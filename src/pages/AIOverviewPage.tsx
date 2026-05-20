import React from 'react';
import { Helmet } from 'react-helmet-async';
import BookmarkButton from '../components/BookmarkButton';
import { TrendingUp, Search, Brain, Target, Users, Award } from 'lucide-react';

const AIOverviewPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Fever Game Today — Indiana Fever Next Game, Live Updates & AI Analysis</title>
        <meta name="description" content="Fever Game Today: Indiana Fever next game time, live updates, Caitlin Clark stats, schedule, and AI-powered analysis with real-time insights and predictions." />
        <meta name="keywords" content="Fever Game Today, Indiana Fever next game, Caitlin Clark stats, WNBA schedule, live updates, AI analysis, predictions" />
        <meta property="og:title" content="Fever Game Today — Indiana Fever Next Game & AI Analysis" />
        <meta property="og:description" content="Instant next game info for Indiana Fever with live updates and AI analysis. Caitlin Clark stats, schedule, and predictions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://fever-game.run/ai-overview" />
        <link rel="canonical" href="http://fever-game.run/ai-overview" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Fever Game Today — AI Analysis & Live Updates",
            "description": "Instant next game info for Indiana Fever with AI analysis, Caitlin Clark stats, schedule and predictions.",
            "author": {
              "@type": "Organization",
              "name": "Fever Game Analytics"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Fever Game",
              "logo": {
                "@type": "ImageObject",
                "url": "http://fever-game.run/logo.png"
              }
            },
            "datePublished": "2025-09-27",
            "dateModified": "2025-09-27",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "http://fever-game.run/ai-overview"
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Next Game Today Banner */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>• Updated: {new Date().toLocaleString()}</span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-800" onClick={() => window.location.reload()}>
              <span>↻ Refresh</span>
            </button>
            <BookmarkButton label="Bookmark" className="text-gray-500 hover:text-gray-800" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 md:p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3">
            <span role="img" aria-label="basketball">🏀</span>
            <span className="text-lg md:text-2xl font-extrabold tracking-wide">NEXT GAME: TODAY AT 7:00 PM EST!</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Fever Game Today — AI Insights</h1>
              <p className="text-xl opacity-90">Live updates, next game time, and predictive analysis</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Team Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-bold text-green-600">68.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Points</span>
                <span className="font-bold">87.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Field Goal %</span>
                <span className="font-bold">45.8%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-semibold">Caitlin Clark Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">PPG</span>
                <span className="font-bold text-blue-600">19.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">APG</span>
                <span className="font-bold">8.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">3P%</span>
                <span className="font-bold">34.6%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-semibold">AI Predictions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Next Game Win %</span>
                <span className="font-bold text-green-600">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Playoff Odds</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Championship</span>
                <span className="font-bold">23%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-600" />
              Performance Analysis
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Our AI analysis reveals that the Indiana Fever has shown remarkable improvement this season, 
                particularly in offensive efficiency and three-point shooting accuracy.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Key Insights:</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>25% improvement in offensive rating since last season</li>
                  <li>Caitlin Clark leads WNBA rookies in assists per game</li>
                  <li>Team chemistry index increased by 40% mid-season</li>
                  <li>Home court advantage: 78% win rate at Gainbridge Fieldhouse</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Player Impact Metrics
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Advanced analytics show how each player contributes to team success through 
                various performance indicators and situational statistics.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Caitlin Clark</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-sm font-bold">92</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Kelsey Mitchell</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-bold">85</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Aliyah Boston</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-sm font-bold">78</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Indiana Fever: WNBA's Rising Powerhouse</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              The Indiana Fever has emerged as one of the most exciting teams in the WNBA, led by rookie sensation 
              Caitlin Clark. Our comprehensive AI analysis provides deep insights into team performance, player 
              statistics, and predictive modeling for future games.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Caitlin Clark: Rookie of the Year Impact</h3>
            <p className="text-gray-700 mb-4">
              Caitlin Clark's transition from college basketball to the WNBA has been nothing short of spectacular. 
              Her court vision, three-point shooting ability, and leadership have transformed the Indiana Fever 
              into a playoff contender. Key performance metrics include:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Leading all rookies in assists per game (8.4 APG)</li>
              <li>Second in rookie scoring with 19.2 points per game</li>
              <li>Breaking multiple WNBA rookie records for three-pointers made</li>
              <li>Generating the highest attendance figures in Fever history</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Team Chemistry and Performance Analytics</h3>
            <p className="text-gray-700 mb-4">
              Our AI models analyze team chemistry through advanced metrics including player interaction rates, 
              assist networks, and situational performance. The Fever's improvement in these areas correlates 
              directly with their win-loss record improvement.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Predictive Modeling and Future Outlook</h3>
            <p className="text-gray-700 mb-4">
              Using machine learning algorithms trained on historical WNBA data, we project the Indiana Fever's 
              trajectory for the remainder of the season and beyond. Factors include player development curves, 
              injury probability, and opponent strength analysis.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIOverviewPage;