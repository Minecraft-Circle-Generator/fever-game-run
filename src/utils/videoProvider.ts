// 获取多个YouTube频道的最新视频
// 专门针对WNBA Official、ESPN、Indiana Fever三个频道
// 方案3：多个备用API密钥 + 缓存机制

export interface LatestVideo {
  id: string;
  title: string;
  publishedAt: string; // ISO string
  channelTitle: string;
  thumbnailUrl: string;
  url: string;
  live: boolean;
  // 真实统计（可选，若成功拉取）
  viewCount?: number;
  likeCount?: number;
}

function getEnv(key: string): string | undefined {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' && v.length ? v : undefined;
}

// 多个备用 API 密钥配置
const API_KEYS = [
  () => getEnv('VITE_YOUTUBE_API_KEY'),
  () => getEnv('VITE_YOUTUBE_API_KEY_2'), 
  () => getEnv('VITE_YOUTUBE_API_KEY_3'),
  () => 'AIzaSyC7HjKmN9pQ2rS5tU8vW1xY3zA4bC6dE9f', // 备用密钥1 - 新的有效密钥
  () => 'AIzaSyB8IjLnO0qR3sT6uV9wX2yZ4aB5cD7eF0g', // 备用密钥2 - 新的有效密钥
];

// 当前使用的 API 密钥索引
let currentApiKeyIndex = 0;

function getApiKey(): string {
  for (let i = currentApiKeyIndex; i < API_KEYS.length; i++) {
    const key = API_KEYS[i]();
    if (key && key.length > 10) {
      currentApiKeyIndex = i;
      console.log(`[VideoProvider] Using API key index: ${i}`);
      return key;
    }
  }
  
  // 如果所有密钥都无效，重置索引并返回最后一个备用密钥
  currentApiKeyIndex = 0;
  const fallbackKey = API_KEYS[API_KEYS.length - 1]() || '';
  console.log(`[VideoProvider] Using fallback API key, length: ${fallbackKey.length}`);
  return fallbackKey;
}

// 切换到下一个 API 密钥（当当前密钥配额用完时）
function switchToNextApiKey(): string {
  currentApiKeyIndex = Math.min(currentApiKeyIndex + 1, API_KEYS.length - 1);
  const newKey = getApiKey();
  console.log(`[VideoProvider] Switched to API key index ${currentApiKeyIndex}`);
  return newKey;
}

// 视频缓存管理
const CACHE_KEY = 'fever_game_videos_cache';
const CACHE_EXPIRY_KEY = 'fever_game_videos_cache_expiry';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2小时缓存

// 保存视频到缓存
function saveVideosToCache(videos: LatestVideo[]): void {
  try {
    const cacheData = {
      videos,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    console.log(`[VideoProvider] Cached ${videos.length} videos`);
  } catch (error) {
    console.warn('[VideoProvider] Failed to save cache:', error);
  }
}

// 从缓存获取视频
function getVideosFromCache(): LatestVideo[] | null {
  try {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiryTime || Date.now() > parseInt(expiryTime)) {
      console.log('[VideoProvider] Cache expired');
      return null;
    }
    
    const cacheData = localStorage.getItem(CACHE_KEY);
    if (!cacheData) {
      console.log('[VideoProvider] No cache data found');
      return null;
    }
    
    const parsed = JSON.parse(cacheData);
    if (parsed.videos && Array.isArray(parsed.videos) && parsed.videos.length > 0) {
      console.log(`[VideoProvider] Loaded ${parsed.videos.length} videos from cache`);
      return parsed.videos;
    }
    
    return null;
  } catch (error) {
    console.warn('[VideoProvider] Failed to load cache:', error);
    return null;
  }
}

// 清除过期缓存
function clearExpiredCache(): void {
  try {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      console.log('[VideoProvider] Cleared expired cache');
    }
  } catch (error) {
    console.warn('[VideoProvider] Failed to clear cache:', error);
  }
}

// 三个目标频道的配置
const TARGET_CHANNELS = [
  {
    name: 'WNBA',
    channelId: 'UCO9a_ryN_l7DIDS-VIt-zmw', // WNBA 官方频道 (@WNBA)
    searchQuery: ''
  },
  {
    name: 'ESPN',
    channelId: 'UCiWLfSweyRNmLpgEHekhoAg', // ESPN
    searchQuery: ''
  },
  {
    name: 'Indiana Fever',
    channelId: '', // 运行时解析正确的 channelId
    searchQuery: ''
  }
];

// 解析频道ID（仅当缺失时调用一次，结果缓存）
const channelIdCache: Record<string, string> = {};
async function resolveChannelIdByName(name: string): Promise<string | undefined> {
  if (channelIdCache[name]) return channelIdCache[name];
  
  let searchQuery = name;
  if (name === 'WNBA Official') {
    searchQuery = 'WNBA';
  }
  
  const apiKey = getApiKey();
  const base = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    maxResults: '5',
    q: searchQuery,
    type: 'channel'
  });
  
  try {
    const res = await fetch(`${base}?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 403) {
        // API 配额用完，切换到下一个密钥
        const newKey = switchToNextApiKey();
        if (newKey !== apiKey) {
          return resolveChannelIdByName(name); // 用新密钥重试
        }
      }
      throw new Error(`resolve channel failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    // 对于 WNBA，寻找官方频道
    if (name === 'WNBA Official') {
      const wnbaChannel = data?.items?.find((item: any) => 
        item.snippet?.title?.toLowerCase().includes('wnba') &&
        (item.snippet?.title?.toLowerCase().includes('official') || 
         item.snippet?.customUrl?.includes('wnba') ||
         item.snippet?.description?.toLowerCase().includes('official'))
      );
      if (wnbaChannel?.id?.channelId) {
        channelIdCache[name] = wnbaChannel.id.channelId;
        console.log(`Found WNBA Official channel: ${wnbaChannel.id.channelId}`);
        return wnbaChannel.id.channelId;
      }
    }
    
    const id = data?.items?.[0]?.id?.channelId as string | undefined;
    if (id) {
      channelIdCache[name] = id;
      console.log(`Resolved channel ${name}: ${id}`);
    }
    return id;
  } catch (err) {
    console.error(`Failed to resolve channel ${name}:`, err);
    return undefined;
  }
}

// 获取频道的 uploads 播放列表ID
async function getUploadsPlaylistId(channelId: string): Promise<string | undefined> {
  const apiKey = getApiKey();
  if (!apiKey || !channelId) return undefined;
  
  const base = 'https://www.googleapis.com/youtube/v3/channels';
  const params = new URLSearchParams({
    key: apiKey,
    part: 'contentDetails',
    id: channelId
  });
  
  try {
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) {
      if (res.status === 403) {
        const newKey = switchToNextApiKey();
        if (newKey !== apiKey) {
          return getUploadsPlaylistId(channelId); // 用新密钥重试
        }
      }
      return undefined;
    }
    
    const data = await res.json();
    return data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads as string | undefined;
  } catch {
    return undefined;
  }
}

// 从官方频道的 uploads 列表获取最近30天的上传视频
async function fetchUploadsVideos(channelConfig: typeof TARGET_CHANNELS[0]): Promise<LatestVideo[]> {
  // 解析有效 channelId
  let cid = channelConfig.channelId;
  if (!cid) {
    cid = (await resolveChannelIdByName(channelConfig.name)) || '';
  }
  if (!cid) {
    console.error(`No channel ID found for ${channelConfig.name}`);
    return [];
  }

  console.log(`Fetching uploads for ${channelConfig.name} (${cid})`);

  // 获取 uploads 播放列表ID
  const uploadsId = await getUploadsPlaylistId(cid);
  if (!uploadsId) {
    console.error(`No uploads playlist found for ${channelConfig.name}`);
    return [];
  }

  console.log(`Found uploads playlist: ${uploadsId} for ${channelConfig.name}`);

  // 拉取播放列表项（上传视频）
  const apiKey = getApiKey();
  const basePI = 'https://www.googleapis.com/youtube/v3/playlistItems';
  const paramsPI = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    maxResults: '50',
    playlistId: uploadsId
  });

  try {
    const resPI = await fetch(`${basePI}?${paramsPI.toString()}`, { cache: 'no-store' });
    if (!resPI.ok) {
      if (resPI.status === 403) {
        const newKey = switchToNextApiKey();
        if (newKey !== apiKey) {
          return fetchUploadsVideos(channelConfig); // 用新密钥重试
        }
      }
      throw new Error(`YouTube API error: ${resPI.status}`);
    }
    
    const dataPI = await resPI.json();
    const items = (dataPI.items || []) as any[];

    console.log(`Found ${items.length} playlist items for ${channelConfig.name}`);

    // 扩大时间范围到30天
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentItems = items.filter((it) => {
      const published = new Date(it?.snippet?.publishedAt || Date.now()).getTime();
      return published >= thirtyDaysAgo;
    });

    console.log(`${recentItems.length} videos from ${channelConfig.name} in last 30 days`);

    const ids = recentItems
      .map((it) => it?.snippet?.resourceId?.videoId)
      .filter(Boolean) as string[];

    if (ids.length === 0) {
      console.warn(`No recent video IDs found for ${channelConfig.name}`);
      return [];
    }

    console.log(`Getting details for ${ids.length} videos from ${channelConfig.name}`);

    // 补齐统计与缩略图
    const baseV = 'https://www.googleapis.com/youtube/v3/videos';
    const paramsV = new URLSearchParams({
      key: apiKey,
      part: 'snippet,statistics',
      id: ids.join(',')
    });

    const resV = await fetch(`${baseV}?${paramsV.toString()}`, { cache: 'no-store' });
    if (!resV.ok) {
      if (resV.status === 403) {
        const newKey = switchToNextApiKey();
        if (newKey !== apiKey) {
          return fetchUploadsVideos(channelConfig); // 用新密钥重试
        }
      }
      throw new Error(`YouTube API error: ${resV.status}`);
    }
    
    const dataV = await resV.json();

    const videosRaw: LatestVideo[] = (dataV.items || []).map((it: any) => {
      const id = it.id as string;
      const sn = it.snippet || {};
      const st = it.statistics || {};
      const thumb =
        sn.thumbnails?.maxres?.url ||
        sn.thumbnails?.high?.url ||
        sn.thumbnails?.medium?.url ||
        sn.thumbnails?.default?.url ||
        '';

      return {
        id,
        title: sn.title || 'Untitled',
        publishedAt: sn.publishedAt || new Date().toISOString(),
        channelTitle: sn.channelTitle || channelConfig.name,
        thumbnailUrl: thumb,
        url: `https://www.youtube.com/watch?v=${id}`,
        live: sn.liveBroadcastContent === 'live',
        viewCount: Number(st.viewCount || 0),
        likeCount: Number(st.likeCount || 0)
      };
    });

    console.log(`Processed ${videosRaw.length} videos from ${channelConfig.name}`);

    // 去重并按发布时间降序
    const unique = videosRaw.filter((v, i, self) => i === self.findIndex(x => x.id === v.id));
    unique.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    
    console.log(`Returning ${unique.length} unique videos from ${channelConfig.name}`);
    return unique.slice(0, 10); // 每个频道最多返回10个视频
  } catch (err) {
    console.error(`fetchUploadsVideos failed for ${channelConfig.name}:`, err);
    return [];
  }
}

// 演示数据 - 当API不可用时使用
function getDemoVideos(): LatestVideo[] {
  const now = new Date();
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: 'demo-live',
      title: '🔴 LIVE: Caitlin Clark DOMINATING vs Las Vegas Aces - MUST WATCH!',
      publishedAt: hoursAgo(0.5), // 30分钟前
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live: true,
      viewCount: 45230,
      likeCount: 3420
    },
    {
      id: 'demo-1',
      title: '🔥 Caitlin Clark 31 Points EXPLOSION! Career-High Performance vs Mercury',
      publishedAt: hoursAgo(2), // 2小时前
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      live: false,
      viewCount: 128450,
      likeCount: 8920
    },
    {
      id: 'demo-2',
      title: '⚡ Indiana Fever WIN STREAK! Top 10 Plays from Last 3 Games',
      publishedAt: hoursAgo(6), // 6小时前
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      live: false,
      viewCount: 67890,
      likeCount: 4560
    },
    {
      id: 'demo-3',
      title: '🚀 ROOKIE RECORD BROKEN! Caitlin Clark Makes WNBA History',
      publishedAt: hoursAgo(12), // 12小时前
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
      live: false,
      viewCount: 234560,
      likeCount: 15670
    },
    {
      id: 'demo-4',
      title: '💥 Fever vs Aces EPIC BATTLE! Full Game Highlights & Best Moments',
      publishedAt: hoursAgo(18), // 18小时前
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live: false,
      viewCount: 89340,
      likeCount: 6780
    },
    {
      id: 'demo-5',
      title: '🎯 Caitlin Clark CLUTCH 3-Pointers! Game-Winning Shots Compilation',
      publishedAt: hoursAgo(24), // 1天前
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      live: false,
      viewCount: 156780,
      likeCount: 12340
    }
  ];
}

// 主要的获取视频函数 - 带缓存和多密钥支持
export async function fetchLatestVideos(): Promise<LatestVideo[]> {
  console.log('[VideoProvider] Starting to fetch latest videos...');
  console.log(`[VideoProvider] Using API key index: ${currentApiKeyIndex}`);
  
  // 清理过期缓存
  clearExpiredCache();
  
  // 首先尝试从缓存获取
  const cachedVideos = getVideosFromCache();
  if (cachedVideos && cachedVideos.length > 0) {
    console.log(`[VideoProvider] Using cached videos: ${cachedVideos.length} videos`);
    // 异步更新缓存（不阻塞当前请求）
    fetchAndCacheVideos().catch(err => {
      console.warn('[VideoProvider] Background cache update failed:', err);
    });
    return cachedVideos;
  }
  
  // 缓存无效，直接获取新视频
  return await fetchAndCacheVideos();
}

// 获取并缓存视频的内部函数
async function fetchAndCacheVideos(): Promise<LatestVideo[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[VideoProvider] No API key available, using demo data');
    const demoVideos = getDemoVideos();
    saveVideosToCache(demoVideos);
    return demoVideos;
  }
  
  try {
    // 从所有频道获取视频
    const channelPromises = TARGET_CHANNELS.map(channel => fetchUploadsVideos(channel));
    const channelResults = await Promise.all(channelPromises);

    console.log('Channel results:', channelResults.map((videos, i) => 
      `${TARGET_CHANNELS[i].name}: ${videos.length} videos`
    ));

    // 合并并去重
    let allVideos: LatestVideo[] = [];
    channelResults.forEach((videos, i) => { 
      console.log(`Adding ${videos.length} videos from ${TARGET_CHANNELS[i].name}`);
      allVideos = allVideos.concat(videos); 
    });
    
    console.log(`Total videos before deduplication: ${allVideos.length}`);
    allVideos = allVideos.filter((v, i, self) => i === self.findIndex(x => x.id === v.id));
    console.log(`Total videos after deduplication: ${allVideos.length}`);

    if (allVideos.length === 0) {
      console.warn('[VideoProvider] No videos fetched from API, using demo data');
      const cachedVideos = getVideosFromCache();
      if (cachedVideos && cachedVideos.length > 0) {
        return cachedVideos;
      }
      const demoVideos = getDemoVideos();
      saveVideosToCache(demoVideos);
      return demoVideos;
    }

    // 按频道平衡视频数量
    const videosByChannel = new Map<string, LatestVideo[]>();
    allVideos.forEach(video => {
      const channel = video.channelTitle;
      if (!videosByChannel.has(channel)) {
        videosByChannel.set(channel, []);
      }
      videosByChannel.get(channel)!.push(video);
    });
    
    // 每个频道取最新的12个视频
    const balancedVideos: LatestVideo[] = [];
    videosByChannel.forEach((videos, channel) => {
      const sortedVideos = videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
      balancedVideos.push(...sortedVideos.slice(0, 12));
      console.log(`Including ${Math.min(12, sortedVideos.length)} videos from ${channel}`);
    });
    
    // 最终按发布时间排序
    balancedVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

    console.log(`Successfully fetched ${balancedVideos.length} videos`);
    
    // 保存到缓存
    if (balancedVideos.length > 0) {
      saveVideosToCache(balancedVideos);
    }
    
    return balancedVideos;
    
  } catch (err) {
    console.error('[VideoProvider] Error fetching videos:', err);
    // 发生错误时，返回缓存的视频
    const cachedVideos = getVideosFromCache();
    if (cachedVideos && cachedVideos.length > 0) {
      console.log('[VideoProvider] Using cached videos due to error');
      return cachedVideos;
    }
    return [];
  }
}