import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
const FastHome = lazy(() => import('./pages/FastHome'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const GameRecap = lazy(() => import('./pages/GameRecap'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AIOverviewPage = lazy(() => import('./pages/AIOverviewPage'));

// 具体的比赛回顾页面
const CaitlinClarkTripleDoubleVsAces = lazy(() => import('./pages/CaitlinClarkTripleDoubleVsAces'));
const CaitlinClarkRookieRecordVsLiberty = lazy(() => import('./pages/CaitlinClarkRookieRecordVsLiberty'));
const CaitlinClark50PointsVsSun = lazy(() => import('./pages/CaitlinClark50PointsVsSun'));
const FeverPlayoffPushVsMercury = lazy(() => import('./pages/FeverPlayoffPushVsMercury'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
            <Routes>
              <Route path="/" element={<FastHome />} />
              <Route path="/player/caitlin-clark" element={<PlayerPage />} />
              <Route path="/videos" element={<VideosPage />} />
              
              {/* 具体的比赛回顾页面 - SEO 友好的 URL */}
              <Route path="/caitlin-clark-triple-double-vs-aces" element={<CaitlinClarkTripleDoubleVsAces />} />
              <Route path="/caitlin-clark-rookie-record-vs-liberty" element={<CaitlinClarkRookieRecordVsLiberty />} />
              <Route path="/caitlin-clark-50-points-vs-sun" element={<CaitlinClark50PointsVsSun />} />
              <Route path="/fever-playoff-push-vs-mercury" element={<FeverPlayoffPushVsMercury />} />
              
              {/* 通用的动态回顾页面 */}
              <Route path="/recap/:gameId" element={<GameRecap />} />
              
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/ai-overview" element={<AIOverviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;