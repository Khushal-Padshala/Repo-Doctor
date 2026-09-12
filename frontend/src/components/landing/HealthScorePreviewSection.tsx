import React, { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

export const HealthScorePreviewSection: React.FC = () => {
  const [isRemediated, setIsRemediated] = useState(false);

  // States
  const score = isRemediated ? 84 : 67;
  const grade = isRemediated ? 'Grade B+' : 'Grade C+';
  const findings = isRemediated ? '4 Active Findings' : '10 Active Findings';
  const statusLabel = isRemediated ? 'Optimal' : 'Requires Attention';
  const gradeBadgeBg = isRemediated
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
    : 'bg-amber-50 border-amber-200 text-amber-700';

  const dimensions = [
    { name: 'Security', before: 52, after: 88, color: 'bg-rose-500' },
    { name: 'Code Quality', before: 68, after: 82, color: 'bg-blue-500' },
    { name: 'Git Hygiene', before: 70, after: 85, color: 'bg-amber-500' },
    { name: 'Documentation', before: 75, after: 90, color: 'bg-emerald-500' },
    { name: 'Testing', before: 60, after: 78, color: 'bg-purple-500' },
    { name: 'CI / CD', before: 65, after: 90, color: 'bg-indigo-500' }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-20 border-t border-slate-200/60 bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Repository Diagnostics
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Repository Health Score
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Interactive preview of the health score diagnostic engine and real-time improvement simulation.
            </p>
          </div>

          {/* Interactive Simulation Switcher */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setIsRemediated(false)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-tight transition ${
                !isRemediated
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Initial Scan (67)
            </button>
            <button
              onClick={() => setIsRemediated(true)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold tracking-tight transition ${
                isRemediated
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>After AI Fixes (84)</span>
            </button>
          </div>
        </div>

        {/* Interactive Score Display Card */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Big Score Hero */}
            <div className="lg:col-span-5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-10">
              <div className="flex items-center gap-3">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${isRemediated ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Overall Health Score
                </span>
              </div>

              {/* Huge animated score digits */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-7xl sm:text-8xl font-extrabold tracking-tight text-slate-900 transition-all duration-500">
                  {score}
                </span>
                <span className="text-2xl sm:text-3xl text-slate-400 font-medium">
                  / 100
                </span>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className={`rounded-lg border px-3 py-1 text-xs font-bold tracking-tight transition-colors duration-300 ${gradeBadgeBg}`}>
                  {grade}
                </span>
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {findings}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {statusLabel}
                </span>
              </div>

              {/* Delta Callout */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isRemediated ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {isRemediated ? '+17 Health Points Gained' : 'Potential +17 Points with 1-Click Fixes'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isRemediated ? 'Resolved 6 critical vulnerabilities across 4 files' : 'AI-generated pull requests ready for review'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Dimension Bars Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                Category Breakdown Comparison
              </div>

              {dimensions.map((dim) => {
                const currentVal = isRemediated ? dim.after : dim.before;
                return (
                  <div key={dim.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span>{dim.name}</span>
                      <span className="font-mono text-slate-900 font-bold">{currentVal}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${dim.color} transition-all duration-700 ease-out`}
                        style={{ width: `${currentVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
