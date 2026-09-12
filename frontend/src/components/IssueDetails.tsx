import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileCode,
  Copy,
  Check,
  Code2
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
  const [diffViewMode, setDiffViewMode] = useState<'split' | 'before' | 'after'>('split');
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
          bg: 'bg-[#8A334E]/20 text-[#F3E9EC] border-[#8A334E]/60',
          label: 'CRITICAL',
        };
      case 'high':
        return {
          bg: 'bg-[#5E3A5C]/40 text-[#B47A9A] border-[#5E3A5C]',
          label: 'HIGH',
        };
      case 'medium':
        return {
          bg: 'bg-[#2C1B2F] text-[#F3E9EC]/70 border-[#5E3A5C]',
          label: 'MEDIUM',
        };
      case 'low':
        return {
          bg: 'bg-[#0B0E1A] text-[#F3E9EC]/50 border-[#5E3A5C]/50',
          label: 'LOW',
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div className="min-h-screen bg-[#00030E] text-[#F3E9EC] px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#5E3A5C]/40">
          <button
            id="issue-details-back-button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-urbanist text-xs font-semibold text-[#F3E9EC]/70 transition hover:text-[#F3E9EC]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 font-urbanist text-xs">
            <span
              className={`rounded-full border px-3 py-0.5 font-bold uppercase tracking-wider ${badge.bg}`}
            >
              {badge.label}
            </span>
            <span className="rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-0.5 text-[#F3E9EC]/70 font-mono">
              {issue.id}
            </span>
          </div>
        </div>

        {/* Issue Header Title & File Location */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
              DIAGNOSTIC DEEP DIVE
            </div>
            <h1 className="font-urbanist text-3xl sm:text-4xl font-bold tracking-tight text-[#F3E9EC]">
              {issue.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#F3E9EC]/70 font-urbanist">
              <div className="flex items-center gap-2 text-[#F3E9EC]/80">
                <FileCode className="h-4 w-4 text-[#B47A9A]" />
                <span className="text-[#F3E9EC] font-mono">{issue.affectedFile}</span>
                <span className="text-[#5E3A5C]">:</span>
                <span className="rounded bg-[#2C1B2F] border border-[#5E3A5C] px-2 py-0.5 text-[#B47A9A] font-mono">
                  {issue.lineNumber}
                </span>
              </div>
              <button
                onClick={handleCopyFile}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-3 py-1 text-[11px] font-urbanist font-semibold text-[#F3E9EC]/70 hover:text-[#F3E9EC] transition"
              >
                {copiedFile ? <Check className="h-3 w-3 text-[#F3E9EC]" /> : <Copy className="h-3 w-3" />}
                <span>{copiedFile ? 'Copied' : 'Copy Ref'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Problem & Why It Matters Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Problem */}
          <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 flex flex-col justify-between">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#8A334E] mb-3">
                PROBLEM DEFINITION
              </div>
              <p className="font-urbanist text-sm leading-relaxed text-[#F3E9EC]/80">
                {issue.problem}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#5E3A5C]/40 text-xs font-urbanist text-[#F3E9EC]/70 font-medium">
              Affects category: <span className="text-[#F3E9EC] uppercase font-bold">[{issue.category}]</span>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 flex flex-col justify-between">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-3">
                WHY IT MATTERS
              </div>
              <p className="font-urbanist text-sm leading-relaxed text-[#F3E9EC]/80">
                {issue.whyItMatters}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#5E3A5C]/40 text-xs font-urbanist text-[#F3E9EC]/70 font-medium">
              Potential health impact: <span className="text-[#B47A9A] font-bold">+{issue.scoreImpact.overall} pts on fix</span>
            </div>
          </div>
        </div>

        {/* Affected Code Section */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC]/70">
              FLAGGED AST CODE FRAME
            </div>
            <span className="font-mono text-xs text-[#F3E9EC]/50">
              {issue.affectedFile} ({issue.lineNumber})
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5 font-mono text-xs text-[#F3E9EC]/90">
            <pre className="whitespace-pre">{issue.affectedCode}</pre>
          </div>
        </div>

        {/* AI Analysis & Recommended Fix */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* AI Analysis */}
          <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-3">
              AI ANALYSIS DETAILS
            </div>
            <p className="font-urbanist text-sm leading-relaxed text-[#F3E9EC]/80">
              {issue.aiDiagnosis}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3.5 py-1 text-xs text-[#F3E9EC] font-urbanist font-semibold">
              Root cause confidence: 99.4%
            </div>
          </div>

          {/* Recommended Fix */}
          <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-3">
              RECOMMENDED REMEDIATION
            </div>
            <p className="font-urbanist text-sm leading-relaxed text-[#F3E9EC]/80">
              {issue.recommendedTreatment}
            </p>
            <div className="mt-6 text-xs font-urbanist text-[#F3E9EC]/70 font-medium">
              Target branch: <span className="text-[#F3E9EC] font-mono font-semibold">{issue.targetBranch}</span>
            </div>
          </div>
        </div>

        {/* Before / After Code Comparison */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC] flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#B47A9A]" />
              <span>PROPOSED CODE DIFF</span>
            </div>

            <div className="flex items-center rounded-full border border-[#5E3A5C] bg-[#00030E] p-1 text-xs font-urbanist">
              <button
                onClick={() => setDiffViewMode('split')}
                className={`rounded-full px-3.5 py-1 font-semibold transition ${
                  diffViewMode === 'split'
                    ? 'bg-[#B47A9A] text-[#00030E] font-bold'
                    : 'text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setDiffViewMode('before')}
                className={`rounded-full px-3.5 py-1 font-semibold transition ${
                  diffViewMode === 'before'
                    ? 'bg-[#B47A9A] text-[#00030E] font-bold'
                    : 'text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setDiffViewMode('after')}
                className={`rounded-full px-3.5 py-1 font-semibold transition ${
                  diffViewMode === 'after'
                    ? 'bg-[#B47A9A] text-[#00030E] font-bold'
                    : 'text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
                }`}
              >
                After
              </button>
            </div>
          </div>

          {diffViewMode === 'split' ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Before */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]/70 px-1">
                  <span>BEFORE (Current Code)</span>
                  <span className="text-[#8A334E]">Vulnerable</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5 font-mono text-xs text-[#F3E9EC]/80 h-80">
                  <pre className="whitespace-pre text-[#F3E9EC]/80">{issue.beforeCode}</pre>
                </div>
              </div>

              {/* After */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]/70 px-1">
                  <span>AFTER (Recommended Patch)</span>
                  <span className="text-[#B47A9A]">Remediated</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5 font-mono text-xs text-[#F3E9EC] h-80">
                  <pre className="whitespace-pre text-[#F3E9EC]">{issue.afterCode}</pre>
                </div>
              </div>
            </div>
          ) : diffViewMode === 'before' ? (
            <div className="overflow-x-auto rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5 font-mono text-xs text-[#F3E9EC]/80">
              <pre className="whitespace-pre">{issue.beforeCode}</pre>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5 font-mono text-xs text-[#F3E9EC]">
              <pre className="whitespace-pre">{issue.afterCode}</pre>
            </div>
          )}
        </div>

        {/* Action Button: Apply Fix */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-full border border-[#5E3A5C] bg-[#0B0E1A]/95 px-6 py-4 shadow-2xl backdrop-blur-md">
          <div>
            <p className="font-urbanist text-sm font-bold text-[#F3E9EC]">Ready to apply remediation</p>
            <p className="font-urbanist text-xs text-[#F3E9EC]/70">Verified against regression test boundaries</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-2 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition"
            >
              Cancel
            </button>
            <button
              id="apply-fix-button"
              onClick={() => onApplyFix(issue)}
              className="inline-flex items-center gap-2 rounded-full bg-[#F3E9EC] px-6 py-2.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition shadow-md"
            >
              <span>Apply Fix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
