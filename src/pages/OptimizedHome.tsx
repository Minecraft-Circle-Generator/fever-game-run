import React, { Suspense, lazy } from 'react';
import { Star, Video, Flame, Zap, Trophy, Target, RefreshCw } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import DebugInfo from '../components/DebugInfo';
import ErrorBoundary from '../components/ErrorBoundary';
import StructuredData from '../components/StructuredData';
import SEOHead from '../components/SEOHead';
import BookmarkButton from '../components/BookmarkButton';
import { t } from '../utils/i18n';

// 懒加载组件
const GameCard = lazy(() => import('../components/GameCard'));
const MobileGameCard = lazy(() => import('../components/MobileGameCard'));
const OptimizedVideoCard = lazy(() => import('../components/OptimizedVideoCard'));

// 加载占位符组件
const LoadingCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const OptimizedHome = () => {
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

  const forceMobile = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mobile') === '1';
  const isMobile = forceMobile || useIsMobile();
  const reducedMotion = useReducedMotion();

  // 点击跳转并高亮目标区块
  const handleJump = (sectionId: string) => {
    try {
      // 更新 URL hash，便于分享与刷新后定位
      if (typeof window !== 'undefined') {
        window.location.hash = sectionId;
      }
      // 等待懒加载组件渲染后再滚动
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // 临时高亮
          el.classList.add('ring-4', 'ring-yellow-400');
          setTimeout(() => {
            if (el.classList) {
              el.classList.remove('ring-4', 'ring-yellow-400');
            }
          }, 1500);
          // 将焦点移至区块，提升可访问性
          (el as HTMLElement).setAttribute('tabindex', '-1');
          (el as HTMLElement).focus({ preventScroll: true });
        }
      }, 100);
    } catch (error) {
      console.warn(`Section ${sectionId} not found or not ready`);
    }
  };

  // 动画类名优化
  const getAnimationClass = (defaultClass: string, mobileClass: string = '') => {
    if (isMobile || reducedMotion) {
      return mobileClass || '';
    }
    return defaultClass;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4 ${getAnimationClass('animate-spin')}`}></div>
          <h2 className="text-2xl font-bold text-gray-800">🔥 Loading Live Data... 🔥</h2>
          <p className="text-gray-600 mt-2">Getting the latest Fever updates!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO 优化 */}
      <SEOHead todayGame={todayGame} playerStats={playerStats} />
      
      {/* 结构化数据 */}
      <StructuredData todayGame={todayGame} playerStats={playerStats} />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* 优化的Hero Section - 移动端简化 */}
      <div className={`relative ${isMobile ? 'bg-gradient-to-r from-red-900 to-black' : 'bg-gradient-to-r from-black via-red-900 to-black'} text-white overflow-hidden`}>
        {/* 简化的背景效果 - 仅在桌面端显示 */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-20">
            {/* 简化的背景元素 */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 w-px h-full bg-white opacity-30 transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-white opacity-30 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Flame className={`h-6 w-6 md:h-12 md:w-12 text-yellow-300 mr-2 md:mr-4 ${getAnimationClass('animate-pulse', 'mobile-pulse')}`} />
              <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white">
                FEVER GAME TODAY
              </h1>
              <Flame className={`h-6 w-6 md:h-12 md:w-12 text-yellow-300 ml-2 md:ml-4 ${getAnimationClass('animate-pulse', 'mobile-pulse')}`} />
            </div>
            <p className="text-base md:text-2xl text-yellow-100 mb-6 md:mb-8 font-bold">
              🔥 CAITLIN CLARK IS ON FIRE! 🔥
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center px-4">
              <button 
                onClick={() => handleJump('todays-game')}
                className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-xl shadow-lg transition-all duration-300 border-2 border-yellow-300 ${getAnimationClass('transform hover:scale-105')}`}
              >
                🏀 TODAY'S GAME
              </button>
              <button 
                onClick={() => {
                  try {
                    const videosSection = document.getElementById('highlights');
                    if (videosSection) {
                      videosSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  } catch (error) {
                    console.warn('Highlights section not found');
                  }
                }}
                className={`bg-transparent border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black text-yellow-300 px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-xl transition-all duration-300 ${getAnimationClass('transform hover:scale-105')}`}
              >
                ⚡ HIGHLIGHTS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Real-time Update Info - Mobile Optimized */}
        <div className="mb-4 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center text-gray-600">
            <div className={`w-2 h-2 bg-green-500 rounded-full mr-2 ${getAnimationClass('animate-pulse', 'mobile-pulse')}`}></div>
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

        {/* Live Status Banner - Mobile Optimized */}
        <div className="mb-6">
          <div className={`${liveStatus.isLive ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white p-3 md:p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 md:space-x-4">
                {liveStatus.isLive && <div className={`w-3 h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full ${getAnimationClass('animate-ping', 'mobile-pulse')}`}></div>}
                <span className="text-base md:text-2xl font-bold text-center">{liveStatus.message}</span>
                {liveStatus.isLive && <div className={`w-3 h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full ${getAnimationClass('animate-ping', 'mobile-pulse')}`}></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Game Status */}
        <section id="todays-game" className="mb-8">
          <div className="flex items-center mb-6">
            <Trophy className={`h-6 w-6 md:h-8 md:w-8 text-orange-500 mr-3 ${getAnimationClass('animate-bounce')}`} />
            <h2 className="text-xl md:text-3xl font-black text-gray-800">
              TODAY'S BATTLE! 🔥
            </h2>
          </div>
          
          {/* Mobile-first layout */}
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Game Card - Responsive */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard />}>
                {todayGame ? (
                  isMobile ? (
                    <MobileGameCard
                      homeTeam={todayGame.homeTeam}
                      awayTeam={todayGame.awayTeam}
                      homeScore={todayGame.homeScore}
                      awayScore={todayGame.awayScore}
                      date={todayGame.date}
                      time={todayGame.time}
                      venue={todayGame.venue}
                      status={todayGame.status}
                      platform={todayGame.platform}
                    />
                  ) : (
                    <GameCard
                      homeTeam={todayGame.homeTeam}
                      awayTeam={todayGame.awayTeam}
                      homeScore={todayGame.homeScore}
                      awayScore={todayGame.awayScore}
                      date={todayGame.date}
                      time={todayGame.time}
                      venue={todayGame.venue}
                      status={todayGame.status}
                      platform={todayGame.platform}
                    />
                  )
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-4 text-center mobile-card">
                    <div className="text-gray-500 mobile-text">Loading game data...</div>
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
            
            {/* Game Preview Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-orange-300">
              <div className="flex items-center mb-4">
                <Zap className={`h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2 ${getAnimationClass('animate-pulse', 'mobile-pulse')}`} />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {todayGame?.status === 'live' ? 'LIVE GAME! 🔴' : 'GAME PREVIEW 🚀'}
                </h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                {todayGame?.status === 'live' 
                  ? '🔴 LIVE ACTION! Caitlin Clark is dominating the court right now!' 
                  : '🔥 Get ready for an epic showdown! The Indiana Fever are about to unleash Caitlin Clark!'
                }
              </p>
              <div className="flex items-center text-sm md:text-base font-semibold text-red-600 bg-red-50 rounded-lg p-3">
                <Target className={`h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-500 ${getAnimationClass('animate-spin')}`} />
                <span>🎯 KEY BATTLE: CLARK vs PLUM!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Caitlin Clark Stats */}
        {playerStats ? (
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
        ) : (
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-gray-500">Loading player stats...</div>
            </div>
          </section>
        )}

        {/* Yesterday's Game */}
        {yesterdayGame && (
          <section className="mb-8">
            <div className="flex items-center mb-6">
              <Flame className={`h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3 ${getAnimationClass('animate-pulse')}`} />
              <h2 className="text-xl md:text-3xl font-black text-gray-800">
                YESTERDAY'S GAME! 💥
              </h2>
            </div>
            {isMobile ? (
              <MobileGameCard
                homeTeam={yesterdayGame.homeTeam}
                awayTeam={yesterdayGame.awayTeam}
                homeScore={yesterdayGame.homeScore}
                awayScore={yesterdayGame.awayScore}
                date={yesterdayGame.date}
                time={yesterdayGame.time}
                venue={yesterdayGame.venue}
                status={yesterdayGame.status}
              />
            ) : (
              <GameCard
                homeTeam={yesterdayGame.homeTeam}
                awayTeam={yesterdayGame.awayTeam}
                homeScore={yesterdayGame.homeScore}
                awayScore={yesterdayGame.awayScore}
                date={yesterdayGame.date}
                time={yesterdayGame.time}
                venue={yesterdayGame.venue}
                status={yesterdayGame.status}
              />
            )}
          </section>
        )}

        {/* Latest Videos */}
        <section id="highlights">
          <div className="flex items-center mb-6">
            <Video className={`h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3 ${getAnimationClass('animate-bounce')}`} />
            <h2 className="text-xl md:text-3xl font-black text-gray-800">
              HIGHLIGHTS! 🎬
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {videos && videos.length > 0 ? (
              videos.map((video) => (
                <ErrorBoundary key={video.id}>
                  <Suspense fallback={<LoadingCard />}>
                    <OptimizedVideoCard
                      title={video.title}
                      thumbnail={video.thumbnail}
                      duration={video.duration}
                      views={video.views}
                      uploadDate={video.uploadDate}
                      channel={video.channel}
                      videoId={video.videoId}
                      isLive={video.isLive}
                      publishedAtISO={video.publishedAtISO}
                      viewsNumeric={video.viewsNumeric}
                    />
                  </Suspense>
                </ErrorBoundary>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow-md p-4 text-center mobile-card">
                <div className="text-gray-500 mobile-text">Loading videos...</div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Debug Info Component */}
      <DebugInfo
        todayGame={todayGame}
        yesterdayGame={yesterdayGame}
        playerStats={playerStats}
        videos={videos}
        liveStatus={liveStatus}
        loading={loading}
      />
      </div>
    </>
  );
};

export default OptimizedHome;