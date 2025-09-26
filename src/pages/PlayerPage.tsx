import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Target, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PlayerStats from '../components/PlayerStats';
import VideoCard from '../components/VideoCard';
import { fetchLatestVideos, LatestVideo } from '../utils/videoProvider';

const PlayerPage = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<LatestVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = async () => {
    setLoading(true);
    try {
      const latestVideos = await fetchLatestVideos();
      setVideos(latestVideos);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Helmet>
        <title>{t('player.title')}</title>
        <meta name="description" content={t('player.bio.content')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-900 to-black text-white rounded-xl p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 w-px h-full bg-white opacity-30 transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-white opacity-30 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="relative">
                <img 
                  src="/caitlin-clark-hero.jpg" 
                  alt="Caitlin Clark"
                  className="w-48 h-48 rounded-full mx-auto border-4 border-yellow-300 shadow-2xl"
                />
                <div className="absolute -top-2 -right-2 bg-yellow-300 text-black rounded-full p-2">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Star className="h-8 w-8 text-yellow-300 mr-3 animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-black">
                  CAITLIN CLARK
                </h1>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center md:justify-start">
                <span className="bg-yellow-300 text-black px-4 py-2 rounded-full font-bold text-lg">
                  🏀 {t('player.position')}
                </span>
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                  🔥 {t('player.team')}
                </span>
              </div>
              <p className="text-xl text-yellow-100 leading-relaxed">
                {t('player.bio.content')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-500 mr-3 animate-bounce" />
              <h2 className="text-3xl font-black text-gray-800">
                {t('player.stats')} 🔥
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              <button 
                onClick={refreshData}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <PlayerStats />
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-yellow-300">
          <div className="flex items-center mb-6">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-black text-gray-800">
              {t('player.careerHighlights.title')} 🏆
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-xl font-bold text-red-600">
                  {t('player.careerHighlights.rookieRecord')}
                </h3>
              </div>
              <p className="text-gray-700">
                Set new WNBA rookie record for assists in a season with 337 assists, breaking the previous record.
              </p>
              <div className="mt-3 text-2xl font-black text-red-600">337 ASSISTS</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-orange-500 mr-2" />
                <h3 className="text-xl font-bold text-orange-600">
                  {t('player.careerHighlights.tripleDouble')}
                </h3>
              </div>
              <p className="text-gray-700">
                First rookie in WNBA history to record a triple-double with 19 points, 13 assists, and 12 rebounds.
              </p>
              <div className="mt-3 text-2xl font-black text-orange-600">HISTORIC FIRST</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-3">
                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold text-yellow-600">
                  {t('player.careerHighlights.allStar')}
                </h3>
              </div>
              <p className="text-gray-700">
                Selected for WNBA All-Star Game in rookie season, becoming the youngest player ever selected.
              </p>
              <div className="mt-3 text-2xl font-black text-yellow-600">ALL-STAR ⭐</div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-xl font-bold text-red-600">
                  {t('player.careerHighlights.rotY')}
                </h3>
              </div>
              <p className="text-gray-700">
                Leading candidate for WNBA Rookie of the Year award with outstanding performance metrics.
              </p>
              <div className="mt-3 text-2xl font-black text-red-600">ROY FAVORITE 🏆</div>
            </div>
          </div>
        </div>

        {/* Latest Videos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-500 mr-3 animate-spin" />
              <h2 className="text-3xl font-black text-gray-800">
                Latest Highlights 🎬
              </h2>
            </div>
            <button 
              onClick={refreshData}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Videos</span>
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos && videos.length > 0 ? (
                videos.slice(0, 6).map((video) => (
                  <VideoCard
                    key={video.id}
                    title={video.title}
                    thumbnail={video.thumbnailUrl}
                    duration={`${Math.floor(Math.random() * 8) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`}
                    views={`${Math.floor(Math.random() * 500) + 100}K`}
                    uploadDate="2 days ago"
                    channel={video.channelTitle}
                    videoId={video.id}
                    isLive={video.live}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">
                    No videos available
                  </h3>
                  <p className="text-gray-500">
                    Check back later for the latest Caitlin Clark highlights!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Biography */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-black mb-6 text-gray-800">
            {t('player.bio.title')} 📖
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('player.bio.content')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              From her college days at Iowa to her professional debut with the Indiana Fever, 
              Clark has consistently broken records and exceeded expectations. Her ability to 
              see the court and create opportunities for teammates has made her an instant 
              fan favorite and a cornerstone of the Fever's future.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With her exceptional three-point shooting range and court vision reminiscent of 
              NBA legends, Clark has brought unprecedented attention to women's basketball. 
              Her rookie season has been nothing short of spectacular, setting multiple records 
              and earning recognition as one of the most impactful players in WNBA history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;