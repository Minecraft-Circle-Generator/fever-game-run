import React, { useRef, useEffect, useState } from 'react';
import postscribe from 'postscribe';

interface AdWrapperProps {
  scriptSrc: string;
  containerId?: string;
}

/**
 * Safely injects third-party ad scripts in a React SPA using postscribe.
 * Postscribe properly parses and executes document.write calls asynchronously
 * without wiping the React DOM.
 */
const AdWrapper: React.FC<AdWrapperProps> = ({ scriptSrc, containerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDev] = useState(import.meta.env.DEV);

  useEffect(() => {
    if (isDev) return;
    
    if (containerRef.current) {
      // Use postscribe to inject the script. This safely handles document.write
      // and ensures all chained scripts are fetched and executed in order.
      postscribe(
        containerRef.current,
        `<script data-cfasync="false" async src="${scriptSrc}"></script>`,
        {
          error: (e: any) => {
            console.error('Postscribe injection error:', e);
          }
        }
      );
    }
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
