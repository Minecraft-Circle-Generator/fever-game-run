import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Video, Flame, Star, Brain } from 'lucide-react';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="relative bg-gradient-to-r from-black via-red-900 to-black text-white shadow-2xl sticky top-0 z-50 border-b-4 border-red-600 overflow-hidden">
      {/* Background Player Silhouettes - disable on mobile or reduced motion */}
      {!(isMobile || reducedMotion) && (
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-2 left-1/4 w-6 h-10 bg-gradient-to-b from-red-400 to-transparent transform rotate-12 animate-pulse">
          <div className="w-1 h-1 bg-red-300 rounded-full mx-auto mb-1"></div>
          <div className="w-3 h-5 bg-red-400 mx-auto mb-1"></div>
          <div className="w-2 h-3 bg-red-400 mx-auto"></div>
        </div>
        <div className="absolute top-1 right-1/3 w-8 h-12 bg-gradient-to-b from-orange-400 to-transparent transform -rotate-8 animate-bounce">
          <div className="w-2 h-2 bg-orange-300 rounded-full mx-auto mb-1"></div>
          <div className="w-4 h-6 bg-orange-400 mx-auto mb-1"></div>
          <div className="w-3 h-4 bg-orange-400 mx-auto"></div>
        </div>
        <div className="absolute top-3 right-1/4 w-5 h-8 bg-gradient-to-b from-yellow-400 to-transparent transform rotate-20 animate-pulse">
          <div className="w-1 h-1 bg-yellow-300 rounded-full mx-auto mb-1"></div>
          <div className="w-2 h-4 bg-yellow-400 mx-auto mb-1"></div>
          <div className="w-2 h-2 bg-yellow-400 mx-auto"></div>
        </div>
        
        {/* Action Lines */}
        <div className="absolute top-4 left-1/2 w-16 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-2 right-1/4 w-12 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -rotate-6 animate-bounce"></div>
      </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img src="/logo.svg" alt="Fever Game Today Logo" className="h-8 w-8 md:h-12 md:w-12" />
                <Flame className={`h-4 w-4 md:h-6 md:w-6 text-orange-300 absolute -top-1 -right-1 ${reducedMotion || isMobile ? '' : 'animate-pulse'}`} />
              </div>
              <span className="text-lg md:text-2xl font-black text-white">
                <span className="hidden sm:inline">FEVER GAME TODAY</span>
                <span className="sm:hidden">FEVER</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-black transition-all duration-300 transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-yellow-300 text-red-600 shadow-xl' 
                  : 'hover:bg-white hover:bg-opacity-20 hover:shadow-lg'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>🏠 {t('nav.home').toUpperCase()}</span>
            </Link>
            <Link 
              to="/player/caitlin-clark" 
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-black transition-all duration-300 transform hover:scale-105 ${
                isActive('/player/caitlin-clark') 
                  ? 'bg-yellow-300 text-red-600 shadow-xl' 
                  : 'hover:bg-white hover:bg-opacity-20 hover:shadow-lg'
              }`}
            >
              <Star className="h-5 w-5 animate-pulse" />
              <span>⭐ CLARK</span>
            </Link>
            <Link 
              to="/videos" 
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-black transition-all duration-300 transform hover:scale-105 ${
                isActive('/videos') 
                  ? 'bg-yellow-300 text-red-600 shadow-xl' 
                  : 'hover:bg-white hover:bg-opacity-20 hover:shadow-lg'
              }`}
            >
              <Video className="h-5 w-5" />
              <span>🎬 {t('nav.videos').toUpperCase()}</span>
            </Link>
            <Link 
              to="/ai-overview" 
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-black transition-all duration-300 transform hover:scale-105 ${
                isActive('/ai-overview') 
                  ? 'bg-yellow-300 text-red-600 shadow-xl' 
                  : 'hover:bg-white hover:bg-opacity-20 hover:shadow-lg'
              }`}
            >
              <Brain className="h-5 w-5 animate-pulse" />
              <span>🧠 AI</span>
            </Link>
            <Link 
              to="/privacy" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive('/privacy') 
                  ? 'bg-yellow-300 text-red-600 shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-20 text-gray-300 hover:text-white'
              }`}
            >
              <span>{t('nav.privacy').toUpperCase()}</span>
            </Link>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              to="/player/caitlin-clark" 
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <Star className="h-6 w-6 text-yellow-300" />
            </Link>
            <Link 
              to="/videos" 
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <Video className="h-6 w-6 text-white" />
            </Link>
            <Link 
              to="/ai-overview" 
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <Brain className="h-6 w-6 text-blue-300" />
            </Link>
            
            {/* Mobile Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;