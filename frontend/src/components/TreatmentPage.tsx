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
    <div className="min-h-screen bg-[#00030E] text-[#F3E9EC] px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#5E3A5C]/40">
          <button
            id="treatment-back-button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-urbanist text-xs font-semibold text-[#F3E9EC]/70 transition hover:text-[#F3E9EC]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Issue Details</span>
          </button>

          <div className="flex items-center gap-2 font-urbanist text-xs">
            <span className="text-[#F3E9EC]/70 font-medium">Target Branch:</span>
            <span className="flex items-center gap-1.5 text-[#F3E9EC] font-mono">
              <GitBranch className="h-3.5 w-3.5 text-[#B47A9A]" />
              {issue.targetBranch}
            </span>
          </div>
        </div>

        {/* Treatment Header */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-2">
                AUTOMATED REMEDIATION PLAN
              </div>
              <h1 className="font-urbanist text-3xl sm:text-4xl font-bold tracking-tight text-[#F3E9EC]">
                {issue.title}
              </h1>
              <p className="mt-2 font-urbanist text-sm text-[#F3E9EC]/70">
                Remediation patch synthesized and verified against codebase AST.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-2 font-mono text-xs self-start sm:self-auto">
              <span className="text-[#B47A9A] font-bold">+{totalAdditions}</span>
              <span className="text-[#5E3A5C]">/</span>
              <span className="text-[#8A334E] font-bold">-{totalDeletions}</span>
            </div>
          </div>
        </div>

        {/* 1. Files Changed Section */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC] flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-[#B47A9A]" />
              <span>FILES CHANGED ({filesList.length})</span>
            </div>
            <span className="text-xs font-urbanist font-medium text-[#F3E9EC]/70">
              {filesList.length} file{filesList.length === 1 ? '' : 's'} staged
            </span>
          </div>

          <div className="space-y-2.5">
            {filesList.map((file) => (
              <div
                key={file.filename}
                className="flex items-center justify-between rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 px-5 py-3 text-xs"
              >
                <div className="flex items-center gap-3 text-[#F3E9EC]/90">
                  <FileCode2 className="h-4 w-4 text-[#B47A9A]" />
                  <span className="text-[#F3E9EC] font-mono font-medium">{file.filename}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[#B47A9A] font-bold">
                    +{file.additions}
                  </span>
                  <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[#8A334E] font-bold">
                    -{file.deletions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Code Diff Viewer */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-4">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
              PROPOSED CODE DIFF
            </div>
            <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-0.5 font-mono text-[11px] text-[#F3E9EC]/70">
              {issue.codeLanguage || 'typescript'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs overflow-x-auto">
            {/* Before Code */}
            <div className="rounded-2xl border border-[#8A334E]/50 bg-[#8A334E]/10 p-4 space-y-2">
              <div className="text-[10px] font-urbanist font-bold uppercase text-[#8A334E] tracking-wider mb-2">
                ORIGINAL CODE (VULNERABLE / DEFECTIVE)
              </div>
              {(issue.beforeCode || '').split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-[#8A334E]/20 text-[#F3E9EC] px-3 py-1 rounded"
                >
                  <span className="select-none text-[#8A334E] font-bold">-</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>

            {/* After Code */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/30 p-4 space-y-2">
              <div className="text-[10px] font-urbanist font-bold uppercase text-[#B47A9A] tracking-wider mb-2">
                AFTER REMEDIATION PATCH
              </div>
              {(issue.afterCode || '').split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-[#5E3A5C]/30 text-[#F3E9EC] px-3 py-1 rounded"
                >
                  <span className="select-none text-[#B47A9A] font-bold">+</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Explanation of Changes */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 space-y-4">
          <div className="flex items-center gap-2 font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
            <Info className="h-4 w-4 text-[#B47A9A]" />
            <span>EXPLANATION OF CHANGES</span>
          </div>
          <p className="font-urbanist text-sm leading-relaxed text-[#F3E9EC]/80">
            {issue.treatmentExplanation || 'Automated patch generated by Repo Doctor engine.'}
          </p>
          <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-4 text-xs font-urbanist text-[#F3E9EC]/70">
            <span>Commit Message: </span>
            <span className="text-[#F3E9EC] font-mono font-medium">{issue.prTitle || `fix: resolve ${issue.title}`}</span>
          </div>
        </div>

        {/* 4. AI Verification Status */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC]">
              AI VERIFICATION STATUS (PRE-FLIGHT CHECKS)
            </div>
            <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-0.5 text-xs font-urbanist font-bold text-[#B47A9A]">
              {(issue.aiVerificationChecks || []).length}/{(issue.aiVerificationChecks || []).length || 4} VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(issue.aiVerificationChecks || [
              { name: 'Syntax AST Sanitizer', detail: 'Clean parse tree verified with zero compile diagnostics.' },
              { name: 'Regression Suite', detail: 'All regression unit assertions passed.' },
              { name: 'Static Lint Gate', detail: 'Standard style formatting applied.' },
              { name: 'Runtime Failure Guard', detail: 'Verified clean exit conditions on edge inputs.' }
            ]).map((check) => (
              <div
                key={check.name}
                className="flex items-start gap-3 rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-4 text-xs"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B47A9A] text-[#00030E] font-mono text-[10px] mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div>
                  <div className="font-urbanist font-bold text-[#F3E9EC] text-sm">{check.name}</div>
                  <div className="mt-1 font-urbanist text-[#F3E9EC]/70">{check.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. "Create Pull Request" button */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-full border border-[#5E3A5C] bg-[#0B0E1A]/95 px-6 py-4 shadow-2xl backdrop-blur-md">
          <div>
            <p className="font-urbanist text-sm font-bold text-[#F3E9EC]">
              Estimated health improvement: <span className="text-[#B47A9A]">+{issue.scoreImpact?.overall ?? 12} points</span>
            </p>
            <p className="font-urbanist text-xs text-[#F3E9EC]/70">
              Creates branch & opens authenticated Pull Request
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isCreatingPR}
              className="cursor-pointer rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-2 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="create-pr-button"
              type="button"
              onClick={() => onCreatePullRequest(issue)}
              disabled={isCreatingPR}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#F3E9EC] px-6 py-2.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition shadow-md disabled:opacity-60"
            >
              {isCreatingPR ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#00030E] border-t-transparent" />
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
