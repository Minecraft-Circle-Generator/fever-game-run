import React from 'react';
import { GameData, PlayerStats, VideoData } from '../hooks/useRealTimeData';
import { generateAllSchemas, validateSchema } from '../utils/schemaUtils';
import { TeamStats } from '../types/seo';

interface StructuredDataProps {
  todayGame: GameData | null;
  playerStats: PlayerStats | null;
  videos?: VideoData[];
  teamStats?: TeamStats;
  enableValidation?: boolean;
}

const StructuredData: React.FC<StructuredDataProps> = ({ 
  todayGame, 
  playerStats, 
  videos = [],
  teamStats,
  enableValidation = false
}) => {
  // 使用新的schema生成工具
  const allSchemas = generateAllSchemas(todayGame, playerStats, videos, teamStats);
  
  // 验证schemas（如果启用）
  const validatedSchemas = enableValidation 
    ? allSchemas.map(schema => {
        const validation = validateSchema(schema);
        if (!validation.isValid) {
          console.warn('Schema validation failed:', validation.errors);
        }
        return validation.schema;
      })
    : allSchemas;

  return (
    <>
      {/* 渲染所有验证过的结构化数据 */}
      {validatedSchemas.map((schema, index) => (
        <script
          key={`schema-${index}-${schema['@type'] || 'schema'}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, enableValidation ? 2 : 0)
          }}
        />
      ))}
      
      {/* 添加额外的SEO增强标记 */}
      {todayGame && (
        <>
          {/* 比赛特定的meta标签 */}
          <meta name="sports.game.home_team" content={todayGame.homeTeam} />
          <meta name="sports.game.away_team" content={todayGame.awayTeam} />
          <meta name="sports.game.status" content={todayGame.status} />
          <meta name="sports.game.venue" content={todayGame.venue} />
          {todayGame.homeScore !== undefined && (
            <meta name="sports.game.home_score" content={todayGame.homeScore.toString()} />
          )}
          {todayGame.awayScore !== undefined && (
            <meta name="sports.game.away_score" content={todayGame.awayScore.toString()} />
          )}
        </>
      )}
      
      {/* 球员特定的meta标签 */}
      {playerStats && (
        <>
          <meta name="sports.player.name" content="Caitlin Clark" />
          <meta name="sports.player.points" content={playerStats.points.toString()} />
          <meta name="sports.player.assists" content={playerStats.assists.toString()} />
          <meta name="sports.player.three_pointers" content={playerStats.threePointers.toString()} />
          <meta name="sports.player.rebounds" content={playerStats.rebounds.toString()} />
        </>
      )}
    </>
  );
};

export default StructuredData;