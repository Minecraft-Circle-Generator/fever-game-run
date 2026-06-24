import React, { Suspense, lazy, useMemo, useEffect, useState } from 'react';
import { Star, Video, Flame, Zap, Trophy, Target, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import LazyImage from '../components/LazyImage';
import PerformanceOptimizer from '../components/PerformanceOptimizer';
import BookmarkButton from '../components/BookmarkButton';
import { t } from '../utils/i18n';
import { fetchLatestVideos } from '../utils/videoProvider';
import AdSenseSlot from '../components/AdSenseSlot';
import SubscribeWidget from '../components/SubscribeWidget';
import NextGameCountdown from '../components/NextGameCountdown';

// 懒加载组件 - 进一步优化
const GameCard = lazy(() => import('../components/GameCard'));
const MobileGameCard = lazy(() => import('../components/MobileGameCard'));
const OptimizedVideoCard = lazy(() => import('../components/OptimizedVideoCard'));

// 轻量级加载占位符
const QuickLoader = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// 移动端优化的 Hero 组件
const MobileHero = React.memo(() => (
  <div className="bg-gradient-to-r from-red-900 to-black text-white py-8">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center mb-4">
        <Flame className="h-6 w-6 text-yellow-300 mr-2" />
        <h1 className="text-2xl font-black text-white">FEVER GAME TODAY</h1>
        <Flame className="h-6 w-6 text-yellow-300 ml-2" />
      </div>
      <p className="text-base text-yellow-100 mb-6 font-bold">
        🔥 CAITLIN CLARK IS ON FIRE! 🔥
      </p>
      <div className="flex flex-col gap-3 px-4">
        <button onClick={() => document.getElementById('todays-game')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-base">
          🏀 TODAY'S GAME
        </button>
        <button onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent border-2 border-yellow-300 text-yellow-300 px-6 py-3 rounded-full font-bold text-base">
          ⚡ HIGHLIGHTS
        </button>
      </div>
    </div>
  </div>
));

// 桌面端 Hero 组件
const DesktopHero = React.memo(() => (
  <div className="relative bg-gradient-to-r from-black via-red-900 to-black text-white overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-px h-full bg-white opacity-30 transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white opacity-30 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Flame className="h-12 w-12 text-yellow-300 mr-4 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-black text-white">
            FEVER GAME TODAY
          </h1>
          <Flame className="h-12 w-12 text-yellow-300 ml-4 animate-pulse" />
        </div>
        <p className="text-2xl text-yellow-100 mb-8 font-bold">
          🔥 CAITLIN CLARK IS ON FIRE! 🔥
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => document.getElementById('todays-game')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300">
            🏀 TODAY'S GAME
          </button>
          <button onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black text-yellow-300 px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105">
            ⚡ HIGHLIGHTS
          </button>
        </div>
      </div>
    </div>
  </div>
));

const FastHome = () => {
  const { 
    todayGame, 
    yesterdayGame, 
    playerStats, 
    videos, 
    liveStatus, 
    loading, 
    lastUpdate, 
    refreshData 
  } = useRealTimeData();

  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  // 优化的动画类名
  const getAnimationClass = useMemo(() => (defaultClass: string, mobileClass: string = '') => {
    if (isMobile || reducedMotion) {
      return mobileClass || '';
    }
    return defaultClass;
  }, [isMobile, reducedMotion]);

  const [latestVideos, setLatestVideos] = useState<any[]>(videos || []);
  useEffect(() => {
    let mounted = true;
    fetchLatestVideos()
      .then(list => {
        if (!mounted) return;
        const enriched = (list || []).map(v => ({ ...v, channel: (v as any).channel ?? (v as any).channelTitle }));
        setLatestVideos(enriched.slice(0, 8));
      })
      .catch(() => {
        if (!mounted) return;
        setLatestVideos(videos || []);
      });
    return () => { mounted = false; };
  }, []);

  // Bookmark toast logic
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const hasSeenToast = localStorage.getItem('hasSeenBookmarkToast');
          if (!hasSeenToast) {
            setShowBookmarkToast(true);
            localStorage.setItem('hasSeenBookmarkToast', 'true');
            setTimeout(() => setShowBookmarkToast(false), 5000);
          }
        }
      },
      { threshold: 0.1 }
    );
    const highlightsEl = document.getElementById('highlights');
    if (highlightsEl) observer.observe(highlightsEl);
    return () => observer.disconnect();
  }, []);

  // 快速加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4 animate-spin"></div>
          <h2 className="text-xl font-bold text-gray-800">🔥 Loading... 🔥</h2>
        </div>
      </div>
    );
  }

  return (
    <PerformanceOptimizer>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        {/* 响应式 Hero Section */}
        {isMobile ? <MobileHero /> : <DesktopHero />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          {/* 简化的更新信息 */}
          <div className="mb-4 flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center text-gray-600">
              <div className={`w-2 h-2 bg-green-500 rounded-full mr-2 ${getAnimationClass('animate-pulse')}`}></div>
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshData}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <BookmarkButton
                label={t('bookmark.label')}
                messages={{
                  iosAddToHome: t('bookmark.iosAddToHome'),
                  pressKeysMac: t('bookmark.pressKeysMac'),
                  pressKeysWin: t('bookmark.pressKeysWin'),
                  copied: t('bookmark.copied'),
                }}
                className="text-gray-600 hover:text-gray-800 p-2"
              />
            </div>
          </div>

          {/* 实时状态横幅 */}
          <div className="mb-6">
            <div className={`${liveStatus.isLive ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white p-3 md:p-6 rounded-xl shadow-lg`}>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 md:space-x-4">
                  {liveStatus.isLive && <div className={`w-3 h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full ${getAnimationClass('animate-ping')}`}></div>}
                  <span className="text-base md:text-2xl font-bold text-center">{liveStatus.message}</span>
                  {liveStatus.isLive && <div className={`w-3 h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full ${getAnimationClass('animate-ping')}`}></div>}
                </div>
              </div>
            </div>
          </div>

          {/* 今日比赛状态 */}
          <section id="todays-game" className="mb-8">
            <div className="flex items-center mb-6">
              <Trophy className={`h-6 w-6 md:h-8 md:w-8 text-orange-500 mr-3 ${getAnimationClass('animate-bounce')}`} />
              <h2 className="text-xl md:text-3xl font-black text-gray-800">
                TODAY'S BATTLE! 🔥
              </h2>
            </div>
            
            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
              {/* 比赛卡片 */}
              <Suspense fallback={<QuickLoader />}>
                {todayGame ? (
                  isMobile ? (
                    <MobileGameCard {...todayGame} />
                  ) : (
                    <GameCard {...todayGame} />
                  )
                ) : (
                  <QuickLoader />
                )}
              </Suspense>
              
              {/* 比赛预览卡片 */}
              <Link 
                to={todayGame ? `/recap/${todayGame.id}` : '/schedule'}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-orange-300 text-left w-full cursor-pointer hover:bg-orange-50 hover:scale-[1.02] hover:shadow-xl transition-all block"
              >
                <div className="flex items-center mb-4">
                  <Zap className={`h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2 ${getAnimationClass('animate-pulse')}`} />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {todayGame?.status === 'live' ? 'LIVE GAME! 🔴' : 'GAME PREVIEW 🚀'}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                  {todayGame?.status === 'live' 
                    ? '🔴 LIVE ACTION! Track stats, highlights and play-by-play right here!' 
                    : '🔥 Get ready for an epic showdown! Click to view full game preview, stats & details!'
                  }
                </p>
                <div className="flex items-center text-sm md:text-base font-semibold text-red-600 bg-red-50 rounded-lg p-3 hover:bg-red-100 transition-colors">
                  <Target className={`h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-500 ${getAnimationClass('animate-spin')}`} />
                  <span>🎯 CLICK FOR FULL COVERAGE & STATS!</span>
                </div>
              </Link>
            </div>
          </section>

          <AdSenseSlot slotId="home-middle" />

          {/* Countdown Widget */}
          <div className="w-full my-8">
            <NextGameCountdown />
          </div>

          {/* Caitlin Clark 统计 */}
          {playerStats && (
            <section id="player-stats" className="mb-8">
              <div className="flex items-center mb-6">
                <Star className={`h-6 w-6 md:h-8 md:w-8 text-yellow-500 mr-3 ${getAnimationClass('animate-spin')}`} />
                <h2 className="text-xl md:text-3xl font-black text-gray-800">
                  CLARK STATS! ⚡
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-yellow-400">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl md:text-4xl font-black text-red-600 mb-2 bg-red-50 rounded-lg px-2 py-3">
                      {playerStats.points}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-gray-900">🔥 POINTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-4xl font-black text-orange-600 mb-2 bg-orange-50 rounded-lg px-2 py-3">
                      {playerStats.assists}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-gray-900">🎯 ASSISTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-4xl font-black text-yellow-600 mb-2 bg-yellow-50 rounded-lg px-2 py-3">
                      {playerStats.threePointers}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-gray-900">🚀 3-POINTERS</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  {todayGame?.status === 'live' ? '🔴 Live Stats!' : 'Last Game Performance'}
                </div>
              </div>
            </section>
          )}

          {/* 昨日比赛 */}
          {yesterdayGame && (
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <Flame className={`h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3 ${getAnimationClass('animate-pulse')}`} />
                <h2 className="text-xl md:text-3xl font-black text-gray-800">
                  YESTERDAY'S GAME! 💥
                </h2>
              </div>
              <Suspense fallback={<QuickLoader />}>
                {isMobile ? (
                  <MobileGameCard {...yesterdayGame} />
                ) : (
                  <GameCard {...yesterdayGame} />
                )}
              </Suspense>
            </section>
          )}

          <SubscribeWidget />

          {/* 最新视频 */}
          <section id="highlights">
            <div className="flex items-center mb-6">
              <Video className={`h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3 ${getAnimationClass('animate-bounce')}`} />
              <h2 className="text-xl md:text-3xl font-black text-gray-800">
                HIGHLIGHTS! 🎬
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {latestVideos && latestVideos.length > 0 ? (
                latestVideos.slice(0, 8).map((video) => {
                  // 统一字段命名，兼容现有类型
                  const viewsNumeric = (video as any).viewsNumeric ?? (video as any).views ?? 0;
                  const publishedAtISO = (video as any).publishedAtISO ?? (video as any).publishedAt;
                  const isLive = (video as any).isLive ?? (video as any).live ?? false;
                  const thumbnail = (video as any).thumbnail ?? (video as any).thumbnailUrl;

                  const formatViews = (v?: number): string => {
                    const viewCount = v ?? 0;
                    if (viewCount >= 1_000_000) return `${(viewCount / 1_000_000).toFixed(1)}M`;
                    if (viewCount >= 1_000) return `${(viewCount / 1_000).toFixed(1)}K`;
                    return viewCount.toString();
                  };

                  const formatUploadDate = (iso?: string, live?: boolean): string => {
                    if (live) return 'LIVE NOW';
                    if (!iso) return '';
                    const publishedDate = new Date(iso);
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

                  const formatDuration = (live?: boolean): string => {
                    if (live) return 'LIVE';
                    const minutes = Math.floor(Math.random() * 8) + 2;
                    const seconds = Math.floor(Math.random() * 60);
                    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  };

                  return (
                    <Suspense key={(video as any).id} fallback={<QuickLoader />}>
                      <OptimizedVideoCard
                        title={(video as any).title}
                        thumbnail={thumbnail}
                        duration={formatDuration(isLive)}
                        views={formatViews(viewsNumeric)}
                        uploadDate={formatUploadDate(publishedAtISO, isLive)}
                        channel={(video as any).channel}
                        videoId={(video as any).videoId ?? (video as any).id}
                        isLive={isLive}
                      />
                    </Suspense>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <QuickLoader />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Floating Bookmark Toast */}
        {showBookmarkToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
            <span className="text-xl">⭐</span>
            <div>
              <p className="font-bold text-sm">Enjoying the content?</p>
              <p className="text-xs text-gray-300">Press <strong className="text-yellow-400">Ctrl+D</strong> (or ⌘+D) to bookmark us!</p>
            </div>
            <button onClick={() => setShowBookmarkToast(false)} className="ml-4 text-gray-400 hover:text-white">✕</button>
          </div>
        )}
      </div>
    </PerformanceOptimizer>
  );
};

export default FastHome;