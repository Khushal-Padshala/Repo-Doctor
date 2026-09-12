import React, { useState } from 'react';
import { Shield, GitBranch, Workflow, CheckCircle2, Terminal } from 'lucide-react';

export const LandingHeroVisual: React.FC = () => {
  const [, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* 1. Outer Orbit Ring (Radius ~248px, Inset 12px) */}
      <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-slate-400/85 shadow-sm animate-orbit-spin pointer-events-none">
        {/* Outer Orbit Node 1: 0 CVEs Found (Top) */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div
            onMouseEnter={() => setActiveNode('security')}
            onMouseLeave={() => setActiveNode(null)}
            className="animate-orbit-counter-spin flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-3.5 py-1.5 text-xs text-slate-800 shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Shield className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="font-bold tracking-tight whitespace-nowrap">0 CVEs Found</span>
          </div>
        </div>

        {/* Outer Orbit Node 2: Action SHAs Pinned (Bottom) */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div
            onMouseEnter={() => setActiveNode('cicd')}
            onMouseLeave={() => setActiveNode(null)}
            className="animate-orbit-counter-spin flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-3.5 py-1.5 text-xs text-slate-800 shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg"
          >
            <Workflow className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="font-bold tracking-tight whitespace-nowrap">Action SHAs Pinned</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Dashed Orbit Ring (Radius ~172px, exactly halfway between outer ring and center core with equal ~76px spacing on both sides) */}
      <div className="absolute inset-16 sm:inset-[74px] rounded-full border-2 border-dashed border-slate-400/85 animate-orbit-reverse pointer-events-none">
        {/* Middle Orbit Node 1: Branch Protected (Mounted directly on the dashed line, left side) */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div
            onMouseEnter={() => setActiveNode('hygiene')}
            onMouseLeave={() => setActiveNode(null)}
            className="animate-orbit-counter-reverse flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/95 px-3 py-1.5 text-xs text-slate-800 shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg"
          >
            <GitBranch className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="font-bold tracking-tight whitespace-nowrap">Branch Protected</span>
          </div>
        </div>

        {/* Middle Orbit Node 2: AST Verified (Mounted directly on the dashed line, right side) */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div
            onMouseEnter={() => setActiveNode('quality')}
            onMouseLeave={() => setActiveNode(null)}
            className="animate-orbit-counter-reverse flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/95 px-3 py-1.5 text-xs text-slate-800 shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="font-bold tracking-tight whitespace-nowrap">AST Verified</span>
          </div>
        </div>
      </div>

      {/* 3. Inner Diagnostic Shield Core (Radius ~96px, 192px diameter, centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-44 w-44 sm:h-48 sm:w-48 rounded-full border-2 border-slate-400/90 bg-white p-4 shadow-2xl shadow-slate-300/60 animate-float-gentle">
        {/* Radar Scanner Line */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(37,99,235,0.1)_360deg)] animate-orbit-spin" />
          <div className="absolute inset-0 rounded-full border border-slate-200" />
        </div>

        {/* Central Brand Badge */}
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-sm mb-1">
            <Shield className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Health Score
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
              88
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>

          {/* Green Mesh Gradient Grade Pill */}
          <div
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10.5px] font-bold text-white shadow-md shadow-emerald-900/20 border border-emerald-300/40 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, #065F46 0%, #059669 45%, #10B981 85%, #34D399 100%)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="drop-shadow-sm font-semibold">Grade A- · Optimal</span>
          </div>
        </div>
      </div>

      {/* Floating Code Snippet Card - Bottom Right (Dusk blue gradient with vibrant text) */}
      <div
        className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-0 z-20 max-w-[220px] rounded-2xl border border-white/20 p-3.5 shadow-2xl backdrop-blur-md hidden sm:block"
        style={{
          background: 'linear-gradient(135deg, #1C2B54 0%, #293D6E 50%, #475D8F 100%)',
        }}
      >
        <div className="flex items-center gap-1.5 text-[10px] text-cyan-200 border-b border-white/15 pb-1.5 mb-1.5 font-mono font-medium">
          <Terminal className="h-3 w-3 text-cyan-300" />
          <span>AST Remediation</span>
        </div>
        <div className="font-mono text-[10px] leading-tight space-y-1">
          <div className="text-emerald-300 font-semibold drop-shadow-sm">+ jwt.verify(token, secret)</div>
          <div className="text-slate-200/90 text-[9px]">1-click PR generated</div>
        </div>
      </div>
    </div>
  );
};
