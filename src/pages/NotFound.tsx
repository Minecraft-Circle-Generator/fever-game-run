import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, TrendingUp } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <div className="text-sm text-gray-600">
            <p className="mb-4">Popular pages:</p>
            <div className="space-y-2">
              <Link 
                to="/player/caitlin-clark" 
                className="block text-amber-600 hover:text-amber-700 font-medium"
              >
                Caitlin Clark Stats
              </Link>
              <Link 
                to="/videos" 
                className="block text-amber-600 hover:text-amber-700 font-medium"
              >
                Latest Video Highlights
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-semibold text-gray-800">Recent Game Recaps</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fever vs Mercury</span>
              <span className="text-green-600 font-medium">W 89-76</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fever vs Storm</span>
              <span className="text-red-600 font-medium">L 84-91</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fever vs Dream</span>
              <span className="text-green-600 font-medium">W 95-82</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;