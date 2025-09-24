// SEO优化钩子
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameData, PlayerStats, VideoData } from './useRealTimeData';
import { SEOData, SEOOptimizationConfig } from '../types/seo';
import { generateSEOData } from '../utils/seoUtils';
import { getContextualKeywords, calculateSEOScore } from '../utils/keywordUtils';

interface SEOOptimizationState {
  seoData: SEOData | null;
  seoScore: number;
  lastUpdate: Date;
  isUpdating: boolean;
  updateCount: number;
}

const defaultConfig: SEOOptimizationConfig = {
  primaryKeywords: [
    'fever game today',
    'fever game',
    'fever game tonight',
    'caitlin clark'
  ],
  secondaryKeywords: [
    'wnba live',
    'indiana fever',
    'basketball highlights',
    'fever game score'
  ],
  updateInterval: 300000, // 5分钟
  enableRealTimeUpdates: true,
  targetKeywordDensity: 2.0
};

export const useSEOOptimization = (
  todayGame: GameData | null,
  playerStats: PlayerStats | null,
  videos: VideoData[] = [],
  config: Partial<SEOOptimizationConfig> = {}
) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastGameStatusRef = useRef<string | null>(null);
  
  const [state, setState] = useState<SEOOptimizationState>({
    seoData: null,
    seoScore: 0,
    lastUpdate: new Date(),
    isUpdating: false,
    updateCount: 0
  });

  // 生成SEO数据
  const generateOptimizedSEOData = useCallback(() => {
    if (!todayGame && !playerStats) return null;

    const seoData = generateSEOData(todayGame, playerStats, 'home');
    
    // 获取上下文关键词
    const contextualKeywords = todayGame 
      ? getContextualKeywords(todayGame.status, true)
      : mergedConfig.primaryKeywords;

    // 计算SEO评分
    const content = `${seoData.title} ${seoData.description}`;
    const seoScore = calculateSEOScore(
      content,
      seoData.title,
      seoData.description,
      contextualKeywords
    );

    return {
      ...seoData,
      keywords: [...contextualKeywords, ...mergedConfig.secondaryKeywords],
      seoScore
    };
  }, [todayGame, playerStats, mergedConfig]);

  // 更新SEO数据
  const updateSEOData = useCallback(async () => {
    setState(prev => ({ ...prev, isUpdating: true }));

    try {
      const newSEOData = generateOptimizedSEOData();
      
      if (newSEOData) {
        const seoScore = calculateSEOScore(
          `${newSEOData.title} ${newSEOData.description}`,
          newSEOData.title,
          newSEOData.description,
          newSEOData.keywords
        );

        setState(prev => ({
          ...prev,
          seoData: newSEOData,
          seoScore,
          lastUpdate: new Date(),
          isUpdating: false,
          updateCount: prev.updateCount + 1
        }));

        // 触发自定义事件通知其他组件
        window.dispatchEvent(new CustomEvent('seoDataUpdated', {
          detail: { seoData: newSEOData, seoScore }
        }));
      }
    } catch (error) {
      console.error('SEO数据更新失败:', error);
      setState(prev => ({ ...prev, isUpdating: false }));
    }
  }, [generateOptimizedSEOData]);

  // 检查是否需要更新
  const shouldUpdate = useCallback(() => {
    if (!mergedConfig.enableRealTimeUpdates) return false;
    
    // 如果比赛状态改变，立即更新
    const currentGameStatus = todayGame?.status || null;
    if (currentGameStatus !== lastGameStatusRef.current) {
      lastGameStatusRef.current = currentGameStatus;
      return true;
    }

    // 如果是直播状态，更频繁地更新
    if (todayGame?.status === 'live') {
      return true;
    }

    // 检查时间间隔
    const timeSinceLastUpdate = Date.now() - state.lastUpdate.getTime();
    return timeSinceLastUpdate >= mergedConfig.updateInterval;
  }, [todayGame, state.lastUpdate, mergedConfig]);

  // 强制更新SEO数据
  const forceUpdate = useCallback(() => {
    updateSEOData();
  }, [updateSEOData]);

  // 获取SEO建议
  const getSEORecommendations = useCallback(() => {
    if (!state.seoData) return [];

    const recommendations: string[] = [];
    
    if (state.seoScore < 70) {
      recommendations.push('SEO评分较低，建议优化关键词分布');
    }
    
    if (state.seoData.title.length > 60) {
      recommendations.push('标题过长，建议控制在60字符以内');
    }
    
    if (state.seoData.description.length > 155) {
      recommendations.push('描述过长，建议控制在155字符以内');
    }
    
    if (state.seoData.keywords.length < 5) {
      recommendations.push('关键词数量较少，建议增加相关关键词');
    }

    // 检查fever game关键词是否存在
    const hasFeverKeyword = state.seoData.keywords.some(keyword => 
      keyword.toLowerCase().includes('fever game')
    );
    if (!hasFeverKeyword) {
      recommendations.push('建议在关键词中包含"fever game"相关词汇');
    }

    return recommendations;
  }, [state.seoData, state.seoScore]);

  // 初始化和设置定时更新
  useEffect(() => {
    // 立即生成初始SEO数据
    updateSEOData();

    // 设置定时更新
    if (mergedConfig.enableRealTimeUpdates) {
      intervalRef.current = setInterval(() => {
        if (shouldUpdate()) {
          updateSEOData();
        }
      }, Math.min(mergedConfig.updateInterval, 60000)); // 最少1分钟检查一次
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateSEOData, shouldUpdate, mergedConfig.enableRealTimeUpdates, mergedConfig.updateInterval]);

  // 监听比赛数据变化
  useEffect(() => {
    if (shouldUpdate()) {
      updateSEOData();
    }
  }, [todayGame, playerStats, videos, shouldUpdate, updateSEOData]);

  // 页面可见性变化时的处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && mergedConfig.enableRealTimeUpdates) {
        // 页面重新可见时，检查是否需要更新
        if (shouldUpdate()) {
          updateSEOData();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldUpdate, updateSEOData, mergedConfig.enableRealTimeUpdates]);

  return {
    seoData: state.seoData,
    seoScore: state.seoScore,
    lastUpdate: state.lastUpdate,
    isUpdating: state.isUpdating,
    updateCount: state.updateCount,
    forceUpdate,
    getSEORecommendations,
    config: mergedConfig
  };
};