import React from 'react';

interface AdSenseSlotProps {
  className?: string;
  slotId?: string;
}

// Component shell preserved for future legitimate ad integration
const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ className = '', slotId = 'auto' }) => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    return (
      <div className={`my-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center p-2 min-h-[50px] text-gray-400 text-xs ${className}`}>
        <span>Ad Placeholder ({slotId})</span>
      </div>
    );
  }

  // Empty in production - no ad scripts loaded
  return null;
};

export default AdSenseSlot;
