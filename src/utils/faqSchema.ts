import { StructuredDataSchema } from '../types/seo';
import { GameData } from '../hooks/useRealTimeData';

/**
 * 生成 FAQPage（根据今日比赛动态填充）
 */
export const generateFAQSchema = (todayGame?: GameData | null): StructuredDataSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time is the Indiana Fever game today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": todayGame?.time && todayGame?.date
            ? `Today at ${todayGame.time} (${todayGame.date})`
            : "Check today's schedule for the latest start time."
        }
      },
      {
        "@type": "Question",
        "name": "Where is the Indiana Fever game today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": todayGame?.venue
            ? `At ${todayGame.venue}`
            : "Venue information will be updated when available."
        }
      },
      {
        "@type": "Question",
        "name": "How can I watch the Indiana Fever game today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": todayGame?.platform
            ? `Watch on ${todayGame.platform}`
            : "Broadcast platform will be announced before the game."
        }
      },
      {
        "@type": "Question",
        "name": "Is the Indiana Fever game live right now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": todayGame?.status === 'live'
            ? "Yes, it's live now!"
            : "Not live yet."
        }
      }
    ]
  };
};