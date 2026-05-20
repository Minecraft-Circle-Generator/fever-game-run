import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';

const FastHome = lazy(() => import('./pages/FastHome'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const GameRecap = lazy(() => import('./pages/GameRecap'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AIOverviewPage = lazy(() => import('./pages/AIOverviewPage'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
              <Routes>
                <Route path="/" element={<FastHome />} />
                <Route path="/player/caitlin-clark" element={<PlayerPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/recap/:gameId" element={<GameRecap />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/ai-overview" element={<AIOverviewPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <InstallPrompt />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;