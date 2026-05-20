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
  () => getEnv('VITE_YOUTUBE_API_KEY_3')
];

// 当前使用的 API 密钥索引
let currentApiKeyIndex = 0;

function getApiKey(): string {
  for (let i = currentApiKeyIndex; i < API_KEYS.length; i++) {
    const key = API_KEYS[i]();
    if (key && key.length > 10) {
      currentApiKeyIndex = i;
      return key;
    }
  }
  
  // 如果所有密钥都无效，重置索引并返回最后一个备用密钥
  currentApiKeyIndex = 0;
  return API_KEYS[API_KEYS.length - 1]() || '';
}

// 切换到下一个 API 密钥（当当前密钥配额用完时）
function switchToNextApiKey(): string {
  currentApiKeyIndex = Math.min(currentApiKeyIndex + 1, API_KEYS.length - 1);
  const newKey = getApiKey();
  console.log(`[VideoProvider] Switched to API key index ${currentApiKeyIndex}`);
  return newKey;
}

// 视频缓存管理 - 1小时缓存，全用户共享
const CACHE_KEY = 'fever_game_videos_global_cache';
const CACHE_EXPIRY_KEY = 'fever_game_videos_cache_expiry';
const CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

// 导出：判断缓存是否陈旧（已过期）
export function isVideoCacheStale(): boolean {
  try {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  } catch {
    return true;
  }
}

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
    const cacheData = localStorage.getItem(CACHE_KEY);
    if (!cacheData) {
      console.log('[VideoProvider] No cache data found');
      return null;
    }
    const parsed = JSON.parse(cacheData);
    if (parsed.videos && Array.isArray(parsed.videos) && parsed.videos.length > 0) {
      const stale = isVideoCacheStale();
      console.log(`[VideoProvider] Loaded ${parsed.videos.length} videos from cache${stale ? ' (stale)' : ''}`);
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

// 创建备用视频数据用于调试
function createFallbackVideos(): LatestVideo[] {
  const now = new Date();
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: 'fallback-1',
      title: '🔴 LIVE: Caitlin Clark DOMINATING vs Las Vegas Aces - MUST WATCH!',
      publishedAt: hoursAgo(0.5),
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live: true,
      viewCount: 45230,
      likeCount: 3420
    },
    {
      id: 'fallback-2',
      title: '🔥 Caitlin Clark 31 Points EXPLOSION! Career-High Performance vs Mercury',
      publishedAt: hoursAgo(2),
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      live: false,
      viewCount: 128450,
      likeCount: 8920
    },
    {
      id: 'fallback-3',
      title: '⚡ Indiana Fever WIN STREAK! Top 10 Plays from Last 3 Games',
      publishedAt: hoursAgo(6),
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      live: false,
      viewCount: 67890,
      likeCount: 4560
    }
  ];
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

// 无密钥RSS回退：从频道RSS获取最新视频
async function fetchRSSVideos(channelId: string, channelName: string): Promise<LatestVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl, { cache: 'no-store' });
    if (!res.ok) return [];
    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const entries = Array.from(doc.getElementsByTagName('entry'));
    const videos: LatestVideo[] = entries.slice(0, 12).map((entry) => {
      const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent || '';
      const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled';
      const publishedAt = entry.getElementsByTagName('published')[0]?.textContent || new Date().toISOString();
      const author = entry.getElementsByTagName('author')[0];
      const channelTitle = author?.getElementsByTagName('name')[0]?.textContent || channelName;
      const maxres = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : 'https://i.ytimg.com/vi/invalid/hqdefault.jpg';
      return {
        id,
        title,
        publishedAt,
        channelTitle,
        thumbnailUrl: maxres,
        url: id ? `https://www.youtube.com/watch?v=${id}` : '',
        live: false
      };
    });
    return videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  } catch (e) {
    console.warn('[VideoProvider] RSS fallback failed:', e);
    return [];
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
    // RSS 回退
    const rssVideos = await fetchRSSVideos(cid, channelConfig.name);
    if (rssVideos.length > 0) {
      return rssVideos.slice(0, 10);
    }
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
      // RSS 回退
      const rssVideos = await fetchRSSVideos(cid, channelConfig.name);
      if (rssVideos.length > 0) {
        return rssVideos.slice(0, 10);
      }
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
      // RSS 回退
      console.warn(`YouTube API error ${resV.status} — using RSS fallback for ${channelConfig.name}`);
      const rssVideos = await fetchRSSVideos(cid, channelConfig.name);
      if (rssVideos.length > 0) {
        return rssVideos.slice(0, 10);
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
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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

// 主要的获取视频函数 - 带缓存和多密钥支持
export async function fetchLatestVideos(): Promise<LatestVideo[]> {
  console.log('[VideoProvider] Starting to fetch latest videos...');
  console.log(`[VideoProvider] Using API key index: ${currentApiKeyIndex}`);
  
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
  console.log('[VideoProvider] No cache found, fetching fresh videos...');
  return await fetchAndCacheVideos();
}

// 获取并缓存视频的内部函数
async function fetchAndCacheVideos(): Promise<LatestVideo[]> {
  const apiKey = getApiKey();
  console.log('[VideoProvider] Current API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None');
  if (!apiKey) {
    console.warn('[VideoProvider] No API key available');
    const cached = getVideosFromCache();
    if (cached && cached.length > 0) {
      console.log('[VideoProvider] Using cached videos due to missing API key');
      return cached;
    }
    // 最后兜底（不写入缓存）
    const fallbackVideos = createFallbackVideos();
    console.warn('[VideoProvider] Returning temporary fallback videos (no cache write)');
    return fallbackVideos;
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
      console.warn('[VideoProvider] No videos fetched from API');
      const cachedVideos = getVideosFromCache();
      if (cachedVideos && cachedVideos.length > 0) {
        console.log('[VideoProvider] Using cached videos (API returned none)');
        return cachedVideos;
      }
      // 最后兜底（不写入缓存）
      const fallbackVideos = createFallbackVideos();
      console.warn('[VideoProvider] Returning temporary fallback videos (no cache write)');
      return fallbackVideos;
    }

    // 按频道平衡视频数量 - 确保每个频道至少2个视频
    const videosByChannel = new Map<string, LatestVideo[]>();
    allVideos.forEach(video => {
      const channel = video.channelTitle;
      if (!videosByChannel.has(channel)) {
        videosByChannel.set(channel, []);
      }
      videosByChannel.get(channel)!.push(video);
    });
    
    // 每个频道取最新的视频，确保总数至少6个
    const balancedVideos: LatestVideo[] = [];
    const minVideosPerChannel = 2;
    const maxVideosPerChannel = 8;
    
    videosByChannel.forEach((videos, channel) => {
      const sortedVideos = videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
      const videosToTake = Math.min(maxVideosPerChannel, Math.max(minVideosPerChannel, sortedVideos.length));
      balancedVideos.push(...sortedVideos.slice(0, videosToTake));
      console.log(`Including ${videosToTake} videos from ${channel} (available: ${sortedVideos.length})`);
    });
    
    // 如果总视频数不足6个，从所有视频中补充
    if (balancedVideos.length < 6) {
      const remainingVideos = allVideos
        .filter(v => !balancedVideos.find(bv => bv.id === v.id))
        .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
      
      const needed = 6 - balancedVideos.length;
      balancedVideos.push(...remainingVideos.slice(0, needed));
      console.log(`Added ${Math.min(needed, remainingVideos.length)} additional videos to reach minimum of 6`);
    }
    
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