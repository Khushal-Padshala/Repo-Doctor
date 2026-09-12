import React from 'react';
import {
  Shield,
  Code2,
  GitBranch,
  FileText,
  Workflow,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AnalysisCategoriesSectionProps {
  onAnalyzeClick: () => void;
}

const categories = [
  {
    id: 'security',
    title: 'SECURITY',
    icon: Shield,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Detects hardcoded secrets, SQL/XSS injection vulnerabilities, unencrypted tokens, and vulnerable dependencies.',
    checks: ['Secrets entropy detection', 'CVE dependency scanner', 'API credential leaks', 'CORS & auth sanity']
  },
  {
    id: 'quality',
    title: 'CODE QUALITY',
    icon: Code2,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Audits unhandled asynchronous rejections, circular imports, dead code paths, and cyclomatic complexity hotspots.',
    checks: ['Unhandled promise rejections', 'Dead branch elimination', 'Type safety coverage', 'Memory leak hazards']
  },
  {
    id: 'hygiene',
    title: 'GIT HYGIENE',
    icon: GitBranch,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Enforces branch protection rules, required PR approvals, signed commits, and clean squash/rebase workflows.',
    checks: ['Main branch write gates', 'Required review count', 'Signed commit verification', 'Stale branch detection']
  },
  {
    id: 'docs',
    title: 'DOCUMENTATION',
    icon: FileText,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Evaluates README architecture clarity, OpenAPI/Swagger specifications, license metadata, and contributing guidelines.',
    checks: ['Setup & bootstrap guide', 'API contract coverage', 'License compatibility', 'CHANGELOG tracking']
  },
  {
    id: 'testing',
    title: 'TESTING',
    icon: CheckCircle2,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Assesses automated test suite breadth, flakiness indicators, regression safety nets, and test assertion density.',
    checks: ['Regression test coverage', 'Mock leak prevention', 'E2E pipeline assertions', 'Edge case resilience']
  },
  {
    id: 'cicd',
    title: 'CI/CD',
    icon: Workflow,
    accent: 'text-[#B47A9A]',
    borderHover: 'hover:border-[#B47A9A]',
    description: 'Validates immutable GitHub Action SHA pinning, caching strategy, build step timeouts, and supply chain integrity.',
    checks: ['Action commit SHA pinning', 'Build execution timeout', 'Secret credential masking', 'Artifact caching rules']
  }
];

export const AnalysisCategoriesSection: React.FC<AnalysisCategoriesSectionProps> = ({ onAnalyzeClick }) => {
  return (
    <section id="analysis-section" className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#5E3A5C]/60">
          <div className="max-w-2xl">
            <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
              Comprehensive Health Evaluation
            </div>
            <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
              ANALYZE ANY GITHUB REPOSITORY
            </h2>
            <p className="mt-3 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70 font-normal leading-relaxed">
              Simply paste any public or private GitHub repository URL. Repo Doctor performs deep static
              analysis across six critical health dimensions without executing untrusted code.
            </p>
          </div>

          <button
            onClick={onAnalyzeClick}
            className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-5 py-2.5 font-urbanist text-xs font-semibold text-[#F3E9EC] hover:border-[#B47A9A] hover:bg-[#2C1B2F] transition shadow-sm self-start md:self-auto shrink-0"
          >
            <span>Scan a Repository</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#B47A9A]" />
          </button>
        </div>

        {/* 6 Dimension Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                className={`group relative rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-7 transition-all duration-300 ${cat.borderHover} hover:bg-[#2C1B2F]/60 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#5E3A5C] bg-[#00030E] group-hover:border-[#B47A9A] transition">
                    <IconComponent className={`h-5 w-5 ${cat.accent}`} />
                  </div>
                  <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] group-hover:text-[#F3E9EC] transition">
                    {cat.title}
                  </span>
                </div>

                <p className="font-urbanist text-sm text-[#F3E9EC]/80 leading-relaxed min-h-[48px]">
                  {cat.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[#5E3A5C]/40 space-y-2">
                  <div className="font-urbanist text-[11px] font-semibold uppercase tracking-wider text-[#B47A9A]/60">
                    Key diagnostic points:
                  </div>
                  {cat.checks.map((check) => (
                    <div key={check} className="flex items-center gap-2 font-urbanist text-xs text-[#F3E9EC]/70">
                      <span className="h-1 w-1 rounded-full bg-[#B47A9A]" />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
