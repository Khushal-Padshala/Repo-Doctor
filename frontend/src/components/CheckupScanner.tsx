import React, { useEffect, useState } from 'react';
import {
  Check,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles
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
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanRepoDisplay = repoName.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsDone(true);
          // Smooth automatic navigation to dashboard upon scan completion
          setTimeout(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 300);
          return prev;
        }
      });
    }, 140);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = isDone
    ? 100
    : Math.round(((currentStep + 1) / ANALYSIS_STAGES.length) * 100);

  return (
    <div
      id="analysis-progress-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200 selection:bg-blue-500/20"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Repository Health Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
              {isDone ? 'Analysis Complete' : 'Analyzing Repository'}
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-sans">
              <span>Repository:</span>
              <span className="text-slate-900 font-mono font-semibold">{cleanRepoDisplay}</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {isDone ? 'Continue' : 'Skip'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">
              {isDone ? 'Diagnostic finalized' : ANALYSIS_STAGES[currentStep].label}
            </span>
            <span className="text-blue-600 font-bold font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Log Steps */}
        <div className="mt-6 space-y-2 text-xs max-h-[260px] overflow-y-auto pr-1">
          {ANALYSIS_STAGES.map((step, idx) => {
            const isCompleted = idx < currentStep || isDone;
            const isCurrent = idx === currentStep && !isDone;

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                  isCurrent
                    ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                    : isCompleted
                    ? 'text-slate-800 bg-slate-50/70'
                    : 'text-slate-400 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : isCurrent ? (
                      <span className="text-blue-600 animate-pulse font-bold">◉</span>
                    ) : (
                      <span className="text-slate-300">○</span>
                    )}
                  </span>
                  <span className="truncate font-medium">{step.label}</span>
                </div>

                {isCompleted && (
                  <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                    DONE
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-bold text-blue-600 animate-pulse shrink-0">
                    INSPECTING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Card */}
        {isDone && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4.5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                  Analysis Finalized
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {summaryFindings.total} findings identified for {cleanRepoDisplay}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Health score, dimension metrics, and remediation patches ready.
                </p>
              </div>

              <button
                id="view-analysis-results-btn"
                onClick={onComplete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0 shadow-sm cursor-pointer"
              >
                <span>View Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
