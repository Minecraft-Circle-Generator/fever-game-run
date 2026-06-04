import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Info, Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>About Us | Fever Game Today</title>
        <meta name="description" content="Learn more about Fever Game Today, our mission, and our dedication to bringing you the best Indiana Fever and Caitlin Clark stats, news, and highlights." />
        <link rel="canonical" href="https://fever-game.vercel.app/about" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-12 text-white">
            <div className="flex items-center justify-center mb-6">
              <Info className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-black text-center mb-4">About Fever Game Today</h1>
            <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
              The ultimate destination for passionate Indiana Fever fans and Caitlin Clark supporters worldwide.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                Founded in 2024, Fever Game Today was created with a singular mission: to provide the most comprehensive, real-time, and engaging platform for Indiana Fever basketball fans. We understand the thrill of the game and the hunger for accurate, up-to-the-minute statistics.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                With the arrival of generational talents like Caitlin Clark, Aliyah Boston, and Kelsey Mitchell, the Fever are capturing the attention of the basketball world. Our platform is dedicated to tracking their journey, providing live score updates, detailed player statistics, and curated video highlights all in one accessible place.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">What We Offer</h2>
              </div>
              <ul className="space-y-4 text-gray-600 text-lg list-disc list-inside">
                <li><strong>Live Game Tracking:</strong> Real-time updates during every Indiana Fever game, so you never miss a play.</li>
                <li><strong>Player Statistics:</strong> In-depth season averages and game-by-game logs focusing on Caitlin Clark and the entire roster.</li>
                <li><strong>Video Highlights:</strong> Carefully curated post-game highlights, press conferences, and top plays.</li>
                <li><strong>Latest News & Analysis:</strong> Expert breakdowns of team performance, tactical shifts, and WNBA season outlooks.</li>
              </ul>
            </section>

            <section className="mb-12">
              <div className="bg-red-50 rounded-xl p-8 border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Join Our Community</h2>
                <p className="text-gray-700 text-center mb-6">
                  We are a community-driven project built by fans, for fans. Whether you are tracking Caitlin Clark's record-breaking three-pointers or analyzing the team's defensive rating, Fever Game Today is your home court.
                </p>
                <div className="text-center">
                  <a href="/contact" className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Us
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
