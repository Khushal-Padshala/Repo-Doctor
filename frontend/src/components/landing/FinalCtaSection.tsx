import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface FinalCtaSectionProps {
  onAnalyzeClick: () => void;
  isAnalyzing?: boolean;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onAnalyzeClick,
  isAnalyzing = false
}) => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-24 border-t border-slate-200 bg-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[750px] rounded-full bg-blue-50/60 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center z-10">
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Start in Seconds</span>
        </div>

        {/* Large closing heading */}
        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto font-sans">
          Ready to diagnose and cure your repository?
        </h2>

        {/* Supporting text */}
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Connect your GitHub repository to generate a full health report and 1-click automated pull requests.
        </p>

        {/* Big Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-cta-analyze-btn"
            type="button"
            onClick={onAnalyzeClick}
            disabled={isAnalyzing}
            className="group inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-600/30 transition duration-200 disabled:opacity-50 border border-white/20 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #1D3557 0%, #2A4365 40%, #2B6CB0 85%, #3182CE 100%)',
            }}
          >
            <span>Analyze a Repository</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-cyan-300" />
          </button>
        </div>

        {/* Assurance badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Public and private repositories supported</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600" />
            <span>Read-only static AST inspection</span>
          </div>
        </div>
      </div>
    </section>
  );
};
