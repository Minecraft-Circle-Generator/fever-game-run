// 鑾峰彇澶氫釜YouTube棰戦亾鐨勬渶鏂拌棰?// 涓撻棬閽堝WNBA Official銆丒SPN銆両ndiana Fever涓変釜棰戦亾
// 鏂规3锛氬涓鐢ˋPI瀵嗛挜 + 缂撳瓨鏈哄埗

export interface LatestVideo {
  id: string;
  title: string;
  publishedAt: string; // ISO string
  channelTitle: string;
  thumbnailUrl: string;
  url: string;
  live: boolean;
  // 鐪熷疄缁熻锛堝彲閫夛紝鑻ユ垚鍔熸媺鍙栵級
  viewCount?: number;
  likeCount?: number;
}

function getEnv(key: string): string | undefined {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' && v.length ? v : undefined;
}

// 澶氫釜澶囩敤 API 瀵嗛挜閰嶇疆
const API_KEYS = [
  () => getEnv('VITE_YOUTUBE_API_KEY'),
  () => getEnv('VITE_YOUTUBE_API_KEY_2'), 
  () => getEnv('VITE_YOUTUBE_API_KEY_3'),
  () => 'AIzaSyB-To2HdPVodNAK54rYZdVCA8jeVOfAjm8', // 澶囩敤瀵嗛挜1
  () => 'AIzaSyBpVRHSo98enkIJrREPfCTQzm2FUkzXTvg', // 澶囩敤瀵嗛挜2
];

// 褰撳墠浣跨敤鐨?API 瀵嗛挜绱㈠紩
let currentApiKeyIndex = 0;

function getApiKey(): string {
  for (let i = currentApiKeyIndex; i < API_KEYS.length; i++) {
    const key = API_KEYS[i]();
    if (key && key.length > 10) {
      currentApiKeyIndex = i;
      return key;
    }
  }
  
  // 濡傛灉鎵€鏈夊瘑閽ラ兘鏃犳晥锛岄噸缃储寮曞苟杩斿洖鏈€鍚庝竴涓鐢ㄥ瘑閽?  currentApiKeyIndex = 0;
  return API_KEYS[API_KEYS.length - 1]() || '';
}

// 鍒囨崲鍒颁笅涓€涓?API 瀵嗛挜锛堝綋褰撳墠瀵嗛挜閰嶉鐢ㄥ畬鏃讹級
function switchToNextApiKey(): string {
  currentApiKeyIndex = Math.min(currentApiKeyIndex + 1, API_KEYS.length - 1);
  const newKey = getApiKey();
  console.log(`[VideoProvider] Switched to API key index ${currentApiKeyIndex}`);
  return newKey;
}

// 瑙嗛缂撳瓨绠＄悊
const CACHE_KEY = 'fever_game_videos_cache';
const CACHE_EXPIRY_KEY = 'fever_game_videos_cache_expiry';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2灏忔椂缂撳瓨

// 淇濆瓨瑙嗛鍒扮紦瀛?function saveVideosToCache(videos: LatestVideo[]): void {
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

// 浠庣紦瀛樿幏鍙栬棰?function getVideosFromCache(): LatestVideo[] | null {
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

// 娓呴櫎杩囨湡缂撳瓨
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

// 涓変釜鐩爣棰戦亾鐨勯厤缃?const TARGET_CHANNELS = [
  {
    name: 'WNBA',
    channelId: 'UCO9a_ryN_l7DIDS-VIt-zmw', // WNBA 瀹樻柟棰戦亾 (@WNBA)
    searchQuery: ''
  },
  {
    name: 'ESPN',
    channelId: 'UCiWLfSweyRNmLpgEHekhoAg', // ESPN
    searchQuery: ''
  },
  {
    name: 'Indiana Fever',
    channelId: '', // 杩愯鏃惰В鏋愭纭殑 channelId
    searchQuery: ''
  }
];

// 瑙ｆ瀽棰戦亾ID锛堜粎褰撶己澶辨椂璋冪敤涓€娆★紝缁撴灉缂撳瓨锛?const channelIdCache: Record<string, string> = {};
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
        // API 閰嶉鐢ㄥ畬锛屽垏鎹㈠埌涓嬩竴涓瘑閽?        const newKey = switchToNextApiKey();
        if (newKey !== apiKey) {
          return resolveChannelIdByName(name); // 鐢ㄦ柊瀵嗛挜閲嶈瘯
        }
      }
      throw new Error(`resolve channel failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    // 瀵逛簬 WNBA锛屽鎵惧畼鏂归閬?    if (name === 'WNBA Official') {
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

// 鑾峰彇棰戦亾鐨?uploads 鎾斁鍒楄〃ID
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
          return getUploadsPlaylistId(channelId); // 鐢ㄦ柊瀵嗛挜閲嶈瘯
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

// 浠庡畼鏂归閬撶殑 uploads 鍒楄〃鑾峰彇鏈€杩?0澶╃殑涓婁紶瑙嗛
async function fetchUploadsVideos(channelConfig: typeof TARGET_CHANNELS[0]): Promise<LatestVideo[]> {
  // 瑙ｆ瀽鏈夋晥 channelId
  let cid = channelConfig.channelId;
  if (!cid) {
    cid = (await resolveChannelIdByName(channelConfig.name)) || '';
  }
  if (!cid) {
    console.error(`No channel ID found for ${channelConfig.name}`);
    return [];
  }

  console.log(`Fetching uploads for ${channelConfig.name} (${cid})`);

  // 鑾峰彇 uploads 鎾斁鍒楄〃ID
  const uploadsId = await getUploadsPlaylistId(cid);
  if (!uploadsId) {
    console.error(`No uploads playlist found for ${channelConfig.name}`);
    return [];
  }

  console.log(`Found uploads playlist: ${uploadsId} for ${channelConfig.name}`);

  // 鎷夊彇鎾斁鍒楄〃椤癸紙涓婁紶瑙嗛锛?  const apiKey = getApiKey();
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
          return fetchUploadsVideos(channelConfig); // 鐢ㄦ柊瀵嗛挜閲嶈瘯
        }
      }
      throw new Error(`YouTube API error: ${resPI.status}`);
    }
    
    const dataPI = await resPI.json();
    const items = (dataPI.items || []) as any[];

    console.log(`Found ${items.length} playlist items for ${channelConfig.name}`);

    // 鎵╁ぇ鏃堕棿鑼冨洿鍒?0澶?    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
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

    // 琛ラ綈缁熻涓庣缉鐣ュ浘
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
          return fetchUploadsVideos(channelConfig); // 鐢ㄦ柊瀵嗛挜閲嶈瘯
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

    // 鍘婚噸骞舵寜鍙戝竷鏃堕棿闄嶅簭
    const unique = videosRaw.filter((v, i, self) => i === self.findIndex(x => x.id === v.id));
    unique.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    
    console.log(`Returning ${unique.length} unique videos from ${channelConfig.name}`);
    return unique.slice(0, 10); // 姣忎釜棰戦亾鏈€澶氳繑鍥?0涓棰?  } catch (err) {
    console.error(`fetchUploadsVideos failed for ${channelConfig.name}:`, err);
    return [];
  }
}

// 涓昏鐨勮幏鍙栬棰戝嚱鏁?- 甯︾紦瀛樺拰澶氬瘑閽ユ敮鎸?export async function fetchLatestVideos(): Promise<LatestVideo[]> {
  console.log('[VideoProvider] Starting to fetch latest videos...');
  console.log(`[VideoProvider] Using API key index: ${currentApiKeyIndex}`);
  
  // 娓呯悊杩囨湡缂撳瓨
  clearExpiredCache();
  
  // 棣栧厛灏濊瘯浠庣紦瀛樿幏鍙?  const cachedVideos = getVideosFromCache();
  if (cachedVideos && cachedVideos.length > 0) {
    console.log(`[VideoProvider] Using cached videos: ${cachedVideos.length} videos`);
    // 寮傛鏇存柊缂撳瓨锛堜笉闃诲褰撳墠璇锋眰锛?    fetchAndCacheVideos();
    return cachedVideos;
  }
  
  // 缂撳瓨鏃犳晥锛岀洿鎺ヨ幏鍙栨柊瑙嗛
  return await fetchAndCacheVideos();
}

// 鑾峰彇骞剁紦瀛樿棰戠殑鍐呴儴鍑芥暟
async function fetchAndCacheVideos(): Promise<LatestVideo[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[VideoProvider] No API key available');
    return getVideosFromCache() || [];
  }
  
  try {
    // 浠庢墍鏈夐閬撹幏鍙栬棰?    const channelPromises = TARGET_CHANNELS.map(channel => fetchUploadsVideos(channel));
    const channelResults = await Promise.all(channelPromises);

    console.log('Channel results:', channelResults.map((videos, i) => 
      `${TARGET_CHANNELS[i].name}: ${videos.length} videos`
    ));

    // 鍚堝苟骞跺幓閲?    let allVideos: LatestVideo[] = [];
    channelResults.forEach((videos, i) => { 
      console.log(`Adding ${videos.length} videos from ${TARGET_CHANNELS[i].name}`);
      allVideos = allVideos.concat(videos); 
    });
    
    console.log(`Total videos before deduplication: ${allVideos.length}`);
    allVideos = allVideos.filter((v, i, self) => i === self.findIndex(x => x.id === v.id));
    console.log(`Total videos after deduplication: ${allVideos.length}`);

    if (allVideos.length === 0) {
      console.warn('[VideoProvider] No videos fetched from API, using cached data');
      return getVideosFromCache() || [];
    }

    // 鎸夐閬撳钩琛¤棰戞暟閲?    const videosByChannel = new Map<string, LatestVideo[]>();
    allVideos.forEach(video => {
      const channel = video.channelTitle;
      if (!videosByChannel.has(channel)) {
        videosByChannel.set(channel, []);
      }
      videosByChannel.get(channel)!.push(video);
    });
    
    // 姣忎釜棰戦亾鍙栨渶鏂扮殑12涓棰?    const balancedVideos: LatestVideo[] = [];
    videosByChannel.forEach((videos, channel) => {
      const sortedVideos = videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
      balancedVideos.push(...sortedVideos.slice(0, 12));
      console.log(`Including ${Math.min(12, sortedVideos.length)} videos from ${channel}`);
    });
    
    // 鏈€缁堟寜鍙戝竷鏃堕棿鎺掑簭
    balancedVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

    console.log(`Successfully fetched ${balancedVideos.length} videos`);
    
    // 淇濆瓨鍒扮紦瀛?    if (balancedVideos.length > 0) {
      saveVideosToCache(balancedVideos);
    }
    
    return balancedVideos;
    
  } catch (err) {
    console.error('[VideoProvider] Error fetching videos:', err);
    // 鍙戠敓閿欒鏃讹紝杩斿洖缂撳瓨鐨勮棰?    const cachedVideos = getVideosFromCache();
    if (cachedVideos && cachedVideos.length > 0) {
      console.log('[VideoProvider] Using cached videos due to error');
      return cachedVideos;
    }
    return [];
  }
}
