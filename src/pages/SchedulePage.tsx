import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Calendar, MapPin, Clock, ExternalLink, Ticket } from 'lucide-react';
import { fetchFullFeverSchedule, ScheduleGame } from '../utils/espnProvider';

export default function SchedulePage() {
  const [games, setGames] = useState<ScheduleGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchFullFeverSchedule().then(data => {
      if (mounted) {
        setGames(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const formatGameDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
    };
  };

  const handleAddToCalendar = (game: ScheduleGame) => {
    const startDate = new Date(game.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
    
    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Indiana Fever vs ${game.opponent}`,
      `DESCRIPTION:WNBA Game: Indiana Fever vs ${game.opponent} at ${game.venue}`,
      `LOCATION:${game.venue}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Fever_Game_vs_${game.opponent.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSchema = () => {
    if (games.length === 0) return null;
    const events = games.map(game => ({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": `Indiana Fever vs ${game.opponent}`,
      "startDate": new Date(game.date).toISOString(),
      "location": {
        "@type": "Place",
        "name": game.venue || (game.isHome ? "Gainbridge Fieldhouse" : "Away Arena"),
        "address": "USA"
      },
      "homeTeam": {
        "@type": "SportsTeam",
        "name": game.isHome ? "Indiana Fever" : game.opponent
      },
      "awayTeam": {
        "@type": "SportsTeam",
        "name": game.isHome ? game.opponent : "Indiana Fever"
      }
    }));
    return JSON.stringify(events);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Helmet>
        <title>Indiana Fever Game Schedule 2026 - Dates, Times & Tickets</title>
        <meta name="description" content="View the complete 2026 Indiana Fever WNBA game schedule. Get dates, times, TV channels, and tickets for upcoming Caitlin Clark and Indiana Fever games." />
        {games.length > 0 && (
          <script type="application/ld+json">
            {generateSchema()}
          </script>
        )}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Indiana Fever Game <span className="text-red-600">Schedule</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Don't miss a single moment of the 2026 season. Plan ahead for upcoming games.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
            <a 
              href="https://ticketmaster.evyy.net/c/3551523/264167/4272?u=https%3A%2F%2Fwww.ticketmaster.com%2Findiana-fever-tickets%2Fartist%2F806041"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Ticket className="h-5 w-5 mr-2" />
              Buy Tickets
            </a>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-xl h-32 animate-pulse shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-dashed border-gray-200">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">2026 Season Concluded</h3>
            <p className="text-gray-600 mt-2 mb-8 text-lg">The WNBA season has officially ended. Thank you for following the Indiana Fever with us. Check back soon for the upcoming 2027 Schedule!</p>
            <Link to="/news" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
              Read Off-Season News & Player Recaps
            </Link>
          </div>
        ) : (
          <div className="space-y-4 relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-orange-400 to-yellow-300 rounded-full hidden md:block"></div>

            {games.map((game, index) => {
              const { date, time } = formatGameDate(game.date);
              
              return (
                <div key={game.id} className="relative flex items-stretch md:pl-16 group transition-all duration-300">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-red-500 rounded-full z-10 hidden md:block group-hover:scale-150 group-hover:border-yellow-400 transition-transform"></div>

                  <div className="flex-1 bg-white rounded-xl shadow-sm hover:shadow-xl border-l-4 border-transparent hover:border-red-500 overflow-hidden transition-all duration-300 flex flex-col md:flex-row">
                    
                    <div className="bg-gray-50 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center md:w-48 border-b md:border-b-0 md:border-r border-gray-100">
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-600 uppercase tracking-widest">{date.split(' ')[0]}</div>
                        <div className="text-2xl font-black text-gray-900 leading-tight">{date.split(' ').slice(1).join(' ')}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-500 flex items-center md:mt-2">
                        <Clock size={14} className="mr-1" />
                        {time}
                      </div>
                    </div>

                    <div className="p-4 md:p-6 flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${game.isHome ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                          {game.isHome ? '🏠 Home' : '✈️ Away'}
                        </span>
                        
                        {game.broadcasts.length > 0 && (
                          <div className="flex gap-2">
                            {game.broadcasts.map((b, i) => (
                              <Link 
                                key={i} 
                                to="/guides/how-to-watch-fever"
                                title={`Learn how to watch ${b}`}
                                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 px-2 py-1 rounded border border-blue-100 transition-colors cursor-pointer"
                              >
                                📺 {b}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-xl md:text-2xl font-black text-gray-900">
                          <span className="text-red-600">Fever</span> {game.isHome ? 'vs' : '@'} {game.opponent}
                        </div>
                        {game.oppLogo && (
                          <img src={game.oppLogo} alt={game.opponent} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        )}
                      </div>

                      <div className="flex items-center text-gray-500 text-sm font-medium">
                        <MapPin size={16} className="mr-1 text-red-400" />
                        {game.venue}
                      </div>
                    </div>

                    <div className="p-4 md:p-6 bg-gray-50 flex flex-row md:flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100">
                      <button 
                        onClick={() => handleAddToCalendar(game)}
                        className="flex-1 md:flex-none md:w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        <span className="text-sm">Calendar</span>
                      </button>
                      
                      <a 
                        href={game.ticketsUrl || `https://www.stubhub.com/indiana-fever-tickets/performer/12665/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none md:w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                      >
                        <span className="text-sm">Find Tickets</span>
                        <ExternalLink size={14} className="ml-2 opacity-80" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
