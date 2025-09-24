import React, { useEffect } from 'react';
import { GameData, PlayerStats } from '../hooks/useRealTimeData';
import { generateSEOData, getFeverGameKeywords } from '../utils/seoUtils';
import { getContextualKeywords, generateKeywordRichDescription } from '../utils/keywordUtils';

interface SEOHeadProps {
  todayGame: GameData | null;
  playerStats: PlayerStats | null;
  pageType?: 'home' | 'game' | 'player' | 'highlights';
  customKeywords?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  todayGame, 
  playerStats, 
  pageType = 'home',
  customKeywords = []
}) => {
  useEffect(() => {
    // 生成优化的SEO数据
    const updateMetaTags = () => {
      // 使用新的SEO工具生成优化数据
      const seoData = generateSEOData(todayGame, playerStats, pageType);
      
      // 获取上下文相关的关键词
      const contextualKeywords = todayGame 
        ? getContextualKeywords(todayGame.status, true)
        : getFeverGameKeywords(true);
      
      // 合并自定义关键词
      const allKeywords = [...contextualKeywords, ...customKeywords];
      
      // 生成关键词丰富的描述
      let optimizedDescription = seoData.description;
      if (todayGame && playerStats) {
        optimizedDescription = generateKeywordRichDescription(
          todayGame.status,
          { home: todayGame.homeTeam, away: todayGame.awayTeam },
          todayGame.time,
          {
            points: playerStats.points,
            assists: playerStats.assists,
            threePointers: playerStats.threePointers
          }
        );
      }

      // 更新标题
      document.title = seoData.title;

      // 更新描述
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', optimizedDescription);
      }

      // 更新关键词
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', allKeywords.join(', '));
      }

      // 添加移动优先的viewport meta标签
      updateViewportMeta();

      // 添加 Open Graph 标签
      updateOpenGraphTags(seoData.title, optimizedDescription, todayGame);
      
      // 添加 Twitter Card 标签
      updateTwitterCardTags(seoData.title, optimizedDescription);
      
      // 添加移动端特定的meta标签
      updateMobileMeta();
    };

    updateMetaTags();
  }, [todayGame, playerStats, pageType, customKeywords]);

  const updateViewportMeta = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
  };

  const updateMobileMeta = () => {
    // 移除现有的移动端meta标签
    const existingMobileTags = document.querySelectorAll('meta[name^="mobile-"], meta[name="format-detection"], meta[name="apple-mobile-web-app-"]');
    existingMobileTags.forEach(tag => tag.remove());

    // 添加移动端优化标签
    const mobileTags = [
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Fever Game Today' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'msapplication-TileColor', content: '#dc2626' },
      { name: 'msapplication-tap-highlight', content: 'no' }
    ];

    mobileTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });
  };

  const updateOpenGraphTags = (title: string, description: string, game: GameData | null) => {
    // 移除现有的 OG 标签
    const existingOGTags = document.querySelectorAll('meta[property^="og:"]');
    existingOGTags.forEach(tag => tag.remove());

    // 生成优化的Open Graph数据
    const baseUrl = window.location.origin;
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: game ? 'article' : 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: 'Fever Game Today' },
      { property: 'og:image', content: `${baseUrl}/logo.svg` },
      { property: 'og:image:alt', content: 'Fever Game Today Logo' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:updated_time', content: new Date().toISOString() }
    ];

    if (game) {
      ogTags.push(
        { property: 'article:section', content: 'Sports' },
        { property: 'article:tag', content: 'WNBA' },
        { property: 'article:tag', content: 'Basketball' },
        { property: 'article:tag', content: 'Indiana Fever' },
        { property: 'article:tag', content: 'Caitlin Clark' },
        { property: 'article:tag', content: 'fever game today' },
        { property: 'article:published_time', content: new Date().toISOString() },
        { property: 'article:author', content: 'Fever Game Today' }
      );
    }

    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });
  };

  const updateTwitterCardTags = (title: string, description: string) => {
    // 移除现有的 Twitter 标签
    const existingTwitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    existingTwitterTags.forEach(tag => tag.remove());

    // 添加增强的 Twitter Card 标签
    const baseUrl = window.location.origin;
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${baseUrl}/logo.svg` },
      { name: 'twitter:image:alt', content: 'Fever Game Today - WNBA Live Scores and Highlights' },
      { name: 'twitter:site', content: '@FeverGameToday' },
      { name: 'twitter:creator', content: '@FeverGameToday' },
      { name: 'twitter:domain', content: 'fevergametoday.com' },
      { name: 'twitter:url', content: window.location.href }
    ];

    // 如果是比赛页面，添加额外的Twitter标签
    if (todayGame) {
      twitterTags.push(
        { name: 'twitter:label1', content: 'Teams' },
        { name: 'twitter:data1', content: `${todayGame.awayTeam} vs ${todayGame.homeTeam}` },
        { name: 'twitter:label2', content: 'Status' },
        { name: 'twitter:data2', content: todayGame.status.toUpperCase() }
      );
    }

    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });
  };

  return null; // 这个组件不渲染任何内容
};

export default SEOHead;