import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface QuickFixItem {
  id: string;
  issue: string;
  category: string;
  recommendedFix: string;
  confidence: string;
  expectedImprovement: string;
  points: number;
}

const defaultFixes: QuickFixItem[] = [
  {
    id: 'qf-1',
    issue: 'Hardcoded cloud credentials in repository configuration',
    category: 'SECURITY',
    recommendedFix: 'Migrate AWS secrets to environment variables and append .env to .gitignore',
    confidence: '99.4%',
    expectedImprovement: '+8 Health Points',
    points: 8
  },
  {
    id: 'qf-2',
    issue: 'Mutable GitHub Actions checkout reference @v4',
    category: 'CI/CD',
    recommendedFix: 'Pin actions/checkout to immutable commit SHA (actions/checkout@11bd71901b...)',
    confidence: '99.1%',
    expectedImprovement: '+4 Health Points',
    points: 4
  },
  {
    id: 'qf-3',
    issue: 'Unhandled asynchronous promise rejections',
    category: 'CODE QUALITY',
    recommendedFix: 'Implement scoped try/catch boundaries with structured telemetry logging',
    confidence: '96.2%',
    expectedImprovement: '+4 Health Points',
    points: 4
  }
];

export const QuickFixPreviewSection: React.FC = () => {
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());

  const toggleApplyFix = (id: string) => {
    setAppliedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalAddedPoints = defaultFixes
    .filter((f) => appliedFixes.has(f.id))
    .reduce((sum, f) => sum + f.points, 0);

  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60 bg-[#0B0E1A]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#5E3A5C]/60">
          <div>
            <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
              Automated Remediation
            </div>
            <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
              QUICK FIXES
            </h2>
            <p className="mt-2 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70">
              One-click pull requests that verify syntax, run test suites, and immediately heal your repository.
            </p>
          </div>

          {/* Points gained indicator */}
          <div className="flex items-center gap-3 bg-[#00030E] border border-[#5E3A5C] rounded-full px-5 py-2.5">
            <Sparkles className="h-4 w-4 text-[#B47A9A]" />
            <span className="font-urbanist text-xs font-semibold text-[#F3E9EC]/70">
              Preview Points Gained:
            </span>
            <span className="font-urbanist text-sm font-bold text-[#B47A9A]">
              +{totalAddedPoints} pts
            </span>
          </div>
        </div>

        {/* Quick Fix Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultFixes.map((fix) => {
            const isApplied = appliedFixes.has(fix.id);

            return (
              <div
                key={fix.id}
                className={`relative rounded-3xl border p-7 transition-all duration-300 flex flex-col justify-between ${
                  isApplied
                    ? 'border-[#B47A9A] bg-[#2C1B2F]/40 shadow-lg'
                    : 'border-[#5E3A5C] bg-[#00030E] hover:border-[#B47A9A]'
                }`}
              >
                <div>
                  {/* Category and Confidence */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-3 py-1 font-urbanist text-[11px] font-bold uppercase tracking-wider text-[#F3E9EC]">
                      {fix.category}
                    </span>
                    <span className="font-urbanist text-[11px] font-semibold text-[#F3E9EC]/70 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#B47A9A]" />
                      <span>{fix.confidence}</span>
                    </span>
                  </div>

                  {/* Issue */}
                  <h3 className="font-urbanist text-base font-bold text-[#F3E9EC] leading-snug">
                    {fix.issue}
                  </h3>

                  {/* Recommended Fix */}
                  <div className="mt-4 rounded-2xl border border-[#5E3A5C]/60 bg-[#0B0E1A] p-3.5">
                    <div className="font-urbanist text-[11px] font-semibold uppercase tracking-wider text-[#B47A9A] mb-1">
                      Recommended Fix:
                    </div>
                    <p className="font-urbanist text-xs text-[#F3E9EC]/80 leading-relaxed">
                      {fix.recommendedFix}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer Action */}
                <div className="mt-6 pt-5 border-t border-[#5E3A5C]/40 flex items-center justify-between">
                  <div className="font-urbanist text-xs font-bold text-[#B47A9A]">
                    {fix.expectedImprovement}
                  </div>

                  <button
                    onClick={() => toggleApplyFix(fix.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-urbanist text-xs font-bold transition duration-200 ${
                      isApplied
                        ? 'bg-[#B47A9A] text-[#00030E] shadow-md'
                        : 'border border-[#5E3A5C] bg-[#2C1B2F] text-[#F3E9EC] hover:border-[#B47A9A]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span>Applied ✓</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Fix</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#B47A9A]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
