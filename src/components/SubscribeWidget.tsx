import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

const SubscribeWidget = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send the email to your backend or newsletter service
      setSubscribed(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl my-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
          NEVER MISS A BATTLE! 🏀
        </h3>
        <p className="mb-8 text-red-100 text-lg">
          Get Caitlin Clark stats, exclusive highlights, and live WNBA game alerts straight to your inbox. Join the ultimate Fever fan club today!
        </p>
        
        {subscribed ? (
          <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl border border-white/20 animate-fade-in">
            <CheckCircle2 className="h-12 w-12 text-yellow-300 mb-3" />
            <p className="text-xl font-bold text-white">You're in the squad!</p>
            <p className="text-red-100 mt-1">We'll alert you before the next tip-off.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-lg mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                required 
                className="pl-11 pr-4 py-4 rounded-full text-gray-900 w-full focus:outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-inner font-medium" 
              />
            </div>
            <button 
              type="submit" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-black text-lg hover:bg-yellow-300 hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap shadow-md"
            >
              SUBSCRIBE 🔥
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-red-200/80">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default SubscribeWidget;
