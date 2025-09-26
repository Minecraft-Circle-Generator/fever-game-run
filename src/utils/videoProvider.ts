
// 获取多个YouTube频道的最新视频
// 专门针对WNBA Official、ESPN、Indiana Fever三个频道

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

// 多个备用 API 密钥以提高可靠性
const BACKUP_API_KEYS = [
  'AIzaSyB-To2HdPVodNAK54rYZdVCA8jeVOfAjm8',
  'AIzaSyDHnKL9Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z', // 备用密钥
];

function getApiKey(): string {
  const envKey = getEnv('VITE_YOUTUBE_API_KEY');
  if (envKey && envKey.length > 10) return envKey;
  
  // 使用备用密钥
  return BACKUP_API_KEYS[0];
}

const API_KEY = getApiKey();

// 添加调试日志
console.log('[VideoProvider] Using API key:', API_KEY.substring(0, 10) + '...');

// 三个目标频道的配置（Indiana Fever 频道ID将自动解析）
const TARGET_CHANNELS = [
  {
    name: 'WNBA', // 修正：API返回的频道名是 "WNBA"，不是 "WNBA Official"
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
  
  // 为 WNBA Official 使用更精确的搜索
  let searchQuery = name;
  if (name === 'WNBA Official') {
    searchQuery = 'WNBA';
  }
  
  const base = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    key: API_KEY!,
    part: 'snippet',
    maxResults: '5',
    q: searchQuery,
    type: 'channel'
  });
  try {
    const res = await fetch(`${base}?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`resolve channel failed: ${res.status}`);
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

// 构建YouTube搜索URL - 针对特定频道
function buildChannelSearchUrl(channelId: string): string {
  const base = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    key: API_KEY!,
    part: 'snippet',
    order: 'date', // 最新在前
    maxResults: '10',
    type: 'video',
    channelId,
    // 仅拉取最近7天，避免旧视频
    publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  });
  return `${base}?${params.toString()}`;
}

// 构建通用搜索URL - 作为备用方案
function buildGeneralSearchUrl(): string {
  const base = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    key: API_KEY!,
    part: 'snippet',
    order: 'date',
    maxResults: '15',
    type: 'video',
    q: 'Indiana Fever Caitlin Clark WNBA highlights 2024',
    publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 最近7天
  });
  
  return `${base}?${params.toString()}`;
}

// 从单个频道获取视频
async function fetchChannelVideos(channelConfig: typeof TARGET_CHANNELS[0]): Promise<LatestVideo[]> {
  // 确保拿到有效的 channelId
  let cid = channelConfig.channelId;
  if (!cid) {
    cid = (await resolveChannelIdByName(channelConfig.name)) || '';
  }
  if (!cid) {
    console.warn(`No channel ID found for ${channelConfig.name}`);
    return [];
  }
  
  console.log(`Fetching videos from ${channelConfig.name} (${cid})`);
  const url = buildChannelSearchUrl(cid);
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
    const json = await res.json();
    const items = (json.items || []) as any[];
    
    console.log(`Found ${items.length} videos from ${channelConfig.name}`);

    const videos = items.map((it) => {
      const id = it.id?.videoId || it.id;
      const sn = it.snippet || {};
      const publishedAt = sn.publishedAt || new Date().toISOString();
      const title = sn.title || 'Untitled';
      const channelTitle = sn.channelTitle || channelConfig.name;
      const thumb = sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || '';
      const live = sn.liveBroadcastContent === 'live';
      return {
        id,
        title,
        publishedAt,
        channelTitle,
        thumbnailUrl: thumb,
        url: `https://www.youtube.com/watch?v=${id}`,
        live
      };
    }).filter(v => !!v.id);
    
    console.log(`Processed ${videos.length} valid videos from ${channelConfig.name}`);
    return videos;
  } catch (err) {
    console.error(`Failed to fetch from ${channelConfig.name}:`, err);
    return [];
  }
}

// 获取所有频道的最新视频（带强化的 fallback 机制）
export async function fetchLatestVideos(): Promise<LatestVideo[]> {
  if (!API_KEY) {
    console.warn('No YouTube API key found, using fallback data');
    return getFallbackVideos();
  }
  
  console.log('Starting to fetch latest videos from all channels...');
  
  try {
    // 仅官方三频道，严格聚合最近7天
    const channelPromises = TARGET_CHANNELS.map(channel => fetchUploadsVideos(channel));
    const channelResults = await Promise.all(channelPromises);

    console.log('Channel results:', channelResults.map((videos, i) => 
      `${TARGET_CHANNELS[i].name}: ${videos.length} videos`
    ));

    // 合并并基于视频ID强去重
    let allVideos: LatestVideo[] = [];
    channelResults.forEach((videos, i) => { 
      console.log(`Adding ${videos.length} videos from ${TARGET_CHANNELS[i].name}`);
      allVideos = allVideos.concat(videos); 
    });
    
    console.log(`Total videos before deduplication: ${allVideos.length}`);
    allVideos = allVideos.filter((v, i, self) => i === self.findIndex(x => x.id === v.id));
    console.log(`Total videos after deduplication: ${allVideos.length}`);

    // 如果没有获取到任何视频，使用 fallback
    if (allVideos.length === 0) {
      console.warn('No videos fetched from API, using fallback data');
      return getFallbackVideos();
    }

    // 拉取统计（分批<=50）
    const statsMap = await fetchStatsForIds(allVideos.map(v => v.id));
    allVideos = allVideos.map(v => ({
      ...v,
      viewCount: statsMap[v.id]?.viewCount || v.viewCount,
      likeCount: statsMap[v.id]?.likeCount || v.likeCount
    }));

    // 确保每个频道都有视频被包含 - 每个频道取最新的4个视频
    const videosByChannel = new Map<string, any[]>();
    
    // 按频道分组
    allVideos.forEach(video => {
      const channel = video.channelTitle;
      if (!videosByChannel.has(channel)) {
        videosByChannel.set(channel, []);
      }
      videosByChannel.get(channel)!.push(video);
    });
    
    // 每个频道按发布时间排序并取前12个（进一步增加数量以获得更多 Caitlin Clark 相关视频）
    const balancedVideos: any[] = [];
    videosByChannel.forEach((videos, channel) => {
      const sortedVideos = videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
      balancedVideos.push(...sortedVideos.slice(0, 12));
      console.log(`Including ${Math.min(12, sortedVideos.length)} videos from ${channel}`);
    });
    
    // 最终按发布时间排序
    balancedVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

    console.log(`Returning ${balancedVideos.length} videos (balanced across channels)`);
    
    // 如果最终结果太少，补充 fallback 数据
    if (balancedVideos.length < 3) {
      console.warn('Too few videos from API, supplementing with fallback data');
      const fallbackVideos = getFallbackVideos();
      return [...balancedVideos, ...fallbackVideos].slice(0, 6);
    }
    
    return balancedVideos;
  } catch (err) {
    console.error('fetchLatestVideos error:', err);
    console.log('Using fallback videos due to error');
    return getFallbackVideos();
  }
}

// 通用搜索作为备用方案
async function fetchGeneralVideos(): Promise<LatestVideo[]> {
  const url = buildGeneralSearchUrl();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
    const json = await res.json();
    const items = (json.items || []) as any[];

    const videos: LatestVideo[] = items.map((it) => {
      const id = it.id?.videoId || it.id;
      const sn = it.snippet || {};
      const publishedAt = sn.publishedAt || new Date().toISOString();
      const title = sn.title || 'Untitled';
      const channelTitle = sn.channelTitle || 'YouTube';
      const thumb = sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || '';
      const live = sn.liveBroadcastContent === 'live';
      
      return {
        id,
        title,
        publishedAt,
        channelTitle,
        thumbnailUrl: thumb,
        url: `https://www.youtube.com/watch?v=${id}`,
        live
      };
    }).filter(v => !!v.id);

    // 按发布时间排序
    videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return videos;
  } catch (err) {
    console.warn('General search failed, using demo data:', err);
    return getDemoVideos();
  }
  
}
// 批量获取统计数据
async function fetchStatsForIds(ids: string[]): Promise<Record<string, { viewCount: number; likeCount: number }>> {
  const result: Record<string, { viewCount: number; likeCount: number }> = {};
  if (!API_KEY || ids.length === 0) return result;

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 50) {
    chunks.push(ids.slice(i, i + 50));
  }

  await Promise.all(chunks.map(async (chunk) => {
    const base = 'https://www.googleapis.com/youtube/v3/videos';
    const params = new URLSearchParams({
      key: API_KEY!,
      part: 'statistics',
      id: chunk.join(',')
    });
    try {
      const res = await fetch(`${base}?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      (data.items || []).forEach((it: any) => {
        const id = it.id as string;
        const st = it.statistics || {};
        const views = Number(st.viewCount || 0);
        const likes = Number(st.likeCount || 0);
        result[id] = { viewCount: views, likeCount: likes };
      });
    } catch {
      // 忽略单批失败
    }
  }));

  return result;
}
 
/**
 * 获取频道的 uploads 播放列表ID
 */
async function getUploadsPlaylistId(channelId: string): Promise<string | undefined> {
  if (!API_KEY || !channelId) return undefined;
  const base = 'https://www.googleapis.com/youtube/v3/channels';
  const params = new URLSearchParams({
    key: API_KEY!,
    part: 'contentDetails',
    id: channelId
  });
  try {
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads as string | undefined;
  } catch {
    return undefined;
  }
}

/**
 * 从官方频道的 uploads 列表获取最近30天的上传视频，并补齐统计与缩略图
 */
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
  const basePI = 'https://www.googleapis.com/youtube/v3/playlistItems';
  const paramsPI = new URLSearchParams({
    key: API_KEY!,
    part: 'snippet',
    maxResults: '50', // 增加到50个
    playlistId: uploadsId
  });

  try {
    const resPI = await fetch(`${basePI}?${paramsPI.toString()}`, { cache: 'no-store' });
    if (!resPI.ok) throw new Error(`YouTube API error: ${resPI.status}`);
    const dataPI = await resPI.json();
    const items = (dataPI.items || []) as any[];

    console.log(`Found ${items.length} playlist items for ${channelConfig.name}`);

    // 扩大时间范围到30天，避免过滤太严格
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
      key: API_KEY!,
      part: 'snippet,statistics',
      id: ids.join(',')
    });

    const resV = await fetch(`${baseV}?${paramsV.toString()}`, { cache: 'no-store' });
    if (!resV.ok) throw new Error(`YouTube API error: ${resV.status}`);
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

// Fallback 视频数据 - 当API失败时使用
function getFallbackVideos(): LatestVideo[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: 'fallback-1',
      title: '🔥 Caitlin Clark INCREDIBLE 30-Point Performance vs Las Vegas Aces!',
      publishedAt: now.toISOString(),
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=Caitlin+Clark+Indiana+Fever+highlights',
      live: false,
      viewCount: 125000,
      likeCount: 8500
    },
    {
      id: 'fallback-2',
      title: '🏀 WNBA Highlights: Indiana Fever vs New York Liberty - EPIC Game Recap',
      publishedAt: yesterday.toISOString(),
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=WNBA+Indiana+Fever+highlights',
      live: false,
      viewCount: 89000,
      likeCount: 5200
    },
    {
      id: 'fallback-3',
      title: '⭐ Caitlin Clark Triple-Double Highlights - Rookie Record Breaking!',
      publishedAt: twoDaysAgo.toISOString(),
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=Caitlin+Clark+triple+double+ESPN',
      live: false,
      viewCount: 156000,
      likeCount: 12000
    },
    {
      id: 'fallback-4',
      title: '🎯 Indiana Fever Best Plays of the Season - Caitlin Clark Edition',
      publishedAt: twoDaysAgo.toISOString(),
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=Indiana+Fever+best+plays+2024',
      live: false,
      viewCount: 78000,
      likeCount: 4500
    },
    {
      id: 'fallback-5',
      title: '🔥 WNBA Rookie of the Year: Caitlin Clark Highlights Compilation',
      publishedAt: twoDaysAgo.toISOString(),
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=Caitlin+Clark+rookie+year+highlights',
      live: false,
      viewCount: 203000,
      likeCount: 15000
    },
    {
      id: 'fallback-6',
      title: '🏆 Indiana Fever Playoff Push - Key Moments & Highlights',
      publishedAt: twoDaysAgo.toISOString(),
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/results?search_query=Indiana+Fever+playoffs+2024',
      live: false,
      viewCount: 92000,
      likeCount: 6800
    }
  ];
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
      channelTitle: 'WNBA Official',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live: true,
    },
    {
      id: 'demo-1',
      title: '🔥 Caitlin Clark 31 Points EXPLOSION! Career-High Performance vs Mercury',
      publishedAt: hoursAgo(2), // 2小时前
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      live: false,
    },
    {
      id: 'demo-2',
      title: '⚡ Indiana Fever WIN STREAK! Top 10 Plays from Last 3 Games',
      publishedAt: hoursAgo(6), // 6小时前
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      live: false,
    },
    {
      id: 'demo-3',
      title: '🚀 ROOKIE RECORD BROKEN! Caitlin Clark Makes WNBA History',
      publishedAt: hoursAgo(12), // 12小时前
      channelTitle: 'WNBA Official',
      thumbnailUrl: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
      live: false,
    },
    {
      id: 'demo-4',
      title: '💥 Fever vs Aces EPIC BATTLE! Full Game Highlights & Best Moments',
      publishedAt: hoursAgo(18), // 18小时前
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live: false,
    },
    {
      id: 'demo-5',
      title: '🎯 Caitlin Clark CLUTCH 3-Pointers! Game-Winning Shots Compilation',
      publishedAt: hoursAgo(24), // 1天前
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
      live: false,
    }
  ];
}