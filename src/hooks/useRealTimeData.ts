import { useState, useEffect, useCallback } from 'react';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';
import { fetchFeverTodayFromESPN, fetchFeverLatestFinalFromESPN, fetchNextFeverGame } from '../utils/espnProvider';

export interface GameData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  platform?: string;
}

export interface PlayerStats {
  points: number;
  assists: number;
  threePointers: number;
  rebounds: number;
  fieldGoalPercentage: number;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: string;
  isLive?: boolean;
  videoId?: string;
  // 新增：用于首页真实时间与观看数的鲁棒展示
  publishedAtISO?: string;
  viewsNumeric?: number;
}

export interface LiveStatus {
  isLive: boolean;
  message: string;
  gameId?: string;
}

// 模拟实时数据API
const mockApiCall = <T>(data: T, delay: number = 200): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 为慢请求增加超时与回退，避免页面长时间 Loading
const withTimeout = async <T>(p: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

// 兜底清洗：保证缩略图与上传时间有效（保留已有 views，不改）
const sanitizeVideos = (list: VideoData[]): VideoData[] => {
  const fallbackThumb = 'https://i.ytimg.com/vi_webp/invalid/hqdefault.webp';
  return (list || []).map(v => ({
    ...v,
    // 只兜底缩略图，不覆盖已计算好的时间
    thumbnail: v.thumbnail || (v.videoId ? `https://i.ytimg.com/vi_webp/${v.videoId}/hqdefault.webp` : fallbackThumb)
  }));
};

export const useRealTimeData = () => {
  const [todayGame, setTodayGame] = useState<GameData | null>(null);
  const [yesterdayGame, setYesterdayGame] = useState<GameData | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({ isLive: false, message: '' });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 获取今日比赛数据（优先 ESPN，无密钥）
  const fetchTodayGame = async (): Promise<GameData> => {
    const espn = await fetchFeverTodayFromESPN().catch(() => null);

    if (espn) {
      const isFinal = espn.status === 'final';
      const gameDate = new Date(espn.startIso || Date.now());
      const dateStr = gameDate.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
      const timeStr = gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

      return mockApiCall({
        id: espn.id || 'today-game',
        homeTeam: espn.isFeverHome ? 'Indiana Fever' : espn.opponent,
        awayTeam: espn.isFeverHome ? espn.opponent : 'Indiana Fever',
        homeScore: espn.homeScore,
        awayScore: espn.awayScore,
        date: dateStr,
        time: timeStr,
        venue: espn.venue || 'Gainbridge Fieldhouse',
        status: espn.status as 'upcoming' | 'live' | 'finished',
        platform: 'ESPN'
      });
    }

    // 如果今天没比赛，尝试获取真正即将到来的下一场比赛
    const nextGame = await fetchNextFeverGame().catch(() => null);
    if (nextGame) {
      const gameDate = new Date(nextGame.date);
      const dateStr = gameDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const timeStr = gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
      return mockApiCall({
        id: 'upcoming-game',
        homeTeam: nextGame.isHome ? 'Indiana Fever' : nextGame.opponent,
        awayTeam: nextGame.isHome ? nextGame.opponent : 'Indiana Fever',
        homeScore: undefined,
        awayScore: undefined,
        date: dateStr,
        time: timeStr,
        venue: 'Gainbridge Fieldhouse', // Simplified, actual venue requires more API parsing
        status: 'upcoming',
        platform: 'ESPN'
      });
    }

    // 回退到原有本地模拟: 应对完全没有数据的情况
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 模拟下一场在两天后
    return mockApiCall({
      id: 'today-game',
      homeTeam: 'Indiana Fever',
      awayTeam: 'Las Vegas Aces',
      homeScore: undefined,
      awayScore: undefined,
      date: futureDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: futureDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
      venue: 'Gainbridge Fieldhouse',
      status: 'upcoming',
      platform: 'ESPN'
    });
  };

  // 获取昨日/最近一场已结束比赛（优先 ESPN，无密钥）
  const fetchYesterdayGame = async (): Promise<GameData> => {
    try {
      const latest = await fetchFeverLatestFinalFromESPN();
      if (latest) {
        const gameDate = new Date(latest.startIso || Date.now());
        const dateStr = gameDate.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        });
        const timeStr = gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

        const homeTeamName = latest.isFeverHome ? 'Indiana Fever' : latest.opponent;
        const awayTeamName = latest.isFeverHome ? latest.opponent : 'Indiana Fever';

        return mockApiCall({
          id: latest.startIso || 'yesterday-game',
          homeTeam: homeTeamName,
          awayTeam: awayTeamName,
          homeScore: latest.homeScore,
          awayScore: latest.awayScore,
          date: dateStr,
          time: timeStr,
          venue: latest.venue || 'Gainbridge Fieldhouse',
          status: 'finished',
          platform: 'ESPN'
        });
      }
    } catch {}
    // 回退到原有模拟
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return mockApiCall({
      id: 'yesterday-game',
      homeTeam: 'Indiana Fever',
      awayTeam: 'Phoenix Mercury',
      homeScore: 89,
      awayScore: 76,
      date: yesterday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: yesterday.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
      venue: 'Gainbridge Fieldhouse',
      status: 'finished'
    });
  };

  // 获取球员实时统计
  const fetchPlayerStats = async (): Promise<PlayerStats> => {
    const baseStats = { points: 22, assists: 9, threePointers: 5, rebounds: 6, fieldGoalPercentage: 45.2 };
    const currentHour = new Date().getHours();
    const isGameTime = currentHour >= 19 && currentHour <= 22;
    
    if (isGameTime) {
      // 比赛进行中，数据会变化
      return mockApiCall({
        points: baseStats.points + Math.floor(Math.random() * 10),
        assists: baseStats.assists + Math.floor(Math.random() * 5),
        threePointers: baseStats.threePointers + Math.floor(Math.random() * 3),
        rebounds: baseStats.rebounds + Math.floor(Math.random() * 4),
        fieldGoalPercentage: baseStats.fieldGoalPercentage + (Math.random() * 10 - 5)
      });
    }
    
    return mockApiCall(baseStats);
  };

  // 最新视频（YouTube 实时来源，带缓存回退）
  const fetchVideosYT = async (): Promise<VideoData[]> => {
    try {
      console.log('[useRealTimeData] Fetching videos from YouTube API...');
      const latest: LatestVideo[] = await fetchLatestVideos();

      if (!latest || latest.length === 0) {
        console.warn('[useRealTimeData] API returned empty, keep empty to avoid mock placeholders');
        return [];
      }

      // 映射为页面数据，同时提供真实 ISO 时间与数值观看数用于鲁棒展示
      const mapped = latest.map(v => {
        const publishedDate = new Date(v.publishedAt);
        const now = new Date();
        const publishedValid = !isNaN(publishedDate.getTime());
        const basePublished = publishedValid ? publishedDate : now;
        const diffMs = now.getTime() - basePublished.getTime();
        const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
        const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
        const diffDays = Math.max(0, Math.floor(diffHours / 24));

        let uploadDate = '';
        if (v.live) {
          uploadDate = 'LIVE NOW';
        } else if (!publishedValid) {
          // 解析失败：显示绝对日期（当前日期）
          uploadDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
          const diffMs = now.getTime() - publishedDate.getTime();
          if (diffMs < 0) {
            // 未来时间（时区/延迟）：显示绝对日期
            uploadDate = publishedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } else {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            if (diffHours < 1) {
              uploadDate = `${diffMinutes} minutes ago`;
            } else if (diffHours < 24) {
              uploadDate = `${diffHours} hours ago`;
            } else if (diffDays === 1) {
              uploadDate = '1 day ago';
            } else {
              uploadDate = `${diffDays} days ago`;
            }
          }
        }

        const viewsStr = (() => {
          const n = v.viewCount;
          if (typeof n === 'number' && isFinite(n) && n > 0) {
            return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(1)}K`;
          }
          // 若无统计，保留字符串展示由卡片组件处理
          return '';
        })();

        return {
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnailUrl || (v.id ? `https://i.ytimg.com/vi_webp/${v.id}/hqdefault.webp` : ''),
          duration: v.live ? 'LIVE' : `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          views: viewsStr, // 可为空，由组件用数值兜底
          uploadDate,
          channel: v.channelTitle,
          isLive: v.live,
          videoId: v.id,
          publishedAtISO: v.publishedAt,
          viewsNumeric: typeof v.viewCount === 'number' ? v.viewCount : undefined
        };
      });

      // 官方频道过滤与排序
      const OFFICIAL_CHANNELS = new Set(['WNBA', 'WNBA Official', 'ESPN', 'Indiana Fever']);

      const parseViews = (s: string): number => {
        if (!s) return 0;
        const mM = s.match(/([\d.]+)\s*M/i);
        const mK = s.match(/([\d.]+)\s*K/i);
        if (mM) return parseFloat(mM[1]) * 1_000_000;
        if (mK) return parseFloat(mK[1]) * 1_000;
        const num = parseFloat(s.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
      };
      const recencyScore = (s: string): number => {
        if (!s) return 0;
        if (s === 'LIVE NOW') return 1;
        const mMin = s.match(/(\d+)\s*minutes?/i);
        const mHour = s.match(/(\d+)\s*hours?/i);
        const mDay = s.match(/(\d+)\s*days?/i);
        if (mMin) return Math.max(0, 1 - parseInt(mMin[1], 10) / 120);
        if (mHour) return Math.max(0, 1 - parseInt(mHour[1], 10) / 24);
        if (mDay) return Math.max(0, 1 - parseInt(mDay[1], 10) / 7);
        return 0.5;
      };
      const popularityScore = (viewsStr: string): number => Math.min(1, parseViews(viewsStr) / 100_000);
      const combinedScore = (uploadDate: string, viewsStr: string): number =>
        0.6 * recencyScore(uploadDate) + 0.4 * popularityScore(viewsStr);

      const filtered = Array.from(
        new Map(
          mapped
            .filter(v => OFFICIAL_CHANNELS.has(v.channel))
            .map(v => [v.id, v])
        ).values()
      ).sort((a, b) => combinedScore(b.uploadDate, b.views) - combinedScore(a.uploadDate, a.views));

      console.log(`[useRealTimeData] Returning ${filtered.length} filtered videos`);
      return filtered.length > 0 ? filtered : [];
      
    } catch (error) {
      console.error('[useRealTimeData] fetchVideosYT failed:', error);
      return [];
    }
  };

  // 获取直播状态
  const getLiveStatus = (game: GameData | null): LiveStatus => {
    if (game && game.status === 'live') {
      const messages = [
        '🔴 LIVE NOW: FEVER DOMINATING!',
        '🔥 CLARK IS ON FIRE RIGHT NOW!',
        '⚡ FEVER LEADING BY 12 POINTS!',
        '🚀 INCREDIBLE PERFORMANCE HAPPENING!',
        '💥 FEVER UNSTOPPABLE TONIGHT!'
      ];
      
      return {
        isLive: true,
        message: messages[Math.floor(Math.random() * messages.length)],
        gameId: game.id
      };
    }
    
    if (game && game.status === 'upcoming') {
      return {
        isLive: false,
        message: `🏀 NEXT GAME: ${game.date.toUpperCase()}`
      };
    }
    
    return {
      isLive: false,
      message: '🏀 NO GAME SCHEDULED TODAY'
    };
  };

  // 初始数据加载
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [todayGameData, yesterdayGameData, playerStatsData, videosData] = await Promise.all([
        fetchTodayGame(),
        fetchYesterdayGame(),
        fetchPlayerStats(),
        withTimeout(fetchVideosYT(), 3500, [])
      ]);

      setTodayGame(todayGameData);
      setYesterdayGame(yesterdayGameData);
      setPlayerStats(playerStatsData);
      console.info('[VIDEOS] loadInitialData: count=', videosData.length, 'sample=', videosData.slice(0,3).map(v => ({channel: v.channel, thumb: v.thumbnail, iso: v.publishedAtISO, viewsN: v.viewsNumeric})));
      setVideos(sanitizeVideos(videosData));
      setLiveStatus(getLiveStatus(todayGameData));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 实时更新数据
  const updateRealTimeData = useCallback(async () => {
    try {
      const [todayGameData, playerStatsData, videosData] = await Promise.all([
        fetchTodayGame(),
        fetchPlayerStats(),
        withTimeout(fetchVideosYT(), 3500, [])
      ]);

      setTodayGame(todayGameData);
      setPlayerStats(playerStatsData);
      console.info('[VIDEOS] updateRealTimeData: count=', videosData.length, 'sample=', videosData.slice(0,3).map(v => ({channel: v.channel, thumb: v.thumbnail, iso: v.publishedAtISO, viewsN: v.viewsNumeric})));
      setVideos(sanitizeVideos(videosData));
      setLiveStatus(getLiveStatus(todayGameData));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error updating real-time data:', error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    let interval: ReturnType<typeof setInterval> | undefined;
    const handleVisibilityChange = () => {
      clearInterval(interval);
      if (!document.hidden) {
        interval = setInterval(updateRealTimeData, 60000);
      }
    };

    if (!document.hidden) {
      interval = setInterval(updateRealTimeData, 60000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateRealTimeData]);

  return {
    todayGame,
    yesterdayGame,
    playerStats,
    videos,
    liveStatus,
    loading,
    lastUpdate,
    refreshData: updateRealTimeData
  };
};