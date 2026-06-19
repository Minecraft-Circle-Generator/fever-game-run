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
      // 确保不会重复加载
      if (containerRef.current.innerHTML !== '') return;
      
      const containerDiv = document.createElement('div');
      containerDiv.id = 'container-247c4fee71f83bc7365fec29c49eddbf';
      containerRef.current.appendChild(containerDiv);

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl29710316.effectivecpmnetwork.com/247c4fee71f83bc7365fec29c49eddbf/invoke.js';
      
      containerRef.current.appendChild(script);
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
