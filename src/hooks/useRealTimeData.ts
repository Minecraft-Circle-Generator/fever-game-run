import { useState, useEffect, useCallback } from 'react';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';

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

export const useRealTimeData = () => {
  const [todayGame, setTodayGame] = useState<GameData | null>(null);
  const [yesterdayGame, setYesterdayGame] = useState<GameData | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({ isLive: false, message: '' });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 获取今日比赛数据
  const fetchTodayGame = async (): Promise<GameData> => {
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

  // 获取昨日比赛数据
  const fetchYesterdayGame = async (): Promise<GameData> => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return mockApiCall({
      id: 'yesterday-game',
      homeTeam: 'Indiana Fever',
      awayTeam: 'Phoenix Mercury',
      homeScore: 89,
      awayScore: 76,
      date: yesterday.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
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

  // 最新视频（YouTube 实时来源，无密钥自动回退）
  const fetchVideosYT = async (): Promise<VideoData[]> => {
    const latest: LatestVideo[] = await fetchLatestVideos();

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
        if (typeof n === 'number' && n >= 0) {
          return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(1)}K`;
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

    return filtered;
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
        withTimeout(fetchVideosYT(), 3500, []),
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
        withTimeout(fetchVideosYT(), 3500, []),
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

  // 初始化和设置定时更新 - 优化更新频率
  useEffect(() => {
    loadInitialData();

    // 根据页面可见性调整更新频率
    let interval: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      clearInterval(interval);
      if (!document.hidden) {
        // 页面可见时每60秒更新一次（降低频率）
        interval = setInterval(updateRealTimeData, 60000);
      }
    };

    // 初始设置
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