import React from 'react';
import { Helmet } from 'react-helmet-async';

type TodayGame = {
  opponent?: string;
  awayTeam?: { name?: string };
  homeScore?: number;
  awayScore?: number;
  startTime?: string;      // e.g. "7:00 PM"
  timezone?: string;       // e.g. "EST"
  startIso?: string;       // ISO datetime
  venue?: string;          // e.g. "Gainbridge Fieldhouse"
  status?: 'upcoming' | 'live' | 'final';
};

type PlayerStats = {
  points?: number;
  assists?: number;
  threePointers?: number;
};

interface Props {
  todayGame?: TodayGame | null;
  playerStats?: PlayerStats | null;
  lastUpdate?: Date;
}

const SeoSchema: React.FC<Props> = ({ todayGame, playerStats, lastUpdate }) => {
  const opponent =
    (typeof todayGame?.opponent === 'string' && todayGame?.opponent) ||
    todayGame?.awayTeam?.name ||
    'TBD';

  const homeScore = (todayGame?.homeScore ?? '-') as any;
  const awayScore = (todayGame?.awayScore ?? '-') as any;
  const tipTime = todayGame?.startTime ?? 'Tonight';
  const tz = todayGame?.timezone ?? 'EST';
  const venue = todayGame?.venue ?? 'Gainbridge Fieldhouse';
  const startIso = todayGame?.startIso ?? new Date().toISOString();

  const eventStatus =
    todayGame?.status === 'live'
      ? 'https://schema.org/EventInProgress'
      : todayGame?.status === 'final'
      ? 'https://schema.org/EventCompleted'
      : 'https://schema.org/EventScheduled';

  const faqEntities = [
    {
      '@type': 'Question',
      name: 'fever game today',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Indiana Fever vs ${opponent}. Tip-off: ${tipTime} (${tz}) at ${venue}. Live score: ${homeScore} - ${awayScore}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'wnba fever score today',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `WNBA Fever score today vs ${opponent}: ${homeScore} - ${awayScore}. Updated ${lastUpdate ? lastUpdate.toLocaleTimeString() : 'recently'}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'fever score tonight',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Fever score tonight vs ${opponent}: ${homeScore} - ${awayScore}. Tip-off at ${tipTime} (${tz}).`,
      },
    },
    {
      '@type': 'Question',
      name: 'fever score today',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Indiana Fever score today vs ${opponent}: ${homeScore} - ${awayScore}. Venue: ${venue}.`,
      },
    },
  ];

  const sportsEvent = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `Indiana Fever vs ${opponent} — Today`,
    startDate: startIso,
    eventStatus,
    location: {
      '@type': 'Place',
      name: venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Indianapolis',
        addressRegion: 'IN',
        addressCountry: 'US',
      },
    },
    homeTeam: { '@type': 'SportsTeam', name: 'Indiana Fever' },
    awayTeam: { '@type': 'SportsTeam', name: opponent },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: 'http://fever-game.run/',
      price: '0',
      priceCurrency: 'USD',
    },
    // 当前比分作为附加属性，便于抓取
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'homeScore', value: `${homeScore}` },
      { '@type': 'PropertyValue', name: 'awayScore', value: `${awayScore}` },
      { '@type': 'PropertyValue', name: 'tipTime', value: `${tipTime} (${tz})` },
    ],
    url: 'http://fever-game.run/',
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntities,
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Indiana Fever Game Today: Live WNBA Scores & Updates',
    description:
      `Real-time Indiana Fever updates — opponent ${opponent}, live score ${homeScore}-${awayScore}, tip-off ${tipTime} (${tz}).`,
    inLanguage: ['en', 'zh-Hans'],
    about: [
      'fever game today',
      'wnba fever score today',
      'fever score tonight',
      'fever score today',
      'Indiana Fever',
      'Caitlin Clark',
    ],
    isPartOf: {
      '@type': 'WebSite',
      name: 'Fever Game Today',
      url: 'http://fever-game.run/',
    },
    url: 'http://fever-game.run/',
  };

  const playerAnswer =
    `Top scorers tonight: Caitlin Clark` +
    (playerStats?.points ? ` (${playerStats.points} pts)` : '') +
    `, Assists ${playerStats?.assists ?? '-'}, 3P ${playerStats?.threePointers ?? '-'}.`;

  const qaExtra = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who are the top players in today’s Fever game?',
        acceptedAnswer: { '@type': 'Answer', text: playerAnswer },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(sportsEvent)}</script>
      <script type="application/ld+json">{JSON.stringify(faqPage)}</script>
      <script type="application/ld+json">{JSON.stringify(webPage)}</script>
      <script type="application/ld+json">{JSON.stringify(qaExtra)}</script>
    </Helmet>
  );
};

export default SeoSchema;