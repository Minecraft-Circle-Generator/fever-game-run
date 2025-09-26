import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
      <Helmet>
        <title>{t('notFound.title')}</title>
        <meta name="description" content={t('notFound.message')} />
      </Helmet>

      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="text-9xl font-black text-red-500 mb-4">404</div>
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('notFound.title')}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {t('notFound.message')}
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-flex items-center justify-center w-full bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-300"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('notFound.backHome')}
          </Link>
          
          <Link 
            to="/videos"
            className="inline-flex items-center justify-center w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('nav.videos')}
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Looking for something specific? Try our main pages:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/player/caitlin-clark" className="text-red-600 hover:underline">
              {t('nav.player')}
            </Link>
            <Link to="/ai-overview" className="text-red-600 hover:underline">
              {t('nav.aiOverview')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;