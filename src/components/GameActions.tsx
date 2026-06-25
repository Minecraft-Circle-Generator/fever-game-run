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
    const startDate = new Date(`${game.date} ${game.time}`);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3小时后
    
    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:WNBA: ${game.awayTeam} vs ${game.homeTeam}`,
      `DESCRIPTION:WNBA Game: ${game.awayTeam} vs ${game.homeTeam} at ${game.venue}`,
      `LOCATION:${game.venue}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Fever_Game_vs_${game.homeTeam === 'Fever' ? game.awayTeam : game.homeTeam}.ics`.replace(/\s+/g, '_'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buttonClass = "flex items-center justify-center text-white px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors min-h-[44px] flex-1 min-w-[120px]";

  return (
    <div className="mt-4 space-y-2">
      {/* 主要操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {game.status === 'live' && (
          <>
            <button
              onClick={() => window.open('https://www.fubo.tv/welcome', '_blank')}
              className={`${buttonClass} bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50 animate-pulse`}
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Free (FuboTV)
            </button>
            <button
              onClick={handleViewStats}
              className={`${buttonClass} bg-gray-800 hover:bg-gray-900`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Live Stats
            </button>
          </>
        )}
        
        {game.status === 'upcoming' && (
          <>
            <button
              onClick={() => window.open('https://seatgeek.com/indiana-fever-tickets', '_blank')}
              className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/30 animate-pulse`}
            >
              🔥 Get Tickets ($20 Off)
            </button>
            <button
              onClick={() => window.open('https://www.fubo.tv/welcome', '_blank')}
              className={`${buttonClass} bg-gray-800 hover:bg-gray-900 text-white`}
            >
              📺 Watch on FuboTV
            </button>
          </>
        )}
        
        {game.status === 'finished' && (
          <>
            <button
              onClick={() => window.open('https://amzn.to/4oPJpPw', '_blank')}
              className={`${buttonClass} bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 animate-bounce`}
            >
              🛒 Caitlin Clark Figure
            </button>
            <button
              onClick={handleViewHighlights}
              className={`${buttonClass} bg-gray-800 hover:bg-gray-900 text-white`}
            >
              ⚡ View Recap
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameActions;