import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, TrendingUp, Video, Calendar, MapPin, Award, Zap } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const CaitlinClarkRookieRecordVsLiberty = () => {
  return (
    <>
      <Helmet>
        <title>Caitlin Clark Breaks WNBA Rookie Assist Record vs Liberty | Fever Game</title>
        <meta name="description" content="Caitlin Clark makes history with 337th assist, breaking WNBA rookie record as Indiana Fever defeats New York Liberty 84-80 in playoff-clinching victory." />
        <meta name="keywords" content="Caitlin Clark, rookie record, assists, Indiana Fever, New York Liberty, WNBA playoffs, basketball history" />
        <meta property="og:title" content="Caitlin Clark Breaks WNBA Rookie Assist Record vs Liberty" />
        <meta property="og:description" content="Historic night as Caitlin Clark sets new WNBA rookie assist record while leading Fever to playoff-clinching win." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fever-game.run/caitlin-clark-rookie-record-vs-liberty" />
        <link rel="canonical" href="https://fever-game.run/caitlin-clark-rookie-record-vs-liberty" />
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
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  🏆 PLAYOFFS CLINCHED
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Caitlin Clark Breaks Rookie Record, Fever Clinch Playoffs
              </h1>
              <div className="flex items-center justify-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>September 24, 2024</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Barclays Center, Brooklyn</span>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-lg p-8 mb-8 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Indiana Fever</div>
                  <div className="text-5xl font-bold text-amber-600">84</div>
                </div>
                
                <div className="mx-8 text-center">
                  <div className="text-lg font-semibold text-purple-600 mb-2">FINAL</div>
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    📈 RECORD BROKEN
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">New York Liberty</div>
                  <div className="text-5xl font-bold text-gray-600">80</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Summary */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Record-Breaking Performance</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>History was made in Brooklyn</strong> as Caitlin Clark recorded her 337th assist of the season, 
                breaking the WNBA rookie record previously held by Ticha Penicheiro (336 assists in 1998). The milestone 
                came during the Indiana Fever's crucial 84-80 victory over the New York Liberty, a win that officially 
                clinched their first playoff berth since 2016.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clark finished the night with <strong>19 points and 13 assists</strong>, her 11th double-double of the season. 
                The 22-year-old rookie has now shattered multiple WNBA records in her debut campaign, including most 
                three-pointers by a rookie and most assists by a first-year player.
              </p>
              <p className="text-gray-700 leading-relaxed">
                "Breaking this record means everything to me, but doing it while clinching a playoff spot makes it even 
                more special," Clark said after the game. "This team has worked so hard all season, and we're just 
                getting started."
              </p>
            </div>
          </section>

          {/* Record Breakdown */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Historic Achievement</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-purple-600 mb-2">337</div>
                  <div className="text-lg font-semibold text-gray-800">Total Assists</div>
                  <div className="text-sm text-gray-600">New WNBA Rookie Record</div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Previous Record:</span>
                    <span className="font-semibold">336 (Ticha Penicheiro, 1998)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Games Remaining:</span>
                    <span className="font-semibold text-purple-600">2 games</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-amber-600 mb-2">8.4</div>
                  <div className="text-lg font-semibold text-gray-800">Assists Per Game</div>
                  <div className="text-sm text-gray-600">Season Average</div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">League Rank:</span>
                    <span className="font-semibold">#2 in WNBA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Double-Doubles:</span>
                    <span className="font-semibold text-amber-600">11 this season</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Player Stats */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Game Leaders</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indiana Fever Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-amber-500 text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">Indiana Fever (84)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          22
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-lg">Caitlin Clark</div>
                          <div className="text-sm text-purple-600 font-medium">🏆 RECORD HOLDER</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-purple-600">19 PTS</div>
                        <div className="text-sm text-gray-600">13 AST, 5 REB</div>
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
                        <div className="font-bold text-lg">21 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 4 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          5
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Aliyah Boston</div>
                          <div className="text-sm text-gray-600">Center</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">14 PTS</div>
                        <div className="text-sm text-gray-600">2 AST, 8 REB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* New York Liberty Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">New York Liberty (80)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          20
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Sabrina Ionescu</div>
                          <div className="text-sm text-gray-600">Point Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">22 PTS</div>
                        <div className="text-sm text-gray-600">7 AST, 6 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          32
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Jonquel Jones</div>
                          <div className="text-sm text-gray-600">Forward/Center</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">18 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 10 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Betnijah Laney</div>
                          <div className="text-sm text-gray-600">Guard/Forward</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">15 PTS</div>
                        <div className="text-sm text-gray-600">4 AST, 5 REB</div>
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
              <h2 className="text-2xl font-bold text-gray-800">Record-Breaking Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoCard
                title="Caitlin Clark BREAKS WNBA Rookie Assist Record!"
                thumbnail="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="5:12"
                views="156.8K"
                uploadDate="4 hours ago"
                channel="WNBA Official"
                videoId="dQw4w9WgXcQ"
              />
              <VideoCard
                title="Every Assist from Caitlin Clark's Record-Breaking Night"
                thumbnail="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="4:27"
                views="89.3K"
                uploadDate="5 hours ago"
                channel="ESPN"
                videoId="jNQXAC9IVRw"
              />
              <VideoCard
                title="Fever Clinch Playoffs! Full Game Highlights vs Liberty"
                thumbnail="https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="7:33"
                views="124.7K"
                uploadDate="3 hours ago"
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

export default CaitlinClarkRookieRecordVsLiberty;