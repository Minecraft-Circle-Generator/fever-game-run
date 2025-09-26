// 性能优化工具函数

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 图片预加载
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// 批量预加载图片
export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(preloadImage);
  await Promise.allSettled(promises);
};

// 检测网络连接质量
export const getConnectionQuality = (): 'slow' | 'fast' | 'unknown' => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection.effectiveType === '4g') return 'fast';
    if (connection.effectiveType === '3g' || connection.effectiveType === '2g') return 'slow';
  }
  return 'unknown';
};

// 延迟加载非关键资源
export const loadNonCriticalResources = (delay: number = 3000) => {
  setTimeout(() => {
    // 加载非关键的第三方脚本
    const scripts = [
      // Google Analytics 等可以在这里添加
    ];
    
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    });
  }, delay);
};

// 内存清理
export const cleanupMemory = () => {
  // 清理未使用的事件监听器
  const events = ['scroll', 'resize', 'mousemove'];
  events.forEach(event => {
    const listeners = (window as any)._eventListeners?.[event] || [];
    listeners.forEach((listener: any) => {
      if (listener.cleanup) {
        listener.cleanup();
      }
    });
  });
};

// 性能监控
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// 检测设备性能
export const getDevicePerformance = (): 'low' | 'medium' | 'high' => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;
  const memory = (navigator as any).deviceMemory || 1;
  
  if (hardwareConcurrency >= 8 && memory >= 8) return 'high';
  if (hardwareConcurrency >= 4 && memory >= 4) return 'medium';
  return 'low';
};

// 自适应加载策略
export const getLoadingStrategy = () => {
  const connectionQuality = getConnectionQuality();
  const devicePerformance = getDevicePerformance();
  
  if (connectionQuality === 'slow' || devicePerformance === 'low') {
    return {
      imageQuality: 'low',
      animationsEnabled: false,
      lazyLoadThreshold: '200px',
      chunkSize: 'small'
    };
  }
  
  if (connectionQuality === 'fast' && devicePerformance === 'high') {
    return {
      imageQuality: 'high',
      animationsEnabled: true,
      lazyLoadThreshold: '50px',
      chunkSize: 'large'
    };
  }
  
  return {
    imageQuality: 'medium',
    animationsEnabled: true,
    lazyLoadThreshold: '100px',
    chunkSize: 'medium'
  };
};