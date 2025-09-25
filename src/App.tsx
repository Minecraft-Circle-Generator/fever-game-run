import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SEOHead from './components/SEOHead';
const OptimizedHome = lazy(() => import('./pages/OptimizedHome'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const GameRecap = lazy(() => import('./pages/GameRecap'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <SEOHead todayGame={null} playerStats={null} pageType="home" />
        <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
          <Routes>
            <Route path="/" element={<OptimizedHome />} />
            <Route path="/player/caitlin-clark" element={<PlayerPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/recap/:gameId" element={<GameRecap />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;