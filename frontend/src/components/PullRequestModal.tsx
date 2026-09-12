import React, { useState } from 'react';
import {
  X,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  Check
} from 'lucide-react';
import { PullRequestDetails } from '../types';

interface PullRequestModalProps {
  pr: PullRequestDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onMerged?: () => void;
}

export const PullRequestModal: React.FC<PullRequestModalProps> = ({
  pr,
  isOpen,
  onClose,
  onMerged,
}) => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'commits' | 'files'>('conversation');
  const [isMerged, setIsMerged] = useState(false);

  if (!isOpen || !pr) return null;

  const handleMerge = () => {
    setIsMerged(true);
    if (onMerged) onMerged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 font-bold uppercase tracking-wider ${
                  isMerged
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <GitPullRequest className="h-3.5 w-3.5" />
                {isMerged ? 'Merged' : 'Open'}
              </span>
              <span className="text-slate-500 font-mono">
                #{pr.prNumber || 101}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {pr.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{pr.author}</span>
              <span>wants to merge into</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-mono text-[11px]">
                {pr.baseBranch || 'main'}
              </span>
              <span>from</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-mono text-[11px]">
                {pr.branchName || 'repo-doctor/patch'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PR Tabs */}
        <div className="flex border-b border-slate-200 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('conversation')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'conversation'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Conversation
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'commits'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Commits (1)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'files'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Files changed ({pr.issue?.filesChanged?.length || 1})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {activeTab === 'conversation' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-900">repo-doctor[bot]</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] font-mono text-slate-700">
                      bot
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">just now</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900">
                    Automated Remediation Patch by Repo Doctor AI
                  </p>
                  <p>{pr.issue?.treatmentExplanation || 'Automated patch synthesized and verified against AST bounds.'}</p>

                  <div className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Health Score Recovery</span>
                    <span className="font-bold text-emerald-600">+{Math.max(0, pr.scoreAfter - pr.scoreBefore)} pts</span>
                  </div>
                </div>
              </div>

              {/* Merge Action Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {isMerged ? 'Pull request successfully merged' : 'Ready to merge'}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {isMerged
                      ? 'The changes have been merged into the default branch.'
                      : 'Merging will apply the fix and update repository health score.'}
                  </div>
                </div>

                {!isMerged ? (
                  <button
                    id="merge-pr-button"
                    onClick={handleMerge}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Merge Pull Request</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Merged into {pr.baseBranch}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'commits' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-slate-900">{pr.title}</span>
              </div>
              <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-slate-700 text-[11px]">
                8f92a1c
              </span>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              {(pr.issue?.filesChanged || [{ filename: pr.issue?.affectedFile || 'src/index.ts', additions: 10, deletions: 2 }]).map((file) => (
                <div key={file.filename} className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100 overflow-x-auto">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                    <span className="text-slate-300">{file.filename}</span>
                    <span className="text-emerald-400">+{file.additions} -{file.deletions}</span>
                  </div>
                  <pre className="text-[11px] text-slate-300">
                    {pr.issue?.afterCode || '// Remediated code'}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
