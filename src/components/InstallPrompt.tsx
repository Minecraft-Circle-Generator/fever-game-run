import React, { useEffect, useState } from 'react';
import { X, Download, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS since iOS doesn't support beforeinstallprompt
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setShow(true), 3000); // show after 3s
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // For iOS, show a manual prompt if not installed and not dismissed
    if (isIosDevice && !(window.navigator as any).standalone) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setShow(true), 3000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Just dismiss the banner, iOS users have to do it manually
      handleDismiss();
      return;
    }
    
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    }
    setDeferredPrompt(null);
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 z-50 animate-[slideInUp_0.5s_ease-out]">
      <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
        <X size={16} />
      </button>
      <div className="flex items-start gap-4">
        <div className="bg-red-50 p-3 rounded-2xl text-red-600 shrink-0 mt-1">
          <Download size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-[15px]">Add to Home Screen</h4>
          <p className="text-[13px] text-gray-500 mt-1 mb-3 leading-relaxed">
            {isIOS 
              ? "Tap the Share button below and select 'Add to Home Screen' for instant access to live games."
              : "Install Fever Tracker for quick access to the latest games, stats, and videos!"}
          </p>
          
          {isIOS ? (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 py-2 rounded-lg border border-gray-100">
              Tap <Share size={14} className="text-blue-500" /> then Add to Home Screen
            </div>
          ) : (
            <button 
              onClick={handleInstall} 
              className="w-full bg-[#C8102E] text-white font-bold text-sm py-2.5 rounded-xl shadow-[0_4px_12px_rgba(200,16,46,0.25)] hover:shadow-[0_6px_16px_rgba(200,16,46,0.35)] hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
