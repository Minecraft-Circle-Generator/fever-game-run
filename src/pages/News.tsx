import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { fetchWnbaNews, WnbaNewsItem } from '../utils/espnProvider';

const fallbackArticles = [
  {
    id: 'caitlin-clark-2026-season-preview',
    title: 'Caitlin Clark 2026 Season Preview: Elevating the Indiana Fever',
    description: 'As the 2026 WNBA season unfolds, Caitlin Clark is proving once again why she is considered a generational talent. From her expanded passing vision to her deep three-point range, we break down her impact.',
    published: '2026-05-20T12:00:00Z',
    link: '/news/caitlin-clark-2026-season-preview'
  },
  {
    id: 'fever-playoff-push',
    title: 'Indiana Fever Playoff Push: The Road Ahead',
    description: 'With the playoffs approaching, the Indiana Fever are relying heavily on their young core. We analyze the upcoming schedule, key matchups, and defensive strategies needed to secure a top seed.',
    published: '2026-05-15T12:00:00Z',
    link: '/news/fever-playoff-push'
  },
  {
    id: 'breaking-down-the-pick-and-roll',
    title: 'Tactical Breakdown: The Clark-Boston Pick and Roll',
    description: 'One of the most lethal offensive weapons in the WNBA right now is the pick and roll synergy between Caitlin Clark and Aliyah Boston. Here is a deep dive into the numbers and game film.',
    published: '2026-05-10T12:00:00Z',
    link: '/news/breaking-down-the-pick-and-roll'
  }
];

const News = () => {
  const [articles, setArticles] = useState<WnbaNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchWnbaNews().then(data => {
      if (mounted) {
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          // Fallback to static articles
          setArticles(fallbackArticles as any);
        }
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Latest WNBA News | Fever Game Today</title>
        <meta name="description" content="Read the latest news, tactical analysis, and deep dives into Caitlin Clark and the Indiana Fever's performance in the WNBA." />
        <link rel="canonical" href="https://fevergame.space/news" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 mb-4">Latest WNBA News</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest stories, game previews, and news across the league.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded w-full mb-auto"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full border border-gray-100">
                {article.imageUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                      News
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.published)}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow line-clamp-4 text-sm">
                    {article.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <a 
                      href={article.link}
                      target={article.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 font-bold hover:text-red-700 transition-colors group"
                    >
                      Read Full Article
                      <ExternalLink className="h-4 w-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
