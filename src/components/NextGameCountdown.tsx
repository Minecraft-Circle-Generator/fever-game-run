import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { fetchNextFeverGame, NextGameInfo } from '../utils/espnProvider';
import { Link } from 'react-router-dom';

export default function NextGameCountdown() {
  const [game, setGame] = useState<NextGameInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchNextFeverGame().then(data => {
      if (mounted) {
        setGame(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!game) return;
    
    const targetDate = new Date(game.date).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [game]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white text-center animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-12 bg-white/20 rounded w-2/3 mx-auto"></div>
      </div>
    );
  }

  if (!game || !timeLeft) {
    return null; // Don't render if no upcoming game found
  }

  const dateObj = new Date(game.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

  return (
    <Link to="/schedule" className="block bg-gradient-to-br from-[#041E42] via-[#0E2D5B] to-[#C8102E] rounded-2xl shadow-xl overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Info */}
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white mb-3 backdrop-blur-sm border border-white/20 uppercase tracking-wider">
            <Calendar size={14} className="mr-1.5 text-amber-400" />
            Next Game Countdown
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <div className="text-white font-black text-2xl md:text-3xl leading-tight tracking-tight">
              {game.isHome ? 'vs' : '@'} {game.opponent}
            </div>
            {game.oppLogo && (
              <img src={game.oppLogo} alt={game.opponent} className="w-10 h-10 object-contain drop-shadow-lg" />
            )}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-blue-100 text-sm mt-3">
            <div className="flex items-center font-medium">
              <Calendar size={14} className="mr-1 opacity-70" /> {formattedDate}
            </div>
            <div className="flex items-center font-medium">
              <Clock size={14} className="mr-1 opacity-70" /> {formattedTime}
            </div>
            <div className="flex items-center font-medium">
              <MapPin size={14} className="mr-1 opacity-70" /> {game.isHome ? 'Gainbridge Fieldhouse' : 'Away'}
            </div>
          </div>
        </div>
        
        {/* Right: Countdown */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0 mt-4 md:mt-0">
          <CountdownBox value={timeLeft.d} label="DAYS" />
          <CountdownBox value={timeLeft.h} label="HRS" />
          <div className="text-white/30 text-xl md:text-2xl font-black -mt-4 md:-mt-5">:</div>
          <CountdownBox value={timeLeft.m} label="MIN" />
          <div className="text-white/30 text-xl md:text-2xl font-black -mt-4 md:-mt-5">:</div>
          <CountdownBox value={timeLeft.s} label="SEC" />
        </div>
        
      </div>
    </Link>
  );
}

function CountdownBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-black/30 backdrop-blur-md rounded-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-black/40 transition-colors">
        <span className="text-white font-black text-xl sm:text-2xl md:text-3xl font-mono tabular-nums tracking-tighter">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-white/60 text-[9px] sm:text-[10px] md:text-xs font-bold mt-1.5 tracking-widest">{label}</span>
    </div>
  );
}
