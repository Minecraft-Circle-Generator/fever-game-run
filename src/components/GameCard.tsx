import React from 'react';
import { Clock, MapPin, Flame, Zap } from 'lucide-react';

interface GameCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  platform?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  venue,
  status,
  platform
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'finished': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live': return '🔴 LIVE NOW!';
      case 'finished': return '✅ FINAL';
      default: return '⏰ UPCOMING';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-orange-300 overflow-hidden">
      {/* Status Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-red-100">
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {platform && (
          <span className="text-sm font-semibold text-orange-600 bg-white px-2 py-1 rounded">
            📺 {platform}
          </span>
        )}
      </div>
      
      {/* Teams and Scores */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="font-bold text-lg text-gray-900 mb-1">
              {awayTeam.replace('Las Vegas ', '').replace('Indiana ', '')}
            </div>
            {typeof awayScore === 'number' ? (
              <div className="text-3xl font-black text-red-600 bg-red-50 rounded-lg px-2 py-1">
                {awayScore}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">--</div>
            )}
          </div>
          
          <div className="mx-4 text-center">
            <div className="text-lg font-black text-gray-600">VS</div>
            {status === 'live' && (
              <Flame className="h-5 w-5 mx-auto mt-1 text-red-500" />
            )}
          </div>
          
          <div className="text-center flex-1">
            <div className="font-bold text-lg text-gray-900 mb-1">
              {homeTeam.replace('Las Vegas ', '').replace('Indiana ', '')}
            </div>
            {typeof homeScore === 'number' ? (
              <div className="text-3xl font-black text-red-600 bg-red-50 rounded-lg px-2 py-1">
                {homeScore}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">--</div>
            )}
          </div>
        </div>
        
        {/* Game Info */}
        <div className="space-y-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-orange-500" />
            <span>{venue}</span>
          </div>
        </div>
        
        {status === 'finished' && (
          <button 
            onClick={() => {
              const highlightsSection = document.getElementById('highlights');
              highlightsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center hover:from-red-600 hover:to-orange-600 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            VIEW RECAP
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCard;