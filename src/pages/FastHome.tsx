import React, { Suspense, lazy, useMemo } from 'react';
import { Star, Video, Flame, Zap, Trophy, Target, RefreshCw } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import LazyImage from '../components/LazyImage';
import PerformanceOptimizer from '../components/PerformanceOptimizer';
import SeoSchema from '../components/SeoSchema';
import { Helmet } from 'react-helmet-async';

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
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-base">
          🏀 TODAY'S GAME
        </button>
        <button className="bg-transparent border-2 border-yellow-300 text-yellow-300 px-6 py-3 rounded-full font-bold text-base">
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
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300">
            🏀 TODAY'S GAME
          </button>
          <button className="bg-transparent border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black text-yellow-300 px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105">
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
      {/* 结构化数据注入（仅供搜索抓取，不改变UI） */}
      <SeoSchema todayGame={todayGame} playerStats={playerStats} lastUpdate={lastUpdate} />
      {/* SEO / AEO 结构化数据 */}
      <Helmet>
        <title>Indiana Fever Game Today: Live WNBA Scores & Updates</title>
        <meta name="description" content="WNBA Fever score today | Real-time Indiana Fever updates: opponent, live score, schedule time." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": `Indiana Fever vs ${((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || 'TBD'}`,
            "startDate": todayGame?.startIso ?? new Date().toISOString(),
            "eventStatus": todayGame?.status === 'live' ? "https://schema.org/EventInProgress" : (todayGame?.status === 'final' ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled"),
            "location": {
              "@type": "Place",
              "name": todayGame?.venue ?? "Gainbridge Fieldhouse",
              "address": { "@type": "PostalAddress", "addressLocality": "Indianapolis", "addressRegion": "IN", "addressCountry": "US" }
            },
            "homeTeam": { "@type": "SportsTeam", "name": "Indiana Fever" },
            "awayTeam": { "@type": "SportsTeam", "name": ((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || "Opponent TBD" },
            "url": "http://fever-game.run/"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is the Indiana Fever score today?",
                "acceptedAnswer": { "@type": "Answer", "text": `Fever score today vs ${((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || 'TBD'}: ${todayGame?.homeScore ?? '-'} - ${todayGame?.awayScore ?? '-'}` } },
              { "@type": "Question", "name": "Who are the top players in today’s Fever game?",
                "acceptedAnswer": { "@type": "Answer", "text": `Top scorers: Caitlin Clark ${playerStats?.points ? '('+playerStats.points+' pts)' : ''}, Assists ${playerStats?.assists ?? '-'}, 3P ${playerStats?.threePointers ?? '-'}` } },
              { "@type": "Question", "name": "What time is the Fever game tonight?",
                "acceptedAnswer": { "@type": "Answer", "text": `${todayGame?.startTime ?? 'Tonight'} (${todayGame?.timezone ?? 'EST'}) — ${todayGame?.venue ?? 'Gainbridge Fieldhouse'}` } }
            ]
          })}
        </script>
      </Helmet>
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
            <button 
              onClick={refreshData}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
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
                Fever Score Today vs {((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || 'TBD'}
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
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-orange-300">
                <div className="flex items-center mb-4">
                  <Zap className={`h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2 ${getAnimationClass('animate-pulse')}`} />
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
                  WNBA Fever Score Tonight — Schedule & Results
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

          {/* 最新视频 */}
          <section id="highlights">
            <div className="flex items-center mb-6">
              <Video className={`h-6 w-6 md:h-8 md:w-8 text-red-500 mr-3 ${getAnimationClass('animate-bounce')}`} />
              <h2 className="text-xl md:text-3xl font-black text-gray-800">
                Highlights — WNBA Fever Score Today
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {videos && videos.length > 0 ? (
                videos.map((video) => (
                  <Suspense key={video.id} fallback={<QuickLoader />}>
                    <OptimizedVideoCard
                      title={video.title}
                      thumbnail={video.thumbnail}
                      duration={video.duration}
                      views={video.views}
                      uploadDate={video.uploadDate}
                      channel={video.channel}
                      videoId={video.videoId}
                      isLive={video.isLive}
                    />
                  </Suspense>
                ))
              ) : (
                <div className="col-span-full">
                  <QuickLoader />
                </div>
              )}
            </div>
          </section>

          {/* FAQ 文本区块（与结构化数据对应，双语） */}
          <section className="mt-8 bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-4">FAQ — Fever Game Today</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-800">
              <div>
                <div className="font-semibold">Q: What is the Indiana Fever score today?</div>
                <div>A: {todayGame?.homeScore ?? '-'} - {todayGame?.awayScore ?? '-'} vs {((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || 'TBD'}.</div>
                <div className="text-xs text-gray-500">问：今天印第安纳狂热队比分是多少？答：{todayGame?.homeScore ?? '-'} - {todayGame?.awayScore ?? '-'}，对手 {((typeof todayGame?.opponent === 'string' && todayGame?.opponent) || (todayGame?.awayTeam?.name)) || '待定'}。</div>
              </div>
              <div>
                <div className="font-semibold">Q: Who are the top players in today’s Fever game?</div>
                <div>A: Caitlin Clark {playerStats?.points ? `(${playerStats.points} pts)` : ''}, Assists {playerStats?.assists ?? '-'}, 3P {playerStats?.threePointers ?? '-'}.</div>
                <div className="text-xs text-gray-500">问：今天的狂热队比赛中谁表现最佳？答：凯特琳·克拉克 {playerStats?.points ? `（${playerStats.points} 分）` : ''}，助攻 {playerStats?.assists ?? '-'}，三分 {playerStats?.threePointers ?? '-' }。</div>
              </div>
              <div>
                <div className="font-semibold">Q: What time is the Fever game tonight?</div>
                <div>A: {todayGame?.startTime ?? 'Tonight'} ({todayGame?.timezone ?? 'EST'}) at {todayGame?.venue ?? 'Gainbridge Fieldhouse'}.</div>
                <div className="text-xs text-gray-500">问：今晚狂热队什么时候比赛？答：{todayGame?.startTime ?? '今晚'}（{todayGame?.timezone ?? '美东时间'}）地点 {todayGame?.venue ?? 'Gainbridge Fieldhouse'}。</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PerformanceOptimizer>
  );
};

export default FastHome;