import React, { useState } from 'react';
import { Share2, Twitter, Copy, Check } from 'lucide-react';

interface ShareRecapButtonProps {
  stats?: {
    points: number;
    assists: number;
    rebounds?: number;
    threePointers?: number;
  };
  gameInfo?: {
    opponent: string;
    isHome?: boolean;
    homeScore?: number;
    awayScore?: number;
    status?: string;
  };
  customText?: string;
}

export default function ShareRecapButton({ stats, gameInfo, customText }: ShareRecapButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const siteUrl = 'https://fever-game.vercel.app';
  
  // Generate dynamic share text
  let shareText = customText;
  
  if (!shareText) {
    if (stats && gameInfo) {
      const resultStr = gameInfo.homeScore && gameInfo.awayScore 
        ? `(${gameInfo.isHome ? gameInfo.homeScore : gameInfo.awayScore}-${gameInfo.isHome ? gameInfo.awayScore : gameInfo.homeScore})` 
        : '';
        
      const matchup = gameInfo.isHome ? `vs ${gameInfo.opponent}` : `@ ${gameInfo.opponent}`;
      
      shareText = `🔥 Caitlin Clark just dropped ${stats.points} PTS, ${stats.assists} AST${stats.rebounds ? `, ${stats.rebounds} REB` : ''}${stats.threePointers ? ` & ${stats.threePointers} 3PM` : ''} ${matchup} ${resultStr}! \n\nTrack her live stats: ${siteUrl} \n#WNBA #CaitlinClark #IndianaFever`;
    } else if (stats) {
      shareText = `🔥 Caitlin Clark goes OFF for ${stats.points} PTS, ${stats.assists} AST! \n\nSee full stats on Fever Tracker: ${siteUrl} \n#WNBA #CaitlinClark`;
    } else {
      shareText = `🔥 Track Caitlin Clark's live WNBA stats and latest highlights! \n\n${siteUrl} \n#WNBA #CaitlinClark #IndianaFever`;
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareToTwitter = () => {
    const encodedText = encodeURIComponent(shareText as string);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-4 rounded-full transition-colors border border-indigo-200 shadow-sm"
      >
        <Share2 size={16} />
        <span className="text-sm">Share Stats</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 animate-fade-in-up">
            <div className="p-2">
              <button
                onClick={shareToTwitter}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors"
              >
                <Twitter size={18} className="text-[#1DA1F2]" />
                Share to X (Twitter)
              </button>
            </div>
            <div className="p-2">
              <button
                onClick={handleCopy}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Text & Link'}
              </button>
            </div>
            
            <div className="px-3 py-2 bg-gray-50 rounded-b-xl border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-mono line-clamp-3 leading-tight break-words">
                {shareText}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
