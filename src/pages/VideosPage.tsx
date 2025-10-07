import React, { useState, useEffect } from 'react';
import { Video, Search, Filter, RefreshCw } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import BookmarkButton from '../components/BookmarkButton';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';
import { t } from '../utils/i18n';

const VideosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [videos, setVideos] = useState<LatestVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 官方三个频道
  const OFFICIAL_CHANNELS = [
    { id: 'all', name: 'All Official Channels' },
    { id: 'WNBA', name: 'WNBA Official' }, // 修正：使用API返回的实际频道名 "WNBA"
    { id: 'ESPN', name: 'ESPN' },
    { id: 'Indiana Fever', name: 'Indiana Fever' }
  ];

  // 获取官方频道的最新视频
  const fetchOfficialVideos = async () => {
    setLoading(true);
    try {
      const allVideos = await fetchLatestVideos();
      console.log('fetchOfficialVideos - Total videos received:', allVideos.length);
      
      // 打印所有视频的频道信息
      const channelCounts = allVideos.reduce((acc, video) => {
        acc[video.channelTitle] = (acc[video.channelTitle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('fetchOfficialVideos - Videos by channel:', channelCounts);
      
      // 按频道分组，每个频道只取前2个视频
      const channelGroups: Record<string, LatestVideo[]> = {};
      const targetChannels = ['WNBA', 'ESPN', 'Indiana Fever']; // 修正频道名称
      
      allVideos.forEach(video => {
        console.log('Processing video:', video.title, 'from channel:', video.channelTitle);
        if (targetChannels.includes(video.channelTitle)) {
          if (!channelGroups[video.channelTitle]) {
            channelGroups[video.channelTitle] = [];
          }
          if (channelGroups[video.channelTitle].length < 2) {
            channelGroups[video.channelTitle].push(video);
            console.log('Added video to', video.channelTitle, '- now has', channelGroups[video.channelTitle].length, 'videos');
          }
        } else {
          console.log('Video channel not in target channels:', video.channelTitle);
        }
      });

      console.log('Final channel groups:', Object.keys(channelGroups).map(key => `${key}: ${channelGroups[key].length}`));

      // 合并所有频道的视频，按发布时间排序
      const officialVideos: LatestVideo[] = [];
      Object.values(channelGroups).forEach(channelVideos => {
        officialVideos.push(...channelVideos);
      });

      officialVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      console.log('fetchOfficialVideos - Final videos to display:', officialVideos.length);
      setVideos(officialVideos);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch official videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficialVideos();
  }, []);

  // 过滤视频
  const filteredVideos = videos.filter(video => {
    // 搜索过滤
    const matchesSearch = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 频道过滤
    const matchesChannel = selectedChannel === 'all' || 
      video.channelTitle === selectedChannel;
    
    return matchesSearch && matchesChannel;
  });

  // 调试：打印所有视频的频道信息
  React.useEffect(() => {
    if (videos.length > 0) {
      console.log('All videos by channel:');
      const channelCounts = videos.reduce((acc, video) => {
        acc[video.channelTitle] = (acc[video.channelTitle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log(channelCounts);
    }
  }, [videos]);

  // 格式化函数
  const formatViews = (viewCount?: number): string => {
    if (!viewCount) return '0';
    if (viewCount >= 1_000_000) return `${(viewCount / 1_000_000).toFixed(1)}M`;
    if (viewCount >= 1_000) return `${(viewCount / 1_000).toFixed(1)}K`;
    return viewCount.toString();
  };

  const formatUploadDate = (publishedAt: string, isLive?: boolean): string => {
    if (isLive) return 'LIVE NOW';
    
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const formatDuration = (isLive?: boolean): string => {
    if (isLive) return 'LIVE';
    // 生成随机时长作为示例
    const minutes = Math.floor(Math.random() * 8) + 2;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Video className="h-8 w-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Video Highlights</h1>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {OFFICIAL_CHANNELS.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchOfficialVideos}
                  className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <BookmarkButton
                  label={t('bookmark.label')}
                  messages={{
                    iosAddToHome: t('bookmark.iosAddToHome'),
                    pressKeysMac: t('bookmark.pressKeysMac'),
                    pressKeysWin: t('bookmark.pressKeysWin'),
                    copied: t('bookmark.copied'),
                  }}
                  className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800 text-sm">
            <strong>Official Channels Only:</strong> Showing latest 1-2 videos from each official channel (WNBA, ESPN, Indiana Fever)
          </div>
          <div className="text-blue-600 text-xs mt-1">
            Total videos: {filteredVideos.length} | Last updated: {lastUpdate.toLocaleTimeString()}

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                thumbnail={video.thumbnailUrl}
                duration={formatDuration(video.live)}
                views={formatViews(video.viewCount)}
                uploadDate={formatUploadDate(video.publishedAt, video.live)}
                channel={video.channelTitle}
                videoId={video.id}
              />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 mb-4">No videos found from official channels</div>
              <button
                onClick={fetchOfficialVideos}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;