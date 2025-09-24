import React, { memo } from 'react';
import { Play, Eye, Clock } from 'lucide-react';
import LazyImage from './LazyImage';
import { useIsMobile } from '../hooks/useMediaQuery';

interface OptimizedVideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: string;
  videoId?: string;
  isLive?: boolean;
}

const OptimizedVideoCard: React.FC<OptimizedVideoCardProps> = memo(({
  title,
  thumbnail,
  duration,
  views,
  uploadDate,
  channel,
  videoId,
  isLive = false
}) => {
  const isMobile = useIsMobile();

  const handleVideoClick = () => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 ${
        !isMobile ? 'hover:scale-105 hover:shadow-xl' : ''
      }`}
      onClick={handleVideoClick}
    >
      <div className="relative">
        <LazyImage
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Play className="h-12 w-12 text-white" fill="white" />
        </div>
        
        {/* 时长标签 */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-semibold">
          {isLive ? (
            <span className="text-red-400 font-bold">🔴 LIVE</span>
          ) : (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{channel}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {views} views
          </span>
          <span>{uploadDate}</span>
        </div>
      </div>
    </div>
  );
});

OptimizedVideoCard.displayName = 'OptimizedVideoCard';

export default OptimizedVideoCard;