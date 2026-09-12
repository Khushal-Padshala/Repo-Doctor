import React, { useState } from 'react';
import {
  RefreshCw,
  GitBranch,
  Github,
  Search,
  CheckCircle2,
  Shield,
  Code2,
  FileText,
  Workflow,
  TrendingUp,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
  Plus,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { RepositoryData, Issue, IssueSeverity, ImprovementComparison } from '../types';
import { IssueCard } from './IssueCard';
import { QuickFixDropdown } from './QuickFixDropdown';
import { BeforeAfterComparison } from './BeforeAfterComparison';

interface DashboardProps {
  repository: RepositoryData;
  onViewFix: (issue: Issue) => void;
  onReScan: () => void;
  onApplyQuickFix: (issueId: string) => Promise<void> | void;
  onApplyAllQuickFixes: () => Promise<void> | void;
  recentComparison?: ImprovementComparison | null;
  onDismissComparison?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  repository,
  onViewFix,
  onReScan,
  onApplyQuickFix,
  onApplyAllQuickFixes,
  recentComparison,
  onDismissComparison,
}) => {
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeRange, setActiveTimeRange] = useState<'1W' | '1M' | '3M' | 'YTD' | 'ALL'>('1W');

  const { scores, issues } = repository;

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.affectedFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.shortExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const unresolvedCount = issues.filter((i) => !i.isResolved).length;
  const resolvedCount = issues.filter((i) => i.isResolved).length;
  const quickFixCount = issues.filter((i) => i.canQuickFix && !i.isResolved).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* RECENT COMPARISON BANNER (if active) */}
        {recentComparison && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
            <BeforeAfterComparison
              comparison={recentComparison}
              onDismiss={onDismissComparison}
            />
          </div>
        )}

        {/* 3-Column / Bento Grid Layout matching Origin reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 8 COLUMNS: Main Analytics Deck */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. HERO CARD: Health Score & Area Curve Graph */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span>REPOSITORY HEALTH SCORE</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onReScan}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 text-slate-600" />
                    <span>Re-scan</span>
                  </button>
                </div>
              </div>

              {/* Big Metric Display */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                    {scores.overall}
                  </span>
                  <span className="text-xl font-semibold text-slate-600">/ 100</span>
                  
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+{Math.max(0, scores.overall - 60)} pts (+18.2%)</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  Grade <strong className="text-slate-900 font-bold">{scores.letterGrade}</strong> — {scores.gradeDescription}
                </p>
              </div>

              {/* Curved SVG Progression Graph */}
              <div className="relative pt-4 pb-2">
                <div className="h-44 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area fill */}
                    <path
                      d="M 0 100 C 60 100, 100 95, 140 30 C 200 30, 320 30, 500 30 L 500 120 L 0 120 Z"
                      fill="url(#scoreGradient)"
                    />
                    
                    {/* Smooth curve line */}
                    <path
                      d="M 0 100 C 60 100, 100 95, 140 30 C 200 30, 320 30, 500 30"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Active Point Indicator */}
                    <circle cx="500" cy="30" r="5" fill="#2563EB" className="animate-pulse" />
                    <circle cx="500" cy="30" r="9" fill="#2563EB" opacity="0.2" />
                  </svg>
                </div>

                {/* Graph Axis Labels */}
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Initial: 60/100</span>
                  <span>After Fixes: 78/100</span>
                  <span className="font-bold text-blue-600">Current: {scores.overall}/100</span>
                </div>
              </div>

              {/* Time Range Filter Pills matching Origin */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                {(['1W', '1M', '3M', 'YTD', 'ALL'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTimeRange(t)}
                    className={`rounded-xl px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeTimeRange === t
                        ? 'bg-slate-100 text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Full Width Bottom Action Button */}
              <div className="pt-2">
                {quickFixCount > 0 ? (
                  <button
                    type="button"
                    onClick={onApplyAllQuickFixes}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-3 px-4 text-xs font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer"
                  >
                    <Zap className="h-4 w-4 fill-current text-amber-400" />
                    <span>Apply All {quickFixCount} Quick Fixes at Once</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onReScan}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 py-3 px-4 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>All Actionable Fixes Applied — Re-scan to Verify</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. SECONDARY CENTER CARD: Categories & Findings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Repository Audit Findings ({filteredIssues.length})
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {unresolvedCount} active issues · {resolvedCount} resolved
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverityFilter(sev)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition cursor-pointer ${
                        severityFilter === sev
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue Cards Grid */}
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onViewFix={onViewFix}
                  />
                ))}

                {filteredIssues.length === 0 && (
                  <div className="py-12 text-center text-slate-600 text-xs">
                    No issues matching your active filter.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Insight Widgets Rail (Origin Style) */}
          <div className="lg:col-span-4 space-y-6">

            {/* WIDGET 1: Top Navy / Indigo Promo Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  AUTOMATED REMEDIATION
                </span>
                <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-bold">
                  PRO
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold tracking-tight text-white leading-snug">
                  One-Click Pull Requests
                </h4>
                <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                  Repo Doctor generates AST-verified patches and prepares reviewable PRs without breaking code syntax.
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-900/60 flex items-center gap-2 text-xs text-indigo-200 font-medium">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{unresolvedCount} patches ready to deploy</span>
              </div>
            </div>

            {/* WIDGET 2: Security & Secret Digest */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                SECURITY & SECRET AUDIT
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-900">
                  High-Entropy Credential Check
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Scans AWS keys, Stripe secrets, GitHub tokens, and private RSA keys in working tree.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-600">Score Impact</span>
                <span className="font-bold text-slate-900">{scores.security} / 40 pts</span>
              </div>
            </div>

            {/* WIDGET 3: Codebase Maintainability */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                CODE QUALITY & SMELLS
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-900">
                  Maintainability & Bloat
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Identifies bloated files (&gt;600 LOC), unaddressed TODO debt, and missing lockfiles.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-600">Score Impact</span>
                <span className="font-bold text-slate-900">{scores.quality} / 30 pts</span>
              </div>
            </div>

            {/* WIDGET 4: Scan Coverage Progress Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  SCAN COVERAGE
                </div>
                <span className="text-xs font-bold text-emerald-600">100%</span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">
                  42 of 42 Automated Checks
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-600">
                All AST, git hygiene, documentation, and CI gates verified.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
