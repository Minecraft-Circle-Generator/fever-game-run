import { StructuredDataSchema } from '../types/seo';

export const generateFAQSchema = (): StructuredDataSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time is the Indiana Fever game today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check the Today's Game card for the exact start time and broadcast channel; we update in real time."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I watch the Fever game live?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Live broadcasts are listed on the game card (e.g., ESPN). We show the platform badge at the top."
        }
      },
      {
        "@type": "Question",
        "name": "What were the final scores of the last Fever game?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "See the Yesterday's Game section for final scores including home and away totals."
        }
      },
      {
        "@type": "Question",
        "name": "How is Caitlin Clark performing recently?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Caitlin Clark Stats section displays points, assists, and 3-pointers with frequent updates."
        }
      }
    ]
  };
};