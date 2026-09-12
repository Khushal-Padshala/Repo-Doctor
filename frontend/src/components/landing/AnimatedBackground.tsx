import React from 'react';
import { MystifyCanvas } from './MystifyCanvas';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* 1. Interactive Windows Mystify Single Splitting Blue Ribbon Canvas */}
      <MystifyCanvas />

      {/* 2. Subtle developer dot matrix grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3. Subtle radial ambient blue/slate gradients */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-100/30 via-slate-100/15 to-transparent blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-50/40 to-transparent blur-3xl" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-slate-100/40 to-transparent blur-3xl" />

      {/* 4. Top light beam accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
    </div>
  );
};
