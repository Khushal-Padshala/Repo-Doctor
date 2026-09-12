import React from 'react';
import { ScanCoverageData } from '../types';

interface ScanCoverageCardProps {
  coverage?: ScanCoverageData;
}

export const ScanCoverageCard: React.FC<ScanCoverageCardProps> = ({ coverage }) => {
  if (!coverage) return null;

  return (
    <div
      id="scan-coverage-card"
      className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 sm:p-8 shadow-sm"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#5E3A5C]/40 mb-6">
        <div>
          <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-1">
            INSPECTION BREADTH
          </div>
          <h3 className="font-urbanist text-2xl font-bold tracking-tight text-[#F3E9EC] uppercase">
            SCAN COVERAGE
          </h3>
          <p className="font-urbanist text-sm text-[#F3E9EC]/70 mt-1">
            42 checks completed across analyzed repository surfaces.
          </p>
        </div>

        <div className="rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-3.5 py-1 text-xs font-urbanist font-semibold text-[#F3E9EC] self-start sm:self-auto">
          Full Automated Audit
        </div>
      </div>

      {/* Clean Grid of Coverage Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coverage.categories.map((cat) => {
          const isComplete = cat.percentage === 100;

          return (
            <div
              key={cat.category}
              className="rounded-2xl border border-[#5E3A5C]/60 bg-[#2C1B2F]/30 p-4 transition hover:border-[#B47A9A]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]">
                  {cat.category}
                </span>
                <span className="font-urbanist text-xs font-bold text-[#B47A9A]">
                  {cat.percentage}%
                </span>
              </div>

              {/* Thin Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2C1B2F]">
                <div
                  className="h-full rounded-full bg-[#B47A9A] transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              {/* Note / status */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-urbanist text-[#F3E9EC]/70">
                <span>{cat.note || (isComplete ? 'Complete' : 'Evaluated')}</span>
                <span className="font-semibold text-[#F3E9EC]">{isComplete ? '100% verified' : `${cat.percentage}%`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
