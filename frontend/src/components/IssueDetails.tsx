import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileCode,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Issue } from '../types';

interface IssueDetailsProps {
  issue: Issue;
  onApplyFix: (issue: Issue) => void;
  onBack: () => void;
}

export const IssueDetails: React.FC<IssueDetailsProps> = ({
  issue,
  onApplyFix,
  onBack,
}) => {
  const [copiedFile, setCopiedFile] = useState(false);

  const handleCopyFile = () => {
    navigator.clipboard.writeText(`${issue.affectedFile}:${issue.lineNumber}`);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 1800);
  };

  const getSeverityBadge = () => {
    switch (issue.severity) {
      case 'critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'CRITICAL',
        };
      case 'high':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'HIGH',
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'MEDIUM',
        };
      case 'low':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'LOW',
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-8 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <button
            id="issue-details-back-button"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`rounded-lg border px-2.5 py-0.5 font-bold uppercase tracking-wider ${badge.bg}`}
            >
              {badge.label}
            </span>
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-slate-600 font-mono font-semibold">
              {issue.id}
            </span>
          </div>
        </div>

        {/* Issue Header Title */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
            DIAGNOSTIC DEEP DIVE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-slate-900 font-semibold">{issue.affectedFile}</span>
              <span className="text-slate-300">:</span>
              <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-slate-700">
                {issue.lineNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyFile}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition cursor-pointer text-xs"
            >
              {copiedFile ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied path</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy reference</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. Problem Statement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            What is the issue?
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {issue.problem || issue.shortExplanation}
          </p>
        </div>

        {/* 2. Why It Matters */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 sm:p-8 shadow-xs space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
            Why does this matter?
          </h3>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {issue.whyItMatters}
          </p>
        </div>

        {/* 3. Affected Code Block */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Affected Code Context
            </h3>
            <span className="text-[11px] font-mono text-slate-500">{issue.affectedFile}</span>
          </div>

          <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
            <code>{issue.affectedCode}</code>
          </pre>
        </div>

        {/* 4. Action Footer */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-md">
          <div>
            <span className="text-xs text-slate-500 font-medium">Estimated Score Recovery:</span>
            <div className="text-sm font-extrabold text-emerald-600">
              +{issue.scoreImpact?.overall ?? 12} Health Points
            </div>
          </div>

          <button
            id="apply-fix-button"
            type="button"
            onClick={() => onApplyFix(issue)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-sm"
          >
            <span>Apply Remediation Patch</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
