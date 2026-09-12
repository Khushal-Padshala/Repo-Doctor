import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ImprovementComparisonSection: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F]/60 px-4 py-1.5 font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>MEASURABLE OUTCOMES</span>
          </div>
          <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
            REPOSITORY IMPROVEMENT
          </h2>
          <p className="mt-3 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70 leading-relaxed">
            See the quantifiable delta when automated AI treatments resolve critical vulnerabilities and architectural debt.
          </p>
        </div>

        {/* Before vs After Visual Comparison Banner */}
        <div className="relative rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-12 overflow-hidden">
          {/* Subtle mauve background accent */}
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#B47A9A]/5 blur-3xl" />

          {/* Central "+17 Health Points" Callout Badge */}
          <div className="mb-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-6 py-2.5 shadow-xl">
              <span className="h-2 w-2 rounded-full bg-[#B47A9A] animate-pulse" />
              <span className="font-urbanist text-sm sm:text-base font-extrabold tracking-wider uppercase text-[#B47A9A]">
                +17 HEALTH POINTS
              </span>
            </div>
          </div>

          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
            {/* BEFORE CARD */}
            <div className="rounded-3xl border border-[#5E3A5C]/60 bg-[#00030E] p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#5E3A5C]/40 mb-6">
                  <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC]/50">
                    BEFORE SCAN
                  </span>
                  <span className="rounded-full bg-[#8A334E]/20 border border-[#8A334E]/50 px-3 py-1 font-urbanist text-xs font-bold uppercase text-[#F3E9EC]">
                    GRADE C+
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-urbanist text-6xl sm:text-7xl font-extrabold text-[#F3E9EC]/70">
                    67
                  </span>
                  <span className="font-urbanist text-xl text-[#F3E9EC]/40 font-medium">/ 100</span>
                </div>

                <div className="flex items-center gap-2 text-[#8A334E] font-urbanist text-xs font-semibold uppercase tracking-wider mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <span>10 ACTIVE FINDINGS</span>
                </div>

                {/* Sub metrics */}
                <div className="space-y-3 pt-4 border-t border-[#5E3A5C]/40 font-urbanist text-xs text-[#F3E9EC]/70">
                  <div className="flex justify-between">
                    <span>Security Dimension</span>
                    <span className="font-semibold text-[#F3E9EC]">{`52%`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Quality Dimension</span>
                    <span className="font-semibold text-[#F3E9EC]">{`68%`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CI/CD Pipeline Security</span>
                    <span className="font-semibold text-[#F3E9EC]">{`60%`}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#5E3A5C]/40 font-urbanist text-xs text-[#F3E9EC]/50">
                Exposure to vulnerable credentials & unpinned dependencies
              </div>
            </div>

            {/* AFTER CARD */}
            <div className="rounded-3xl border border-[#B47A9A] bg-gradient-to-b from-[#2C1B2F] to-[#0B0E1A] p-7 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#5E3A5C]/60 mb-6">
                  <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
                    AFTER AI REMEDIATION
                  </span>
                  <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-1 font-urbanist text-xs font-bold uppercase text-[#B47A9A]">
                    GRADE B+
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-urbanist text-6xl sm:text-7xl font-extrabold text-[#F3E9EC]">
                    84
                  </span>
                  <span className="font-urbanist text-xl text-[#B47A9A]/60 font-medium">/ 100</span>
                </div>

                <div className="flex items-center gap-2 text-[#B47A9A] font-urbanist text-xs font-semibold uppercase tracking-wider mb-6">
                  <ShieldCheck className="h-4 w-4" />
                  <span>4 FINDINGS (RESOLVED 6 CRITICAL RISKS)</span>
                </div>

                {/* Sub metrics */}
                <div className="space-y-3 pt-4 border-t border-[#5E3A5C]/60 font-urbanist text-xs text-[#F3E9EC]/90">
                  <div className="flex justify-between">
                    <span>Security Dimension</span>
                    <span className="font-bold text-[#B47A9A]">88% (+36%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Quality Dimension</span>
                    <span className="font-bold text-[#B47A9A]">82% (+14%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CI/CD Pipeline Security</span>
                    <span className="font-bold text-[#B47A9A]">90% (+30%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#5E3A5C]/60 font-urbanist text-xs text-[#B47A9A] font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified with AST test suite & reproducible CI checks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
