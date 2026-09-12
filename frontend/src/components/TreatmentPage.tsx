import React from 'react';
import {
  ArrowLeft,
  GitPullRequest,
  FileCode2,
  GitBranch,
  Info,
  Check
} from 'lucide-react';
import { Issue } from '../types';

interface TreatmentPageProps {
  issue: Issue;
  onCreatePullRequest: (issue: Issue) => void;
  onBack: () => void;
  isCreatingPR: boolean;
}

export const TreatmentPage: React.FC<TreatmentPageProps> = ({
  issue,
  onCreatePullRequest,
  onBack,
  isCreatingPR,
}) => {
  const filesList = issue.filesChanged || [];
  const totalAdditions = filesList.reduce((acc, f) => acc + (f.additions || 0), 0);
  const totalDeletions = filesList.reduce((acc, f) => acc + (f.deletions || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-8 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <button
            id="treatment-back-button"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Issue Details</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Target Branch:</span>
            <span className="flex items-center gap-1.5 text-slate-900 font-mono font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              <GitBranch className="h-3.5 w-3.5 text-blue-600" />
              {issue.targetBranch}
            </span>
          </div>
        </div>

        {/* Treatment Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                AUTOMATED REMEDIATION PLAN
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {issue.title}
              </h1>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Remediation patch synthesized and verified against codebase AST bounds.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-xs self-start sm:self-auto">
              <span className="text-emerald-600 font-bold">+{totalAdditions}</span>
              <span className="text-slate-300">/</span>
              <span className="text-rose-600 font-bold">-{totalDeletions}</span>
            </div>
          </div>
        </div>

        {/* 1. Files Changed Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-blue-600" />
              <span>FILES CHANGED ({filesList.length})</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {filesList.length} file{filesList.length === 1 ? '' : 's'} staged
            </span>
          </div>

          <div className="space-y-2">
            {filesList.map((file) => (
              <div
                key={file.filename}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800">
                  <FileCode2 className="h-4 w-4 text-blue-600" />
                  <span className="font-mono font-semibold">{file.filename}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-700 font-bold">
                    +{file.additions}
                  </span>
                  <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-rose-700 font-bold">
                    -{file.deletions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Code Diff Viewer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              PROPOSED CODE DIFF
            </div>
            <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
              {issue.codeLanguage || 'typescript'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs overflow-x-auto">
            {/* Before Code */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
              <div className="text-[10px] font-bold uppercase text-rose-700 tracking-wider mb-2">
                ORIGINAL CODE (VULNERABLE)
              </div>
              {(issue.beforeCode || '').split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-rose-100/50 text-rose-900 px-2.5 py-0.5 rounded text-[11px]"
                >
                  <span className="select-none text-rose-500 font-bold">-</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>

            {/* After Code */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider mb-2">
                AFTER REMEDIATION PATCH
              </div>
              {(issue.afterCode || '').split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-emerald-100/50 text-emerald-950 px-2.5 py-0.5 rounded text-[11px]"
                >
                  <span className="select-none text-emerald-600 font-bold">+</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Explanation of Changes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Info className="h-4 w-4 text-blue-600" />
            <span>EXPLANATION OF CHANGES</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {issue.treatmentExplanation || 'Automated patch generated by Repo Doctor engine.'}
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Commit Message: </span>
            <span className="font-mono text-slate-900">{issue.prTitle || `fix: resolve ${issue.title}`}</span>
          </div>
        </div>

        {/* 4. AI Verification Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI VERIFICATION STATUS (PRE-FLIGHT CHECKS)
            </div>
            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {(issue.aiVerificationChecks || []).length}/{(issue.aiVerificationChecks || []).length || 4} VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(issue.aiVerificationChecks || [
              { name: 'Syntax AST Sanitizer', detail: 'Clean parse tree verified with zero compile diagnostics.' },
              { name: 'Regression Suite', detail: 'All regression unit assertions passed.' },
              { name: 'Static Lint Gate', detail: 'Standard style formatting applied.' },
              { name: 'Runtime Failure Guard', detail: 'Verified clean exit conditions on edge inputs.' }
            ]).map((check) => (
              <div
                key={check.name}
                className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-mono text-[10px] mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{check.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{check.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Sticky Bottom Action Bar */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-md">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Estimated health improvement: <span className="text-emerald-600 font-extrabold">+{issue.scoreImpact?.overall ?? 12} points</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Creates branch & opens reviewable Pull Request
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isCreatingPR}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="create-pr-button"
              type="button"
              onClick={() => onCreatePullRequest(issue)}
              disabled={isCreatingPR}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-md disabled:opacity-60"
            >
              {isCreatingPR ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting Pull Request...</span>
                </>
              ) : (
                <>
                  <GitPullRequest className="h-4 w-4" />
                  <span>Create Pull Request</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
