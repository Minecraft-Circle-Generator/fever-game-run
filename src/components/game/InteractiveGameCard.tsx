import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Flame, Zap, Calendar, Play, ExternalLink, TrendingUp, List, Ticket, ShoppingCart } from 'lucide-react';
import { GameData } from '../../hooks/useRealTimeData';

interface InteractiveGameCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'finished';
  platform?: string;
  onWatchLive?: () => void;
  onAddToCalendar?: () => void;
  onViewRecap?: () => void;
  showTooltip?: boolean;
  enableInteractions?: boolean;
  isHighlighted?: boolean;
}

const InteractiveGameCard: React.FC<InteractiveGameCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  venue,
  status,
  platform,
  onWatchLive,
  onAddToCalendar,
  onViewRecap,
  showTooltip = true,
  enableInteractions = true,
  isHighlighted = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 处理卡片点击高亮效果
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // 添加高亮动画
      setIsClicked(true);
      const timer = setTimeout(() => setIsClicked(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

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

  const handleWatchLive = () => {
    if (onWatchLive) {
      onWatchLive();
    } else {
      // 默认行为：根据平台跳转
      if (platform === 'ESPN') {
        window.open('https://www.espn.com/watch/', '_blank');
      } else {
        window.open('https://www.wnba.com/watch/', '_blank');
      }
    }
  };

  const handleAddToCalendar = () => {
    if (onAddToCalendar) {
      onAddToCalendar();
    } else {
      const startDate = new Date(`${date} ${time}`);
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
      
      const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:WNBA: ${awayTeam} vs ${homeTeam}`,
        `DESCRIPTION:WNBA Game: ${awayTeam} vs ${homeTeam} at ${venue}`,
        `LOCATION:${venue}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Fever_Game_vs_${homeTeam === 'Fever' ? awayTeam : homeTeam}.ics`.replace(/\s+/g, '_'));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewRecap = () => {
    if (onViewRecap) {
      onViewRecap();
    } else {
      // 默认行为：滚动到highlights部分
      const highlightsSection = document.getElementById('highlights');
      highlightsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTeamClick = (teamName: string) => {
    if (!enableInteractions) return;
    
    // 显示团队统计信息（可以扩展为模态框或工具提示）
    console.log(`显示 ${teamName} 的统计信息`);
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('teamClicked', {
      detail: { teamName, gameData: { homeTeam, awayTeam, status, venue } }
    }));
  };

  return (
    <div 
      ref={cardRef}
      className={`
        bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 transform
        ${isClicked ? 'border-yellow-400 shadow-2xl scale-105 ring-4 ring-yellow-200' : 'border-orange-300'}
        ${isHovered && enableInteractions ? 'shadow-xl scale-102' : ''}
        ${enableInteractions ? 'cursor-pointer hover:shadow-xl' : ''}
      `}
      onMouseEnter={() => enableInteractions && setIsHovered(true)}
      onMouseLeave={() => {
        if (enableInteractions) {
          setIsHovered(false);
          setShowActions(false);
        }
      }}
      onClick={() => enableInteractions && setShowActions(!showActions)}
      role="button"
      tabIndex={enableInteractions ? 0 : -1}
      aria-label={`${awayTeam} vs ${homeTeam} game card`}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-red-100">
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor()} animate-pulse`}>
          {getStatusText()}
        </span>
        {platform && (
          <span className="text-sm font-semibold text-orange-600 bg-white px-2 py-1 rounded flex items-center">
            📺 {platform}
            {status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full ml-2 animate-ping"></div>}
          </span>
        )}
      </div>
      
      {/* Teams and Scores */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Away Team */}
          <div 
            className={`text-center flex-1 ${enableInteractions ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTeamClick(awayTeam);
            }}
          >
            <div className="font-bold text-lg text-gray-900 mb-1 flex items-center justify-center">
              {awayTeam.replace('Las Vegas ', '').replace('Indiana ', '')}
              {enableInteractions && <TrendingUp className="h-4 w-4 ml-1 opacity-50" />}
            </div>
            {typeof awayScore === 'number' ? (
              <div className="text-3xl font-black text-red-600 bg-red-50 rounded-lg px-2 py-1 transition-all duration-300 hover:bg-red-100">
                {awayScore}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">--</div>
            )}
          </div>
          
          {/* VS Section */}
          <div className="mx-4 text-center">
            <div className="text-lg font-black text-gray-600">VS</div>
            {status === 'live' && (
              <Flame className="h-5 w-5 mx-auto mt-1 text-red-500 animate-bounce" />
            )}
          </div>
          
          {/* Home Team */}
          <div 
            className={`text-center flex-1 ${enableInteractions ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTeamClick(homeTeam);
            }}
          >
            <div className="font-bold text-lg text-gray-900 mb-1 flex items-center justify-center">
              {homeTeam.replace('Las Vegas ', '').replace('Indiana ', '')}
              {enableInteractions && <TrendingUp className="h-4 w-4 ml-1 opacity-50" />}
            </div>
            {typeof homeScore === 'number' ? (
              <div className="text-3xl font-black text-red-600 bg-red-50 rounded-lg px-2 py-1 transition-all duration-300 hover:bg-red-100">
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
        
        {/* Interactive Actions */}
        {enableInteractions && (showActions || isHovered) && (
          <div className="mt-4 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {status === 'live' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.fubo.tv/welcome?irad=356362&irmp=YOUR_AFFILIATE_ID', '_blank');
                    }}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg animate-pulse"
                    aria-label="Watch free on FuboTV"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Free (FuboTV)
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchLive();
                    }}
                    className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    aria-label="Live Stats"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Live Stats
                  </button>
                </>
              )}
              
              {status === 'upcoming' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://seatgeek.com/indiana-fever-tickets', '_blank');
                    }}
                    className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-orange-500/30"
                    aria-label="Get Tickets"
                  >
                    <Ticket className="h-4 w-4 mr-1" />
                    🔥 Get Tickets ($20 Off)
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.fubo.tv/welcome?irad=356362&irmp=YOUR_AFFILIATE_ID', '_blank');
                    }}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-500/30"
                    aria-label="Watch on FuboTV"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    📺 Watch on FuboTV
                  </button>
                </>
              )}
              
              {status === 'finished' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRecap();
                    }}
                    className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    aria-label="View game recap"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    View Recap
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://amzn.to/4oPJpPw', '_blank');
                    }}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/30 animate-bounce"
                    aria-label="Buy Fever Gear"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    🛒 Caitlin Clark Figure
                  </button>
                </>
              )}
              
              {status !== 'finished' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.amazon.com/gp/video/offers?tag=fevergame01-20', '_blank');
                  }}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  aria-label="Prime Video Sports"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Prime Video Sports
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Static Action for Non-Interactive Mode */}
        {!enableInteractions && status === 'finished' && (
          <button 
            onClick={handleViewRecap}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center hover:from-red-600 hover:to-orange-600 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            VIEW RECAP
          </button>
        )}
      </div>
      
      {/* Hover Tooltip */}
      {showTooltip && isHovered && enableInteractions && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10">
          Click for more actions
        </div>
      )}
    </div>
  );
};

export default InteractiveGameCard;