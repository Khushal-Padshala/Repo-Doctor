import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  FileCode,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Check
} from 'lucide-react';
import { Issue, IssueSeverity } from '../types';

interface QuickFixDropdownProps {
  issues: Issue[];
  onApplyQuickFix: (issueId: string) => Promise<void> | void;
  onApplyAllQuickFixes: () => Promise<void> | void;
}

const SEVERITY_TEXT: Record<IssueSeverity, { label: string; style: string }> = {
  critical: { label: 'Critical', style: 'text-[#8A334E]' },
  high: { label: 'High', style: 'text-[#B47A9A]' },
  medium: { label: 'Medium', style: 'text-[#F3E9EC]/70' },
  low: { label: 'Low', style: 'text-[#F3E9EC]/50' },
};

export const QuickFixDropdown: React.FC<QuickFixDropdownProps> = ({
  issues,
  onApplyQuickFix,
  onApplyAllQuickFixes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [isFixingAll, setIsFixingAll] = useState(false);
  const [justFixedIds, setJustFixedIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter unresolved quick fix candidates
  const quickFixIssues = issues.filter(
    (issue) => issue.isQuickFix && !issue.isResolved
  );

  const totalPotentialGain = quickFixIssues.reduce(
    (sum, issue) => sum + (issue.scoreImpact.overall || 3),
    0
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSingleFix = async (issueId: string) => {
    setFixingId(issueId);
    try {
      await onApplyQuickFix(issueId);
      setJustFixedIds((prev) => [...prev, issueId]);
    } finally {
      setFixingId(null);
    }
  };

  const handleAllFixes = async () => {
    setIsFixingAll(true);
    try {
      await onApplyAllQuickFixes();
      setIsOpen(false);
    } finally {
      setIsFixingAll(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="quick-fixes-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-urbanist text-xs font-bold transition duration-150 focus:outline-none ${
          quickFixIssues.length > 0
            ? 'bg-[#B47A9A] text-[#00030E] hover:bg-[#F3E9EC] shadow-md'
            : 'border border-[#5E3A5C] bg-[#0B0E1A] text-[#F3E9EC]/60 hover:text-[#F3E9EC]'
        }`}
      >
        <span>Quick Fixes ({quickFixIssues.length})</span>
        <span className="text-[10px]">↓</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="quick-fixes-menu"
          className="absolute right-0 z-40 mt-3 w-96 sm:w-[460px] max-w-[92vw] origin-top-right rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-5 shadow-2xl backdrop-blur-xl ring-1 ring-black/80 animate-in fade-in zoom-in-95 duration-150 text-left font-urbanist"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#5E3A5C]/40 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-urbanist font-bold uppercase tracking-widest text-[#F3E9EC]">
                  AUTOMATED QUICK FIXES
                </span>
                <span className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2.5 py-0.5 text-[10px] font-urbanist font-bold text-[#B47A9A]">
                  {quickFixIssues.length} available
                </span>
              </div>
              <p className="mt-1 text-xs text-[#F3E9EC]/70 font-urbanist">
                Potential improvement: <span className="text-[#B47A9A] font-bold">+{totalPotentialGain} health points</span>
              </p>
            </div>

            {quickFixIssues.length > 0 && (
              <button
                id="apply-all-safe-fixes-btn"
                onClick={handleAllFixes}
                disabled={isFixingAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E9EC] px-3.5 py-1.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition disabled:opacity-50"
              >
                {isFixingAll ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Applying All...</span>
                  </>
                ) : (
                  <span>Apply All Safe Fixes</span>
                )}
              </button>
            )}
          </div>

          {/* List of Quick Fixes */}
          {quickFixIssues.length === 0 ? (
            <div className="py-10 text-center font-urbanist">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#B47A9A] mb-2" />
              <p className="text-sm font-bold text-[#F3E9EC]">
                All quick fixes applied!
              </p>
              <p className="text-xs text-[#F3E9EC]/70 mt-1">
                Your repository has no remaining automated single-tap fixes.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {quickFixIssues.map((issue) => {
                const isFixing = fixingId === issue.id;
                const isJustFixed = justFixedIds.includes(issue.id);
                const sev = SEVERITY_TEXT[issue.severity];

                return (
                  <div
                    key={issue.id}
                    className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-4 transition hover:border-[#B47A9A]"
                  >
                    {/* Header: Title & Impact */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-urbanist text-sm font-bold text-[#F3E9EC] leading-snug">
                          {issue.title}
                        </div>
                        <div className="flex items-center gap-2 font-urbanist text-xs mt-1 text-[#F3E9EC]/70 font-medium">
                          <span className={`${sev.style} font-bold`}>{sev.label}</span>
                          <span className="text-[#5E3A5C]">·</span>
                          <span className="uppercase text-[11px] tracking-wider text-[#F3E9EC]/70">{issue.category}</span>
                        </div>
                      </div>

                      <span className="font-urbanist text-xs text-[#B47A9A] shrink-0 font-bold">
                        +{issue.scoreImpact.overall} pts
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="mt-2 text-xs font-urbanist text-[#F3E9EC]/80 line-clamp-2">
                      {issue.shortExplanation}
                    </p>

                    {/* Footer with Affected File & Apply Fix button */}
                    <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-[#5E3A5C]/40 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#F3E9EC]/60 truncate max-w-[210px]">
                        <FileCode className="h-3 w-3 text-[#B47A9A] shrink-0" />
                        <span className="truncate">{issue.affectedFile}</span>
                      </div>

                      <button
                        id={`quick-fix-btn-${issue.id}`}
                        onClick={() => handleSingleFix(issue.id)}
                        disabled={isFixing || isJustFixed}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F3E9EC] px-3.5 py-1.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition disabled:opacity-50 shrink-0"
                      >
                        {isFixing ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Applying...</span>
                          </>
                        ) : isJustFixed ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <span>Apply Fix</span>
                            <ArrowRight className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
