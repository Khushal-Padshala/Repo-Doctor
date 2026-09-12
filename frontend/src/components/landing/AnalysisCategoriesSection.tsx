import React from 'react';
import {
  Shield,
  Code2,
  GitBranch,
  FileText,
  Workflow,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AnalysisCategoriesSectionProps {
  onAnalyzeClick: () => void;
}

const categories = [
  {
    id: 'security',
    tag: 'SECURITY & SECRETS',
    title: 'Zero-Leak Guard',
    metric: '48',
    metricLabel: 'Audit Rules Active',
    trend: '100% automated CVE & secret detection',
    icon: Shield,
    description: 'Detects hardcoded secrets, SQL/XSS vulnerabilities, unencrypted tokens, and dependency flaws.'
  },
  {
    id: 'quality',
    tag: 'CODE QUALITY',
    title: 'AST Architecture',
    metric: '62',
    metricLabel: 'AST Checks Running',
    trend: 'Zero false-positive AST engine',
    icon: Code2,
    description: 'Audits unhandled async rejections, circular imports, dead code paths, and cyclomatic complexity.'
  },
  {
    id: 'hygiene',
    tag: 'GIT HYGIENE',
    title: 'Branch Governance',
    metric: '18',
    metricLabel: 'Branch Gates Enforced',
    trend: 'Enforces signed commits & squash history',
    icon: GitBranch,
    description: 'Enforces branch protection rules, required PR approvals, signed commits, and clean git history.'
  },
  {
    id: 'docs',
    tag: 'DOCUMENTATION',
    title: 'Contract & Specs',
    metric: '14',
    metricLabel: 'Contracts Audited',
    trend: 'Automatic OpenAPI contract verification',
    icon: FileText,
    description: 'Evaluates README architecture clarity, OpenAPI/Swagger specifications, and license metadata.'
  },
  {
    id: 'testing',
    tag: 'TESTING & COVERAGE',
    title: 'Resilience Suite',
    metric: '32',
    metricLabel: 'Assertion Suites',
    trend: 'Automated regression safety nets',
    icon: CheckCircle2,
    description: 'Assesses automated test suite breadth, flakiness indicators, and regression safety nets.'
  },
  {
    id: 'cicd',
    tag: 'CI / CD AUTOMATION',
    title: 'Supply Chain Shield',
    metric: '24',
    metricLabel: 'Pipeline Security Rules',
    trend: 'Immutable GitHub Action SHA pinning',
    icon: Workflow,
    description: 'Validates immutable GitHub Action SHA pinning, caching strategy, timeouts, and supply chain safety.'
  }
];

export const AnalysisCategoriesSection: React.FC<AnalysisCategoriesSectionProps> = ({ onAnalyzeClick }) => {
  return (
    <section id="analysis-section" className="relative z-10 px-4 sm:px-6 lg:px-12 py-24 border-t border-slate-200/60 bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Comprehensive Health Evaluation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Analyze any GitHub repository
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Simply paste any public or private GitHub repository URL. Repo Doctor performs deep static
              analysis across six critical health dimensions with automated 1-click pull request fixes.
            </p>
          </div>

          <button
            onClick={onAnalyzeClick}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800 transition duration-200 self-start md:self-auto shrink-0"
          >
            <span>Scan a Repository</span>
            <ArrowRight className="h-4 w-4 text-blue-400" />
          </button>
        </div>

        {/* 6 Custom Styled Luminous Blue-Periwinkle Mesh Gradient Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative rounded-[28px] p-[1.5px] bg-gradient-to-b from-blue-200/60 via-indigo-200/40 to-purple-200/30 shadow-lg shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Lighter, Luminous Blue & Periwinkle Gradient from Reference */}
                <div
                  className="relative h-full w-full rounded-[26.5px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #284478 0%, #365796 28%, #4F72B3 62%, #6887C8 85%, #8589B6 100%)',
                  }}
                >
                  {/* Luminous ambient top-right & center light glow */}
                  <div className="pointer-events-none absolute -top-8 -right-8 h-56 w-56 rounded-full bg-[#93B4ED]/35 blur-2xl group-hover:bg-[#ABC8FA]/45 transition-colors duration-500" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#A89EC7]/25 blur-2xl" />

                  {/* Top Section: Small Tag on Left, Glassmorphic Icon on Right */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
                    <div>
                      <span className="font-mono text-[11px] font-bold tracking-widest text-[#D6E3FA] uppercase block mb-1">
                        {cat.tag}
                      </span>
                      <h3 className="text-2xl font-serif italic text-white tracking-normal font-normal drop-shadow-sm">
                        {cat.title}
                      </h3>
                    </div>

                    {/* Glassmorphic Icon Badge */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25">
                      <Icon className="h-5 w-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" />
                    </div>
                  </div>

                  {/* Middle Section: Large Metric with Drop Shadow & Description */}
                  <div className="relative z-10 my-auto space-y-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] font-sans">
                        {cat.metric}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#E8F0FE]">
                        {cat.metricLabel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Pill Card (Glassmorphic Capsule) */}
                  <div className="relative z-10 mt-6 rounded-2xl border border-white/25 bg-white/15 px-4 py-2.5 backdrop-blur-md flex items-center gap-2.5 text-xs text-white shadow-sm">
                    <TrendingUp className="h-4 w-4 text-[#D8E6FF] shrink-0" />
                    <span className="truncate font-medium text-[#F4F7FE]">{cat.trend}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
