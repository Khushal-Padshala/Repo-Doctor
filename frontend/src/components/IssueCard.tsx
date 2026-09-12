import React, { useState } from 'react';
import {
  FileCode,
  ArrowRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Issue, IssueSeverity } from '../types';

interface IssueCardProps {
  issue: Issue;
  onViewFix: (issue: Issue) => void;
}

const SEVERITY_CONFIG: Record<
  IssueSeverity,
  {
    label: string;
    badgeBg: string;
    border: string;
    tagClass: string;
  }
> = {
  critical: {
    label: 'CRITICAL',
    badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    border: 'border-rose-200 hover:border-rose-400',
    tagClass: 'text-rose-600',
  },
  high: {
    label: 'HIGH',
    badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    border: 'border-amber-200 hover:border-amber-400',
    tagClass: 'text-amber-600',
  },
  medium: {
    label: 'MEDIUM',
    badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    border: 'border-slate-200 hover:border-blue-400',
    tagClass: 'text-blue-600',
  },
  low: {
    label: 'LOW',
    badgeBg: 'bg-slate-100 text-slate-600 border border-slate-200',
    border: 'border-slate-200 hover:border-slate-300',
    tagClass: 'text-slate-600',
  },
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewFix }) => {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const config = SEVERITY_CONFIG[issue.severity];

  return (
    <div
      id={`issue-card-${issue.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-6 sm:p-7 transition duration-200 shadow-xs hover:shadow-md ${
        issue.isResolved
          ? 'border-slate-200 bg-slate-50/50'
          : config.border
      }`}
    >
      <div>
        {/* Top Tagline / Category & Severity */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-[11px]">
            {/* Severity Pill */}
            <span
              className={`rounded-lg px-2.5 py-0.5 uppercase tracking-wider font-bold ${config.badgeBg}`}
            >
              {config.label}
            </span>

            {/* Category Pill */}
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-600 uppercase tracking-wider font-semibold">
              {issue.category}
            </span>

            {/* Quick Fix Pill */}
            {issue.isQuickFix && !issue.isResolved && (
              <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-blue-600 font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                <Zap className="h-3 w-3 fill-current text-blue-600" />
                <span>QUICK FIX</span>
              </span>
            )}
          </div>

          {/* Status or Issue ID */}
          {issue.isResolved ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Fixed in PR #{issue.prNumber || '142'}
            </span>
          ) : (
            <span className="font-mono text-xs text-slate-600">
              {issue.id}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
          {issue.title}
        </h4>

        {/* Short description */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {issue.shortExplanation}
        </p>

        {/* File & Line Range */}
        <div className="mt-3.5 flex items-center gap-2 font-mono text-xs text-slate-600">
          <FileCode className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="text-slate-900 font-medium truncate">
            {issue.affectedFile}
          </span>
          <span className="text-slate-300">:</span>
          <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-700 font-semibold">
            {issue.lineNumber}
          </span>
        </div>

        {/* Expandable Editorial Section */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                Verification Score: <strong className="text-slate-900 font-bold">{issue.aiConfidence || 98}%</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition tracking-wider cursor-pointer"
            >
              <span>{isAnalysisExpanded ? 'Hide Details' : 'View Audit Details'}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 text-slate-500 ${
                  isAnalysisExpanded ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>
          </div>

          {/* Expanded Analysis Details */}
          {isAnalysisExpanded && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Audit Analysis & Recommendation
                </span>
              </div>

              {/* Bulleted Evidence */}
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {issue.whyFlagged && issue.whyFlagged.length > 0 ? (
                  issue.whyFlagged.map((reason, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span>{reason}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="leading-relaxed">
                      <span>Vulnerability / hygiene defect detected by deterministic scanner.</span>
                    </li>
                    <li className="leading-relaxed">
                      <span>Remediation patch generated and verified against codebase AST syntax.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          Impact: <span className="text-emerald-600 font-bold">+{issue.scoreImpact?.overall ?? 10} health pts</span>
        </div>

        <button
          id={`view-fix-btn-${issue.id}`}
          onClick={() => onViewFix(issue)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition duration-150 cursor-pointer shadow-xs ${
            issue.isResolved
              ? 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <span>{issue.isResolved ? 'Inspect Patch' : 'View Fix'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
