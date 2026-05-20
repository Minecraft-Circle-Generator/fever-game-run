import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Flame className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="text-xl font-black text-white tracking-wider">
              FEVER<span className="text-red-500">GAME</span>TODAY
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/videos" className="hover:text-yellow-400 transition-colors">Highlights</Link>
            <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col items-center">
          <p className="mb-2">
            &copy; {currentYear} Fever Game Today. All rights reserved.
          </p>
          <p className="max-w-2xl text-center">
            This website is not officially affiliated with, associated with, or endorsed by the WNBA, Indiana Fever, or any of their partners. All trademarks and copyrights belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
