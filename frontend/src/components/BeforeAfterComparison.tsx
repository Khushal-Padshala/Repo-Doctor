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
      className="relative rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-7 shadow-xs text-slate-900"
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          aria-label="Close comparison"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>REPOSITORY HEALTH PROGRESSION</span>
            <span>·</span>
            <span>
              {resolvedCount} {resolvedCount === 1 ? 'Finding' : 'Findings'} Remediated
            </span>
          </div>
          {recentFixedTitle ? (
            <p className="text-base text-slate-900 font-bold mt-1">
              Patched: {recentFixedTitle}
            </p>
          ) : (
            <p className="text-xs text-slate-600 mt-1">
              Automated patch application succeeded with clean AST validation.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{pointsGained} Health Points</span>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE CARD */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              BEFORE REMEDIATION
            </span>
            <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              Grade {beforeGrade}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-700">{beforeScore}</span>
            <span className="font-mono text-xs text-slate-400">/ 100</span>
            <span className="ml-auto text-xs text-slate-500 font-medium">
              {beforeActiveIssues} findings
            </span>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="rounded-lg bg-slate-50 border border-slate-200 py-1.5">
              <span className="font-bold text-slate-800 block">{beforeBreakdown?.critical ?? 0}</span>
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Critical</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 py-1.5">
              <span className="font-bold text-slate-800 block">{beforeBreakdown?.high ?? 0}</span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase">High</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 py-1.5">
              <span className="font-bold text-slate-800 block">{beforeBreakdown?.medium ?? 0}</span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase">Med</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 py-1.5">
              <span className="font-bold text-slate-800 block">{beforeBreakdown?.low ?? 0}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Low</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              AFTER REMEDIATION
            </span>
            <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-xs font-bold">
              Grade {afterGrade}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{afterScore}</span>
            <span className="font-mono text-xs text-slate-500">/ 100</span>
            <span className="ml-auto text-xs text-emerald-700 font-bold">
              {afterActiveIssues} remaining ({resolvedCount} fixed)
            </span>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="rounded-lg bg-white border border-emerald-200 py-1.5">
              <span className="font-bold text-slate-900 block">{afterBreakdown?.critical ?? 0}</span>
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Critical</span>
            </div>
            <div className="rounded-lg bg-white border border-emerald-200 py-1.5">
              <span className="font-bold text-slate-900 block">{afterBreakdown?.high ?? 0}</span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase">High</span>
            </div>
            <div className="rounded-lg bg-white border border-emerald-200 py-1.5">
              <span className="font-bold text-slate-900 block">{afterBreakdown?.medium ?? 0}</span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase">Med</span>
            </div>
            <div className="rounded-lg bg-white border border-emerald-200 py-1.5">
              <span className="font-bold text-slate-900 block">{afterBreakdown?.low ?? 0}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
