import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const ImprovementComparisonSection: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Measurable Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Repository Improvement Delta
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            See the quantifiable improvement when automated AI treatments resolve critical vulnerabilities and architectural debt.
          </p>
        </div>

        {/* Before vs After Visual Comparison Banner */}
        <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 overflow-hidden shadow-sm">
          {/* Central \"+17 Health Points\" Callout Badge */}
          <div className="mb-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-emerald-800">
                +17 Health Points Gained
              </span>
            </div>
          </div>

          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
            {/* BEFORE CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Initial Scan
                  </span>
                  <span className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold uppercase text-amber-700">
                    Grade C+
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-6xl sm:text-7xl font-extrabold text-slate-700">
                    67
                  </span>
                  <span className="text-xl text-slate-400 font-medium">/ 100</span>
                </div>

                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <span>10 Active Findings (2 Critical CVEs)</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>Hardcoded AWS Secret Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>Unparameterized SQL queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Unprotected default branch</span>
                </div>
              </div>
            </div>

            {/* AFTER CARD */}
            <div className="rounded-2xl border border-emerald-300 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-md ring-2 ring-emerald-500/10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                    After AI 1-Click PRs
                  </span>
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                    Grade B+ (84)
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-6xl sm:text-7xl font-extrabold text-emerald-600">
                    84
                  </span>
                  <span className="text-xl text-emerald-600/60 font-medium">/ 100</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>0 Critical Vulnerabilities Remaining</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Secrets isolated to environment variables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Parameterized query syntax applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Branch protection rules generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
