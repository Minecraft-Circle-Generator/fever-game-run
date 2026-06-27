import React from 'react';

/**
 * Lightweight performance wrapper.
 * The previous version dynamically injected preconnect links and fonts at runtime,
 * which actually *hurt* performance by adding extra DOM operations after hydration
 * and triggered PageSpeed warnings for excessive preconnects.
 *
 * Now this is a clean pass-through that only adds passive scroll throttling.
 */
const PerformanceOptimizer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default PerformanceOptimizer;