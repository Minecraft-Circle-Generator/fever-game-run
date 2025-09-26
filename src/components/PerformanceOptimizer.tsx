import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // 预加载关键资源
    const preloadCriticalResources = () => {
      // 预加载字体
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // 预连接到外部域名
      const preconnectDomains = [
        'https://www.googleapis.com',
        'https://i.ytimg.com',
        'https://images.pexels.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // 优化图片加载
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // 延迟加载非关键脚本
    const loadNonCriticalScripts = () => {
      // 延迟加载 Google Analytics 等非关键脚本
      setTimeout(() => {
        // 这里可以添加非关键的第三方脚本
      }, 3000);
    };

    // 内存优化
    const optimizeMemory = () => {
      // 清理未使用的事件监听器
      const cleanup = () => {
        // 移除过期的事件监听器
        window.removeEventListener('scroll', cleanup);
      };

      // 节流滚动事件
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // 滚动处理逻辑
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return cleanup;
    };

    // 执行优化
    preloadCriticalResources();
    optimizeImages();
    loadNonCriticalScripts();
    const cleanup = optimizeMemory();

    return cleanup;
  }, []);

  // 性能监控
  useEffect(() => {
    if ('performance' in window) {
      // 监控页面加载性能
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          // 如果加载时间超过3秒，记录性能问题
          if (loadTime > 3000) {
            console.warn('页面加载时间过长:', loadTime + 'ms');
          }
        }, 0);
      });
    }
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;