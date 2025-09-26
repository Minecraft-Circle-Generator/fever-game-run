import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, TrendingUp, Video, Calendar, MapPin, Flame, Target } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const CaitlinClark50PointsVsSun = () => {
  return (
    <>
      <Helmet>
        <title>Caitlin Clark Explodes for 50 Points vs Connecticut Sun | Fever Game</title>
        <meta name="description" content="Caitlin Clark sets new career-high with explosive 50-point performance as Indiana Fever defeats Connecticut Sun 102-95 in overtime thriller." />
        <meta name="keywords" content="Caitlin Clark, 50 points, career high, Indiana Fever, Connecticut Sun, WNBA, basketball highlights, overtime" />
        <meta property="og:title" content="Caitlin Clark Explodes for 50 Points vs Connecticut Sun" />
        <meta property="og:description" content="Career-high 50-point explosion leads Fever to overtime victory in instant classic." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fever-game.run/caitlin-clark-50-points-vs-sun" />
        <link rel="canonical" href="https://fever-game.run/caitlin-clark-50-points-vs-sun" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Game Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 space-x-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  FINAL (OT)
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 CAREER HIGH
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Caitlin Clark's 50-Point Explosion Stuns Connecticut Sun
              </h1>
              <div className="flex items-center justify-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>September 22, 2024</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Mohegan Sun Arena, Connecticut</span>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 mb-8 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Indiana Fever</div>
                  <div className="text-5xl font-bold text-amber-600">102</div>
                </div>
                
                <div className="mx-8 text-center">
                  <div className="text-lg font-semibold text-red-600 mb-2">FINAL (OT)</div>
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    🔥 50 POINTS
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-800 mb-2">Connecticut Sun</div>
                  <div className="text-5xl font-bold text-gray-600">95</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Summary */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Flame className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Career-High Performance</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Caitlin Clark delivered the performance of a lifetime</strong>, exploding for a career-high 50 points 
                to lead the Indiana Fever to a thrilling 102-95 overtime victory over the Connecticut Sun at Mohegan Sun Arena. 
                The rookie sensation shot an incredible 16-of-25 from the field, including 8-of-12 from three-point range.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clark's 50-point outburst is the <strong>highest single-game scoring performance by a rookie in WNBA history</strong>, 
                surpassing the previous record of 48 points. She also became just the fifth player in league history to score 
                50 or more points in a single game, joining an elite group that includes Diana Taurasi and Riquna Williams.
              </p>
              <p className="text-gray-700 leading-relaxed">
                "I've never felt a rhythm like that in my life," Clark said after the game. "Everything was falling, and my 
                teammates kept finding me in great spots. This is a night I'll never forget, but more importantly, we got 
                the win when we needed it most."
              </p>
            </div>
          </section>

          {/* Scoring Breakdown */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">50-Point Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">50</div>
                <div className="text-lg font-semibold text-gray-800">Total Points</div>
                <div className="text-sm text-gray-600">Career High</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">16/25</div>
                <div className="text-lg font-semibold text-gray-800">Field Goals</div>
                <div className="text-sm text-gray-600">64% shooting</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">8/12</div>
                <div className="text-lg font-semibold text-gray-800">Three-Pointers</div>
                <div className="text-sm text-gray-600">67% from deep</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10/11</div>
                <div className="text-lg font-semibold text-gray-800">Free Throws</div>
                <div className="text-sm text-gray-600">91% from line</div>
              </div>
            </div>
          </section>

          {/* Quarter by Quarter */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Scoring by Quarter</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-gray-600">1st Quarter</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">15</div>
                  <div className="text-sm text-gray-600">2nd Quarter</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">8</div>
                  <div className="text-sm text-gray-600">3rd Quarter</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">11</div>
                  <div className="text-sm text-gray-600">4th Quarter</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-600">Overtime</div>
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
                  <h3 className="text-lg font-semibold">Indiana Fever (102)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          22
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-lg">Caitlin Clark</div>
                          <div className="text-sm text-red-600 font-medium">🔥 CAREER HIGH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-red-600">50 PTS</div>
                        <div className="text-sm text-gray-600">7 AST, 6 REB</div>
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
                        <div className="font-bold text-lg">16 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 11 REB</div>
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
                        <div className="font-bold text-lg">12 PTS</div>
                        <div className="text-sm text-gray-600">4 AST, 3 REB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecticut Sun Stats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-orange-600 text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">Connecticut Sun (95)</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          7
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">DeWanna Bonner</div>
                          <div className="text-sm text-gray-600">Forward</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">24 PTS</div>
                        <div className="text-sm text-gray-600">5 AST, 8 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          25
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Alyssa Thomas</div>
                          <div className="text-sm text-gray-600">Forward</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">18 PTS</div>
                        <div className="text-sm text-gray-600">9 AST, 12 REB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          14
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">Ty Harris</div>
                          <div className="text-sm text-gray-600">Guard</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">16 PTS</div>
                        <div className="text-sm text-gray-600">3 AST, 4 REB</div>
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
              <h2 className="text-2xl font-bold text-gray-800">50-Point Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoCard
                title="Caitlin Clark DROPS 50 POINTS! Historic Performance vs Sun"
                thumbnail="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="6:18"
                views="234.5K"
                uploadDate="1 hour ago"
                channel="WNBA Official"
                videoId="dQw4w9WgXcQ"
              />
              <VideoCard
                title="All 8 Three-Pointers from Caitlin Clark's 50-Point Game"
                thumbnail="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="3:42"
                views="178.9K"
                uploadDate="2 hours ago"
                channel="ESPN"
                videoId="jNQXAC9IVRw"
              />
              <VideoCard
                title="Fever vs Sun: Overtime Thriller Full Highlights"
                thumbnail="https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=400"
                duration="8:27"
                views="156.2K"
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

export default CaitlinClark50PointsVsSun;