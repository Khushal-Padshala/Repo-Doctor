import React, { useState } from 'react';
import { Shield, GitBranch, Workflow, CheckCircle2, Lock, Sparkles, Terminal } from 'lucide-react';

export const LandingHeroVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#B47A9A]/15 via-[#5E3A5C]/10 to-transparent blur-3xl" />

      {/* 1. Outer Orbit Ring with Coordinates */}
      <div className="absolute inset-2 sm:inset-4 rounded-full border border-[#5E3A5C]/60 animate-orbit-spin">
        {/* Orbit Node: Security */}
        <div
          onMouseEnter={() => setActiveNode('security')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1 text-xs text-[#F3E9EC] shadow-lg backdrop-blur-md cursor-pointer transition hover:scale-105 hover:border-[#B47A9A]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A] animate-pulse" />
          <Shield className="h-3.5 w-3.5 text-[#B47A9A]" />
          <span className="font-urbanist font-medium tracking-wide">0 CVEs Found</span>
        </div>

        {/* Orbit Node: CI/CD */}
        <div
          onMouseEnter={() => setActiveNode('cicd')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1 text-xs text-[#F3E9EC] shadow-lg backdrop-blur-md cursor-pointer transition hover:scale-105 hover:border-[#B47A9A]"
        >
          <Workflow className="h-3.5 w-3.5 text-[#B47A9A]" />
          <span className="font-urbanist font-medium tracking-wide">Action SHAs Pinned</span>
        </div>
      </div>

      {/* 2. Middle Orbit Ring (Reversing) */}
      <div className="absolute inset-12 sm:inset-16 rounded-full border border-dashed border-[#5E3A5C]/40 animate-orbit-reverse">
        {/* Orbit Node: Git Hygiene */}
        <div
          onMouseEnter={() => setActiveNode('hygiene')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-1/2 -left-3.5 -translate-y-1/2 flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1 text-xs text-[#F3E9EC] shadow-lg cursor-pointer transition hover:scale-105 hover:border-[#B47A9A]"
        >
          <GitBranch className="h-3.5 w-3.5 text-[#B47A9A]" />
          <span className="font-urbanist font-medium tracking-wide">Branch Protected</span>
        </div>

        {/* Orbit Node: AST Health */}
        <div
          onMouseEnter={() => setActiveNode('quality')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-1/2 -right-3.5 -translate-y-1/2 flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1 text-xs text-[#F3E9EC] shadow-lg cursor-pointer transition hover:scale-105 hover:border-[#B47A9A]"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-[#B47A9A]" />
          <span className="font-urbanist font-medium tracking-wide">AST Verified</span>
        </div>
      </div>

      {/* 3. Inner Diagnostic Shield Core */}
      <div className="relative z-10 flex flex-col items-center justify-center h-48 w-48 sm:h-56 sm:w-56 rounded-full border border-[#5E3A5C] bg-gradient-to-b from-[#2C1B2F] via-[#0B0E1A] to-[#00030E] p-6 shadow-2xl animate-float-gentle">
        {/* Radar Scanner Line */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(180,122,154,0.15)_360deg)] animate-orbit-spin" />
          <div className="absolute inset-0 rounded-full border border-[#5E3A5C]/40" />
        </div>

        {/* Central Brand Badge */}
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F] text-[#B47A9A] shadow-inner mb-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="font-urbanist text-xs font-semibold uppercase tracking-wider text-[#B47A9A]">
            Health Score
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-urbanist text-3xl sm:text-4xl font-bold tracking-tight text-[#F3E9EC]">
              88
            </span>
            <span className="font-urbanist text-xs text-[#B47A9A]/70 font-medium">/ 100</span>
          </div>

          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[11px] font-urbanist font-semibold text-[#B47A9A]">
            Grade A- · Optimal
          </div>
        </div>
      </div>

      {/* Floating Code Snippet Card - Bottom Right */}
      <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-0 z-20 max-w-[210px] rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A]/95 p-3 shadow-2xl backdrop-blur-md hidden sm:block">
        <div className="flex items-center gap-1.5 text-[10px] text-[#B47A9A] border-b border-[#5E3A5C]/60 pb-1.5 mb-1.5 font-urbanist font-medium">
          <Terminal className="h-3 w-3 text-[#B47A9A]" />
          <span>AST Remediation</span>
        </div>
        <div className="font-mono text-[10px] text-[#F3E9EC] leading-tight space-y-0.5">
          <div className="text-[#B47A9A]">+ jwt.verify(token, secret)</div>
          <div className="text-[#F3E9EC]/50">1-click PR generated</div>
        </div>
      </div>

      {/* Floating Status Pill - Top Left */}
      <div className="absolute -top-2 -left-2 sm:top-4 sm:left-0 z-20 rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A]/95 px-3.5 py-2 shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#B47A9A] animate-pulse" />
        <div className="font-urbanist text-xs text-[#F3E9EC]">
          <span className="font-semibold text-[#B47A9A]">Auto-Fix</span>: 4 issues
        </div>
      </div>
    </div>
  );
};
