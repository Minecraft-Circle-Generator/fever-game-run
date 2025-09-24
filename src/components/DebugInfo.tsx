import React from 'react';
import { GameData, PlayerStats, VideoData, LiveStatus } from '../hooks/useRealTimeData';

interface DebugInfoProps {
  todayGame: GameData | null;
  yesterdayGame: GameData | null;
  playerStats: PlayerStats | null;
  videos: VideoData[];
  liveStatus: LiveStatus;
  loading: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  todayGame,
  yesterdayGame,
  playerStats,
  videos,
  liveStatus,
  loading
}) => {
  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Debug Info:</h4>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Today Game: {todayGame ? 'Loaded' : 'Null'}</div>
        <div>Yesterday Game: {yesterdayGame ? 'Loaded' : 'Null'}</div>
        <div>Player Stats: {playerStats ? 'Loaded' : 'Null'}</div>
        <div>Videos: {videos.length} items</div>
        <div>Live Status: {liveStatus.isLive ? 'Live' : 'Not Live'}</div>
        {todayGame && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>Status: {todayGame.status}</div>
            <div>Home: {todayGame.homeTeam}</div>
            <div>Away: {todayGame.awayTeam}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;