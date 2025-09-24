// 关键词优化专用工具函数
import { FEVER_GAME_KEYWORDS, KeywordAnalysis } from '../types/seo';

/**
 * 获取fever game相关的所有关键词
 */
export const getAllFeverKeywords = (): string[] => {
  return [
    ...FEVER_GAME_KEYWORDS.PRIMARY,
    ...FEVER_GAME_KEYWORDS.SECONDARY,
    ...FEVER_GAME_KEYWORDS.LONG_TAIL
  ];
};

/**
 * 根据比赛状态获取最相关的关键词
 */
export const getContextualKeywords = (
  gameStatus: 'upcoming' | 'live' | 'finished',
  includePlayerKeywords: boolean = true
): string[] => {
  const baseKeywords = [...FEVER_GAME_KEYWORDS.PRIMARY];
  
  // 根据比赛状态添加特定关键词
  switch (gameStatus) {
    case 'live':
      baseKeywords.push(
        'fever game today live',
        'fever game live stream',
        'fever game score',
        'live wnba game'
      );
      break;
    case 'upcoming':
      baseKeywords.push(
        'fever game tonight',
        'fever game today on tv',
        'fever game tonight on tv',
        'when is the fever game today'
      );
      break;
    case 'finished':
      baseKeywords.push(
        'fever game last night',
        'fever game highlights',
        'fever game final score',
        'fever game recap'
      );
      break;
  }

  // 添加球员相关关键词
  if (includePlayerKeywords) {
    baseKeywords.push(
      'caitlin clark',
      'caitlin clark stats',
      'caitlin clark fever game',
      'caitlin clark points today'
    );
  }

  return baseKeywords;
};

/**
 * 生成SEO友好的内容片段
 */
export const generateSEOContent = (
  gameStatus: 'upcoming' | 'live' | 'finished',
  teamNames: { home: string; away: string },
  playerStats?: { points: number; assists: number }
): string => {
  const keywords = getContextualKeywords(gameStatus, true);
  
  let content = '';
  
  switch (gameStatus) {
    case 'live':
      content = `🔴 The fever game today is LIVE! Watch ${teamNames.away} vs ${teamNames.home} right now. `;
      if (playerStats) {
        content += `Caitlin Clark has ${playerStats.points} points and ${playerStats.assists} assists in tonight's fever game. `;
      }
      content += `Don't miss this exciting WNBA action - the fever game tonight is heating up! Get live fever game scores and stats.`;
      break;
      
    case 'upcoming':
      content = `The fever game today features ${teamNames.away} vs ${teamNames.home}. `;
      content += `Tune in for tonight's fever game and watch Caitlin Clark dominate the court. `;
      content += `Check your local listings for fever game today on TV or stream the fever game tonight online.`;
      break;
      
    case 'finished':
      content = `The fever game last night was incredible! ${teamNames.away} vs ${teamNames.home} delivered amazing highlights. `;
      if (playerStats) {
        content += `Caitlin Clark finished with ${playerStats.points} points and ${playerStats.assists} assists. `;
      }
      content += `Watch fever game highlights and catch up on all the fever game stats from tonight's action.`;
      break;
  }
  
  return content;
};

/**
 * 优化标题中的关键词分布
 */
export const optimizeTitle = (
  baseTitle: string,
  primaryKeyword: string,
  gameStatus?: 'upcoming' | 'live' | 'finished'
): string => {
  // 确保主关键词在标题开头
  if (!baseTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    baseTitle = `${primaryKeyword} - ${baseTitle}`;
  }
  
  // 根据状态添加紧急性词汇
  switch (gameStatus) {
    case 'live':
      if (!baseTitle.includes('🔴') && !baseTitle.toLowerCase().includes('live')) {
        baseTitle = `🔴 LIVE: ${baseTitle}`;
      }
      break;
    case 'upcoming':
      if (!baseTitle.toLowerCase().includes('tonight') && !baseTitle.toLowerCase().includes('today')) {
        baseTitle = baseTitle.replace('fever game', 'fever game tonight');
      }
      break;
    case 'finished':
      if (!baseTitle.toLowerCase().includes('final') && !baseTitle.toLowerCase().includes('highlights')) {
        baseTitle = `Final: ${baseTitle}`;
      }
      break;
  }
  
  return baseTitle;
};

/**
 * 生成关键词丰富的meta描述
 */
export const generateKeywordRichDescription = (
  gameStatus: 'upcoming' | 'live' | 'finished',
  teamNames: { home: string; away: string },
  gameTime?: string,
  playerStats?: { points: number; assists: number; threePointers: number }
): string => {
  const maxLength = 155; // Google推荐的meta描述长度
  let description = '';
  
  switch (gameStatus) {
    case 'live':
      description = `🔴 LIVE: ${teamNames.away} vs ${teamNames.home} fever game today! `;
      if (playerStats) {
        description += `Caitlin Clark: ${playerStats.points}pts, ${playerStats.assists}ast, ${playerStats.threePointers} 3PM. `;
      }
      description += `Watch live WNBA action, fever game highlights & real-time stats!`;
      break;
      
    case 'upcoming':
      description = `${teamNames.away} vs ${teamNames.home} fever game tonight`;
      if (gameTime) {
        description += ` at ${gameTime}`;
      }
      description += `! Get live scores, Caitlin Clark stats & fever game highlights. Don't miss today's WNBA action!`;
      break;
      
    case 'finished':
      description = `Final: ${teamNames.away} vs ${teamNames.home} fever game highlights! `;
      if (playerStats) {
        description += `Caitlin Clark: ${playerStats.points}pts, ${playerStats.assists}ast. `;
      }
      description += `Watch recap, stats & fever game highlights from tonight's WNBA action!`;
      break;
  }
  
  // 确保不超过最大长度
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
};

/**
 * 分析内容中的关键词表现
 */
export const analyzeContentKeywords = (content: string): KeywordAnalysis[] => {
  const allKeywords = getAllFeverKeywords();
  const normalizedContent = content.toLowerCase();
  const words = normalizedContent.split(/\s+/);
  const totalWords = words.length;
  
  return allKeywords.map(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    const keywordWords = normalizedKeyword.split(/\s+/);
    
    // 计算关键词出现次数
    let frequency = 0;
    const positions: number[] = [];
    
    if (keywordWords.length === 1) {
      // 单词关键词
      words.forEach((word, index) => {
        if (word === normalizedKeyword) {
          frequency++;
          positions.push(index);
        }
      });
    } else {
      // 短语关键词
      const regex = new RegExp(`\\b${normalizedKeyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        frequency++;
        positions.push(match.index);
      }
    }
    
    const density = totalWords > 0 ? (frequency / totalWords) * 100 : 0;
    const isOptimal = density >= 0.5 && density <= 2.5; // 调整最优密度范围
    
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
 * 生成长尾关键词变体
 */
export const generateLongTailVariations = (baseKeyword: string): string[] => {
  const variations: string[] = [baseKeyword];
  
  // 添加时间相关变体
  const timeVariations = [
    'today',
    'tonight',
    'this evening',
    'right now',
    'live',
    'schedule'
  ];
  
  timeVariations.forEach(time => {
    if (!baseKeyword.includes(time)) {
      variations.push(`${baseKeyword} ${time}`);
      variations.push(`${time} ${baseKeyword}`);
    }
  });
  
  // 添加问题形式
  const questionWords = ['when', 'what time', 'where', 'how to watch'];
  questionWords.forEach(question => {
    variations.push(`${question} is the ${baseKeyword}`);
    variations.push(`${question} ${baseKeyword}`);
  });
  
  // 添加地理位置变体
  if (baseKeyword.includes('fever')) {
    variations.push(
      baseKeyword.replace('fever', 'indiana fever'),
      baseKeyword.replace('fever', 'fever basketball'),
      `${baseKeyword} indianapolis`
    );
  }
  
  return [...new Set(variations)]; // 去重
};

/**
 * 检查内容的SEO质量评分
 */
export const calculateSEOScore = (
  content: string,
  title: string,
  description: string,
  targetKeywords: string[]
): number => {
  let score = 0;
  const maxScore = 100;
  
  // 标题优化 (25分)
  const titleAnalysis = analyzeContentKeywords(title);
  const titleHasKeyword = titleAnalysis.some(analysis => 
    targetKeywords.includes(analysis.keyword) && analysis.frequency > 0
  );
  if (titleHasKeyword) score += 25;
  
  // 描述优化 (20分)
  const descAnalysis = analyzeContentKeywords(description);
  const descHasKeyword = descAnalysis.some(analysis => 
    targetKeywords.includes(analysis.keyword) && analysis.frequency > 0
  );
  if (descHasKeyword) score += 20;
  
  // 内容关键词密度 (30分)
  const contentAnalysis = analyzeContentKeywords(content);
  const optimalKeywords = contentAnalysis.filter(analysis => 
    targetKeywords.includes(analysis.keyword) && analysis.isOptimal
  );
  score += Math.min(30, (optimalKeywords.length / targetKeywords.length) * 30);
  
  // 内容长度 (15分)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 15;
  else if (wordCount >= 150) score += 10;
  else if (wordCount >= 50) score += 5;
  
  // 语义化标记 (10分)
  const hasSemanticTags = /<(h[1-6]|strong|em|mark)>/i.test(content);
  if (hasSemanticTags) score += 10;
  
  return Math.min(score, maxScore);
};