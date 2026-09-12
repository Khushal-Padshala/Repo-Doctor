import React from 'react';
import { Shield, Code2, GitBranch, FileText, CheckCircle2, Workflow } from 'lucide-react';

const coverageItems = [
  {
    name: 'Security',
    score: 94,
    icon: Shield,
    iconBg: 'bg-rose-50 text-rose-600',
    color: 'bg-rose-500',
    auditedText: '48 Rules Audited',
    details: 'Secrets entropy, known CVE database, dependency vulnerability tree'
  },
  {
    name: 'Code Quality',
    score: 88,
    icon: Code2,
    iconBg: 'bg-blue-50 text-blue-600',
    color: 'bg-blue-500',
    auditedText: '62 AST Rules Audited',
    details: 'Cyclomatic complexity, dead code, unhandled promise rejections'
  },
  {
    name: 'Git Hygiene',
    score: 82,
    icon: GitBranch,
    iconBg: 'bg-amber-50 text-amber-600',
    color: 'bg-amber-500',
    auditedText: '18 Branch Rules Audited',
    details: 'Branch protection, linear history, signed commits, stale branches'
  },
  {
    name: 'Documentation',
    score: 91,
    icon: FileText,
    iconBg: 'bg-emerald-50 text-emerald-600',
    color: 'bg-emerald-500',
    auditedText: '14 Specs Audited',
    details: 'README setup clarity, license headers, API contracts, CHANGELOG'
  },
  {
    name: 'Testing',
    score: 79,
    icon: CheckCircle2,
    iconBg: 'bg-purple-50 text-purple-600',
    color: 'bg-purple-500',
    auditedText: '32 Assertion Suites Audited',
    details: 'Unit regression coverage, mock isolation, pipeline assertions'
  },
  {
    name: 'CI / CD',
    score: 96,
    icon: Workflow,
    iconBg: 'bg-indigo-50 text-indigo-600',
    color: 'bg-indigo-500',
    auditedText: '24 Workflow Rules Audited',
    details: 'GitHub Actions commit SHA pinning, secret masking, timeouts'
  }
];

export const ScanCoveragePreviewSection: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto pb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Engine Depth
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            198 Comprehensive Diagnostic Rules
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Engineered specifically for modern JavaScript, TypeScript, Python, Go, and GitHub ecosystems.
          </p>
        </div>

        {/* Coverage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {item.score}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-semibold text-blue-600 mb-3">
                    {item.auditedText}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {item.details}
                  </p>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
