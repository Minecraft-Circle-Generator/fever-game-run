// SEO相关的TypeScript类型定义
import { GameData, PlayerStats, VideoData } from '../hooks/useRealTimeData';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: OpenGraphData;
  twitterCard: TwitterCardData;
  structuredData: StructuredDataSchema[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
  locale?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image: string;
  site?: string;
  creator?: string;
}

export interface StructuredDataSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface EnhancedGameData extends GameData {
  seoKeywords: string[];
  socialShareData: SocialShareData;
  interactionMetrics?: InteractionMetrics;
  schemaMarkup: StructuredDataSchema;
}

export interface SocialShareData {
  title: string;
  description: string;
  image: string;
  hashtags: string[];
  url: string;
}

export interface InteractionMetrics {
  clicks: number;
  views: number;
  shares: number;
  timeSpent: number;
}

export interface SEOOptimizationConfig {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  updateInterval: number;
  enableRealTimeUpdates: boolean;
  targetKeywordDensity: number;
}

export interface KeywordAnalysis {
  keyword: string;
  density: number;
  frequency: number;
  positions: number[];
  isOptimal: boolean;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  schema: StructuredDataSchema;
}

export interface TeamStats {
  teamName: string;
  wins: number;
  losses: number;
  winPercentage: number;
  averagePoints: number;
  averageAssists: number;
  averageRebounds: number;
  recentGames: GameData[];
}

export interface EnhancedPlayerStats extends PlayerStats {
  seasonAverages: PlayerStats;
  recentGames: PlayerStats[];
  careerHighs: PlayerStats;
  awards: string[];
}

// Fever Game 特定的关键词常量
export const FEVER_GAME_KEYWORDS = {
  PRIMARY: [
    'fever game today',
    'fever game',
    'fever game tonight',
    'fever game today on tv',
    'fever game score',
    'fever game tonight on tv',
    'fever game today live',
    'fever game stats',
    'fever game last night',
    'fever game highlights'
  ],
  SECONDARY: [
    'caitlin clark',
    'indiana fever',
    'wnba live',
    'wnba scores',
    'basketball highlights',
    'fever basketball',
    'indiana fever game',
    'caitlin clark stats',
    'fever vs',
    'wnba game today'
  ],
  LONG_TAIL: [
    'when is the fever game today',
    'what time is the fever game tonight',
    'fever game live stream',
    'caitlin clark fever game highlights',
    'indiana fever game schedule',
    'fever game tv channel',
    'fever game final score',
    'caitlin clark points today'
  ]
} as const;

export type FeverKeywordCategory = keyof typeof FEVER_GAME_KEYWORDS;
export type FeverKeyword = typeof FEVER_GAME_KEYWORDS[FeverKeywordCategory][number];