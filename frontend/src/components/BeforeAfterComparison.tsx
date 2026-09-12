import React from 'react';
import {
  TrendingUp,
  X,
  CheckCircle2,
} from 'lucide-react';
import { ImprovementComparison } from '../types';

interface BeforeAfterComparisonProps {
  comparison: ImprovementComparison;
  onDismiss?: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  comparison,
  onDismiss,
}) => {
  const {
    beforeScore,
    beforeGrade,
    beforeActiveIssues,
    beforeBreakdown,
    afterScore,
    afterGrade,
    afterActiveIssues,
    afterBreakdown,
    resolvedCount,
    pointsGained,
    recentFixedTitle,
  } = comparison;

  return (
    <div
      id="before-after-comparison-banner"
      className="relative rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 sm:p-8 shadow-xl"
    >
      {/* Dismiss button if modal/dismissible */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#F3E9EC]/70 hover:bg-[#2C1B2F] hover:text-[#F3E9EC] transition"
          aria-label="Close comparison"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#5E3A5C]/40 pb-6">
        <div>
          <div className="flex items-center gap-2 font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
            <span>REPOSITORY HEALTH IMPROVEMENT</span>
            <span className="text-[#5E3A5C]">·</span>
            <span className="text-[#F3E9EC]">
              {resolvedCount} {resolvedCount === 1 ? 'Issue' : 'Issues'} Resolved
            </span>
          </div>
          {recentFixedTitle ? (
            <p className="text-base text-[#F3E9EC] font-bold font-urbanist mt-1">
              Remediated: {recentFixedTitle}
            </p>
          ) : (
            <p className="text-sm text-[#F3E9EC]/70 font-urbanist mt-1">
              Automated patch application succeeded without regressions.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-[#B47A9A] px-4 py-1.5 font-urbanist text-xs font-bold text-[#00030E] shadow-lg">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{pointsGained} Health Points</span>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE CARD */}
        <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/20 p-5">
          <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-3 mb-4">
            <span className="text-xs font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]/70">
              BEFORE REMEDIATIONS
            </span>
            <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 font-urbanist text-xs font-bold text-[#F3E9EC]">
              Grade {beforeGrade}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold font-urbanist text-[#F3E9EC]/80">{beforeScore}</span>
            <span className="font-mono text-xs text-[#F3E9EC]/40">/ 100</span>
            <span className="ml-auto font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
              {beforeActiveIssues} active findings
            </span>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center font-urbanist text-xs">
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{beforeBreakdown?.critical ?? 0}</span>
              <span className="text-[10px] text-[#8A334E] font-medium uppercase">Critical</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{beforeBreakdown?.high ?? 0}</span>
              <span className="text-[10px] text-[#B47A9A] font-medium uppercase">High</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{beforeBreakdown?.medium ?? 0}</span>
              <span className="text-[10px] text-[#F3E9EC]/70 font-medium uppercase">Medium</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{beforeBreakdown?.low ?? 0}</span>
              <span className="text-[10px] text-[#F3E9EC]/50 font-medium uppercase">Low</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="rounded-2xl border border-[#B47A9A]/60 bg-[#2C1B2F]/40 p-5">
          <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-3 mb-4">
            <span className="text-xs font-urbanist font-bold uppercase tracking-wider text-[#B47A9A] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B47A9A]" />
              AFTER REMEDIATIONS
            </span>
            <span className="rounded-full bg-[#B47A9A] text-[#00030E] px-2.5 py-0.5 font-urbanist text-xs font-bold">
              Grade {afterGrade}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold font-urbanist text-[#F3E9EC]">{afterScore}</span>
            <span className="font-mono text-xs text-[#F3E9EC]/40">/ 100</span>
            <span className="ml-auto font-urbanist text-xs text-[#B47A9A] font-bold">
              {afterActiveIssues} remaining ({resolvedCount} fixed)
            </span>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center font-urbanist text-xs">
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{afterBreakdown?.critical ?? 0}</span>
              <span className="text-[10px] text-[#8A334E] font-medium uppercase">Critical</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{afterBreakdown?.high ?? 0}</span>
              <span className="text-[10px] text-[#B47A9A] font-medium uppercase">High</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{afterBreakdown?.medium ?? 0}</span>
              <span className="text-[10px] text-[#F3E9EC]/70 font-medium uppercase">Medium</span>
            </div>
            <div className="rounded-xl bg-[#0B0E1A] border border-[#5E3A5C] py-2">
              <span className="font-bold text-[#F3E9EC] block">{afterBreakdown?.low ?? 0}</span>
              <span className="text-[10px] text-[#F3E9EC]/50 font-medium uppercase">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
