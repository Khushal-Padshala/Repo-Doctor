import React from 'react';
import { Shield, Code2, GitBranch, FileText, CheckCircle2, Workflow } from 'lucide-react';

const coverageItems = [
  {
    name: 'SECURITY',
    score: 94,
    icon: Shield,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '48 Rules Audited',
    details: 'Secrets entropy, known CVE database, dependency vulnerability tree'
  },
  {
    name: 'CODE QUALITY',
    score: 88,
    icon: Code2,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '62 AST Rules Audited',
    details: 'Cyclomatic complexity, dead code, unhandled promise rejections'
  },
  {
    name: 'GIT HYGIENE',
    score: 82,
    icon: GitBranch,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '18 Branch Rules Audited',
    details: 'Branch protection, linear history, signed commits, stale branches'
  },
  {
    name: 'DOCUMENTATION',
    score: 91,
    icon: FileText,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '14 Specs Audited',
    details: 'README setup clarity, license headers, API contracts, CHANGELOG'
  },
  {
    name: 'TESTING',
    score: 79,
    icon: CheckCircle2,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '32 Assertion Suites Audited',
    details: 'Unit regression coverage, mock isolation, pipeline assertions'
  },
  {
    name: 'CI/CD',
    score: 96,
    icon: Workflow,
    accent: 'text-[#B47A9A]',
    color: 'bg-[#B47A9A]',
    auditedText: '24 Workflow Rules Audited',
    details: 'GitHub Actions commit SHA pinning, secret masking, timeouts'
  }
];

export const ScanCoveragePreviewSection: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60 bg-[#0B0E1A]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#5E3A5C]/60">
          <div>
            <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
              Diagnostics Depth
            </div>
            <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
              SCAN COVERAGE
            </h2>
            <p className="mt-2 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70">
              Complete diagnostic coverage over your codebase, configuration, workflows, and git tree.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#00030E] px-4 py-2 font-urbanist text-xs text-[#F3E9EC] self-start md:self-auto">
            <span className="h-2 w-2 rounded-full bg-[#B47A9A] animate-pulse" />
            <span>198 Total Diagnostic Rules Active</span>
          </div>
        </div>

        {/* Coverage Bars Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.name}
                className="rounded-3xl border border-[#5E3A5C] bg-[#00030E] p-6 hover:border-[#B47A9A] transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B0E1A] border border-[#5E3A5C]">
                      <IconComp className={`h-4 w-4 ${item.accent}`} />
                    </div>
                    <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-urbanist text-xs font-bold text-[#B47A9A]">
                    {item.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full rounded-full bg-[#0B0E1A] border border-[#5E3A5C]/40 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between font-urbanist text-[11px] text-[#F3E9EC]/70 mb-2">
                  <span>{item.auditedText}</span>
                  <span className="text-[#B47A9A] font-semibold">Active</span>
                </div>

                <p className="font-urbanist text-xs text-[#F3E9EC]/50 line-clamp-2 leading-relaxed">
                  {item.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
