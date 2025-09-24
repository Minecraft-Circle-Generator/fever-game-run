import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();

    // 监控页面加载时间
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      
      // 获取连接信息
      const connection = (navigator as any).connection;
      const connectionType = connection?.effectiveType || 'unknown';
      
      // 获取内存使用情况（如果支持）
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : undefined;

      setMetrics({
        loadTime,
        renderTime: performance.now() - startTime,
        memoryUsage,
        connectionType
      });
    };

    // 监听页面加载完成
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return metrics;
};

// 性能优化建议
export const getPerformanceRecommendations = (metrics: PerformanceMetrics) => {
  const recommendations: string[] = [];

  if (metrics.loadTime > 3000) {
    recommendations.push('页面加载时间较长，建议优化图片和代码分割');
  }

  if (metrics.memoryUsage && metrics.memoryUsage > 50) {
    recommendations.push('内存使用较高，建议检查内存泄漏');
  }

  if (metrics.connectionType === '2g' || metrics.connectionType === '3g') {
    recommendations.push('检测到慢速网络，已启用性能优化模式');
  }

  return recommendations;
};