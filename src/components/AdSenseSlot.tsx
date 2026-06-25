import React, { useEffect, useRef } from 'react';

interface AdSenseSlotProps {
  className?: string;
  slotId?: string;
}

const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ className = '', slotId = 'auto' }) => {
  const isDev = import.meta.env.DEV;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDev && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            // We are deliberately keeping this container empty because the 
            // EffectiveCPM network scripts (pl29871294, etc.) are deceptive 
            // click-hijackers. We will wait for Google AdSense or a better 
            // ad network to populate this space.
            if (containerRef.current && containerRef.current.innerHTML === '') {
              const containerDiv = document.createElement('div');
              containerDiv.className = "p-4 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded";
              containerDiv.innerText = "Premium Ad Space Available";
              containerRef.current.appendChild(containerDiv);
            }
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        },
        { rootMargin: '200px' } // 提前 200px 加载
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isDev]);

  if (isDev) {
    return (
      <div className={`my-8 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center p-4 min-h-[100px] text-gray-400 text-sm overflow-hidden relative ${className}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2YxZjVmOSIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')] opacity-50"></div>
        <span className="relative z-10 bg-white/80 px-2 py-1 rounded">Advertisement ({slotId})</span>
      </div>
    );
  }

  return (
    <div className={`my-8 text-center min-h-[100px] flex justify-center overflow-hidden ${className}`} ref={containerRef}>
    </div>
  );
};

export default AdSenseSlot;
