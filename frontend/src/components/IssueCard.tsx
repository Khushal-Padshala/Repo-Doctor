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
    badgeBg: 'bg-[#8A334E]/20 text-[#F3E9EC] border border-[#8A334E]/60',
    border: 'border-[#5E3A5C] hover:border-[#8A334E]',
    tagClass: 'text-[#8A334E]',
  },
  high: {
    label: 'HIGH',
    badgeBg: 'bg-[#5E3A5C]/40 text-[#F3E9EC] border border-[#5E3A5C]',
    border: 'border-[#5E3A5C] hover:border-[#B47A9A]',
    tagClass: 'text-[#B47A9A]',
  },
  medium: {
    label: 'MEDIUM',
    badgeBg: 'bg-[#2C1B2F] text-[#F3E9EC] border border-[#5E3A5C]',
    border: 'border-[#5E3A5C] hover:border-[#B47A9A]',
    tagClass: 'text-[#F3E9EC]',
  },
  low: {
    label: 'LOW',
    badgeBg: 'bg-[#0B0E1A] text-[#F3E9EC]/70 border border-[#5E3A5C]',
    border: 'border-[#5E3A5C] hover:border-[#B47A9A]',
    tagClass: 'text-[#F3E9EC]/70',
  },
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewFix }) => {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const config = SEVERITY_CONFIG[issue.severity];

  const aiConfidence = issue.aiConfidence || 94;
  const fixConfidence = issue.fixConfidence || 96;

  return (
    <div
      id={`issue-card-${issue.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-[#0B0E1A] p-6 sm:p-7 transition duration-200 hover:bg-[#2C1B2F]/30 shadow-sm ${
        issue.isResolved
          ? 'border-[#5E3A5C]/40 bg-[#0B0E1A]/60'
          : config.border
      }`}
    >
      <div>
        {/* Top Tagline / Category & Severity */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 font-urbanist text-[11px]">
            {/* Severity Pill */}
            <span
              className={`rounded-full px-2.5 py-0.5 uppercase tracking-wider font-bold ${config.badgeBg}`}
            >
              {config.label}
            </span>

            {/* Category Pill */}
            <span className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-2.5 py-0.5 text-[#F3E9EC] uppercase tracking-wider font-semibold">
              {issue.category}
            </span>

            {/* Quick Fix Pill */}
            {issue.isQuickFix && !issue.isResolved && (
              <span className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-2.5 py-0.5 text-[#B47A9A] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                <Zap className="h-3 w-3 fill-current text-[#B47A9A]" />
                <span>QUICK FIX</span>
              </span>
            )}
          </div>

          {/* Status or Issue ID */}
          {issue.isResolved ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-0.5 font-urbanist text-xs font-semibold text-[#B47A9A]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B47A9A]" />
              Fixed in PR #{issue.prNumber || '142'}
            </span>
          ) : (
            <span className="font-mono text-xs text-[#F3E9EC]/50">
              {issue.id}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-urbanist text-lg font-bold text-[#F3E9EC] group-hover:text-[#F3E9EC] transition leading-snug">
          {issue.title}
        </h4>

        {/* Short description */}
        <p className="mt-2.5 font-urbanist text-sm text-[#F3E9EC]/70 line-clamp-2 leading-relaxed">
          {issue.shortExplanation}
        </p>

        {/* File & Line Range */}
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#F3E9EC]/70">
          <FileCode className="h-3.5 w-3.5 text-[#B47A9A] shrink-0" />
          <span className="text-[#F3E9EC] truncate">
            {issue.affectedFile}
          </span>
          <span className="text-[#5E3A5C]">:</span>
          <span className="rounded bg-[#00030E] border border-[#5E3A5C] px-1.5 py-0.5 text-[11px] text-[#B47A9A]">
            {issue.lineNumber}
          </span>
        </div>

        {/* AI Confidence & Expandable Editorial Section */}
        <div className="mt-5 pt-3 border-t border-[#5E3A5C]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
              <span>
                AI Confidence: <strong className="text-[#F3E9EC] font-bold">{aiConfidence}%</strong>
              </span>
              {issue.isQuickFix && (
                <span className="hidden sm:inline text-[#5E3A5C]">
                  · Fix Confidence: <strong className="text-[#B47A9A] font-bold">{fixConfidence}%</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
              className="inline-flex items-center gap-1 font-urbanist text-xs font-semibold text-[#F3E9EC]/80 hover:text-[#F3E9EC] transition uppercase tracking-wider"
            >
              <span>{isAnalysisExpanded ? 'Hide Details' : 'AI Analysis Details'}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  isAnalysisExpanded ? 'rotate-180 text-[#B47A9A]' : 'text-[#B47A9A]'
                }`}
              />
            </button>
          </div>

          {/* Expanded AI Analysis Details */}
          {isAnalysisExpanded && (
            <div className="mt-3.5 rounded-xl border border-[#5E3A5C] bg-[#00030E] p-4 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-2">
                <span className="font-urbanist text-xs uppercase tracking-wider font-bold text-[#F3E9EC] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#B47A9A]" />
                  Why this was flagged
                </span>
                <span className="font-urbanist text-[11px] font-semibold text-[#F3E9EC]/70">
                  Confidence: {aiConfidence}%
                </span>
              </div>

              {/* Bulleted Evidence */}
              <ul className="space-y-1.5 font-urbanist text-xs text-[#F3E9EC]/80 list-disc list-inside">
                {issue.whyFlagged && issue.whyFlagged.length > 0 ? (
                  issue.whyFlagged.map((reason, idx) => (
                    <li key={idx} className="leading-relaxed text-[#F3E9EC]/70">
                      <span className="text-[#F3E9EC]">{reason}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="leading-relaxed text-[#F3E9EC]/70">
                      <span className="text-[#F3E9EC]">Secret is hardcoded in configuration or source code.</span>
                    </li>
                    <li className="leading-relaxed text-[#F3E9EC]/70">
                      <span className="text-[#F3E9EC]">Configuration is accessible by application code without environment assertion.</span>
                    </li>
                    <li className="leading-relaxed text-[#F3E9EC]/70">
                      <span className="text-[#F3E9EC]">Automated patch verified against AST bounds and regression suites.</span>
                    </li>
                  </>
                )}
              </ul>

              {/* Evidence Code Snippet if present */}
              {issue.codeSnippet && (
                <div className="pt-2 border-t border-[#5E3A5C]/40">
                  <div className="font-urbanist text-[11px] text-[#B47A9A] mb-1.5 uppercase tracking-wider font-bold">
                    Evidence
                  </div>
                  <pre className="rounded-lg bg-[#0B0E1A] border border-[#5E3A5C] p-2.5 font-mono text-[11px] text-[#F3E9EC] overflow-x-auto">
                    <code>{issue.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#5E3A5C]/40 flex items-center justify-between">
        <div className="font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
          Impact: <span className="text-[#B47A9A] font-bold">+{issue.scoreImpact.overall} health pts</span>
        </div>

        <button
          id={`view-fix-btn-${issue.id}`}
          onClick={() => onViewFix(issue)}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-urbanist text-xs font-bold uppercase tracking-wider transition duration-150 ${
            issue.isResolved
              ? 'border border-[#5E3A5C] bg-[#2C1B2F] text-[#F3E9EC] hover:border-[#B47A9A]'
              : 'bg-[#B47A9A] text-[#00030E] hover:bg-[#F3E9EC]'
          }`}
        >
          <span>{issue.isResolved ? 'Inspect Patch' : 'View Fix'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
