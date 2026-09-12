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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00030E]/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] shadow-2xl overflow-hidden text-[#F3E9EC]">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#5E3A5C]/40 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-urbanist text-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 font-bold uppercase tracking-wider ${
                  isMerged
                    ? 'bg-[#2C1B2F] text-[#B47A9A] border border-[#5E3A5C]'
                    : 'bg-[#B47A9A] text-[#00030E]'
                }`}
              >
                <GitPullRequest className="h-3.5 w-3.5" />
                {isMerged ? 'Merged' : 'Open'}
              </span>
              <span className="text-[#F3E9EC]/70 font-mono">
                #{pr.prNumber}
              </span>
            </div>
            <h2 className="font-urbanist text-xl sm:text-2xl font-bold text-[#F3E9EC]">
              {pr.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 font-urbanist text-xs text-[#F3E9EC]/70">
              <span className="text-[#F3E9EC] font-semibold">{pr.author}</span>
              <span>wants to merge 1 commit into</span>
              <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[#F3E9EC] font-mono">
                {pr.baseBranch}
              </span>
              <span>from</span>
              <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[#F3E9EC] font-mono">
                {pr.branchName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#F3E9EC]/70 hover:bg-[#2C1B2F] hover:text-[#F3E9EC] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PR Tabs */}
        <div className="flex border-b border-[#5E3A5C]/40 px-6 sm:px-8 font-urbanist text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('conversation')}
            className={`border-b-2 py-3 px-4 transition ${
              activeTab === 'conversation'
                ? 'border-[#B47A9A] text-[#B47A9A] font-bold'
                : 'border-transparent text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
            }`}
          >
            Conversation
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            className={`border-b-2 py-3 px-4 transition ${
              activeTab === 'commits'
                ? 'border-[#B47A9A] text-[#B47A9A] font-bold'
                : 'border-transparent text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
            }`}
          >
            Commits (1)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`border-b-2 py-3 px-4 transition ${
              activeTab === 'files'
                ? 'border-[#B47A9A] text-[#B47A9A] font-bold'
                : 'border-transparent text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
            }`}
          >
            Files changed ({pr.issue?.filesChanged?.length || 1})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-[#F3E9EC]/80 font-urbanist">
          {activeTab === 'conversation' && (
            <div className="space-y-6">
              {/* Bot Message */}
              <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#F3E9EC] font-medium">repo-doctor[bot]</span>
                    <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2 py-0.5 text-[10px] font-mono text-[#F3E9EC]/70">
                      bot
                    </span>
                  </div>
                  <span className="font-mono text-[#F3E9EC]/50">just now</span>
                </div>

                <div className="space-y-3 leading-relaxed">
                  <p className="text-sm font-bold text-[#F3E9EC] font-urbanist">
                    Automated Remediation Patch by Repo Doctor AI
                  </p>
                  <p className="text-[#F3E9EC]/80 font-urbanist leading-relaxed">{pr.issue?.treatmentExplanation || 'Automated remediation patch generated and verified by Repo Doctor.'}</p>

                  <div className="rounded-xl border border-[#5E3A5C] bg-[#00030E] p-4">
                    <div className="font-urbanist text-xs uppercase font-bold tracking-widest text-[#B47A9A] mb-2">Health Score Impact</div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-[#F3E9EC]/70">Before: {pr.scoreBefore}/100</span>
                      <span className="text-[#5E3A5C]">→</span>
                      <span className="text-[#F3E9EC] font-medium">After: {pr.scoreAfter}/100</span>
                      <span className="rounded-full bg-[#B47A9A] text-[#00030E] px-2.5 py-0.5 font-bold font-urbanist ml-auto">
                        +{Math.max(0, pr.scoreAfter - pr.scoreBefore)} pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/70">Automated Verification:</div>
                    {(pr.issue?.aiVerificationChecks || []).map((chk) => (
                      <div key={chk.name} className="flex items-center gap-2 text-[#F3E9EC]/80 text-xs font-urbanist">
                        <Check className="h-3.5 w-3.5 text-[#B47A9A]" />
                        <span>{chk.name}: <span className="text-[#B47A9A] font-semibold">Passed</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Checks box */}
              <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/20 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
                    ALL CHECKS PASSED
                  </span>
                  <span className="font-urbanist text-[#F3E9EC]/70 text-[11px] font-semibold">4 checks</span>
                </div>
                <div className="space-y-1.5 text-[#F3E9EC]/70 text-xs font-mono">
                  <div>✓ CI / static-analysis — Passed</div>
                  <div>✓ CI / security-trivy-scan — Passed</div>
                  <div>✓ CI / regression-tests — Passed</div>
                  <div>✓ Repo Doctor / remediation-verification — Passed</div>
                </div>
              </div>

              {/* Merge Box */}
              <div className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="font-bold text-[#F3E9EC] text-sm font-urbanist">
                    {isMerged ? 'Pull request successfully merged' : 'Ready to merge'}
                  </div>
                  <div className="text-[#F3E9EC]/70 text-xs mt-0.5 font-urbanist">
                    {isMerged
                      ? 'The changes have been merged into the default branch.'
                      : 'Merging will apply the fix and update repository health score.'}
                  </div>
                </div>

                {!isMerged ? (
                  <button
                    id="merge-pr-button"
                    onClick={handleMerge}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F3E9EC] px-5 py-2 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition shrink-0"
                  >
                    <Check className="h-4 w-4" />
                    <span>Merge Pull Request</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#B47A9A] font-urbanist font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#B47A9A]" />
                    <span>Merged into {pr.baseBranch}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'commits' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-4 text-xs font-urbanist">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-[#B47A9A]" />
                  <span className="text-[#F3E9EC] font-semibold">{pr.title}</span>
                </div>
                <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[#F3E9EC]/70 font-mono">
                  8f92a1c
                </span>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              {(pr.issue?.filesChanged || [{ filename: pr.issue?.affectedFile || 'src/index.ts', additions: 10, deletions: 2 }]).map((file) => (
                <div key={file.filename} className="rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-5">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-[#5E3A5C]/40 pb-3 mb-3">
                    <span className="text-[#F3E9EC]">{file.filename}</span>
                    <div className="flex gap-2 font-mono">
                      <span className="text-[#B47A9A]">+{file.additions}</span>
                      <span className="text-[#8A334E]">-{file.deletions}</span>
                    </div>
                  </div>
                  <pre className="font-mono text-xs text-[#F3E9EC]/90 overflow-x-auto">
                    {pr.issue?.afterCode || '// Remediated source code'}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#5E3A5C]/40 bg-[#0B0E1A] p-4 sm:p-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-5 py-2 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
