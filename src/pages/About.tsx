import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Info, Shield, Target, Trophy } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>History & About Us | Fever Game Today</title>
        <meta name="description" content="Discover the rich history of the Indiana Fever, from the Tamika Catchings 2012 Championship era to the new Caitlin Clark and Aliyah Boston generation. Learn about our Fever fan community." />
        <link rel="canonical" href="https://fevergame.space/about" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-700 via-red-900 to-black px-8 py-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Shield className="h-64 w-64 transform translate-x-16 -translate-y-16" />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black mb-4">The Pride of Indiana Basketball</h1>
              <p className="text-xl text-red-100 max-w-2xl font-medium leading-relaxed">
                Welcome to Fever Game Today. We are the ultimate fan-driven community dedicated to tracking the legacy, the present, and the future of the Indiana Fever.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* The Glory Days Section */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">A Legacy of Excellence: The Catchings Era</h2>
              </div>
              <div className="prose prose-lg prose-red max-w-none text-gray-700">
                <p>
                  The Indiana Fever franchise was born in 2000, bringing top-tier professional women's basketball to the heartland of hoops. However, the true identity of the Fever was forged with the arrival of the legendary <strong>Tamika Catchings</strong>. Known for her ferocious defense, unmatched work ethic, and leadership, Catchings transformed the Fever into a perennial WNBA powerhouse.
                </p>
                <p>
                  The pinnacle of this era arrived in <strong>2012</strong>. After years of heartbreaking playoff exits, the Fever, battle-tested and resilient, defeated the highly favored Minnesota Lynx to capture the <strong>WNBA Championship</strong>. That 2012 title run remains a defining moment in Indiana sports history, proving that grit and teamwork can conquer all.
                </p>
              </div>
            </section>

            {/* The New Era Section */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">The New Generation: Clark, Boston & Mitchell</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 prose prose-lg prose-red max-w-none text-gray-700">
                <p>
                  Today, the Indiana Fever are experiencing a monumental resurgence. The drafting of generational talents like unanimous Rookie of the Year <strong>Aliyah Boston</strong> and college basketball's all-time leading scorer <strong>Caitlin Clark</strong> has ushered in a thrilling new era at Gainbridge Fieldhouse.
                </p>
                <p>
                  Paired with the veteran elite scoring of <strong>Kelsey Mitchell</strong>, this young core has made the Fever one of the most electrifying and closely-watched teams in global sports. The energy is back, the sellout crowds have returned, and the chase for the franchise's second championship has officially begun.
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Info className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">About This Community</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  <strong>Fever Game Today</strong> was built by fans, for fans. In this fast-paced digital era, we noticed a need for a centralized, lightning-fast platform where Fever fans could get real-time game updates, tactical breakdowns, and deep statistical dives without the clutter.
                </p>
                <ul>
                  <li><strong>Live Tracking:</strong> Real-time score updates and broadcast information so you never miss a tip-off.</li>
                  <li><strong>Tactical Deep Dives:</strong> Expert analysis on coaching strategies and player mechanics.</li>
                  <li><strong>Community Driven:</strong> A safe, passionate space to celebrate the highs and analyze the lows of every WNBA season.</li>
                </ul>
              </div>
            </section>

            {/* Call to Action */}
            <section className="mb-8">
              <div className="bg-red-50 rounded-2xl p-10 border border-red-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Fever Faithful</h3>
                <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                  Whether you've been sitting in the stands since the 2000 inaugural season, or you just bought your first Caitlin Clark jersey, you belong here. 
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/schedule" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md">
                    View Game Schedule
                  </a>
                  <a href="/news" className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 px-8 rounded-full transition-colors">
                    Read Latest News
                  </a>
                </div>
              </div>
            </section>

            <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-100">
              <p>Fever Game Today is an independent fan site and is not officially affiliated with the Indiana Fever or the WNBA.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
