import React, { useState } from 'react';
import { Play, Calendar, BarChart3, Video, ExternalLink, Share2, Bell, Download } from 'lucide-react';
import { GameData } from '../hooks/useRealTimeData';

interface GameActionsProps {
  game: GameData;
  onActionClick?: (action: string, gameData: GameData) => void;
  showAdvancedActions?: boolean;
  enableNotifications?: boolean;
}

const GameActions: React.FC<GameActionsProps> = ({ game }) => {
  const handleWatchLive = () => {
    // 根据平台跳转到相应的直播页面
    if (game.platform === 'ESPN') {
      window.open('https://www.espn.com/watch/', '_blank');
    } else {
      window.open('https://www.wnba.com/watch/', '_blank');
    }
  };

  const handleViewStats = () => {
    // 跳转到统计页面
    try {
      const statsSection = document.getElementById('player-stats');
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.warn('Stats section not found');
    }
  };

  const handleViewHighlights = () => {
    // 跳转到视频集锦
    try {
      const highlightsSection = document.getElementById('highlights');
      if (highlightsSection) {
        highlightsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.warn('Highlights section not found');
    }
  };

  const handleAddToCalendar = () => {
    // 生成日历事件
    const startDate = new Date(`${game.date} ${game.time}`);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3小时后
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${game.awayTeam} vs ${game.homeTeam}`)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`WNBA Game: ${game.awayTeam} vs ${game.homeTeam} at ${game.venue}`)}&location=${encodeURIComponent(game.venue)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const buttonClass = "flex items-center justify-center text-white px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors min-h-[44px] flex-1 min-w-[120px]";

  return (
    <div className="mt-4 space-y-2">
      {/* 主要操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {game.status === 'live' && (
          <button
            onClick={handleWatchLive}
            className={`${buttonClass} bg-red-500 hover:bg-red-600`}
          >
            <Play className="h-4 w-4 mr-2" />
            Watch Live
          </button>
        )}
        
        {game.status === 'upcoming' && (
          <button
            onClick={handleAddToCalendar}
            className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </button>
        )}
        
        <button
          onClick={handleViewStats}
          className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Stats
        </button>
      </div>

      {/* 次要操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleViewHighlights}
          className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}
        >
          <Video className="h-4 w-4 mr-2" />
          Highlights
        </button>
        
        {game.platform && (
          <button
            onClick={handleWatchLive}
            className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {game.platform}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameActions;