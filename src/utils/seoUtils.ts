// SEO优化工具函数
import { GameData, PlayerStats } from '../hooks/useRealTimeData';
import { SEOData, OpenGraphData, TwitterCardData, KeywordAnalysis, FEVER_GAME_KEYWORDS } from '../types/seo';

/**
 * 生成针对fever game关键词优化的页面标题
 */
export const generateOptimizedTitle = (
  todayGame: GameData | null,
  playerStats: PlayerStats | null,
  pageType: 'home' | 'game' | 'player' | 'highlights' = 'home'
): string => {
  const baseTitle = 'Fever Game Today';
  
  if (!todayGame) {
    return `${baseTitle} - WNBA Live Scores, Stats & Highlights`;
  }

  const { status, awayTeam, homeTeam, homeScore, awayScore, time } = todayGame;
  
  switch (status) {
    case 'live':
      return `🔴 LIVE: ${awayTeam} vs ${homeTeam} - Fever Game Today`;
    case 'upcoming':
      return `${awayTeam} vs ${homeTeam} Tonight at ${time} - Fever Game Today`;
    case 'finished':
      if (homeScore !== undefined && awayScore !== undefined) {
        return `Final: ${awayTeam} ${awayScore} - ${homeScore} ${homeTeam} - Fever Game Today`;
      }
      return `${awayTeam} vs ${homeTeam} Final - Fever Game Today`;
    default:
      return `${awayTeam} vs ${homeTeam} - Fever Game Today`;
  }
};

/**
 * 生成动态meta描述
 */
export const generateOptimizedDescription = (
  todayGame: GameData | null,
  playerStats: PlayerStats | null
): string => {
  const baseDescription = 'Get live WNBA scores, Caitlin Clark stats, Indiana Fever game highlights, and real-time basketball updates.';
  
  if (!todayGame || !playerStats) {
    return baseDescription;
  }

  const { status, awayTeam, homeTeam, time, homeScore, awayScore } = todayGame;
  const { points, assists } = playerStats;

  switch (status) {
    case 'live':
      return `🔴 LIVE NOW: ${awayTeam} vs ${homeTeam}! Caitlin Clark has ${points} points, ${assists} assists. Watch live WNBA action and fever game highlights!`;
    case 'upcoming':
      return `${awayTeam} vs ${homeTeam} tonight at ${time}! Get live fever game scores, Caitlin Clark stats, and WNBA highlights. Don't miss the fever game today!`;
    case 'finished':
      return `Final Score: ${awayTeam} ${awayScore} - ${homeScore} ${homeTeam}. Caitlin Clark finished with ${points} points, ${assists} assists. Watch fever game highlights!`;
    default:
      return baseDescription;
  }
};

/**
 * 分析关键词密度和分布
 */
export const analyzeKeywordDensity = (content: string, keywords: string[]): KeywordAnalysis[] => {
  const normalizedContent = content.toLowerCase();
  const words = normalizedContent.split(/\s+/);
  const totalWords = words.length;

  return keywords.map(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    const regex = new RegExp(`\\b${normalizedKeyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = content.match(regex) || [];
    const frequency = matches.length;
    const density = totalWords > 0 ? (frequency / totalWords) * 100 : 0;
    
    // 找到关键词位置
    const positions: number[] = [];
    let match;
    const positionRegex = new RegExp(`\\b${normalizedKeyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    while ((match = positionRegex.exec(content)) !== null) {
      positions.push(match.index);
    }

    // 判断密度是否最优 (1-3%为最佳)
    const isOptimal = density >= 1 && density <= 3;

    return {
      keyword,
      density,
      frequency,
      positions,
      isOptimal
    };
  });
};

/**
 * 生成语义化HTML标签
 */
export const generateSemanticHTML = (content: string, keywords: string[]): string => {
  let optimizedContent = content;
  
  // 为主要关键词添加语义标记
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    optimizedContent = optimizedContent.replace(regex, '<strong>$1</strong>');
  });
  
  return optimizedContent;
};

/**
 * 生成Open Graph数据
 */
export const generateOpenGraphData = (
  title: string,
  description: string,
  todayGame: GameData | null
): OpenGraphData => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fevergametoday.com';
  
  return {
    title,
    description,
    image: `${baseUrl}/logo.svg`,
    url: typeof window !== 'undefined' ? window.location.href : baseUrl,
    type: todayGame ? 'article' : 'website',
    siteName: 'Fever Game Today',
    locale: 'en_US'
  };
};

/**
 * 生成Twitter Card数据
 */
export const generateTwitterCardData = (
  title: string,
  description: string
): TwitterCardData => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fevergametoday.com';
  
  return {
    card: 'summary_large_image',
    title,
    description,
    image: `${baseUrl}/logo.svg`,
    site: '@FeverGameToday',
    creator: '@FeverGameToday'
  };
};

/**
 * 获取fever game相关关键词
 */
export const getFeverGameKeywords = (includeSecondary: boolean = true): string[] => {
  const keywords = [...FEVER_GAME_KEYWORDS.PRIMARY];
  
  if (includeSecondary) {
    keywords.push(...FEVER_GAME_KEYWORDS.SECONDARY);
  }
  
  return keywords;
};

/**
 * 生成完整的SEO数据
 */
export const generateSEOData = (
  todayGame: GameData | null,
  playerStats: PlayerStats | null,
  pageType: 'home' | 'game' | 'player' | 'highlights' = 'home'
): SEOData => {
  const title = generateOptimizedTitle(todayGame, playerStats, pageType);
  const description = generateOptimizedDescription(todayGame, playerStats);
  const keywords = getFeverGameKeywords(true);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fevergametoday.com';
  
  return {
    title,
    description,
    keywords,
    canonicalUrl: typeof window !== 'undefined' ? window.location.href : baseUrl,
    openGraph: generateOpenGraphData(title, description, todayGame),
    twitterCard: generateTwitterCardData(title, description),
    structuredData: [] // 将在schemaUtils中生成
  };
};

/**
 * 优化内容中的关键词分布
 */
export const optimizeKeywordDistribution = (
  content: string,
  targetKeywords: string[],
  targetDensity: number = 2
): string => {
  const analysis = analyzeKeywordDensity(content, targetKeywords);
  let optimizedContent = content;
  
  analysis.forEach(({ keyword, density, isOptimal }) => {
    if (!isOptimal && density < targetDensity) {
      // 如果密度过低，尝试自然地添加关键词
      const variations = generateKeywordVariations(keyword);
      const randomVariation = variations[Math.floor(Math.random() * variations.length)];
      
      // 在内容末尾添加自然的关键词变体
      optimizedContent += ` Learn more about ${randomVariation} and stay updated with the latest information.`;
    }
  });
  
  return optimizedContent;
};

/**
 * 生成关键词变体
 */
export const generateKeywordVariations = (keyword: string): string[] => {
  const variations = [keyword];
  
  // 添加常见变体
  if (keyword.includes('fever game')) {
    variations.push(
      keyword.replace('fever game', 'Indiana Fever game'),
      keyword.replace('fever game', 'Fever basketball game'),
      keyword.replace('fever game', 'WNBA Fever game')
    );
  }
  
  if (keyword.includes('today')) {
    variations.push(
      keyword.replace('today', 'tonight'),
      keyword.replace('today', 'this evening')
    );
  }
  
  return variations.filter((v, i, arr) => arr.indexOf(v) === i); // 去重
};