import React, { useRef, useEffect, useState } from 'react';

interface AdWrapperProps {
  scriptSrc: string;
  containerId?: string;
}

/**
 * Safely injects third-party ad scripts in a React SPA.
 * Hooks document.write to prevent the ad script from wiping the main DOM.
 */
const AdWrapper: React.FC<AdWrapperProps> = ({ scriptSrc, containerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDev] = useState(import.meta.env.DEV);

  useEffect(() => {
    if (isDev) return;

    let isUnmounted = false;
    
    // Safely hook document.write
    const originalWrite = document.write;
    const originalWriteln = document.writeln;
    
    document.write = function (str: string) {
      if (!isUnmounted && containerRef.current) {
        // Append written HTML into our container instead of wiping the document
        containerRef.current.insertAdjacentHTML('beforeend', str);
      }
    };
    
    document.writeln = function (str: string) {
      if (!isUnmounted && containerRef.current) {
        containerRef.current.insertAdjacentHTML('beforeend', str + '<br/>');
      }
    };

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      isUnmounted = true;
      document.write = originalWrite;
      document.writeln = originalWriteln;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptSrc, isDev]);

  if (isDev) {
    return (
      <div className="my-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-3 text-gray-400 text-xs">
        Ad Placeholder
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-4 ad-wrapper-container" ref={containerRef}>
      {containerId && <div id={containerId}></div>}
    </div>
  );
};

export default AdWrapper;
