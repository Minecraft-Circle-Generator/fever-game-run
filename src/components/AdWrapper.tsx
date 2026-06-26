import React, { useEffect, useRef, useState } from 'react';

interface AdWrapperProps {
  scriptSrc: string;
  containerId?: string; // If provided, creates a div with this ID for native ads
}

/**
 * Safely injects third-party ad scripts in a React SPA.
 * Prevents document.write() wiping and React hydration errors
 * by injecting only after mount and via direct DOM manipulation.
 */
const AdWrapper: React.FC<AdWrapperProps> = ({ scriptSrc, containerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // In dev mode, or if already loaded, do nothing
    if (isDev || loaded) return;
    
    // Safety check for SSR / testing
    if (typeof document === 'undefined') return;

    setLoaded(true);

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    // Determine where to mount the script
    const target = containerRef.current || document.body;
    
    try {
      target.appendChild(script);
    } catch (e) {
      console.error('Ad injection failed:', e);
    }

    return () => {
      // Clean up the script when the component unmounts
      if (target && script.parentNode === target) {
        target.removeChild(script);
      }
    };
  }, [scriptSrc, loaded, isDev]);

  if (isDev) {
    return (
      <div className="my-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-3 text-gray-400 text-xs">
        Ad Placeholder ({containerId ? 'Native' : 'Pop-under'})
      </div>
    );
  }

  return (
    <div ref={containerRef} className="ad-wrapper-container w-full">
      {containerId && <div id={containerId}></div>}
    </div>
  );
};

export default AdWrapper;
