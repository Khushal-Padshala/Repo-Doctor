import React, { useEffect, useState } from 'react';
import {
  Check,
  ArrowRight,
  GitBranch,
  Layers,
  Package,
  Shield,
  Code2,
  FileText,
  CheckCircle2,
  Workflow,
  Activity
} from 'lucide-react';

interface CheckupScannerProps {
  repoName: string;
  onComplete: () => void;
  summaryFindings?: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    score?: number;
  };
}

const ANALYSIS_STAGES = [
  { label: 'Connecting to repository', detail: 'Ephemeral isolated sandbox initialized' },
  { label: 'Inspecting repository structure', detail: 'Traversing root manifest & source trees' },
  { label: 'Checking dependencies', detail: 'Auditing lockfiles & CVE vulnerability databases' },
  { label: 'Analyzing security', detail: 'Scanning for exposed secrets & injection taints' },
  { label: 'Checking code quality', detail: 'AST traversal for unhandled promises & error handling' },
  { label: 'Inspecting Git hygiene', detail: 'Auditing branch protection rules & .gitignore' },
  { label: 'Checking documentation', detail: 'Evaluating README clarity & API specs' },
  { label: 'Evaluating testing', detail: 'Inspecting test suites & coverage frameworks' },
  { label: 'Checking CI/CD', detail: 'Auditing workflow actions & SHA pinning' },
  { label: 'Final analysis', detail: 'Synthesizing health metrics & remediation patches' }
];

export const CheckupScanner: React.FC<CheckupScannerProps> = ({
  repoName,
  onComplete,
  summaryFindings = {
    total: 8,
    critical: 2,
    high: 2,
    medium: 2,
    low: 2,
    score: 64,
  },
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const cleanRepoDisplay = repoName.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsDone(true);
          return prev;
        }
      });
    }, 380);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = isDone
    ? 100
    : Math.round(((currentStep + 1) / ANALYSIS_STAGES.length) * 100);

  return (
    <div
      id="analysis-progress-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00030E]/90 backdrop-blur-xl p-4 animate-in fade-in duration-200 selection:bg-[#B47A9A] selection:text-[#00030E]"
    >
      {/* Background subtle radial lighting */}
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-[#B47A9A]/[0.03] blur-[120px]" />

      <div className="relative w-full max-w-xl rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-6">
          <div>
            <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-1">
              REPOSITORY HEALTH ENGINE
            </div>
            <h2 className="font-urbanist text-2xl font-bold tracking-tight text-[#F3E9EC] uppercase">
              {isDone ? 'ANALYSIS COMPLETE' : 'ANALYZING REPOSITORY'}
            </h2>
            <div className="font-urbanist text-xs text-[#F3E9EC]/70 mt-1.5 flex items-center gap-1.5">
              <span>Repository:</span>
              <span className="text-[#F3E9EC] font-mono font-medium">{cleanRepoDisplay}</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-1.5 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] transition"
          >
            {isDone ? 'Continue' : 'Skip'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-urbanist">
            <span className="text-[#F3E9EC]/80 font-medium">
              {isDone ? 'Diagnostic finalized' : ANALYSIS_STAGES[currentStep].label}
            </span>
            <span className="text-[#B47A9A] font-bold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2C1B2F]">
            <div
              className="h-full bg-[#B47A9A] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Log Steps */}
        <div className="mt-6 space-y-2 font-urbanist text-xs max-h-[300px] overflow-y-auto pr-1">
          {ANALYSIS_STAGES.map((step, idx) => {
            const isCompleted = idx < currentStep || isDone;
            const isCurrent = idx === currentStep && !isDone;

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                  isCurrent
                    ? 'bg-[#2C1B2F] text-[#F3E9EC] border border-[#5E3A5C]'
                    : isCompleted
                    ? 'text-[#F3E9EC]/80 bg-[#0B0E1A]'
                    : 'text-[#F3E9EC]/30'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-mono">
                    {isCompleted ? (
                      <span className="text-[#B47A9A]">✓</span>
                    ) : isCurrent ? (
                      <span className="text-[#B47A9A] animate-pulse">◉</span>
                    ) : (
                      <span className="text-[#5E3A5C]">○</span>
                    )}
                  </span>
                  <span className="truncate font-medium">{step.label}</span>
                </div>

                {isCompleted && (
                  <span className="text-[10px] font-urbanist font-bold text-[#B47A9A] shrink-0">
                    DONE
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-urbanist font-bold text-[#F3E9EC] animate-pulse shrink-0">
                    INSPECTING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Card */}
        {isDone ? (
          <div className="mt-6 rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/40 p-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-urbanist font-bold uppercase tracking-wider text-[#B47A9A] mb-1">
                  ANALYSIS FINALIZED
                </div>
                <div className="text-base font-bold text-[#F3E9EC] font-urbanist">
                  {summaryFindings.total} findings identified for {cleanRepoDisplay}
                </div>
                <p className="text-xs text-[#F3E9EC]/70 mt-0.5 font-urbanist">
                  Health score, dimension metrics, and remediation patches ready.
                </p>
              </div>

              <button
                id="view-analysis-results-btn"
                onClick={onComplete}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F3E9EC] px-6 py-3 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition shrink-0"
              >
                <span>View Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between text-[#F3E9EC]/50 text-xs font-urbanist">
            <span>Non-invasive AST inspection</span>
            <span>Stage {currentStep + 1} of {ANALYSIS_STAGES.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
