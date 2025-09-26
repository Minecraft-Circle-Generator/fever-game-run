export type FeverGame = {
  opponent: string;
  homeScore?: number;
  awayScore?: number;
  startIso?: string;
  startTime?: string;
  timezone?: string;
  venue?: string;
  status?: 'upcoming' | 'live' | 'final';
  isFeverHome?: boolean;
};

function formatTipTime(iso?: string) {
  if (!iso) return { startTime: 'Tonight', timezone: 'EST' };
  try {
    const d = new Date(iso);
    const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
    const startTime = new Intl.DateTimeFormat('en-US', opts).format(d);
    return { startTime, timezone: 'EST' };
  } catch {
    return { startTime: 'Tonight', timezone: 'EST' };
  }
}

function toStatus(espnStatus?: any): 'upcoming' | 'live' | 'final' {
  const type = espnStatus?.type?.state || espnStatus?.type?.name || '';
  if (type.toLowerCase().includes('in')) return 'live';
  if (type.toLowerCase().includes('post') || type.toLowerCase().includes('final')) return 'final';
  return 'upcoming';
}

export async function fetchFeverTodayFromESPN(date?: string): Promise<FeverGame | null> {
  try {
    const yyyymmdd = date || new Date().toISOString().slice(0,10).replace(/-/g,'');
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${yyyymmdd}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const events: any[] = data?.events || [];
    for (const ev of events) {
      const comp = ev?.competitions?.[0];
      const competitors: any[] = comp?.competitors || [];
      const feverIdx = competitors.findIndex(c => (c?.team?.name || '').toLowerCase().includes('fever'));
      if (feverIdx !== -1) {
        const opp = competitors[1 - feverIdx];
        const fever = competitors[feverIdx];
        const startIso = ev?.date || comp?.date;
        const { startTime, timezone } = formatTipTime(startIso);
        const venue = comp?.venue?.fullName || 'Gainbridge Fieldhouse';
        const status = toStatus(ev?.status || comp?.status);
        const isFeverHome = fever?.homeAway === 'home';
        const homeScore = Number(comp?.status?.type?.completed ? comp?.competitors?.find((c:any)=>c.homeAway==='home')?.score : fever?.homeAway==='home' ? fever?.score : opp?.score) || undefined;
        const awayScore = Number(comp?.status?.type?.completed ? comp?.competitors?.find((c:any)=>c.homeAway==='away')?.score : fever?.homeAway==='away' ? fever?.score : opp?.score) || undefined;

        return {
          opponent: opp?.team?.name || 'TBD',
          homeScore,
          awayScore,
          startIso,
          startTime,
          timezone,
          venue,
          status,
          isFeverHome,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}