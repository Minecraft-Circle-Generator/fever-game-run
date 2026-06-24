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
            // 确保不会重复加载
            if (containerRef.current && containerRef.current.innerHTML === '') {
              const containerDiv = document.createElement('div');
              containerDiv.id = 'container-639a4c936d7c38df8d03c63b78071559';
              containerRef.current.appendChild(containerDiv);

              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.async = true;
              script.dataset.cfasync = 'false';
              script.src = 'https://pl29871294.effectivecpmnetwork.com/639a4c936d7c38df8d03c63b78071559/invoke.js';
              
              containerRef.current.appendChild(script);
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
