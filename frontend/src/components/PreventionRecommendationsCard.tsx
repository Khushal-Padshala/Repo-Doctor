import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { PreventionRecommendation } from '../types';

interface PreventionRecommendationsCardProps {
  prevention?: PreventionRecommendation;
}

const DEFAULT_PREVENTION: PreventionRecommendation = {
  title: 'Prevent Recurring Security & Quality Findings',
  whyItHelps:
    'Automating repository guards in pre-commit hooks and CI workflows blocks vulnerable patterns before code reaches default branches, reducing manual review overhead and avoiding production security incidents.',
  actionItems: [
    'Store secrets strictly in environment variables or cloud secret managers',
    'Enforce pre-commit validation hooks using tools like husky or lint-staged',
    'Add continuous integration linting and SAST security gates',
    'Schedule automated weekly dependency and supply chain scans'
  ],
  recommendedChecks: [
    { id: 'chk-sec-scan', label: 'Enable secret scanning alerts', enabled: true },
    { id: 'chk-pre-commit', label: 'Add pre-commit validation hook', enabled: true },
    { id: 'chk-ci-sec', label: 'Add CI security checks (SAST & lint)', enabled: true },
    { id: 'chk-sched', label: 'Schedule regular repository scans', enabled: false }
  ]
};

export const PreventionRecommendationsCard: React.FC<PreventionRecommendationsCardProps> = ({
  prevention = DEFAULT_PREVENTION,
}) => {
  const [checks, setChecks] = useState(prevention.recommendedChecks || DEFAULT_PREVENTION.recommendedChecks);

  const toggleCheck = (id: string) => {
    setChecks((prev) =>
      prev.map((chk) => (chk.id === id ? { ...chk, enabled: !chk.enabled } : chk))
    );
  };

  return (
    <div
      id="prevention-recommendations-card"
      className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 sm:p-8 shadow-sm"
    >
      {/* Editorial Header */}
      <div className="pb-6 border-b border-[#5E3A5C]/40 mb-6">
        <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-1">
          LONG-TERM HARDENING
        </div>
        <h3 className="font-urbanist text-2xl font-bold tracking-tight text-[#F3E9EC] uppercase">
          PREVENT RECURRING ISSUES
        </h3>
        <p className="font-urbanist text-sm text-[#F3E9EC]/70 mt-1">
          {prevention.whyItHelps}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Engineering Practices */}
        <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-5 space-y-4">
          <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
            RECOMMENDED PRACTICES
          </div>

          <ul className="space-y-3 font-urbanist text-xs text-[#F3E9EC]/80">
            {prevention.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2C1B2F] text-[#B47A9A] font-bold text-[10px] mt-0.5 border border-[#5E3A5C]">
                  ✓
                </span>
                <span className="text-[#F3E9EC]/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Preventive Checks */}
        <div className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
              PREVENTIVE CHECKS
            </div>
            <span className="text-[11px] font-urbanist font-semibold text-[#F3E9EC]/70">
              {checks.filter((c) => c.enabled).length}/{checks.length} active
            </span>
          </div>

          <div className="space-y-2.5">
            {checks.map((chk) => (
              <button
                key={chk.id}
                type="button"
                onClick={() => toggleCheck(chk.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border p-3 text-left font-urbanist text-xs transition duration-150 ${
                  chk.enabled
                    ? 'border-[#5E3A5C] bg-[#2C1B2F] text-[#F3E9EC]'
                    : 'border-[#5E3A5C]/40 bg-[#00030E] text-[#F3E9EC]/60 hover:border-[#5E3A5C] hover:text-[#F3E9EC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                      chk.enabled
                        ? 'border-[#B47A9A] bg-[#B47A9A] text-[#00030E]'
                        : 'border-[#5E3A5C] bg-[#0B0E1A] text-transparent'
                    }`}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="font-semibold text-xs">{chk.label}</span>
                </div>

                <span
                  className={`text-[10px] font-urbanist font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    chk.enabled
                      ? 'bg-[#0B0E1A] text-[#B47A9A] border border-[#5E3A5C]'
                      : 'bg-[#0B0E1A] text-[#F3E9EC]/50'
                  }`}
                >
                  {chk.enabled ? 'ENABLED' : 'OPTIONAL'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
