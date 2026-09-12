import React from 'react';
import { ArrowRight, ShieldCheck, Zap, GitPullRequest } from 'lucide-react';
import { LandingHeroVisual } from './LandingHeroVisual';

interface LandingHeroProps {
  onAnalyzeClick: () => void;
  onSeeHowItWorksClick: () => void;
  isAnalyzing?: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onAnalyzeClick,
  onSeeHowItWorksClick,
  isAnalyzing = false,
}) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Editorial Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase text-blue-700 mb-6 sm:mb-8 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>AI-Powered Repository Analysis</span>
          </div>

          {/* Large Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-sans">
            The platform to build{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
              healthier repositories.
            </span>
          </h1>

          {/* Slogan */}
          <div className="mt-4 flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 font-sans">
            <span>Analyze</span>
            <span className="text-blue-500">·</span>
            <span>Improve</span>
            <span className="text-blue-500">·</span>
            <span className="text-slate-900">Ship Faster</span>
          </div>

          {/* Supporting Text */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-600 font-normal leading-relaxed font-sans">
            Analyze your GitHub repository for security risks, code quality issues, Git hygiene,
            documentation gaps, testing weaknesses, and CI/CD problems — then fix them automatically with
            AI-powered 1-click remediations.
          </p>

          {/* Action CTAs (Replaced black box with sleek gradient button) */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto font-sans">
            <button
              id="hero-primary-analyze-btn"
              type="button"
              onClick={onAnalyzeClick}
              disabled={isAnalyzing}
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-600/30 transition duration-200 disabled:opacity-50 border border-white/20 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1D3557 0%, #2A4365 40%, #2B6CB0 85%, #3182CE 100%)',
              }}
            >
              <span>Analyze a Repository</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-cyan-300" />
            </button>

            <button
              id="hero-secondary-how-it-works-btn"
              type="button"
              onClick={onSeeHowItWorksClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition duration-200"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-slate-600 font-medium font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Zero code retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span>Non-invasive AST scan</span>
            </div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-emerald-600" />
              <span>1-click Pull Requests</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Visual */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <LandingHeroVisual />
        </div>
      </div>
    </section>
  );
};
