import { useState, useEffect, useCallback } from 'react';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';
import { fetchFeverTodayFromESPN, fetchFeverLatestFinalFromESPN } from '../utils/espnProvider';

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

// 智能视频缓存管理
const VIDEO_CACHE_KEY = 'fever_game_videos_global_cache';
const VIDEO_CACHE_TIMESTAMP_KEY = 'fever_game_videos_cache_timestamp';

// 动态缓存时长策略
const getCacheDuration = (): number => {
  const currentHour = new Date().getHours();
  const isGameTime = currentHour >= 19 && currentHour <= 22; // 比赛时间 7PM-10PM
  
  if (isGameTime) {
    return 60 * 1000; // 比赛期间：1分钟缓存
  } else {
    return 10 * 60 * 1000; // 非比赛时间：10分钟缓存
  }
};

// 保存视频到缓存（智能策略）
const saveVideosToCache = (videos: VideoData[]): void => {
  try {
    const cacheData = {
      videos,
      timestamp: Date.now()
    };
    localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(cacheData));
    localStorage.setItem(VIDEO_CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    const currentHour = new Date().getHours();
    const isGameTime = currentHour >= 19 && currentHour <= 22;
    console.log(`[VideoCache] Saved ${videos.length} videos (${isGameTime ? 'GAME TIME' : 'NORMAL'} mode)`);
  } catch (error) {
    console.warn('[VideoCache] Failed to save cache:', error);
  }
};

// 从缓存获取视频（智能策略）
const getCachedVideos = (): VideoData[] | null => {
  try {
    const lastUpdate = localStorage.getItem(VIDEO_CACHE_TIMESTAMP_KEY);
    if (!lastUpdate) {
      console.log('[VideoCache] No cache timestamp found');
      return null;
    }
    
    const timeDiff = Date.now() - parseInt(lastUpdate);
    const cacheDuration = getCacheDuration();
    
    if (timeDiff > cacheDuration) {
      const currentHour = new Date().getHours();
      const isGameTime = currentHour >= 19 && currentHour <= 22;
      console.log(`[VideoCache] Cache expired (${Math.round(timeDiff/1000)}s > ${cacheDuration/1000}s) - ${isGameTime ? 'GAME TIME' : 'NORMAL'} mode`);
      return null;
    }
    
    const cacheData = localStorage.getItem(VIDEO_CACHE_KEY);
    if (!cacheData) {
      console.log('[VideoCache] No cache data found');
      return null;
    }
    
    const parsed = JSON.parse(cacheData);
    if (parsed.videos && Array.isArray(parsed.videos) && parsed.videos.length > 0) {
      const currentHour = new Date().getHours();
      const isGameTime = currentHour >= 19 && currentHour <= 22;
      console.log(`[VideoCache] Using cached data: ${parsed.videos.length} videos (${isGameTime ? 'GAME TIME' : 'NORMAL'} mode, age: ${Math.round(timeDiff/1000)}s)`);
      return parsed.videos;
    }
    
    return null;
  } catch (error) {
    console.warn('[VideoCache] Failed to load cache:', error);
    return null;
  }
};

// 检查是否需要更新缓存
const shouldUpdateCache = (): boolean => {
  try {
    const lastUpdate = localStorage.getItem(VIDEO_CACHE_TIMESTAMP_KEY);
    if (!lastUpdate) return true;
    
    const timeDiff = Date.now() - parseInt(lastUpdate);
    const cacheDuration = getCacheDuration();
    
    return timeDiff >= cacheDuration;
  } catch {
    return true;
  }
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
    // 先尝试从 ESPN 获取当天的 Fever 比赛
    const espn = await fetchFeverTodayFromESPN().catch(() => null);

    if (espn) {
      const isFinal = espn.status === 'final';
      const statusMapped: 'upcoming' | 'live' | 'finished' =
        espn.status === 'live' ? 'live' : isFinal ? 'finished' : 'upcoming';

      const homeTeamName = espn.isFeverHome ? 'Indiana Fever' : espn.opponent;
      const awayTeamName = espn.isFeverHome ? espn.opponent : 'Indiana Fever';

      const dateStr = new Date(espn.startIso || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      return {
        id: espn.startIso || 'today-game',
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        homeScore: espn.homeScore,
        awayScore: espn.awayScore,
        date: dateStr,
        time: `${espn.startTime || '7:00 PM'} ${espn.timezone || 'EST'}`,
        venue: espn.venue || 'Gainbridge Fieldhouse',
        status: statusMapped,
        platform: 'ESPN'
      };
    }

    // 回退到原有本地模拟
    const currentHour = new Date().getHours();
    const isGameTime = currentHour >= 19 && currentHour <= 22; // 7PM-10PM

    return mockApiCall({
      id: 'today-game',
      homeTeam: 'Indiana Fever',
      awayTeam: 'Las Vegas Aces',
      homeScore: isGameTime ? Math.floor(Math.random() * 20) + 70 : undefined,
      awayScore: isGameTime ? Math.floor(Math.random() * 20) + 65 : undefined,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: '7:00 PM EST',
      venue: 'Gainbridge Fieldhouse',
      status: isGameTime ? 'live' : 'upcoming',
      platform: 'ESPN'
    });
  };

  // 获取昨日/最近一场已结束比赛（优先 ESPN，无密钥）
  const fetchYesterdayGame = async (): Promise<GameData> => {
    try {
      const latest = await fetchFeverLatestFinalFromESPN();
      if (latest) {
        const dateStr = new Date(latest.startIso || Date.now()).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        });
        const homeTeamName = latest.isFeverHome ? 'Indiana Fever' : latest.opponent;
        const awayTeamName = latest.isFeverHome ? latest.opponent : 'Indiana Fever';
        return {
          id: latest.startIso || 'yesterday-game',
          homeTeam: homeTeamName,
          awayTeam: awayTeamName,
          homeScore: latest.homeScore,
          awayScore: latest.awayScore,
          date: dateStr,
          time: `${latest.startTime || '7:00 PM'} ${latest.timezone || 'EST'}`,
          venue: latest.venue || 'Gainbridge Fieldhouse',
          status: 'finished',
          platform: 'ESPN'
        };
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
      time: '7:00 PM EST',
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

  // 获取最新视频数据（动态生成：相对时间、观看量、时长）
  const fetchVideos = async (): Promise<VideoData[]> => {
    const now = new Date();
    const currentHour = now.getHours();
    const isLiveTime = currentHour >= 19 && currentHour <= 22;

    const minutesAgo = (min: number, max: number) => {
      const m = Math.floor(min + Math.random() * (max - min));
      if (m < 60) return `${m} minutes ago`;
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem > 0 ? `${h}h ${rem}m ago` : `${h} hours ago`;
    };

    const randomDuration = (minM: number, maxM: number) => {
      const m = minM + Math.floor(Math.random() * (maxM - minM + 1));
      const s = 5 + Math.floor(Math.random() * 55);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatViews = (baseK: number, jitter: number = 2) =>
      `${(baseK + Math.random() * jitter).toFixed(1)}K`;

    const items: VideoData[] = [
      {
        id: '1',
        title: isLiveTime
          ? '🔴 LIVE: Caitlin Clark vs Las Vegas Aces — Full Game Action!'
          : '🔥 Caitlin Clark Drops 28 vs Phoenix — Extended Highlights!',
        thumbnail: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: isLiveTime ? 'LIVE' : randomDuration(2, 5),
        views: formatViews(isLiveTime ? 15.0 : 12.5, isLiveTime ? 5 : 3),
        uploadDate: isLiveTime ? 'LIVE NOW' : minutesAgo(8, 75),
        channel: 'WNBA Official',
        isLive: isLiveTime,
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: '2',
        title: '⚡ Indiana Fever Win Streak Continues — Best Plays & Clutch Moments',
        thumbnail: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: randomDuration(2, 4),
        views: formatViews(9.0, 3),
        uploadDate: minutesAgo(15, 120),
        channel: 'ESPN',
        videoId: 'jNQXAC9IVRw'
      },
      {
        id: '3',
        title: '🚀 Top 7 INSANE Plays — Fever vs Mercury',
        thumbnail: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: randomDuration(3, 6),
        views: formatViews(14.0, 4),
        uploadDate: minutesAgo(25, 180),
        channel: 'House of Highlights',
        videoId: 'M7lc1UVf-VE'
      }
    ];

    // 最新在前
    const toNumber = (s: string) => {
      if (s === 'LIVE NOW') return 0;
      const hMatch = /(\d+)h\s*(\d+)?m/.exec(s);
      if (hMatch) return parseInt(hMatch[1]) * 60 + (parseInt(hMatch[2] || '0'));
      const mMatch = /(\d+)\s*minutes?/.exec(s);
      if (mMatch) return parseInt(mMatch[1]);
      return 9999;
    };
    items.sort((a, b) => toNumber(a.uploadDate) - toNumber(b.uploadDate));

    return mockApiCall(items, 200);
  };

  // 最新视频（智能缓存策略）
  const fetchVideosYT = async (): Promise<VideoData[]> => {
    // 首先检查缓存
    if (!shouldUpdateCache()) {
      const cached = getCachedVideos();
      if (cached && cached.length > 0) {
        return cached;
      }
    }

    try {
      console.log('[VideoCache] Fetching fresh data from API...');
      const latest: LatestVideo[] = await fetchLatestVideos();
      
      if (latest && latest.length > 0) {

      // 映射为页面数据，并用真实 viewCount 格式化 views
      const mapped = latest.map(v => {
      const publishedDate = new Date(v.publishedAt);
      const now = new Date();
      const diffMs = now.getTime() - publishedDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let uploadDate = '';
      if (v.live) {
        uploadDate = 'LIVE NOW';
      } else if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        uploadDate = `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        uploadDate = `${diffHours} hours ago`;
      } else if (diffDays === 1) {
        uploadDate = '1 day ago';
      } else {
        uploadDate = `${diffDays} days ago`;
      }

      const viewsStr = ((): string => {
        const n = v.viewCount;
        if (typeof n === 'number' && n > 0) {
          if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
          if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
          return n.toString();
        }
        return `${(Math.random() * 50 + 10).toFixed(1)}K`;
      })();

      return {
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnailUrl,
        duration: v.live ? 'LIVE' : `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: viewsStr,
        uploadDate,
        channel: v.channelTitle,
        isLive: v.live,
        videoId: v.id
      };
    });

    // 仅保留官方频道，强去重并按“新鲜度60%+热度40%”综合分排序
    const OFFICIAL_CHANNELS = new Set(['WNBA Official', 'ESPN', 'Indiana Fever']);

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

        if (filtered.length > 0) {
          saveVideosToCache(filtered); // 保存新缓存
          return filtered;
        }
      }
      
      // API返回空数据，使用缓存
      console.warn('[VideoCache] API returned empty, using cached data');
      const cached = getCachedVideos();
      return cached || [];
      
    } catch (error) {
      console.error('[VideoCache] API failed, using cached data:', error);
      const cached = getCachedVideos();
      return cached || [];
    }
  };

  // 获取直播状态
  const fetchLiveStatus = async (): Promise<LiveStatus> => {
    const currentHour = new Date().getHours();
    const isLiveTime = currentHour >= 19 && currentHour <= 22;
    
    if (isLiveTime) {
      const messages = [
        '🔴 LIVE NOW: FEVER DOMINATING!',
        '🔥 CLARK IS ON FIRE RIGHT NOW!',
        '⚡ FEVER LEADING BY 12 POINTS!',
        '🚀 INCREDIBLE PERFORMANCE HAPPENING!',
        '💥 FEVER UNSTOPPABLE TONIGHT!'
      ];
      
      return mockApiCall({
        isLive: true,
        message: messages[Math.floor(Math.random() * messages.length)],
        gameId: 'today-game'
      });
    }
    
    return mockApiCall({
      isLive: false,
      message: '🏀 NEXT GAME: TODAY AT 7:00 PM EST!'
    });
  };

  // 初始数据加载
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [todayGameData, yesterdayGameData, playerStatsData, videosData, liveStatusData] = await Promise.all([
        fetchTodayGame(),
        fetchYesterdayGame(),
        fetchPlayerStats(),
        fetchVideosYT(),
        fetchLiveStatus()
      ]);

      setTodayGame(todayGameData);
      setYesterdayGame(yesterdayGameData);
      setPlayerStats(playerStatsData);
      console.info('[VIDEOS] loadInitialData: count=', videosData.length, 'sample=', videosData.slice(0,3).map(v => ({channel: v.channel, thumb: v.thumbnail})));
      setVideos(videosData);
      setLiveStatus(liveStatusData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 实时更新数据 - 使用 useCallback 优化
  const updateRealTimeData = useCallback(async () => {
    try {
      const [todayGameData, playerStatsData, videosData, liveStatusData] = await Promise.all([
        fetchTodayGame(),
        fetchPlayerStats(),
        fetchVideosYT(),
        fetchLiveStatus()
      ]);

      setTodayGame(todayGameData);
      setPlayerStats(playerStatsData);
      console.info('[VIDEOS] updateRealTimeData: count=', videosData.length, 'sample=', videosData.slice(0,3).map(v => ({channel: v.channel, thumb: v.thumbnail})));
      setVideos(videosData);
      setLiveStatus(liveStatusData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error updating real-time data:', error);
    }
  }, []);

  // 初始化和设置智能定时更新
  useEffect(() => {
    loadInitialData();

    // 根据比赛时间和页面可见性动态调整更新频率
    let interval: ReturnType<typeof setInterval> | undefined;
    
    const getUpdateInterval = (): number => {
      const currentHour = new Date().getHours();
      const isGameTime = currentHour >= 19 && currentHour <= 22;
      
      if (isGameTime) {
        return 60000; // 比赛期间：每1分钟更新
      } else {
        return 10 * 60000; // 非比赛时间：每10分钟更新
      }
    };
    
    const setupInterval = () => {
      clearInterval(interval);
      if (!document.hidden) {
        const updateFreq = getUpdateInterval();
        const currentHour = new Date().getHours();
        const isGameTime = currentHour >= 19 && currentHour <= 22;
        
        console.log(`[VideoCache] Setting update interval: ${updateFreq/1000}s (${isGameTime ? 'GAME TIME' : 'NORMAL'} mode)`);
        interval = setInterval(updateRealTimeData, updateFreq);
      }
    };
    
    const handleVisibilityChange = () => {
      setupInterval();
    };

    // 初始设置
    setupInterval();
    
    // 每小时重新评估更新频率
    const hourlyCheck = setInterval(() => {
      if (!document.hidden) {
        setupInterval();
      }
    }, 60 * 60 * 1000); // 每小时检查一次

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      clearInterval(hourlyCheck);
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