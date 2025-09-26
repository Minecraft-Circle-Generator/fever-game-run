import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, TrendingUp, Video, Calendar, MapPin, Target, Zap } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const CaitlinClarkTripleDoubleVsAces = () => {
  return (
    <>
      <Helmet>
        <title>Caitlin Clark Triple-Double Leads Fever to Victory Over Aces | Fever Game</title>
        <meta name="description" content="Caitlin Clark records historic triple-double with 24 points, 12 assists, 10 rebounds as Indiana Fever defeats Las Vegas Aces 88-82 in thrilling WNBA matchup." />
        <meta name="keywords" content="Caitlin Clark, triple-double, Indiana Fever, Las Vegas Aces, WNBA, basketball highlights, rookie record" />
        <meta property="og:title" content="Caitlin Clark Triple-Double Leads Fever to Victory Over Aces" />
        <meta property="og:description" content="Historic performance as Caitlin Clark becomes youngest player to record triple-double in WNBA playoff race." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fever-game.run/caitlin-clark-triple-double-vs-aces" />
        <link rel="canonical" href="https://fever-game.run/caitlin-clark-triple-double-vs-aces" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Game Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  FINAL
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Caitlin Clark's Historic Triple-Double Powers Fever Past Aces
              </h1>
              <div className="flex items-center justify-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>September 26, 2024</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Gainbridge Fieldhouse, Indianapolis</span>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-8 mb-8 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Las Vegas Aces</div>
                  <div className="text-5xl font-bold text-gray-600">82</div>
                </div>
                
                <div className="mx-8 text-center">
                  <div className="text-lg font-semibold text-amber-600 mb-2">FINAL</div>
                  <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    🏆 FEVER WIN
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Indiana Fever</div>
                  <div className="text-5xl font-bold text-amber-600">88</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Summary */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Historic Performance</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Caitlin Clark made WNBA history</strong> on Thursday night, recording her first career triple-double with 
                24 points, 12 assists, and 10 rebounds to lead the Indiana Fever to a crucial 88-82 victory over the 
                defending champion Las Vegas Aces at Gainbridge Fieldhouse.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                At just 22 years old, Clark became the <strong>youngest player in WNBA history</strong> to achieve a triple-double, 
                surpassing the previous record. Her performance was instrumental in keeping the Fever's playoff hopes alive 
                with just three games remaining in the regular season.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The rookie sensation shot 8-of-15 from the field, including 4-of-8 from three-point range, while also 
                contributing 3 steals and 2 blocks. Her 12 assists tied her career-high, showcasing the court vision 
                that made her a college basketball legend at Iowa.
              </p>
            </div>
          </section>

          {/* Key Stats */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Triple-Double Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-amber-600 mb-2">24</div>
                <div className="text-lg font-semibold text-gray-800">Points</div>
                <div className="text-sm text-gray-600">8/15 FG, 4/8 3PT</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-lg font-semibold text-gray-800">Assists</div>
                <div className="text-sm text-gray-600">Career-high tying</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10</div>
                <div className="text-lg font-semibold text-gray-800">Rebounds</div>
                <div className="text-sm text-gray-600">First career triple-double</div>
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
                  <h3 className="text-lg font-semibold">Indiana Fever</h3>
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
                          <div className="text-sm text-gray-600">Point Guard • Rookie</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-amber-600">Triple-Double</div>
                        <div className="text-sm text-gray-600">24 PTS, 12 AST, 10 REB</div>
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
                        <div className="font-bold text-lg">18 PTS</div>
                        <div className="text-sm text-gray-600">2 AST, 9 REB</div>
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
                        <div className="font-bold text-lg">16 PTS</div>
                        <div className="text-sm text-gray-600">4 AST, 3 REB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Las Vegas Aces Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-black text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">Las Vegas Aces</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                          22
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">A'ja Wilson</div>
                          <div className="text-sm text-gray-600">Forward/Center</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">26 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 11 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          12
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Chelsea Gray</div>
                          <div className="text-sm text-gray-600">Point Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">15 PTS</div>
                        <div className="text-sm text-gray-600">8 AST, 4 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          7
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Kelsey Plum</div>
                          <div className="text-sm text-gray-600">Shooting Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">14 PTS</div>
                        <div className="text-sm text-gray-600">2 AST, 5 REB</div>
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
                title="Caitlin Clark's HISTORIC Triple-Double vs Las Vegas Aces!"
                thumbnail="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="4:32"
                views="89.2K"
                uploadDate="2 hours ago"
                channel="WNBA Official"
                videoId="dQw4w9WgXcQ"
              />
              <VideoCard
                title="Every Assist from Caitlin Clark's 12-Assist Performance"
                thumbnail="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="3:18"
                views="45.7K"
                uploadDate="3 hours ago"
                channel="ESPN"
                videoId="jNQXAC9IVRw"
              />
              <VideoCard
                title="Fever vs Aces: Full Game Highlights & Recap"
                thumbnail="https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="6:45"
                views="67.3K"
                uploadDate="1 hour ago"
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

export default CaitlinClarkTripleDoubleVsAces;