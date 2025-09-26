import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Video, Calendar, MapPin } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { fetchFeverLatestFinalFromESPN, fetchFeverTodayFromESPN } from '../utils/espnProvider';

const GameRecap = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [latestData, setLatestData] = useState<{
    status: 'FINAL' | 'LIVE' | 'SCHEDULED';
    title: string;
    date: string;
    venue: string;
    away: { name: string; score?: number };
    home: { name: string; score?: number };
  } | null>(null);

  // 简易数据源：可维护的比赛回顾字典；后续可接入真实API
  const games: Record<string, {
    status: 'FINAL' | 'LIVE' | 'SCHEDULED';
    title: string;
    date: string;
    venue: string;
    away: { name: string; score?: number };
    home: { name: string; score?: number };
  }> = {
    'fever-vs-aces-2024': {
      status: 'FINAL',
      title: 'Indiana Fever vs Las Vegas Aces',
      date: 'June 15, 2024',
      venue: 'Michelob Ultra Arena',
      away: { name: 'Las Vegas Aces', score: 82 },
      home: { name: 'Indiana Fever', score: 88 },
    },
    'fever-vs-mercury-2025': {
      status: 'FINAL',
      title: 'Indiana Fever vs Phoenix Mercury',
      date: 'January 14, 2025',
      venue: 'Gainbridge Fieldhouse',
      away: { name: 'Phoenix Mercury', score: 76 },
      home: { name: 'Indiana Fever', score: 89 },
    },
    // 特殊：latest 显示“今天比赛”占位信息（后续接入真实赛程）
    'latest': {
      status: 'SCHEDULED',
      title: 'Indiana Fever — Next Game',
      date: 'Today, 7:00 PM EST',
      venue: 'Gainbridge Fieldhouse',
      away: { name: 'TBD' },
      home: { name: 'Indiana Fever' },
    },
  };

  // 当访问 /recap/latest 时，优先从ESPN拉取最近一场已结束比赛；无则尝试今日比赛；再无则回退到字典
  useEffect(() => {
    const loadLatest = async () => {
      if (gameId !== 'latest') return;
      try {
        const latest = await fetchFeverLatestFinalFromESPN();
        if (latest) {
          const dateStr = new Date(latest.startIso || Date.now()).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          });
          const homeName = latest.isFeverHome ? 'Indiana Fever' : latest.opponent;
          const awayName = latest.isFeverHome ? latest.opponent : 'Indiana Fever';
          setLatestData({
            status: 'FINAL',
            title: `Indiana Fever vs ${latest.opponent}`,
            date: dateStr,
            venue: latest.venue || 'Gainbridge Fieldhouse',
            away: { name: awayName, score: latest.awayScore },
            home: { name: homeName, score: latest.homeScore },
          });
          return;
        }
        const today = await fetchFeverTodayFromESPN();
        if (today) {
          const dateStr = new Date(today.startIso || Date.now()).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          });
          const homeName = today.isFeverHome ? 'Indiana Fever' : today.opponent;
          const awayName = today.isFeverHome ? today.opponent : 'Indiana Fever';
          const statusMap = today.status === 'live' ? 'LIVE' : today.status === 'final' ? 'FINAL' : 'SCHEDULED';
          setLatestData({
            status: statusMap as 'FINAL' | 'LIVE' | 'SCHEDULED',
            title: `Indiana Fever vs ${today.opponent}`,
            date: dateStr,
            venue: today.venue || 'Gainbridge Fieldhouse',
            away: { name: awayName, score: today.awayScore },
            home: { name: homeName, score: today.homeScore },
          });
        }
      } catch {
        // ignore, fallback to dictionary
      }
    };
    loadLatest();
  }, [gameId]);

  const data = latestData ?? games[gameId || 'latest'];

  // 如果传入未知 slug，跳到 latest
  if (!data) {
    return <Navigate to="/recap/latest" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Game Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className={`${data.status === 'FINAL' ? 'bg-green-100 text-green-800' : data.status === 'LIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} px-3 py-1 rounded-full text-sm font-medium`}>
                {data.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {data.title}
            </h1>
            <div className="flex items-center justify-center text-gray-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{data.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{data.venue}</span>
              </div>
            </div>
          </div>
          
          {/* Score */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-gray-800 mb-2">{data.away.name}</div>
                <div className="text-5xl font-bold text-gray-800">{data.away.score ?? '-'}</div>
              </div>
              
              <div className="mx-8 text-gray-400">
                <div className="text-lg font-semibold">{data.status}</div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-gray-800 mb-2">{data.home.name}</div>
                <div className="text-5xl font-bold text-amber-600">{data.home.score ?? '-'}</div>
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
            <h2 className="text-2xl font-bold text-gray-800">Game Summary</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              The Indiana Fever dominated the Phoenix Mercury in a convincing 89-76 victory at Gainbridge Fieldhouse. 
              Caitlin Clark led the way with 22 points, 9 assists, and 6 rebounds, showcasing her exceptional court vision 
              and scoring ability. The Fever's balanced attack and strong defensive performance helped them control the game 
              from start to finish.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Clark's 5 three-pointers were instrumental in the victory, as she consistently found open looks and knocked 
              down crucial shots when the team needed them most. The win extends the Fever's winning streak to three games 
              and improves their record to 15-8 this season.
            </p>
          </div>
        </section>

        {/* Player Stats */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Star className="h-6 w-6 text-amber-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Player Stats</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Indiana Fever Stats */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-amber-500 text-white px-6 py-4">
                <h3 className="text-lg font-semibold">Indiana Fever</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        22
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">Caitlin Clark</div>
                        <div className="text-sm text-gray-600">PG</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">22 PTS</div>
                      <div className="text-sm text-gray-600">9 AST, 6 REB</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        5
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">Aliyah Boston</div>
                        <div className="text-sm text-gray-600">C</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">16 PTS</div>
                      <div className="text-sm text-gray-600">4 AST, 12 REB</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">Kelsey Mitchell</div>
                        <div className="text-sm text-gray-600">SG</div>
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

            {/* Phoenix Mercury Stats */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-500 text-white px-6 py-4">
                <h3 className="text-lg font-semibold">Phoenix Mercury</h3>
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
                        <div className="text-sm text-gray-600">SF</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">19 PTS</div>
                      <div className="text-sm text-gray-600">5 AST, 7 REB</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        12
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">Natasha Mack</div>
                        <div className="text-sm text-gray-600">C</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">15 PTS</div>
                      <div className="text-sm text-gray-600">2 AST, 9 REB</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">Rebecca Allen</div>
                        <div className="text-sm text-gray-600">PF</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">12 PTS</div>
                      <div className="text-sm text-gray-600">1 AST, 4 REB</div>
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
              title="Caitlin Clark's 22-Point Performance vs Phoenix Mercury"
              thumbnail="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400"
              duration="3:45"
              views="15.2K"
              uploadDate="1 day ago"
              channel="WNBA Official"
              videoId="dQw4w9WgXcQ"
            />
            <VideoCard
              title="Best Plays from Fever vs Mercury - Full Highlights"
              thumbnail="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400"
              duration="5:32"
              views="22.8K"
              uploadDate="1 day ago"
              channel="ESPN"
              videoId="jNQXAC9IVRw"
            />
            <VideoCard
              title="Caitlin Clark's 5 Three-Pointers in Victory"
              thumbnail="https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=400"
              duration="2:18"
              views="18.7K"
              uploadDate="1 day ago"
              channel="House of Highlights"
              videoId="M7lc1UVf-VE"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameRecap;