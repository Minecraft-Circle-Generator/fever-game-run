import React from 'react';

interface AdSenseSlotProps {
  className?: string;
  slotId?: string;
}

const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ className = '', slotId = 'auto' }) => {
  // In production, once approved, you will inject the actual <ins> tag here.
  // For now, it displays a placeholder or stays invisible in prod to prepare the layout.
  
  return (
    <div className={`my-8 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center p-4 min-h-[100px] text-gray-400 text-sm overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2YxZjVmOSIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4=')] opacity-50"></div>
      <span className="relative z-10 bg-white/80 px-2 py-1 rounded">Advertisement ({slotId})</span>
    </div>
  );
};

export default AdSenseSlot;
