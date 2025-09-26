// 调试版本的视频提供器
import { LatestVideo } from './videoProvider';

// 多个备用 API 密钥
const API_KEYS = [
  'AIzaSyB-To2HdPVodNAK54rYZdVCA8jeVOfAjm8',
  'AIzaSyDQ7tgw8Z8Zv8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z', // 备用密钥1
  'AIzaSyC9Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'  // 备用密钥2
];

function getEnv(key: string): string | undefined {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' && v.length ? v : undefined;
}

// 获取可用的 API 密钥
function getApiKey(): string {
  const envKey = getEnv('VITE_YOUTUBE_API_KEY');
  if (envKey) return envKey;
  
  // 返回第一个备用密钥
  return API_KEYS[0];
}

// 调试日志函数
function debugLog(message: string, data?: any) {
  console.log(`[VideoProvider Debug] ${message}`, data || '');
}

// 测试 API 连接
export async function testApiConnection(): Promise<boolean> {
  const apiKey = getApiKey();
  debugLog('Testing API connection with key:', apiKey.substring(0, 10) + '...');
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=1&key=${apiKey}`
    );
    
    if (response.ok) {
      debugLog('API connection successful');
      return true;
    } else {
      debugLog('API connection failed:', response.status);
      return false;
    }
  } catch (error) {
    debugLog('API connection error:', error);
    return false;
  }
}

// 简化的视频获取函数（用于调试）
export async function getDebugVideos(): Promise<LatestVideo[]> {
  const apiKey = getApiKey();
  debugLog('Fetching debug videos...');
  
  try {
    // 简单搜索 Indiana Fever 相关视频
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=Indiana+Fever+Caitlin+Clark&type=video&maxResults=6&order=date&key=${apiKey}`
    );
    
    if (!response.ok) {
      debugLog('API request failed:', response.status);
      return [];
    }
    
    const data = await response.json();
    debugLog('API response received:', data);
    
    if (!data.items || data.items.length === 0) {
      debugLog('No videos found in API response');
      return [];
    }
    
    const videos: LatestVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      live: false
    }));
    
    debugLog(`Successfully fetched ${videos.length} videos`);
    return videos;
    
  } catch (error) {
    debugLog('Error fetching videos:', error);
    return [];
  }
}

// 模拟数据（作为最后的 fallback）
export function getMockVideos(): LatestVideo[] {
  debugLog('Using mock videos as fallback');
  
  return [
    {
      id: 'mock1',
      title: '🔥 Caitlin Clark INCREDIBLE Performance vs Las Vegas Aces!',
      publishedAt: new Date().toISOString(),
      channelTitle: 'Indiana Fever',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/watch?v=mock1',
      live: false
    },
    {
      id: 'mock2',
      title: '🏀 WNBA Highlights: Fever vs Liberty - Game Recap',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      channelTitle: 'WNBA',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/watch?v=mock2',
      live: false
    },
    {
      id: 'mock3',
      title: '⭐ Caitlin Clark Triple-Double Highlights',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      channelTitle: 'ESPN',
      thumbnailUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://www.youtube.com/watch?v=mock3',
      live: false
    }
  ];
}