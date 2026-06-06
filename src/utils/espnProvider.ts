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

async function fetchScoreboardByDate(yyyymmdd: string) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${yyyymmdd}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchFeverTodayFromESPN(date?: string): Promise<FeverGame | null> {
  try {
    const yyyymmdd = date || new Date().toISOString().slice(0,10).replace(/-/g,'');
    const data = await fetchScoreboardByDate(yyyymmdd);
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
        const homeCompetitor = comp?.competitors?.find((c:any)=>c.homeAway==='home');
        const awayCompetitor = comp?.competitors?.find((c:any)=>c.homeAway==='away');

        return {
          opponent: opp?.team?.name || 'TBD',
          homeScore: Number(homeCompetitor?.score) || undefined,
          awayScore: Number(awayCompetitor?.score) || undefined,
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

/**
 * 获取最近一场已结束的 Indiana Fever 比赛（用于 yesterday 或 recap/latest）
 * 回溯最近7天，找到 status = final 的比赛
 */
export async function fetchFeverLatestFinalFromESPN(): Promise<FeverGame | null> {
  try {
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const yyyymmdd = d.toISOString().slice(0,10).replace(/-/g,'');
      const data = await fetchScoreboardByDate(yyyymmdd);
      const events: any[] = data?.events || [];
      for (const ev of events) {
        const comp = ev?.competitions?.[0];
        const competitors: any[] = comp?.competitors || [];
        const feverIdx = competitors.findIndex(c => (c?.team?.name || '').toLowerCase().includes('fever'));
        if (feverIdx !== -1) {
          const opp = competitors[1 - feverIdx];
          const fever = competitors[feverIdx];
          const startIso = ev?.date || comp?.date;
          const venue = comp?.venue?.fullName || 'Gainbridge Fieldhouse';
          const status = toStatus(ev?.status || comp?.status);
          if (status === 'final') {
            const homeCompetitor = comp?.competitors?.find((c:any)=>c.homeAway==='home');
            const awayCompetitor = comp?.competitors?.find((c:any)=>c.homeAway==='away');
            const { startTime, timezone } = formatTipTime(startIso);
            const isFeverHome = fever?.homeAway === 'home';
            return {
              opponent: opp?.team?.name || 'TBD',
              homeScore: Number(homeCompetitor?.score) || undefined,
              awayScore: Number(awayCompetitor?.score) || undefined,
              startIso,
              startTime,
              timezone,
              venue,
              status,
              isFeverHome,
            };
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 获取 Caitlin Clark 最近比赛数据（ESPN athlete gamelog）
 * Clark 的 ESPN athlete ID: 4433403
 */
export interface ClarkGameLog {
  date: string;       // 'May 17'
  opponent: string;   // 'vs LAS'
  result: string;     // 'W 95-86'
  won: boolean;
  points: number;
  assists: number;
  rebounds: number;
  threePointers: number;
}

export async function fetchClarkGameLog(): Promise<ClarkGameLog[]> {
  try {
    const currentYear = new Date().getFullYear();
    const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/wnba/athletes/4433403/gamelog?region=us&lang=en&contentorigin=espn&season=${currentYear}&seasontype=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('ESPN gamelog fetch failed');
    const data = await res.json();

    // ESPN gamelog structure: data.seasonTypes[].categories[].events[]
    // and event details are in data.events[eventId]
    const events: ClarkGameLog[] = [];
    const seasonTypes: any[] = data?.seasonTypes || [];
    const labels: string[] = data?.labels || [];
    
    const ptsIdx = labels.findIndex((l: string) => l === 'PTS');
    const astIdx = labels.findIndex((l: string) => l === 'AST');
    const rebIdx = labels.findIndex((l: string) => l === 'REB');
    const tpmIdx = labels.findIndex((l: string) => l === '3PT'); // Usually "2-4" format

    for (const st of seasonTypes) {
      for (const cat of (st?.categories || [])) {
        if (cat?.type !== 'event') continue;
        for (const ev of (cat?.events || [])) {
          const eventId = ev?.eventId;
          if (!eventId) continue;
          
          const eventDetails = data?.events ? data.events[eventId] : null;
          if (!eventDetails) continue;

          const stats: (string | number)[] = ev?.stats || [];
          const atVs = eventDetails.atVs === '@' ? '@' : 'vs';
          const oppAbbr: string = eventDetails.opponent?.abbreviation || eventDetails.opponent?.displayName || '?';
          
          let dateStr = '?';
          if (eventDetails.gameDate) {
             const d = new Date(eventDetails.gameDate);
             dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }

          const won: boolean = eventDetails.gameResult === 'W';
          const resultStr = `${eventDetails.gameResult || '?'} ${eventDetails.score || ''}`.trim();

          let threePointers = 0;
          if (tpmIdx >= 0 && stats[tpmIdx]) {
            // "3PT" is usually like "5-10" where 5 is made
            const parts = String(stats[tpmIdx]).split('-');
            if (parts.length > 0) {
              threePointers = parseInt(parts[0], 10) || 0;
            }
          }

          events.push({
            date: dateStr,
            opponent: `${atVs} ${oppAbbr}`,
            result: resultStr || 'N/A',
            won,
            points: ptsIdx >= 0 ? Number(stats[ptsIdx]) || 0 : 0,
            assists: astIdx >= 0 ? Number(stats[astIdx]) || 0 : 0,
            rebounds: rebIdx >= 0 ? Number(stats[rebIdx]) || 0 : 0,
            threePointers,
          });
        }
      }
    }

    // Return latest 5 games (already sorted newest-first by ESPN)
    return events.slice(0, 5);
  } catch (e) {
    console.error('[ESPN] fetchClarkGameLog error', e);
    return [];
  }
}

export interface NextGameInfo {
  date: string;       // ISO date string
  opponent: string;   // 'Las Vegas Aces'
  oppLogo: string;    // url
  isHome: boolean;
}

export async function fetchNextFeverGame(): Promise<NextGameInfo | null> {
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/5/schedule';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Fever schedule');
    const data = await res.json();
    
    if (!data.events) return null;
    
    const now = new Date();
    // Find the first event whose date is in the future
    const upcoming = data.events.find((e: any) => new Date(e.date) > now);
    if (!upcoming) return null;
    
    const comp = upcoming.competitions?.[0];
    if (!comp) return null;
    
    // Competitors: find the Fever (id "5") and the opponent
    const fever = comp.competitors.find((c: any) => c.team.id === "5");
    const opp = comp.competitors.find((c: any) => c.team.id !== "5");
    
    if (!fever || !opp) return null;
    
    return {
      date: upcoming.date,
      opponent: opp.team.displayName || opp.team.abbreviation,
      oppLogo: opp.team.logos?.[0]?.href || '',
      isHome: fever.homeAway === 'home'
    };
  } catch (e) {
    console.error('[ESPN] fetchNextFeverGame error', e);
    return null;
  }
}

export interface ScheduleGame {
  id: string;
  date: string;
  opponent: string;
  oppLogo: string;
  isHome: boolean;
  venue: string;
  ticketsUrl?: string;
  broadcasts: string[];
}

export async function fetchFullFeverSchedule(): Promise<ScheduleGame[]> {
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/5/schedule';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch full schedule');
    const data = await res.json();
    
    if (!data.events) return [];
    
    const now = new Date();
    // Get all events in the future
    const upcomingEvents = data.events.filter((e: any) => new Date(e.date) > now);
    
    return upcomingEvents.map((event: any) => {
      const comp = event.competitions?.[0];
      if (!comp) return null;
      
      const fever = comp.competitors.find((c: any) => c.team.id === "5");
      const opp = comp.competitors.find((c: any) => c.team.id !== "5");
      
      if (!fever || !opp) return null;
      
      const broadcasts = comp.broadcasts?.map((b: any) => b.media?.shortName || b.names?.[0]).filter(Boolean) || [];
      const ticketsUrl = comp.tickets?.[0]?.summary || comp.tickets?.[0]?.summary; // Sometimes link is in summary or link

      return {
        id: event.id,
        date: event.date,
        opponent: opp.team.displayName || opp.team.abbreviation,
        oppLogo: opp.team.logos?.[0]?.href || '',
        isHome: fever.homeAway === 'home',
        venue: comp.venue?.fullName || 'TBD',
        ticketsUrl: comp.tickets?.[0]?.summary ? comp.tickets[0].summary : undefined, // ESPN tickets structure varies
        broadcasts
      };
    }).filter(Boolean) as ScheduleGame[];
  } catch (e) {
    console.error('[ESPN] fetchFullFeverSchedule error', e);
    return [];
  }
}

export interface WnbaNewsItem {
  id: string;
  title: string;
  description: string;
  published: string;
  imageUrl?: string;
  link: string;
}

export async function fetchWnbaNews(): Promise<WnbaNewsItem[]> {
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch WNBA news');
    const data = await res.json();
    
    if (!data.articles) return [];
    
    return data.articles.map((article: any) => {
      const image = article.images?.[0];
      return {
        id: article.dataSourceIdentifier || String(Math.random()),
        title: article.headline,
        description: article.description,
        published: article.published,
        imageUrl: image?.url,
        link: article.links?.web?.href || article.links?.mobile?.href
      };
    });
  } catch (e) {
    console.error('[ESPN] fetchWnbaNews error', e);
    return [];
  }
}