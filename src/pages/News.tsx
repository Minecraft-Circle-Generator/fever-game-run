import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const newsArticles = [
  {
    id: 'caitlin-clark-2026-season-preview',
    title: 'Caitlin Clark 2026 Season Preview: Elevating the Indiana Fever',
    excerpt: 'As the 2026 WNBA season unfolds, Caitlin Clark is proving once again why she is considered a generational talent. From her expanded passing vision to her deep three-point range, we break down her impact.',
    date: 'May 20, 2026',
    author: 'Fever Game Analytics Team',
    category: 'Analysis'
  },
  {
    id: 'fever-playoff-push',
    title: 'Indiana Fever Playoff Push: The Road Ahead',
    excerpt: 'With the playoffs approaching, the Indiana Fever are relying heavily on their young core. We analyze the upcoming schedule, key matchups, and defensive strategies needed to secure a top seed.',
    date: 'May 15, 2026',
    author: 'Fever Game Analytics Team',
    category: 'Team News'
  },
  {
    id: 'breaking-down-the-pick-and-roll',
    title: 'Tactical Breakdown: The Clark-Boston Pick and Roll',
    excerpt: 'One of the most lethal offensive weapons in the WNBA right now is the pick and roll synergy between Caitlin Clark and Aliyah Boston. Here is a deep dive into the numbers and game film.',
    date: 'May 10, 2026',
    author: 'Fever Game Analytics Team',
    category: 'Deep Dive'
  }
];

const News = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Latest News & Analysis | Fever Game Today</title>
        <meta name="description" content="Read the latest news, tactical analysis, and deep dives into Caitlin Clark and the Indiana Fever's performance in the WNBA." />
        <link rel="canonical" href="https://fever-game.vercel.app/news" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 mb-4">Latest News & Analysis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Deep dives, game previews, and tactical breakdowns of the Indiana Fever and Caitlin Clark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full border border-gray-100">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto">
                  <Link 
                    to={`/news/${article.id}`}
                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors group"
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AdSense Slot inside content to show text context to crawler */}
        <div className="mt-12 text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-4">Advertisement</p>
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-1766207958063879"
               data-ad-slot="auto"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
};

export default News;
