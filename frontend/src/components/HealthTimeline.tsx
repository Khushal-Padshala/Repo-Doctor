import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { HealthTimelineEntry } from '../types';

interface HealthTimelineProps {
  history?: HealthTimelineEntry[];
  currentScore: number;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  history = [],
  currentScore,
}) => {
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);

  const activeHistory = showEmptyPreview ? [] : history;
  const hasHistory = activeHistory.length > 0;

  // Calculate points gained
  const initialEntry = hasHistory ? activeHistory[0] : null;
  const initialScore = initialEntry ? initialEntry.score : currentScore;
  const latestEntry = hasHistory ? activeHistory[activeHistory.length - 1] : null;
  const latestScore = latestEntry ? latestEntry.score : currentScore;
  const totalGain = latestScore - initialScore;

  // SVG dimensions
  const graphHeight = 84;
  const minScore = 40;
  const maxScore = 100;

  const getY = (score: number) => {
    const clamped = Math.min(maxScore, Math.max(minScore, score));
    const ratio = (clamped - minScore) / (maxScore - minScore);
    return graphHeight - ratio * (graphHeight - 20) - 10;
  };

  return (
    <div
      id="health-timeline-section"
      className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 sm:p-8 shadow-sm transition-all"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#5E3A5C]/40">
        <div>
          <div className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A] mb-1">
            PROGRESS TRACKING
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[#F3E9EC] font-urbanist">
            Repository Health Timeline
          </h3>
          <p className="text-sm text-[#F3E9EC]/70 font-urbanist mt-1">
            Track how repository quality changes across scans and automated fixes.
          </p>
        </div>

        {/* Progression Numbers Row */}
        {hasHistory && (
          <div className="flex items-center gap-3 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70 bg-[#2C1B2F]/60 border border-[#5E3A5C] rounded-full px-4 py-1.5 self-start sm:self-auto">
            {activeHistory.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <span className={idx === activeHistory.length - 1 ? 'text-[#B47A9A] font-bold' : 'text-[#F3E9EC]/70 font-medium'}>
                  {item.score}
                </span>
                {idx < activeHistory.length - 1 && (
                  <span className="text-[#5E3A5C]">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {!hasHistory ? (
        /* Empty State */
        <div
          id="health-timeline-empty"
          className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#5E3A5C]/40 bg-[#00030E] p-10 text-center font-urbanist"
        >
          <h4 className="text-base font-bold text-[#F3E9EC]">
            No health history yet
          </h4>
          <p className="mt-1 text-xs text-[#F3E9EC]/70 max-w-sm">
            Run additional scans and apply fixes to track repository health score improvements over time.
          </p>
          {showEmptyPreview && (
            <button
              onClick={() => setShowEmptyPreview(false)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-4 py-2 text-xs font-bold text-[#F3E9EC] hover:border-[#B47A9A] transition"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Restore History Data</span>
            </button>
          )}
        </div>
      ) : (
        /* Active Timeline Visualization */
        <div className="mt-8 space-y-8 font-urbanist">
          {/* Key Metrics: Baseline, Current, Improvement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/30 p-5">
              <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/70">
                BASELINE
              </div>
              <div className="mt-2 text-4xl font-bold text-[#F3E9EC]">
                {initialScore}
                <span className="text-xs text-[#F3E9EC]/40 font-mono"> / 100</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/30 p-5">
              <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/70">
                CURRENT
              </div>
              <div className="mt-2 text-4xl font-bold text-[#B47A9A]">
                {latestScore}
                <span className="text-xs text-[#F3E9EC]/40 font-mono"> / 100</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/30 p-5">
              <div className="font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC]/70">
                IMPROVEMENT
              </div>
              <div className="mt-2 text-4xl font-bold text-[#B47A9A]">
                +{totalGain >= 0 ? totalGain : 0}
                <span className="text-xs text-[#F3E9EC]/40 font-mono"> points</span>
              </div>
            </div>
          </div>

          {/* Line Graph with mauve stroke */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-[#00030E] border border-[#5E3A5C] p-6">
            <div className="flex justify-between text-xs font-urbanist font-bold text-[#F3E9EC]/70 uppercase tracking-wider mb-4">
              <span>SCORE PROGRESSION</span>
              <span className="text-[#B47A9A] font-bold">LATEST: {latestScore}/100</span>
            </div>

            <div className="relative h-[84px] w-full">
              <svg className="h-full w-full overflow-visible" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1={getY(100)} x2="100%" y2={getY(100)} stroke="#5E3A5C" strokeDasharray="3 3" opacity="0.5" />
                <line x1="0" y1={getY(80)} x2="100%" y2={getY(80)} stroke="#5E3A5C" strokeDasharray="3 3" opacity="0.5" />
                <line x1="0" y1={getY(60)} x2="100%" y2={getY(60)} stroke="#5E3A5C" strokeDasharray="3 3" opacity="0.5" />

                {/* Score labels */}
                <text x="0" y={getY(100) - 3} fill="#B47A9A" fontSize="9" fontFamily="monospace" opacity="0.7">100</text>
                <text x="0" y={getY(80) - 3} fill="#B47A9A" fontSize="9" fontFamily="monospace" opacity="0.7">80</text>
                <text x="0" y={getY(60) - 3} fill="#B47A9A" fontSize="9" fontFamily="monospace" opacity="0.7">60</text>

                <defs>
                  <linearGradient id="mauveTimelineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B47A9A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#B47A9A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Path line */}
                {activeHistory.length > 1 && (
                  <>
                    <path
                      d={activeHistory.reduce((acc, pt, index) => {
                        const xPercent = (index / (activeHistory.length - 1)) * 100;
                        const y = getY(pt.score);
                        return `${acc} ${index === 0 ? 'M' : 'L'} ${xPercent}% ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#B47A9A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={`${activeHistory.reduce((acc, pt, index) => {
                        const xPercent = (index / (activeHistory.length - 1)) * 100;
                        const y = getY(pt.score);
                        return `${acc} ${index === 0 ? 'M' : 'L'} ${xPercent}% ${y}`;
                      }, '')} L 100% ${graphHeight} L 0% ${graphHeight} Z`}
                      fill="url(#mauveTimelineGrad)"
                    />
                  </>
                )}
              </svg>

              {/* Point Markers */}
              <div className="absolute inset-0 flex justify-between pointer-events-none">
                {activeHistory.map((item, idx) => {
                  const y = getY(item.score);
                  const isLast = idx === activeHistory.length - 1;

                  return (
                    <div
                      key={item.id || idx}
                      className="relative flex flex-col items-center"
                      style={{ top: `${y - 12}px` }}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-transform hover:scale-110 pointer-events-auto cursor-pointer shadow-sm font-urbanist ${
                          isLast
                            ? 'bg-[#B47A9A] border-[#F3E9EC] text-[#00030E] font-bold text-[11px]'
                            : 'bg-[#0B0E1A] border-[#5E3A5C] text-[#F3E9EC] font-bold text-[10px]'
                        }`}
                        title={`${item.label}: ${item.score}/100`}
                      >
                        {item.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Historical Stages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeHistory.map((entry, idx) => {
              const isLast = idx === activeHistory.length - 1;
              const prevEntry = idx > 0 ? activeHistory[idx - 1] : null;
              const stepDelta = prevEntry ? entry.score - prevEntry.score : 0;

              return (
                <div
                  key={entry.id || idx}
                  className={`rounded-xl border p-4 transition font-urbanist ${
                    isLast
                      ? 'border-[#B47A9A]/60 bg-[#2C1B2F]/60'
                      : 'border-[#5E3A5C]/60 bg-[#0B0E1A]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-urbanist text-[#F3E9EC]/70 mb-1">
                    <span>{entry.date}</span>
                    {stepDelta > 0 && (
                      <span className="text-[#B47A9A] font-bold">+{stepDelta}</span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-[#F3E9EC] truncate">
                    {entry.label}
                  </div>
                  <div className="mt-3 text-lg font-bold text-[#F3E9EC] font-urbanist">
                    {entry.score}
                    <span className="text-xs text-[#F3E9EC]/40 font-normal"> / 100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
