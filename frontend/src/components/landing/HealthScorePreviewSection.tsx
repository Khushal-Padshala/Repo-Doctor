import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export const HealthScorePreviewSection: React.FC = () => {
  const [isRemediated, setIsRemediated] = useState(false);

  // States
  const score = isRemediated ? 84 : 67;
  const grade = isRemediated ? 'GRADE B+' : 'GRADE C+';
  const findings = isRemediated ? '4 ACTIVE FINDINGS' : '10 ACTIVE FINDINGS';
  const statusLabel = isRemediated ? 'OPTIMAL' : 'REQUIRES ATTENTION';
  const statusColor = isRemediated ? 'text-[#B47A9A]' : 'text-[#B47A9A]/70';
  const gradeBadgeBg = isRemediated
    ? 'bg-[#2C1B2F] border-[#5E3A5C] text-[#B47A9A]'
    : 'bg-[#2C1B2F]/40 border-[#5E3A5C]/60 text-[#F3E9EC]/70';

  const dimensions = [
    { name: 'SECURITY', before: 52, after: 88 },
    { name: 'CODE QUALITY', before: 68, after: 82 },
    { name: 'GIT HYGIENE', before: 70, after: 85 },
    { name: 'DOCUMENTATION', before: 75, after: 90 },
    { name: 'TESTING', before: 60, after: 78 },
    { name: 'CI/CD', before: 65, after: 90 }
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60 bg-[#0B0E1A]">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#5E3A5C]/60">
          <div>
            <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
              Repository Diagnostics
            </div>
            <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
              REPOSITORY HEALTH SCORE
            </h2>
            <p className="mt-2 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70">
              Interactive preview of the health score diagnostic engine and real-time improvement simulation.
            </p>
          </div>

          {/* Interactive Simulation Switcher */}
          <div className="inline-flex rounded-full border border-[#5E3A5C] bg-[#00030E] p-1 self-start sm:self-auto">
            <button
              onClick={() => setIsRemediated(false)}
              className={`rounded-full px-4 py-2 font-urbanist text-xs font-semibold uppercase tracking-wider transition ${
                !isRemediated
                  ? 'bg-[#2C1B2F] text-[#F3E9EC] shadow-md border border-[#5E3A5C]'
                  : 'text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
              }`}
            >
              Initial Scan (67)
            </button>
            <button
              onClick={() => setIsRemediated(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-urbanist text-xs font-semibold uppercase tracking-wider transition ${
                isRemediated
                  ? 'bg-[#2C1B2F] text-[#B47A9A] border border-[#5E3A5C] shadow-md'
                  : 'text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
              }`}
            >
              <Sparkles className="h-3 w-3 text-[#B47A9A]" />
              <span>After AI Fixes (84)</span>
            </button>
          </div>
        </div>

        {/* Interactive Score Display Card */}
        <div className="mt-10 rounded-3xl border border-[#5E3A5C] bg-[#00030E] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Big Score Hero */}
            <div className="lg:col-span-5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#5E3A5C]/60 pb-8 lg:pb-0 lg:pr-10">
              <div className="flex items-center gap-3">
                <span className={`inline-block h-2 w-2 rounded-full ${isRemediated ? 'bg-[#B47A9A] animate-pulse' : 'bg-[#8A334E]'}`} />
                <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
                  OVERALL HEALTH SCORE
                </span>
              </div>

              {/* Huge animated score digits */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-urbanist text-7xl sm:text-8xl font-extrabold tracking-tight text-[#F3E9EC] transition-all duration-500">
                  {score}
                </span>
                <span className="font-urbanist text-2xl sm:text-3xl text-[#B47A9A]/60 font-medium">
                  / 100
                </span>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3.5 py-1 font-urbanist text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${gradeBadgeBg}`}>
                  {grade}
                </span>
                <span className="rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3.5 py-1 font-urbanist text-xs font-semibold tracking-wider uppercase text-[#F3E9EC]/80">
                  {findings}
                </span>
                <span className={`font-urbanist text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between font-urbanist text-xs text-[#F3E9EC]/70">
                  <span>Aggregate Health Index</span>
                  <span className="font-semibold text-[#F3E9EC]">{score}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#0B0E1A] overflow-hidden border border-[#5E3A5C]/40">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isRemediated ? 'bg-[#B47A9A]' : 'bg-[#8A334E]'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Score Shift Notice */}
              <div className="mt-6 rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-3.5 flex items-center justify-between">
                <span className="font-urbanist text-xs text-[#F3E9EC]/70">Remediation Delta</span>
                <span className="font-urbanist text-xs font-bold text-[#B47A9A] flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+17 pts potential gain</span>
                </span>
              </div>
            </div>

            {/* Right Dimension Breakdown */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#5E3A5C]/60">
                <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
                  HEALTH DIMENSIONS BREAKDOWN
                </span>
                <span className="font-urbanist text-xs text-[#F3E9EC]/60">
                  {isRemediated ? 'Optimized projection' : 'Current scan status'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dimensions.map((dim) => {
                  const val = isRemediated ? dim.after : dim.before;
                  return (
                    <div
                      key={dim.name}
                      className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-4 transition-all hover:border-[#B47A9A]"
                    >
                      <div className="flex items-center justify-between font-urbanist text-xs mb-2">
                        <span className="font-bold uppercase tracking-wider text-[#F3E9EC]">
                          {dim.name}
                        </span>
                        <span className="font-semibold text-[#F3E9EC]">{val}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#00030E] overflow-hidden border border-[#5E3A5C]/40">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            val >= 80 ? 'bg-[#B47A9A]' : val >= 65 ? 'bg-[#5E3A5C]' : 'bg-[#8A334E]'
                          }`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between font-urbanist text-[11px] text-[#F3E9EC]/50">
                        <span>{dim.before}% scan baseline</span>
                        {isRemediated && (
                          <span className="text-[#B47A9A] font-semibold">
                            +{dim.after - dim.before}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
