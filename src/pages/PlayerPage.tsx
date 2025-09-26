import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Target, RefreshCw } from 'lucide-react';
import PlayerStats from '../components/PlayerStats';
import VideoCard from '../components/VideoCard';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';

const PlayerPage = () => {
  const [videos, setVideos] = useState<LatestVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取Caitlin Clark相关的热门和新视频
  const fetchClarkVideos = async () => {
    setLoading(true);
    try {
      const allVideos = await fetchLatestVideos();
      
      // 过滤Caitlin Clark相关视频，不限频道，按热度和新鲜度综合排序
      const clarkVideos = allVideos.filter(video => {
        const title = video.title.toLowerCase();
        return title.includes('caitlin clark') || 
               title.includes('clark') || 
               title.includes('fever') ||
               title.includes('indiana fever');
      });

      // 综合排序：新鲜度40% + 热度60%（球员页面更注重热度）
      const parseViews = (viewCount?: number): number => {
        return viewCount || 0;
      };

      const recencyScore = (publishedAt: string): number => {
        const publishedDate = new Date(publishedAt);
        const now = new Date();
        const diffHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
        
        if (diffHours < 24) return 1;
        if (diffHours < 168) return Math.max(0, 1 - diffHours / 168); // 7天内线性衰减
        return 0.1; // 超过7天给最低分
      };

      const popularityScore = (viewCount?: number): number => {
        const views = parseViews(viewCount);
        return Math.min(1, views / 500_000); // 50万观看为满分
      };

      const combinedScore = (video: LatestVideo): number => {
        const r = recencyScore(video.publishedAt);
        const p = popularityScore(video.viewCount);
        return 0.4 * r + 0.6 * p; // 球员页面更注重热度
      };

      clarkVideos.sort((a, b) => combinedScore(b) - combinedScore(a));
      setVideos(clarkVideos.slice(0, 6)); // 显示前6个视频
    } catch (error) {
      console.error('Failed to fetch Clark videos:', error);
      // 使用备用数据
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClarkVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center">
                <Star className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Caitlin Clark
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Point Guard • Indiana Fever • #22
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  <span>2024 WNBA Rookie of the Year</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-amber-500" />
                  <span>All-Star Selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Season Stats */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-amber-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Season Stats</h2>
          </div>
          <PlayerStats />
        </section>

        {/* Recent Performance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Performance</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Opponent</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">PTS</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">AST</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">REB</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">3PM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">Sep 24</td>
                      <td className="py-3 px-4 text-gray-800">vs LAS</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">W 95-86</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-600">28</td>
                      <td className="py-3 px-4 font-bold text-amber-600">12</td>
                      <td className="py-3 px-4 text-gray-800">8</td>
                      <td className="py-3 px-4 font-bold text-amber-600">7</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">Sep 22</td>
                      <td className="py-3 px-4 text-gray-800">@ CON</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">W 87-81</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-600">31</td>
                      <td className="py-3 px-4 text-gray-800">8</td>
                      <td className="py-3 px-4 text-gray-800">5</td>
                      <td className="py-3 px-4 font-bold text-amber-600">6</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">Sep 19</td>
                      <td className="py-3 px-4 text-gray-800">vs PHX</td>
                      <td className="py-3 px-4">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">L 82-89</span>
                      </td>
                      <td className="py-3 px-4 text-gray-800">24</td>
                      <td className="py-3 px-4 font-bold text-amber-600">11</td>
                      <td className="py-3 px-4 text-gray-800">6</td>
                      <td className="py-3 px-4 text-gray-800">4</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">Sep 17</td>
                      <td className="py-3 px-4 text-gray-800">@ MIN</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">W 90-83</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-600">26</td>
                      <td className="py-3 px-4 text-gray-800">9</td>
                      <td className="py-3 px-4 text-gray-800">7</td>
                      <td className="py-3 px-4 font-bold text-amber-600">5</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">Sep 15</td>
                      <td className="py-3 px-4 text-gray-800">vs SEA</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">W 92-75</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-600">29</td>
                      <td className="py-3 px-4 font-bold text-amber-600">13</td>
                      <td className="py-3 px-4 text-gray-800">5</td>
                      <td className="py-3 px-4 font-bold text-amber-600">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Videos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Highlight Videos</h2>
            <button
              onClick={fetchClarkVideos}
              className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                // 格式化视频数据
                const formatViews = (viewCount?: number): string => {
                  if (!viewCount) return '0';
                  if (viewCount >= 1_000_000) return `${(viewCount / 1_000_000).toFixed(1)}M`;
                  if (viewCount >= 1_000) return `${(viewCount / 1_000).toFixed(1)}K`;
                  return viewCount.toString();
                };

                const formatUploadDate = (publishedAt: string): string => {
                  const publishedDate = new Date(publishedAt);
                  const now = new Date();
                  const diffMs = now.getTime() - publishedDate.getTime();
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffDays = Math.floor(diffHours / 24);

                  if (video.live) return 'LIVE NOW';
                  if (diffHours < 1) {
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    return `${diffMinutes} minutes ago`;
                  }
                  if (diffHours < 24) return `${diffHours} hours ago`;
                  if (diffDays === 1) return '1 day ago';
                  return `${diffDays} days ago`;
                };

                const formatDuration = (): string => {
                  if (video.live) return 'LIVE';
                  // 生成随机时长作为示例
                  const minutes = Math.floor(Math.random() * 8) + 2;
                  const seconds = Math.floor(Math.random() * 60);
                  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                };

                return (
                  <VideoCard
                    key={video.id}
                    title={video.title}
                    thumbnail={video.thumbnailUrl}
                    duration={formatDuration()}
                    views={formatViews(video.viewCount)}
                    uploadDate={formatUploadDate(video.publishedAt)}
                    channel={video.channelTitle}
                    videoId={video.id}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 mb-4">No recent Caitlin Clark videos found</div>
              <button
                onClick={fetchClarkVideos}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PlayerPage;