import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Star, Trophy, Target, Zap } from 'lucide-react';

const PlayerPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Helmet>
        <title>{t('player.title')}</title>
        <meta name="description" content={t('player.bio.content')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-900 to-black text-white rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img 
                src="/caitlin-clark-hero.jpg" 
                alt="Caitlin Clark"
                className="w-48 h-48 rounded-full mx-auto border-4 border-yellow-300"
              />
            </div>
            <div className="md:w-2/3 md:pl-8 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-4">
                {t('player.title')}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <span className="bg-yellow-300 text-black px-4 py-2 rounded-full font-bold">
                  {t('player.position')}
                </span>
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                  {t('player.team')}
                </span>
              </div>
              <p className="text-xl text-yellow-100">
                {t('player.bio.content')}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-300">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-red-500 mr-3" />
              <h3 className="text-xl font-bold">{t('player.ppg')}</h3>
            </div>
            <div className="text-4xl font-black text-red-600 mb-2">19.2</div>
            <p className="text-gray-600">2024 Season Average</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-300">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-orange-500 mr-3" />
              <h3 className="text-xl font-bold">{t('player.apg')}</h3>
            </div>
            <div className="text-4xl font-black text-orange-600 mb-2">8.4</div>
            <p className="text-gray-600">League Leading</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-300">
            <div className="flex items-center mb-4">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold">{t('player.rpg')}</h3>
            </div>
            <div className="text-4xl font-black text-yellow-600 mb-2">5.7</div>
            <p className="text-gray-600">Rookie Record</p>
          </div>
        </div>

        {/* Career Highlights */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-black">{t('player.careerHighlights.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-600 mb-2">
                {t('player.careerHighlights.rookieRecord')}
              </h3>
              <p className="text-gray-700">
                Set new WNBA rookie record for assists in a season with 337 assists.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-600 mb-2">
                {t('player.careerHighlights.tripleDouble')}
              </h3>
              <p className="text-gray-700">
                First rookie in WNBA history to record a triple-double.
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-600 mb-2">
                {t('player.careerHighlights.allStar')}
              </h3>
              <p className="text-gray-700">
                Selected for WNBA All-Star Game in rookie season.
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-600 mb-2">
                {t('player.careerHighlights.rotY')}
              </h3>
              <p className="text-gray-700">
                Leading candidate for WNBA Rookie of the Year award.
              </p>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-black mb-6">{t('player.bio.title')}</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {t('player.bio.content')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From her college days at Iowa to her professional debut with the Indiana Fever, 
              Clark has consistently broken records and exceeded expectations. Her ability to 
              see the court and create opportunities for teammates has made her an instant 
              fan favorite and a cornerstone of the Fever's future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;