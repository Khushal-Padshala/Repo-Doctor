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
          {/* Eyebrow badge with subtle mauve pulse */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F]/60 px-4 py-1.5 text-xs font-urbanist font-semibold tracking-wider uppercase text-[#B47A9A] backdrop-blur-md mb-6 sm:mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A] animate-pulse" />
            <span>AI-Powered Repository Analysis</span>
          </div>

          {/* Large Hero Headline in Urbanist */}
          <h1 className="font-urbanist text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F3E9EC] leading-[1.05] uppercase">
            THE PLATFORM
            <br />
            <span className="bg-gradient-to-r from-[#F3E9EC] via-[#F3E9EC]/80 to-[#B47A9A] bg-clip-text text-transparent">
              TO BUILD HEALTHIER
            </span>
            <br />
            <span className="text-[#B47A9A]">REPOSITORIES</span>
          </h1>

          {/* Slogan */}
          <div className="mt-4 flex items-center gap-3 font-urbanist text-sm sm:text-base font-semibold uppercase tracking-widest text-[#F3E9EC]/70">
            <span>Analyze</span>
            <span className="text-[#B47A9A]">·</span>
            <span>Improve</span>
            <span className="text-[#B47A9A]">·</span>
            <span className="text-[#F3E9EC]">Ship</span>
          </div>

          {/* Supporting Text */}
          <p className="mt-6 max-w-2xl font-urbanist text-base sm:text-lg text-[#F3E9EC]/80 font-normal leading-relaxed">
            Analyze your GitHub repository for security risks, code quality issues, Git hygiene,
            documentation gaps, testing weaknesses, and CI/CD problems — then fix them with
            AI-powered recommendations.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              id="hero-primary-analyze-btn"
              type="button"
              onClick={onAnalyzeClick}
              disabled={isAnalyzing}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F3E9EC] px-8 py-4 font-urbanist text-sm font-bold text-[#00030E] shadow-xl hover:bg-[#B47A9A] hover:shadow-2xl transition duration-200 disabled:opacity-50"
            >
              <span>Analyze a Repository</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="hero-secondary-how-it-works-btn"
              type="button"
              onClick={onSeeHowItWorksClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-7 py-4 font-urbanist text-sm font-semibold text-[#F3E9EC] hover:border-[#B47A9A] hover:bg-[#2C1B2F] hover:text-[#F3E9EC] transition duration-200"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8 font-urbanist text-xs text-[#F3E9EC]/70 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#B47A9A]" />
              <span>Zero code retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#B47A9A]" />
              <span>Non-invasive AST scan</span>
            </div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-[#B47A9A]" />
              <span>1-click Pull Requests</span>
            </div>
          </div>
        </div>

        {/* Right Side Visual Component */}
        <div className="lg:col-span-5 flex items-center justify-center relative z-10">
          <LandingHeroVisual />
        </div>
      </div>
    </section>
  );
};
