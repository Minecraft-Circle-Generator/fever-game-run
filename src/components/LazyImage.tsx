import React, { useState, useRef, useEffect, useMemo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  sources?: string[]; // 级联候选源，按顺序依次尝试
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
  fallbackSrc = 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
  sources = []
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // 构建级联源：首选 src → 传入的 sources → 最后 fallbackSrc
  const chain = useMemo(() => {
    const list = [src, ...sources.filter(Boolean)];
    if (fallbackSrc) list.push(fallbackSrc);
    // 去重
    return list.filter((v, i, arr) => v && arr.indexOf(v) === i);
  }, [src, sources, fallbackSrc]);

  const currentSrc = chain[Math.min(index, chain.length - 1)];

  useEffect(() => {
    // 兼容不支持 IntersectionObserver 的环境
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // 提前加载
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    } else {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // 尝试下一个候选源
    if (index < chain.length - 1) {
      setIndex((n) => n + 1);
      setIsLoaded(false);
    }
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 占位符 */}
      <img
        ref={imgRef}
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* 实际图片（级联回退） */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;