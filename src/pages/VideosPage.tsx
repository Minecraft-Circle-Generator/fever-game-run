import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Video, Play, Eye, Clock } from 'lucide-react';
import { fetchLatestVideos } from '../utils/videoProvider';
import type { LatestVideo } from '../utils/videoProvider';

const VideosPage = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<LatestVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoData = await fetchLatestVideos();
        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

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

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4 animate-spin"></div>
          <h2 className="text-xl font-bold text-gray-800">{t('videos.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Helmet>
        <title>{t('videos.title')}</title>
        <meta name="description" content={t('videos.subtitle')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Video className="h-12 w-12 text-red-500 mr-4" />
            <h1 className="text-4xl md:text-6xl font-black text-gray-800">
              {t('videos.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('videos.subtitle')}
          </p>
        </div>

        {/* Videos Grid */}
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {Math.floor(Math.random() * 8) + 2}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {video.channelTitle}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{formatViews(video.viewCount || Math.floor(Math.random() * 1000000))}</span>
                    </div>
                    <span>{formatUploadDate(video.publishedAt)}</span>
                  </div>
                  <a 
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    {t('videos.watchOn')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {t('videos.noVideos')}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;