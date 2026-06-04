import React, { memo, useMemo } from 'react';
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
  // 新增：用于真实时间与观看数的鲁棒展示
  publishedAtISO?: string;
  viewsNumeric?: number;
}

const OptimizedVideoCard: React.FC<OptimizedVideoCardProps> = memo(({
  title,
  thumbnail,
  duration,
  views,
  uploadDate,
  channel,
  videoId,
  isLive = false,
  publishedAtISO,
  viewsNumeric
}) => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleVideoClick = () => {
    if (videoId) {
      setIsPlaying(true);
    }
  };

  // 为有 videoId 的视频构造 YouTube 官方缩略图候选链
  const thumbCandidates = useMemo(() => {
    if (!videoId) return [];
    return [
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/default.jpg`
    ];
  }, [videoId]);

  // 真实观看数优先，缺失则使用字符串或“—”
  const displayViews = useMemo(() => {
    // 1) 数值优先
    if (typeof viewsNumeric === 'number' && isFinite(viewsNumeric) && viewsNumeric > 0) {
      return viewsNumeric >= 1_000_000
        ? `${(viewsNumeric / 1_000_000).toFixed(1)}M`
        : `${(viewsNumeric / 1_000).toFixed(1)}K`;
    }
    // 2) 解析字符串（例如 "12.3K", "2.1M", "1234"）
    const s = (views || '').trim();
    if (s) {
      const mM = s.match(/([\d.]+)\s*M/i);
      const mK = s.match(/([\d.]+)\s*K/i);
      if (mM) {
        const n = parseFloat(mM[1]) * 1_000_000;
        if (isFinite(n) && n > 0) return `${(n / 1_000_000).toFixed(1)}M`;
      }
      if (mK) {
        const n = parseFloat(mK[1]) * 1_000;
        if (isFinite(n) && n > 0) return `${(n / 1_000).toFixed(1)}K`;
      }
      const num = parseFloat(s.replace(/[^0-9.]/g, ''));
      if (isFinite(num) && num > 0) {
        return num >= 1_000_000 ? `${(num / 1_000_000).toFixed(1)}M` : `${(num / 1_000).toFixed(1)}K`;
      }
    }
    // 3) 不可用或为0时显示横杠
    return '—';
  }, [viewsNumeric, views]);

  // 真实发布时间优先，非法或缺失则兜底
  const displayUpload = useMemo(() => {
    if (isLive) return 'LIVE NOW';
    // 1) 页面层相对时间优先
    const hasValidText = uploadDate && !/NaN/i.test(uploadDate);
    if (hasValidText) {
      // 若为 "Just now" 但 ISO 显示已过去 >=5 分钟，则改用 ISO 重新计算，避免误判
      if (/^just now$/i.test(uploadDate) && publishedAtISO) {
        const d = new Date(publishedAtISO);
        if (!isNaN(d.getTime())) {
          const diffMs = Date.now() - d.getTime();
          if (diffMs >= 5 * 60 * 1000) {
            const min = Math.floor(diffMs / 60000);
            const h = Math.floor(min / 60);
            const days = Math.floor(h / 24);
            if (h < 1) return `${min} minutes ago`;
            if (h < 24) return `${h} hours ago`;
            if (days === 1) return '1 day ago';
            return `${days} days ago`;
          }
        }
      }
      return uploadDate!;
    }
    // 2) ISO 兜底计算；未来或非法则显示绝对日期
    if (publishedAtISO) {
      const d = new Date(publishedAtISO);
      if (!isNaN(d.getTime())) {
        const now = Date.now();
        const diffMs = now - d.getTime();
        if (diffMs >= 0) {
          const min = Math.floor(diffMs / 60000);
          const h = Math.floor(min / 60);
          const days = Math.floor(h / 24);
          if (h < 1) return `${min} minutes ago`;
          if (h < 24) return `${h} hours ago`;
          if (days === 1) return '1 day ago';
          return `${days} days ago`;
        }
        // 未来时间或本地时区解析异常：显示绝对日期
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    // 3) 最终兜底
    return 'Just now';
  }, [publishedAtISO, uploadDate, isLive]);

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 ${
        !isMobile ? 'hover:scale-105 hover:shadow-xl' : ''
      }`}
    >
      <div className="relative cursor-pointer" onClick={handleVideoClick}>
        {isPlaying && videoId ? (
          <div className="w-full h-48 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <>
            <LazyImage
              src={thumbnail}
              alt={title}
              className="w-full h-48 object-cover"
              sources={thumbCandidates}
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
          </>
        )}
      </div>
      
      <div className="p-4" onClick={() => !isPlaying && handleVideoClick()}>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{channel}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {displayViews === '—' ? '—' : `${displayViews} views`}
          </span>
          <span>{displayUpload}</span>
        </div>
      </div>
    </div>
  );
});

OptimizedVideoCard.displayName = 'OptimizedVideoCard';

export default OptimizedVideoCard;