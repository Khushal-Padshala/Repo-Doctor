import React from 'react';
import { ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onAnalyzeClick: () => void;
  isAnalyzing?: boolean;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onAnalyzeClick,
  isAnalyzing = false
}) => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-24 border-t border-[#5E3A5C]/60 bg-[#00030E] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[750px] rounded-full bg-[#B47A9A]/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center z-10">
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F]/60 px-4 py-1.5 font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>START IN SECONDS</span>
        </div>

        {/* Large closing heading */}
        <h2 className="font-urbanist text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight max-w-4xl mx-auto">
          READY TO ANALYZE YOUR REPOSITORY?
        </h2>

        {/* Supporting text */}
        <p className="mt-6 max-w-2xl mx-auto font-urbanist text-base sm:text-xl text-[#F3E9EC]/70 font-normal leading-relaxed">
          Connect a GitHub repository and get a complete repository health analysis.
        </p>

        {/* Big Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-cta-analyze-btn"
            type="button"
            onClick={onAnalyzeClick}
            disabled={isAnalyzing}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#B47A9A] px-9 py-4 font-urbanist text-base font-bold text-[#00030E] shadow-2xl hover:bg-[#F3E9EC] transition duration-200 disabled:opacity-50"
          >
            <span>ANALYZE REPOSITORY</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Assurance badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A]" />
            <span>Public and private GitHub repositories supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A]" />
            <span>Read-only AST scans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A]" />
            <span>No code stored on servers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
