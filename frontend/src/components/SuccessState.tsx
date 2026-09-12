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
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#F59E0B', '#64748B'],
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const scoreDelta = Math.max(0, (pr.scoreAfter ?? 0) - (pr.scoreBefore ?? 0));
  const filesCount = pr.issue?.filesChanged?.length || 1;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 text-slate-900 px-4 sm:px-8 py-10 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        
        {/* Success Hero Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <Check className="h-7 w-7 stroke-[3]" />
          </div>

          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
            REMEDIATION COMPLETE
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Pull Request Opened
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 max-w-md">
            Repo Doctor synthesized the verified patch, satisfied all AST assertions, and created a reviewable Pull Request.
          </p>
        </div>

        {/* PR Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* PR Title */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              PULL REQUEST
            </div>
            <div className="flex items-start gap-2.5">
              <GitPullRequest className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {pr.title || 'fix: repository health remediation patch'}
              </h3>
            </div>
          </div>

          {/* Branch Name */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                BRANCH ROUTE
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-900">
                <GitBranch className="h-3.5 w-3.5 text-blue-600" />
                <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-800 font-semibold">
                  {pr.branchName || 'repo-doctor/patch'}
                </span>
                <span className="text-slate-300">→</span>
                <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600">
                  {pr.baseBranch || 'main'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              PR #{pr.prNumber || 101} · 1 commit · {filesCount} {filesCount === 1 ? 'file' : 'files'}
            </div>
          </div>

          {/* Health Score Progression Box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                HEALTH SCORE PROGRESSION
              </span>
              <span className="rounded-md bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5">
                +{scoreDelta} points
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-500">Before</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-700">{pr.scoreBefore ?? 70}</span>
                  <span className="font-mono text-xs text-slate-400">/ 100</span>
                  <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    Grade {pr.gradeBefore || 'B'}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-300 bg-white p-3.5 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-emerald-700">After</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-700">{pr.scoreAfter ?? 85}</span>
                  <span className="font-mono text-xs text-slate-400">/ 100</span>
                  <span className="ml-auto rounded-md bg-emerald-600 text-white px-2 py-0.5 text-xs font-bold">
                    Grade {pr.gradeAfter || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              id="back-to-dashboard-btn"
              type="button"
              onClick={onBackToDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="diagnose-next-btn"
                type="button"
                onClick={onDiagnoseNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
              >
                <span>Fix Next Issue</span>
              </button>

              <button
                id="view-pull-request-button"
                type="button"
                onClick={onViewPullRequest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
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
