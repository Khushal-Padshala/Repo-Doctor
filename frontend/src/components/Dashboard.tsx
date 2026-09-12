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
  Workflow
} from 'lucide-react';
import { RepositoryData, Issue, IssueSeverity, ImprovementComparison } from '../types';
import { IssueCard } from './IssueCard';
import { QuickFixDropdown } from './QuickFixDropdown';
import { HealthTimeline } from './HealthTimeline';
import { ScanCoverageCard } from './ScanCoverageCard';
import { PreventionRecommendationsCard } from './PreventionRecommendationsCard';
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

  const { scores, issues } = repository;

  // Compute severity counts
  const totalCritical = issues.filter((i) => !i.isResolved && i.severity === 'critical').length;
  const totalHigh = issues.filter((i) => !i.isResolved && i.severity === 'high').length;
  const totalMedium = issues.filter((i) => !i.isResolved && i.severity === 'medium').length;
  const totalLow = issues.filter((i) => !i.isResolved && i.severity === 'low').length;
  const unresolvedIssues = issues.filter((i) => !i.isResolved);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.affectedFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.shortExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const criticalIssues = filteredIssues.filter((i) => i.severity === 'critical');
  const highIssues = filteredIssues.filter((i) => i.severity === 'high');
  const mediumIssues = filteredIssues.filter((i) => i.severity === 'medium');
  const lowIssues = filteredIssues.filter((i) => i.severity === 'low');

  // Status phrasing for health overview
  const getHealthStatus = (score: number) => {
    if (score >= 90) return 'Optimal Health';
    if (score >= 80) return 'Good Health';
    if (score >= 70) return 'Requires Attention';
    if (score >= 60) return 'Needs Remediation';
    return 'Critical Risk';
  };

  const healthStatus = getHealthStatus(scores.overall);

  return (
    <div className="min-h-screen bg-[#00030E] text-[#F3E9EC] px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16">

        {/* 1. REPOSITORY HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#5E3A5C]/60">
          <div>
            <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
              Repository Health Report
            </div>
            <h1 className="font-urbanist text-3xl sm:text-5xl font-light tracking-tight text-[#F3E9EC]">
              <span className="text-[#F3E9EC]/60 font-normal">{repository.owner} / </span>
              <span className="font-semibold text-[#F3E9EC]">{repository.name}</span>
            </h1>

            {/* Metadata Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-3 font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
              <span className="flex items-center gap-1.5 text-[#F3E9EC]">
                <GitBranch className="h-3.5 w-3.5 text-[#B47A9A]" />
                <span className="font-mono">{repository.defaultBranch}</span>
              </span>
              <span className="text-[#5E3A5C]">·</span>
              <span>{repository.language}</span>
              <span className="text-[#5E3A5C]">·</span>
              <span>commit <span className="font-mono">{repository.commitHash || '8f92a1c'}</span></span>
              <span className="text-[#5E3A5C]">·</span>
              <a
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1 text-[#F3E9EC]/80 hover:border-[#B47A9A] hover:text-[#F3E9EC] transition"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Action Controls: Quick Fixes & Re-run */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <QuickFixDropdown
              issues={issues}
              onApplyQuickFix={onApplyQuickFix}
              onApplyAllQuickFixes={onApplyAllQuickFixes}
            />

            <button
              id="dashboard-rerun-scan-button"
              onClick={onReScan}
              className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-4 py-2 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] hover:bg-[#2C1B2F] transition shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#B47A9A]" />
              <span>Re-run Analysis</span>
            </button>
          </div>
        </header>

        {/* RECENT COMPARISON BANNER (if active) */}
        {recentComparison && (
          <BeforeAfterComparison
            comparison={recentComparison}
            onDismiss={onDismissComparison}
          />
        )}

        {/* 2. HEALTH OVERVIEW SECTION */}
        <section
          id="health-overview"
          className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-12 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-2">
                OVERALL HEALTH SCORE
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-urbanist text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F3E9EC]">
                  {scores.overall}
                </span>
                <span className="font-urbanist text-xl sm:text-2xl text-[#F3E9EC]/40 font-medium">
                  / 100
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#B47A9A] px-3.5 py-1 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E]">
                  GRADE {scores.letterGrade}
                </span>
                <span className="font-urbanist text-xs font-semibold uppercase tracking-wider text-[#F3E9EC]">
                  {healthStatus}
                </span>
                <span className="text-[#5E3A5C]">·</span>
                <span className="text-xs text-[#F3E9EC]/70 font-urbanist font-medium uppercase tracking-wider">
                  {unresolvedIssues.length} ACTIVE {unresolvedIssues.length === 1 ? 'FINDING' : 'FINDINGS'}
                </span>
              </div>
            </div>

            {/* Right Summary Text */}
            <div className="lg:max-w-md font-urbanist text-sm text-[#F3E9EC]/70 leading-relaxed space-y-2 font-normal">
              <p>
                {scores.overall >= 80
                  ? 'This codebase satisfies high security, testing, and CI hygiene requirements. Routine maintenance recommended.'
                  : 'Automated static analysis identified security vectors, missing branch protections, or unhandled async exceptions that impact stability.'}
              </p>
              <p className="text-xs text-[#F3E9EC]/50 font-urbanist">
                Last analyzed: {repository.lastScanned || 'Just now'} · Engine v2.4.0
              </p>
            </div>
          </div>

          {/* Thin Horizontal Health Indicator with Urbanist labels */}
          <div className="mt-8 pt-8 border-t border-[#5E3A5C]/40">
            <div className="flex items-center justify-between font-urbanist text-xs font-bold uppercase tracking-widest mb-2">
              <span className="text-[#8A334E]">CRITICAL RISK</span>
              <span className="text-[#B47A9A]/80">REQUIRES ATTENTION</span>
              <span className="text-[#B47A9A]">OPTIMAL</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#B47A9A] transition-all duration-700"
                style={{ width: `${scores.overall}%` }}
              />
            </div>
          </div>
        </section>

        {/* 3. HEALTH DIMENSIONS */}
        <section id="health-dimensions" className="space-y-4">
          <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
            HEALTH DIMENSIONS BREAKDOWN
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Security */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 transition hover:border-[#B47A9A]">
              <div className="flex items-center justify-between text-xs text-[#F3E9EC]/70">
                <span className="flex items-center gap-2 font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]">
                  <Shield className="h-3.5 w-3.5 text-[#B47A9A]" />
                  SECURITY
                </span>
              </div>
              <div className="mt-4 font-urbanist text-3xl font-bold text-[#F3E9EC]">
                {scores.security}
                <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${scores.security}%` }}
                />
              </div>
              <p className="mt-3 font-urbanist text-xs text-[#F3E9EC]/70">
                Secrets & dependencies
              </p>
            </div>

            {/* 2. Code Quality */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 transition hover:border-[#B47A9A]">
              <div className="flex items-center justify-between text-xs text-[#F3E9EC]/70">
                <span className="flex items-center gap-2 font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]">
                  <Code2 className="h-3.5 w-3.5 text-[#B47A9A]" />
                  CODE QUALITY
                </span>
              </div>
              <div className="mt-4 font-urbanist text-3xl font-bold text-[#F3E9EC]">
                {scores.quality}
                <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${scores.quality}%` }}
                />
              </div>
              <p className="mt-3 font-urbanist text-xs text-[#F3E9EC]/70">
                Unhandled async & complexity
              </p>
            </div>

            {/* 3. Git Hygiene */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 transition hover:border-[#B47A9A]">
              <div className="flex items-center justify-between text-xs text-[#F3E9EC]/70">
                <span className="flex items-center gap-2 font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]">
                  <GitBranch className="h-3.5 w-3.5 text-[#B47A9A]" />
                  GIT HYGIENE
                </span>
              </div>
              <div className="mt-4 font-urbanist text-3xl font-bold text-[#F3E9EC]">
                {scores.hygiene}
                <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${scores.hygiene}%` }}
                />
              </div>
              <p className="mt-3 font-urbanist text-xs text-[#F3E9EC]/70">
                Branch rules & reviews
              </p>
            </div>

            {/* 4. Docs */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 transition hover:border-[#B47A9A]">
              <div className="flex items-center justify-between text-xs text-[#F3E9EC]/70">
                <span className="flex items-center gap-2 font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]">
                  <FileText className="h-3.5 w-3.5 text-[#B47A9A]" />
                  DOCUMENTATION
                </span>
              </div>
              <div className="mt-4 font-urbanist text-3xl font-bold text-[#F3E9EC]">
                {scores.docs}
                <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${scores.docs}%` }}
                />
              </div>
              <p className="mt-3 font-urbanist text-xs text-[#F3E9EC]/70">
                README & API contracts
              </p>
            </div>

            {/* 5. CI/CD */}
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 transition hover:border-[#B47A9A]">
              <div className="flex items-center justify-between text-xs text-[#F3E9EC]/70">
                <span className="flex items-center gap-2 font-urbanist font-bold uppercase tracking-wider text-[#F3E9EC]">
                  <Workflow className="h-3.5 w-3.5 text-[#B47A9A]" />
                  CI/CD
                </span>
              </div>
              <div className="mt-4 font-urbanist text-3xl font-bold text-[#F3E9EC]">
                {scores.cicd}
                <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-[#2C1B2F] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${scores.cicd}%` }}
                />
              </div>
              <p className="mt-3 font-urbanist text-xs text-[#F3E9EC]/70">
                Pinned Action SHAs
              </p>
            </div>
          </div>
        </section>

        {/* 4. HEALTH TIMELINE */}
        <HealthTimeline
          history={repository.healthHistory}
          currentScore={scores.overall}
        />

        {/* 5. SCAN COVERAGE & PREVENTION RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScanCoverageCard coverage={repository.scanCoverage} />
          <PreventionRecommendationsCard />
        </div>

        {/* 6. FINDINGS / ISSUES SECTION */}
        <section id="findings-section" className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#5E3A5C]/60">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-1">
                REMEDIATION QUEUE
              </div>
              <h3 className="font-urbanist text-2xl sm:text-3xl font-bold text-[#F3E9EC] tracking-tight">
                Repository Findings
              </h3>
              <p className="font-urbanist text-sm text-[#F3E9EC]/70 mt-1">
                Detailed diagnostics across security, quality, and workflow compliance.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Severity Filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#0B0E1A] border border-[#5E3A5C] rounded-full p-1 text-xs">
                <button
                  id="filter-all"
                  onClick={() => setSeverityFilter('all')}
                  className={`rounded-full px-3.5 py-1 font-urbanist font-semibold transition ${
                    severityFilter === 'all'
                      ? 'bg-[#B47A9A] text-[#00030E]'
                      : 'text-[#F3E9EC]/70 hover:text-[#F3E9EC]'
                  }`}
                >
                  All ({issues.length})
                </button>

                <button
                  id="filter-critical"
                  onClick={() => setSeverityFilter('critical')}
                  className={`rounded-full px-3.5 py-1 font-urbanist font-semibold transition ${
                    severityFilter === 'critical'
                      ? 'bg-[#8A334E] text-[#F3E9EC]'
                      : 'text-[#F3E9EC]/70 hover:text-[#F3E9EC]'
                  }`}
                >
                  Critical ({totalCritical})
                </button>

                <button
                  id="filter-high"
                  onClick={() => setSeverityFilter('high')}
                  className={`rounded-full px-3.5 py-1 font-urbanist font-semibold transition ${
                    severityFilter === 'high'
                      ? 'bg-[#5E3A5C] text-[#F3E9EC]'
                      : 'text-[#F3E9EC]/70 hover:text-[#F3E9EC]'
                  }`}
                >
                  High ({totalHigh})
                </button>

                <button
                  id="filter-medium"
                  onClick={() => setSeverityFilter('medium')}
                  className={`rounded-full px-3.5 py-1 font-urbanist font-semibold transition ${
                    severityFilter === 'medium'
                      ? 'bg-[#2C1B2F] border border-[#5E3A5C] text-[#F3E9EC]'
                      : 'text-[#F3E9EC]/70 hover:text-[#F3E9EC]'
                  }`}
                >
                  Medium ({totalMedium})
                </button>

                <button
                  id="filter-low"
                  onClick={() => setSeverityFilter('low')}
                  className={`rounded-full px-3.5 py-1 font-urbanist font-semibold transition ${
                    severityFilter === 'low'
                      ? 'bg-[#2C1B2F] text-[#B47A9A]'
                      : 'text-[#F3E9EC]/70 hover:text-[#F3E9EC]'
                  }`}
                >
                  Low ({totalLow})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#F3E9EC]/50" />
                <input
                  id="issue-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter findings..."
                  className="w-full rounded-full border border-[#5E3A5C] bg-[#00030E] pl-9 pr-4 py-1.5 font-urbanist text-xs text-[#F3E9EC] placeholder-[#F3E9EC]/40 focus:border-[#B47A9A] focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Grouped Editorial Finding Cards */}
          <div className="space-y-12">
            {/* Critical Group */}
            {(severityFilter === 'all' || severityFilter === 'critical') && criticalIssues.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#8A334E]">
                      Critical Findings ({criticalIssues.length})
                    </span>
                  </div>
                  <span className="font-urbanist text-xs text-[#F3E9EC]/50">
                    Immediate security vulnerabilities or exploitable attack vectors
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {criticalIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} onViewFix={onViewFix} />
                  ))}
                </div>
              </div>
            )}

            {/* High Group */}
            {(severityFilter === 'all' || severityFilter === 'high') && highIssues.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#B47A9A]">
                      High Severity Findings ({highIssues.length})
                    </span>
                  </div>
                  <span className="font-urbanist text-xs text-[#F3E9EC]/50">
                    Runtime stability risks, unpinned workflows, and race conditions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {highIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} onViewFix={onViewFix} />
                  ))}
                </div>
              </div>
            )}

            {/* Medium Group */}
            {(severityFilter === 'all' || severityFilter === 'medium') && mediumIssues.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
                      Medium Severity Findings ({mediumIssues.length})
                    </span>
                  </div>
                  <span className="font-urbanist text-xs text-[#F3E9EC]/50">
                    Git hygiene flaws, missing branch gates, and API documentation gaps
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediumIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} onViewFix={onViewFix} />
                  ))}
                </div>
              </div>
            )}

            {/* Low Group */}
            {(severityFilter === 'all' || severityFilter === 'low') && lowIssues.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/80">
                      Low Severity Findings ({lowIssues.length})
                    </span>
                  </div>
                  <span className="font-urbanist text-xs text-[#F3E9EC]/50">
                    Code cleanliness, license metadata, and cosmetic hygiene
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lowIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} onViewFix={onViewFix} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredIssues.length === 0 && (
              <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-12 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#5E3A5C] mb-3" />
                <p className="text-base font-medium text-[#F3E9EC]">No findings matching your filter</p>
                <p className="text-xs text-[#F3E9EC]/70 mt-1">Try selecting a different severity or clearing your search term.</p>
                <button
                  onClick={() => {
                    setSeverityFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-2 text-xs font-medium text-[#F3E9EC] hover:border-[#B47A9A] transition"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
