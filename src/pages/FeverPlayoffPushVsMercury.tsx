import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, TrendingUp, Video, Calendar, MapPin, Target, Zap } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const FeverPlayoffPushVsMercury = () => {
  return (
    <>
      <Helmet>
        <title>Fever Dominate Mercury in Crucial Playoff Push Victory | Fever Game</title>
        <meta name="description" content="Indiana Fever defeat Phoenix Mercury 89-76 behind Caitlin Clark's 28 points and Aliyah Boston's double-double in crucial playoff race victory." />
        <meta name="keywords" content="Indiana Fever, Phoenix Mercury, playoffs, Caitlin Clark, Aliyah Boston, WNBA, basketball highlights" />
        <meta property="og:title" content="Fever Dominate Mercury in Crucial Playoff Push Victory" />
        <meta property="og:description" content="Balanced attack leads Fever to commanding victory in playoff race." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fever-game.run/fever-playoff-push-vs-mercury" />
        <link rel="canonical" href="https://fever-game.run/fever-playoff-push-vs-mercury" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Game Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 space-x-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  FINAL
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  🏀 PLAYOFF PUSH
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Fever Dominate Mercury in Crucial Playoff Victory
              </h1>
              <div className="flex items-center justify-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>September 20, 2024</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Gainbridge Fieldhouse, Indianapolis</span>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-8 mb-8 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Indiana Fever</div>
                  <div className="text-5xl font-bold text-amber-600">89</div>
                </div>
                
                <div className="mx-8 text-center">
                  <div className="text-lg font-semibold text-blue-600 mb-2">FINAL</div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    🏀 DOMINANT WIN
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Phoenix Mercury</div>
                  <div className="text-5xl font-bold text-gray-600">76</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Summary */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Playoff Push Victory</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                The <strong>Indiana Fever took a commanding step toward the playoffs</strong> with an impressive 89-76 victory 
                over the Phoenix Mercury at Gainbridge Fieldhouse. Led by Caitlin Clark's 28 points and Aliyah Boston's 
                dominant double-double performance, the Fever controlled the game from start to finish.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clark shot an efficient 10-of-18 from the field, including 5-of-9 from three-point range, while also 
                contributing 8 assists and 6 rebounds. Boston was unstoppable in the paint, recording 22 points and 14 rebounds 
                while shooting 9-of-12 from the field. The <strong>balanced attack showcased the Fever's playoff readiness</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                "We're playing our best basketball at the right time," said head coach Christie Sides. "Caitlin and Aliyah 
                are leading by example, and our role players are stepping up when we need them most. This is the type of 
                performance that wins playoff games."
              </p>
            </div>
          </section>

          {/* Team Performance */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Team Statistics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-amber-600 mb-4">Indiana Fever</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Field Goal %</span>
                    <span className="font-semibold text-green-600">52.4% (33/63)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Three-Point %</span>
                    <span className="font-semibold text-blue-600">41.7% (10/24)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Free Throw %</span>
                    <span className="font-semibold text-purple-600">84.6% (11/13)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rebounds</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assists</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Turnovers</span>
                    <span className="font-semibold text-green-600">12</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-orange-600 mb-4">Phoenix Mercury</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Field Goal %</span>
                    <span className="font-semibold text-red-600">43.1% (28/65)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Three-Point %</span>
                    <span className="font-semibold text-red-600">28.6% (6/21)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Free Throw %</span>
                    <span className="font-semibold">78.6% (11/14)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rebounds</span>
                    <span className="font-semibold">35</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assists</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Turnovers</span>
                    <span className="font-semibold text-red-600">18</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Player Stats */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Top Performers</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indiana Fever Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-amber-500 text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">Indiana Fever (89)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                          22
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-lg">Caitlin Clark</div>
                          <div className="text-sm text-amber-600 font-medium">Point Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-amber-600">28 PTS</div>
                        <div className="text-sm text-gray-600">8 AST, 6 REB, 5 3PM</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          5
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-lg">Aliyah Boston</div>
                          <div className="text-sm text-blue-600 font-medium">Center</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-blue-600">22 PTS</div>
                        <div className="text-sm text-gray-600">14 REB, 9/12 FG</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Kelsey Mitchell</div>
                          <div className="text-sm text-gray-600">Shooting Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">15 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 4 REB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phoenix Mercury Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-orange-500 text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">Phoenix Mercury (76)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          5
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Kahleah Copper</div>
                          <div className="text-sm text-gray-600">Small Forward</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">21 PTS</div>
                        <div className="text-sm text-gray-600">4 AST, 6 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          12
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Natasha Mack</div>
                          <div className="text-sm text-gray-600">Center</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">16 PTS</div>
                        <div className="text-sm text-gray-600">2 AST, 8 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Rebecca Allen</div>
                          <div className="text-sm text-gray-600">Power Forward</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">14 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 5 REB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Game Highlights */}
          <section>
            <div className="flex items-center mb-6">
              <Video className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Game Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoCard
                title="Caitlin Clark & Aliyah Boston Dominate Mercury!"
                thumbnail="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="4:45"
                views="67.8K"
                uploadDate="6 hours ago"
                channel="WNBA Official"
                videoId="dQw4w9WgXcQ"
              />
              <VideoCard
                title="Aliyah Boston's 22-Point, 14-Rebound Performance"
                thumbnail="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="3:28"
                views="43.2K"
                uploadDate="7 hours ago"
                channel="ESPN"
                videoId="jNQXAC9IVRw"
              />
              <VideoCard
                title="Fever vs Mercury: Full Game Highlights & Recap"
                thumbnail="https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="5:52"
                views="89.1K"
                uploadDate="5 hours ago"
                channel="Indiana Fever"
                videoId="M7lc1UVf-VE"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FeverPlayoffPushVsMercury;