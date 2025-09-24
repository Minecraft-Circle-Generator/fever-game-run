import React from 'react';
import { Clock, MapPin, Flame } from 'lucide-react';
import GameActions from './GameActions';

interface MobileGameCardProps {
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

const MobileGameCard: React.FC<MobileGameCardProps> = ({
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
  const getStatusInfo = () => {
    switch (status) {
      case 'live':
        return { color: 'bg-red-500', text: '🔴 LIVE', textColor: 'text-white' };
      case 'finished':
        return { color: 'bg-green-500', text: '✅ FINAL', textColor: 'text-white' };
      default:
        return { color: 'bg-blue-500', text: '⏰ UPCOMING', textColor: 'text-white' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 flex justify-between items-center gap-2">
        <span className={`${statusInfo.color} ${statusInfo.textColor} px-2 py-1 rounded text-sm font-bold`}>
          {statusInfo.text}
        </span>
        {platform && (
          <span className="text-[11px] text-gray-700 bg-gray-200 px-2 py-1 rounded whitespace-nowrap">
            📺 {platform}
          </span>
        )}
      </div>

      {/* Teams and Scores */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="text-[13px] font-bold text-gray-800 mb-1 leading-snug">
              {awayTeam.includes('Las Vegas') ? 'Las Vegas Aces' : 
               awayTeam.includes('Indiana') ? 'Indiana Fever' : awayTeam}
            </div>
            <div className="text-xl font-black text-gray-900">
              {typeof awayScore === 'number' ? awayScore : '--'}
            </div>
          </div>

          {/* VS */}
          <div className="mx-2 text-center">
            <div className="text-xs font-bold text-gray-500">VS</div>
            {status === 'live' && (
              <Flame className="h-4 w-4 mx-auto mt-1 text-red-500" />
            )}
          </div>

          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="text-[13px] font-bold text-gray-800 mb-1 leading-snug">
              {homeTeam.includes('Las Vegas') ? 'Las Vegas Aces' : 
               homeTeam.includes('Indiana') ? 'Indiana Fever' : homeTeam}
            </div>
            <div className="text-xl font-black text-gray-900">
              {typeof homeScore === 'number' ? homeScore : '--'}
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="bg-gray-50 rounded-lg p-2 space-y-2">
          <div className="flex items-center text-[12px] text-gray-600">
            <Clock className="h-3 w-3 mr-1" />
            <span className="truncate">{date} at {time}</span>
          </div>
          <div className="flex items-center text-[12px] text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{venue}</span>
          </div>
        </div>

        {/* 游戏操作按钮 */}
        <GameActions game={{
          id: 'mobile-game',
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          date,
          time,
          venue,
          status,
          platform
        }} />
      </div>
    </div>
  );
};

export default MobileGameCard;