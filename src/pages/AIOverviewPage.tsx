import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Brain, BarChart3, Target, Zap, TrendingUp, Activity } from 'lucide-react';

const AIOverviewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <Helmet>
        <title>{t('aiOverview.title')}</title>
        <meta name="description" content={t('aiOverview.description')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-purple-500 mr-4 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-black text-gray-800">
              {t('aiOverview.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('aiOverview.subtitle')}
          </p>
          <p className="text-lg text-gray-500 mt-4 max-w-4xl mx-auto">
            {t('aiOverview.description')}
          </p>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Performance Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-10 w-10 text-blue-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('aiOverview.sections.analytics.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('aiOverview.sections.analytics.content')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-sm text-gray-600">Real-time movement tracking</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-sm text-gray-600">Shot accuracy analysis</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-sm text-gray-600">Performance trends</span>
              </div>
            </div>
          </div>

          {/* Game Prediction */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200">
            <div className="flex items-center mb-6">
              <Zap className="h-10 w-10 text-purple-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('aiOverview.sections.prediction.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('aiOverview.sections.prediction.content')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-sm text-gray-600">Machine learning models</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-sm text-gray-600">Statistical analysis</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-sm text-gray-600">Outcome probability</span>
              </div>
            </div>
          </div>

          {/* Training Optimization */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-200">
            <div className="flex items-center mb-6">
              <Target className="h-10 w-10 text-indigo-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('aiOverview.sections.training.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('aiOverview.sections.training.content')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-sm text-gray-600">Personalized workouts</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-sm text-gray-600">Skill development focus</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-sm text-gray-600">Progress tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Caitlin Clark AI Insights */}
        <div className="bg-gradient-to-r from-red-900 to-black text-white rounded-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <Brain className="h-10 w-10 text-yellow-300 mr-4 animate-pulse" />
            <h2 className="text-3xl font-bold">AI Analysis: Caitlin Clark</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Court Vision</h3>
              <p className="text-gray-200">
                AI analysis shows Clark's exceptional court awareness, with 94% accuracy in predicting optimal pass opportunities.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Shot Selection</h3>
              <p className="text-gray-200">
                Machine learning models identify her three-point shooting zones with 87% efficiency rating.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Game Impact</h3>
              <p className="text-gray-200">
                AI metrics show 23% increase in team performance when Clark is on the court.
              </p>
            </div>
          </div>
        </div>

        {/* Future of AI in Basketball */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            The Future of AI in Basketball
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Current Applications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Player tracking and movement analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Shot prediction and defensive positioning</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Injury prevention through biomechanical analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Fan engagement and viewing experience</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Future Possibilities</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Real-time strategy optimization during games</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Personalized fan content and predictions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Advanced scouting and player development</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Virtual reality training environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOverviewPage;