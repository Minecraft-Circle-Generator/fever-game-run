// Schema标记生成工具函数
import { GameData, PlayerStats, VideoData } from '../hooks/useRealTimeData';
import { StructuredDataSchema, SchemaValidationResult, TeamStats, EnhancedPlayerStats } from '../types/seo';
import { generateFAQSchema } from './faqSchema';

/**
 * 生成SportsEvent Schema标记
 */
export const generateSportsEventSchema = (game: GameData): StructuredDataSchema => {
  const startDate = new Date(`${game.date} ${game.time}`);
  
  const schema: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${game.awayTeam} vs ${game.homeTeam}`,
    "description": `WNBA game between ${game.awayTeam} and ${game.homeTeam}`,
    "startDate": startDate.toISOString(),
    "location": {
      "@type": "Place",
      "name": game.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Indianapolis",
        "addressRegion": "IN",
        "addressCountry": "US"
      }
    },
    "competitor": [
      {
        "@type": "SportsTeam",
        "name": game.awayTeam,
        "sport": "Basketball"
      },
      {
        "@type": "SportsTeam",
        "name": game.homeTeam,
        "sport": "Basketball"
      }
    ],
    "sport": "Basketball",
    "league": "WNBA",
    "eventStatus": getEventStatus(game.status),
    "organizer": {
      "@type": "Organization",
      "name": "WNBA",
      "url": "https://www.wnba.com"
    }
  };

  // 添加比分信息（如果可用）
  if (game.homeScore !== undefined && game.awayScore !== undefined) {
    schema.result = {
      "@type": "SportsEventResult",
      "homeTeamScore": game.homeScore,
      "awayTeamScore": game.awayScore
    };
  }

  // 添加广播信息（如果可用）
  if (game.platform) {
    schema.broadcastOfEvent = {
      "@type": "BroadcastEvent",
      "isLiveBroadcast": game.status === 'live',
      "name": `${game.platform} broadcast`,
      "broadcaster": {
        "@type": "Organization",
        "name": game.platform
      }
    };
  }

  return schema;
};

/**
 * 生成Person Schema标记（球员信息）
 */
export const generatePersonSchema = (
  playerStats: PlayerStats,
  playerName: string = "Caitlin Clark"
): StructuredDataSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": playerName,
    "jobTitle": "Professional Basketball Player",
    "memberOf": {
      "@type": "SportsTeam",
      "name": "Indiana Fever",
      "sport": "Basketball",
      "league": "WNBA"
    },
    "sport": "Basketball",
    "award": ["WNBA Rookie of the Year", "NCAA Division I All-Time Scoring Leader"],
    "performanceStats": {
      "@type": "SportsPerformance",
      "points": playerStats.points,
      "assists": playerStats.assists,
      "threePointers": playerStats.threePointers,
      "rebounds": playerStats.rebounds,
      "fieldGoalPercentage": playerStats.fieldGoalPercentage
    },
    "nationality": "American",
    "birthPlace": "Des Moines, Iowa",
    "height": "6'0\"",
    "weight": "150 lbs"
  };
};

/**
 * 生成SportsTeam Schema标记
 */
export const generateSportsTeamSchema = (
  teamName: string,
  teamStats?: TeamStats
): StructuredDataSchema => {
  const schema: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": teamName,
    "sport": "Basketball",
    "league": "WNBA",
    "location": {
      "@type": "Place",
      "name": teamName.includes("Indiana") ? "Indianapolis, IN" : "Las Vegas, NV"
    }
  };

  if (teamStats) {
    schema.wins = teamStats.wins;
    schema.losses = teamStats.losses;
    schema.winPercentage = teamStats.winPercentage;
    schema.statistics = {
      "@type": "SportsTeamStats",
      "averagePoints": teamStats.averagePoints,
      "averageAssists": teamStats.averageAssists,
      "averageRebounds": teamStats.averageRebounds
    };
  }

  return schema;
};

/**
 * 生成VideoObject Schema标记
 */
export const generateVideoObjectSchema = (video: VideoData): StructuredDataSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": `${video.title} - WNBA highlights and game footage`,
    "thumbnailUrl": video.thumbnail,
    "duration": convertDurationToISO8601(video.duration),
    "uploadDate": convertUploadDateToISO8601(video.uploadDate),
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": parseViewCount(video.views)
    },
    "publisher": {
      "@type": "Organization",
      "name": video.channel,
      "logo": {
        "@type": "ImageObject",
        "url": "https://fevergametoday.com/logo.svg"
      }
    },
    "contentUrl": video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : undefined,
    "embedUrl": video.videoId ? `https://www.youtube.com/embed/${video.videoId}` : undefined,
    "isLiveBroadcast": video.isLive || false
  };
};

/**
 * 生成Event Schema标记（赛程事件）
 */
export const generateEventSchema = (game: GameData): StructuredDataSchema => {
  const startDate = new Date(`${game.date} ${game.time}`);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3小时后

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${game.awayTeam} vs ${game.homeTeam}`,
    "description": `WNBA basketball game: ${game.awayTeam} vs ${game.homeTeam}`,
    "startDate": startDate.toISOString(),
    "endDate": endDate.toISOString(),
    "eventStatus": getEventStatus(game.status),
    "location": {
      "@type": "Place",
      "name": game.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Indianapolis",
        "addressRegion": "IN",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "WNBA"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free live streaming available"
    }
  };
};

/**
 * 生成Website Schema标记
 */
export const generateWebsiteSchema = (): StructuredDataSchema => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fevergametoday.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fever Game Today",
    "description": "Live WNBA scores, Caitlin Clark stats, Indiana Fever game highlights, and real-time basketball updates",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fever Game Today",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.svg`,
        "width": 512,
        "height": 512
      }
    },
    "sameAs": [
      "https://twitter.com/FeverGameToday",
      "https://facebook.com/FeverGameToday"
    ]
  };
};

/**
 * 生成BreadcrumbList Schema标记
 */
export const generateBreadcrumbSchema = (
  currentPage: string = "Home"
): StructuredDataSchema => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fevergametoday.com';
  
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    }
  ];

  if (currentPage !== "Home") {
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 2,
      "name": currentPage,
      "item": typeof window !== 'undefined' ? window.location.href : baseUrl
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
};

/**
 * 验证Schema标记格式
 */
export const validateSchema = (schema: StructuredDataSchema): SchemaValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 基础验证
  if (!schema['@context']) {
    errors.push('Missing @context property');
  }
  if (!schema['@type']) {
    errors.push('Missing @type property');
  }

  // 特定类型验证
  switch (schema['@type']) {
    case 'SportsEvent':
      if (!schema.name) errors.push('SportsEvent missing name');
      if (!schema.startDate) errors.push('SportsEvent missing startDate');
      if (!schema.competitor) errors.push('SportsEvent missing competitor');
      break;
    
    case 'Person':
      if (!schema.name) errors.push('Person missing name');
      break;
    
    case 'VideoObject':
      if (!schema.name) errors.push('VideoObject missing name');
      if (!schema.thumbnailUrl) warnings.push('VideoObject missing thumbnailUrl');
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    schema
  };
};

/**
 * 生成所有相关的Schema标记
 */
export const generateAllSchemas = (
  todayGame: GameData | null,
  playerStats: PlayerStats | null,
  videos: VideoData[] = [],
  teamStats?: TeamStats
): StructuredDataSchema[] => {
  const schemas: StructuredDataSchema[] = [];

  // 网站Schema
  schemas.push(generateWebsiteSchema());

  // 面包屑Schema
  schemas.push(generateBreadcrumbSchema());

  // 比赛Schema
  if (todayGame) {
    schemas.push(generateSportsEventSchema(todayGame));
    schemas.push(generateEventSchema(todayGame));
    
    // 队伍Schema
    schemas.push(generateSportsTeamSchema(todayGame.homeTeam, teamStats));
    schemas.push(generateSportsTeamSchema(todayGame.awayTeam));
  }

  // 球员Schema
  if (playerStats) {
    schemas.push(generatePersonSchema(playerStats));
  }

  // 视频Schema
  videos.forEach(video => {
    schemas.push(generateVideoObjectSchema(video));
  });

  // FAQ 页面 Schema（帮助 Google 展示常见问题答案）
  schemas.push(generateFAQSchema());

  return schemas;
};

// 辅助函数
const getEventStatus = (status: string): string => {
  switch (status) {
    case 'live':
      return 'https://schema.org/EventScheduled';
    case 'finished':
      return 'https://schema.org/EventCompleted';
    case 'upcoming':
      return 'https://schema.org/EventScheduled';
    default:
      return 'https://schema.org/EventScheduled';
  }
};

const convertDurationToISO8601 = (duration: string): string => {
  if (duration === 'LIVE') return 'PT0S';
  
  const match = duration.match(/(\d+):(\d+)/);
  if (match) {
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    return `PT${minutes}M${seconds}S`;
  }
  return 'PT0S';
};

const convertUploadDateToISO8601 = (uploadDate: string): string => {
  if (uploadDate === 'LIVE NOW') {
    return new Date().toISOString();
  }
  
  // 简单的日期转换，实际应用中需要更复杂的解析
  const now = new Date();
  if (uploadDate.includes('day ago')) {
    const days = parseInt(uploadDate.match(/(\d+)/)?.[1] || '1');
    now.setDate(now.getDate() - days);
  }
  
  return now.toISOString();
};

const parseViewCount = (views: string): number => {
  const match = views.match(/([\d.]+)([KM]?)/);
  if (match) {
    const number = parseFloat(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'K':
        return Math.floor(number * 1000);
      case 'M':
        return Math.floor(number * 1000000);
      default:
        return Math.floor(number);
    }
  }
  return 0;
};