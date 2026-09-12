import React, { useState } from 'react';
import { Sparkles, Check, Zap } from 'lucide-react';

interface QuickFixItem {
  id: string;
  issue: string;
  category: string;
  categoryBadge: string;
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
    categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    recommendedFix: 'Migrate AWS secrets to environment variables and append .env to .gitignore',
    confidence: '99.4%',
    expectedImprovement: '+8 Health Points',
    points: 8
  },
  {
    id: 'qf-2',
    issue: 'Mutable GitHub Actions checkout reference @v4',
    category: 'CI/CD',
    categoryBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    recommendedFix: 'Pin actions/checkout to immutable commit SHA (actions/checkout@11bd71901b...)',
    confidence: '99.1%',
    expectedImprovement: '+4 Health Points',
    points: 4
  },
  {
    id: 'qf-3',
    issue: 'Unhandled asynchronous promise rejections',
    category: 'CODE QUALITY',
    categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    recommendedFix: 'Implement scoped try/catch boundaries with structured telemetry logging',
    confidence: '96.2%',
    expectedImprovement: '+4 Health Points',
    points: 4
  }
];

export const QuickFixPreviewSection: React.FC = () => {
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set(['qf-1']));

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
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Instant Remediation
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              One-Click AI Quick Fixes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Select any issue to preview the automated pull request generation and score impact.
            </p>
          </div>

          {/* Real-time score impact counter */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm self-start sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Score Delta
              </div>
              <div className="text-lg font-extrabold text-slate-900">
                +{totalAddedPoints} Health Points
              </div>
            </div>
          </div>
        </div>

        {/* Quick Fix Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultFixes.map((fix) => {
            const isSelected = appliedFixes.has(fix.id);

            return (
              <div
                key={fix.id}
                onClick={() => toggleApplyFix(fix.id)}
                className={`group relative rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${fix.categoryBadge}`}>
                      {fix.category}
                    </span>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-slate-50 text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                    {fix.issue}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                    {fix.recommendedFix}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">
                    {fix.expectedImprovement}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {fix.confidence} AST Match
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
