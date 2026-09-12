import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GitPullRequest,
  ExternalLink,
  GitBranch,
  ArrowLeft,
  Check
} from 'lucide-react';
import { PullRequestDetails } from '../types';
import { PreventionRecommendationsCard } from './PreventionRecommendationsCard';

interface SuccessStateProps {
  pr: PullRequestDetails;
  onViewPullRequest: () => void;
  onBackToDashboard: () => void;
  onDiagnoseNext: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  pr,
  onViewPullRequest,
  onBackToDashboard,
  onDiagnoseNext,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F3E9EC', '#B47A9A', '#5E3A5C', '#2C1B2F'],
      });
    } catch {
      // ignore
    }
  }, []);

  const scoreDelta = Math.max(0, (pr.scoreAfter ?? 0) - (pr.scoreBefore ?? 0));

  const filesCount = pr.issue?.filesChanged?.length || 1;

  return (
    <div className="min-h-screen bg-[#00030E] text-[#F3E9EC] px-4 sm:px-6 lg:px-12 py-12 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        {/* Success Hero Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#5E3A5C] bg-[#2C1B2F] text-[#B47A9A] shadow-xl">
            <Check className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-2">
            REMEDIATION COMPLETE
          </div>

          <h1 className="font-urbanist text-3xl sm:text-4xl font-bold tracking-tight text-[#F3E9EC]">
            Pull Request Opened
          </h1>
          <p className="mt-2 font-urbanist text-sm text-[#F3E9EC]/70 max-w-md">
            Repo Doctor generated the verified patch, satisfied all AST assertions, and created a reviewable Pull Request.
          </p>
        </div>

        {/* PR Details Card */}
        <div className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-10 shadow-sm space-y-8">
          {/* PR Title */}
          <div>
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC]/70 mb-2">
              PULL REQUEST
            </div>
            <div className="flex items-start gap-3">
              <GitPullRequest className="h-5 w-5 text-[#B47A9A] shrink-0 mt-0.5" />
              <h3 className="font-urbanist text-xl font-bold text-[#F3E9EC] leading-snug">
                {pr.title || 'fix: repository health remediation patch'}
              </h3>
            </div>
          </div>

          {/* Branch Name */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#5E3A5C]/40 pt-6">
            <div>
              <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#F3E9EC]/70 mb-1">
                BRANCH ROUTE
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#F3E9EC]">
                <GitBranch className="h-4 w-4 text-[#B47A9A]" />
                <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-1 text-[#F3E9EC]">
                  {pr.branchName || 'repo-doctor/patch'}
                </span>
                <span className="text-[#5E3A5C]">→</span>
                <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3 py-1 text-[#F3E9EC]/70">
                  {pr.baseBranch || 'main'}
                </span>
              </div>
            </div>

            <div className="font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
              PR #{pr.prNumber || 101} · 1 commit · {filesCount} {filesCount === 1 ? 'file' : 'files'}
            </div>
          </div>

          {/* Health Score Before and After */}
          <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
                HEALTH SCORE PROGRESSION
              </span>
              <span className="rounded-full bg-[#B47A9A] text-[#00030E] font-urbanist text-xs font-bold px-3 py-0.5">
                +{scoreDelta} points
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="rounded-xl border border-[#5E3A5C]/60 bg-[#0B0E1A] p-4">
                <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/70">Before</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-urbanist text-[#F3E9EC]/70">{pr.scoreBefore ?? 70}</span>
                  <span className="font-mono text-xs text-[#F3E9EC]/40">/ 100</span>
                  <span className="ml-auto rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-2.5 py-0.5 font-urbanist text-xs font-bold text-[#F3E9EC]">
                    Grade {pr.gradeBefore || 'B'}
                  </span>
                </div>
              </div>

              {/* After */}
              <div className="rounded-xl border border-[#B47A9A]/60 bg-[#2C1B2F]/40 p-4">
                <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#B47A9A]">After</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-urbanist text-[#F3E9EC]">{pr.scoreAfter ?? 85}</span>
                  <span className="font-mono text-xs text-[#F3E9EC]/40">/ 100</span>
                  <span className="ml-auto rounded-full bg-[#B47A9A] text-[#00030E] px-2.5 py-0.5 font-urbanist text-xs font-bold">
                    Grade {pr.gradeAfter || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prevention Recommendations Card */}
          <div className="border-t border-[#5E3A5C]/40 pt-6">
            <PreventionRecommendationsCard prevention={pr.issue?.prevention} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#5E3A5C]/40 pt-6">
            <button
              id="back-to-dashboard-btn"
              onClick={onBackToDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-5 py-2.5 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                id="diagnose-next-btn"
                onClick={onDiagnoseNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-5 py-2.5 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition"
              >
                <span>Fix Next Issue</span>
              </button>

              <button
                id="view-pull-request-button"
                onClick={onViewPullRequest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#F3E9EC] px-6 py-2.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition shadow-md"
              >
                <span>View Pull Request</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
