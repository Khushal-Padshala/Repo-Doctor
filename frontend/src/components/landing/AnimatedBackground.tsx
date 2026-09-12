import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Subtle developer grid */}
      <div className="absolute inset-0 repo-grid opacity-70" />

      {/* Subtle radial ambient mauve/purple gradients */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#B47A9A]/[0.08] via-[#5E3A5C]/[0.04] to-transparent blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#5E3A5C]/[0.06] to-transparent blur-3xl" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#2C1B2F]/[0.08] to-transparent blur-3xl" />

      {/* Top light beam accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#B47A9A]/30 to-transparent" />
    </div>
  );
};
