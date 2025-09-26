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
              <Route path="/recap/:gameId" element={<GameRecap />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/ai-overview-optimization" element={<AIOverviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;