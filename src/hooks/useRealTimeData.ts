import { useState, useEffect, useCallback } from 'react';

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

  // 获取最新视频数据（实时拉取 Piped API，失败回退）
  const fetchVideos = async (): Promise<VideoData[]> => {
    const currentHour = new Date().getHours();
    const isLiveTime = currentHour >= 19 && currentHour <= 22;

    // 本地缓存：保存上次成功展示的视频
    const CACHE_KEY = 'latest_videos_cache';
    const readCache = (): VideoData[] => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
      } catch { return []; }
    };
    const writeCache = (items: VideoData[]) => {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch {}
    };

    const queries = [
      'Indiana Fever',
      'WNBA Caitlin Clark',
      'Caitlin Clark highlights',
      'Fever highlights'
    ];

    const toRelative = (unixSeconds: number) => {
      const diffMs = Date.now() - unixSeconds * 1000;
      const m = Math.max(1, Math.floor(diffMs / 60000));
      if (m < 60) return `${m} minutes ago`;
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem ? `${h}h ${rem}m ago` : `${h} hours ago`;
    };

    const formatViews = (views: number | undefined) => {
      if (!views || views <= 0) return '—';
      if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
      if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
      return `${views}`;
    };

    try {
      // 并行搜索，先过滤14天窗口；无结果则扩展到30天
      const pullWindow = async (daysWindow: number) => {
        const cutoffSec = Math.floor(Date.now() / 1000) - daysWindow * 24 * 60 * 60;
        const responses = await Promise.all(
          queries.map(q =>
            fetch(`/api/piped/api/v1/search?q=${encodeURIComponent(q)}&region=US`)
              .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
              .catch(() => null)
          )
        );
        const seen = new Set<string>();
        const latest: VideoData[] = [];
        responses.forEach(resp => {
          const items = resp?.items;
          if (!Array.isArray(items)) return;
          items.forEach((item: any) => {
            if (item?.type !== 'video') return;
            const id = item.id || item.url || item.title;
            if (!id || seen.has(id)) return;
            const uploaded = item.uploaded as number | undefined; // unix seconds
            if (!uploaded || uploaded < cutoffSec) return; // 过滤过旧
            seen.add(id);
            latest.push({
              id,
              title: item.title,
              thumbnail: item.thumbnail || item.thumbnailUrl || (item.thumbnails?.[0]?.url) || '',
              duration: item.duration || item.durationText || '3:00',
              views: formatViews(item.views),
              uploadDate: toRelative(uploaded),
              channel: item.uploaderName || item.uploader || 'Unknown',
              isLive: !!item.isLive,
              videoId: item.id
            });
          });
        });
        // 排序：LIVE 优先，其次最近上传
        const ageMinutes = (s: string) => {
          if (s === 'LIVE NOW') return 0;
          const hMatch = /(\d+)h\s*(\d+)?m/.exec(s);
          if (hMatch) return parseInt(hMatch[1]) * 60 + (parseInt(hMatch[2] || '0'));
          const mMatch = /(\d+)\s*minutes?/.exec(s);
          if (mMatch) return parseInt(mMatch[1]);
          return 9999;
        };
        latest.sort((a, b) => {
          if (a.isLive && !b.isLive) return -1;
          if (!a.isLive && b.isLive) return 1;
          return ageMinutes(a.uploadDate) - ageMinutes(b.uploadDate);
        });
        return latest.slice(0, 6);
      };

      let latest = await pullWindow(14);
      if (!latest || latest.length === 0) {
        latest = await pullWindow(30);
      }
      // 若仍无结果，使用上一次展示的数据（state 中的 videos）
      if (!latest || latest.length === 0) {
        if (videos && videos.length > 0) {
          return videos;
        }
        // 兜底：本地示例，确保不为空
        return [
          {
            id: 'fallback-1',
            title: isLiveTime ? '🔴 LIVE: Caitlin Clark DOMINATING vs Las Vegas Aces!' : '🔥 Caitlin Clark\'s EXPLOSIVE Highlights!',
            thumbnail: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
            duration: isLiveTime ? 'LIVE' : '3:45',
            views: '12.6K',
            uploadDate: isLiveTime ? 'LIVE NOW' : '30 minutes ago',
            channel: 'WNBA Official',
            isLive: isLiveTime,
            videoId: 'dQw4w9WgXcQ'
          },
          {
            id: 'fallback-2',
            title: '⚡ Indiana Fever Win Streak CONTINUES — Clutch Moments',
            thumbnail: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
            duration: '2:18',
            views: '9.8K',
            uploadDate: '1 hour ago',
            channel: 'ESPN',
            videoId: 'jNQXAC9IVRw'
          },
          {
            id: 'fallback-3',
            title: '🚀 Top Plays — Fever vs Mercury',
            thumbnail: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
            duration: '4:12',
            views: '14.2K',
            uploadDate: '2 hours ago',
            channel: 'House of Highlights',
            videoId: 'M7lc1UVf-VE'
          }
        ];
      }
      writeCache(latest);
      return latest;
    } catch {
      // 异常时也优先返回上一次展示内容或本地缓存
      if (videos && videos.length > 0) return videos;
      const cachePrev = readCache();
      if (cachePrev.length > 0) return cachePrev;
      return [];
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
        fetchVideos(),
        fetchLiveStatus()
      ]);

      setTodayGame(todayGameData);
      setYesterdayGame(yesterdayGameData);
      setPlayerStats(playerStatsData);
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
        fetchVideos(),
        fetchLiveStatus()
      ]);

      setTodayGame(todayGameData);
      setPlayerStats(playerStatsData);
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
    let interval: number;
    
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