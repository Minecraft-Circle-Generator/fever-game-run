import React, { useEffect, useRef, useState } from 'react';

/**
 * Native ad component - lazy loads via IntersectionObserver
 * Only loads when the element is about to enter the viewport
 */
const NativeAd: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (isDev || loaded || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loaded) {
          setLoaded(true);
          if (containerRef.current) {
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = 'https://pl29871294.effectivecpmnetwork.com/639a4c936d7c38df8d03c63b78071559/invoke.js';
            containerRef.current.appendChild(script);
          }
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isDev, loaded]);

  if (isDev) {
    return (
      <div className="my-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-3 min-h-[90px] text-gray-400 text-xs">
        Native Ad Placeholder
      </div>
    );
  }

  return (
    <div className="my-6" ref={containerRef}>
      <div id="container-639a4c936d7c38df8d03c63b78071559"></div>
    </div>
  );
};

export default NativeAd;
