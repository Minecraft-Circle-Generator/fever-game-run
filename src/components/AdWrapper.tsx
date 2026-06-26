import React, { useRef, useEffect, useState } from 'react';

interface AdWrapperProps {
  scriptSrc: string;
  containerId?: string; 
}

/**
 * Safely injects third-party ad scripts in a React SPA using an iframe.
 * This completely isolates any document.write() calls so they don't wipe the main React DOM.
 */
const AdWrapper: React.FC<AdWrapperProps> = ({ scriptSrc, containerId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDev] = useState(import.meta.env.DEV);

  useEffect(() => {
    if (isDev) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    // Use a slight timeout to ensure React has fully mounted the iframe
    const timer = setTimeout(() => {
      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; }
            </style>
          </head>
          <body>
            ${containerId ? `<div id="${containerId}"></div>` : ''}
            <script data-cfasync="false" async src="${scriptSrc}"></script>
          </body>
        </html>
      `;
      
      try {
        doc.open();
        doc.write(html);
        doc.close();
      } catch (e) {
        console.error("Ad iframe injection failed:", e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scriptSrc, containerId, isDev]);

  if (isDev) {
    return (
      <div className="my-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-3 text-gray-400 text-xs">
        Ad Placeholder ({containerId ? 'Native' : 'Pop-under'})
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-4">
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width="100%"
        height={containerId ? "300" : "0"} // Native ads need height, pop-unders can be 0
        style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </div>
  );
};

export default AdWrapper;
