import React from 'react';
import { AnimatedBackground } from './landing/AnimatedBackground';
import { LandingHero } from './landing/LandingHero';
import { AnalysisCategoriesSection } from './landing/AnalysisCategoriesSection';
import { HealthScorePreviewSection } from './landing/HealthScorePreviewSection';
import { FindingsPreviewSection } from './landing/FindingsPreviewSection';
import { QuickFixPreviewSection } from './landing/QuickFixPreviewSection';
import { ImprovementComparisonSection } from './landing/ImprovementComparisonSection';
import { ScanCoveragePreviewSection } from './landing/ScanCoveragePreviewSection';
import { FinalCtaSection } from './landing/FinalCtaSection';

interface LandingPageProps {
  onContinueWithGitHub: () => void;
  onContinueWithGoogle: () => void;
  onNavigateToSignIn?: () => void;
  onNavigateToAnalyze?: () => void;
  isGitHubLoading?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onContinueWithGitHub,
  onNavigateToAnalyze,
  isGitHubLoading = false
}) => {
  // If dedicated navigate to analyze is passed, use it, else fallback to continue with github
  const handleAnalyzeClick = () => {
    if (onNavigateToAnalyze) {
      onNavigateToAnalyze();
    } else {
      onContinueWithGitHub();
    }
  };

  const handleSeeHowItWorksClick = () => {
    const el = document.getElementById('analysis-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#00030E] text-[#F3E9EC] font-urbanist selection:bg-[#B47A9A] selection:text-[#00030E]">
      {/* Subtle procedural background grid & ambient lighting */}
      <AnimatedBackground />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <LandingHero
          onAnalyzeClick={handleAnalyzeClick}
          onSeeHowItWorksClick={handleSeeHowItWorksClick}
          isAnalyzing={isGitHubLoading}
        />

        {/* SECTION A — Repository Analysis */}
        <AnalysisCategoriesSection onAnalyzeClick={handleAnalyzeClick} />

        {/* SECTION B — Health Score */}
        <HealthScorePreviewSection />

        {/* SECTION C — Findings */}
        <FindingsPreviewSection />

        {/* SECTION D — AI-Powered Fixes */}
        <QuickFixPreviewSection />

        {/* SECTION E — Repository Improvement (Before -> After) */}
        <ImprovementComparisonSection />

        {/* SECTION F — Scan Coverage */}
        <ScanCoveragePreviewSection />

        {/* SECTION G — Final CTA */}
        <FinalCtaSection
          onAnalyzeClick={handleAnalyzeClick}
          isAnalyzing={isGitHubLoading}
        />
      </main>

      {/* Subtle Landing Page Footer */}
      <footer className="relative z-10 border-t border-[#5E3A5C]/60 bg-[#0B0E1A] px-4 sm:px-6 lg:px-12 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-urbanist text-xs text-[#B47A9A]/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F3E9EC]">Repo Doctor</span>
            <span>·</span>
            <span>AI-powered repository health analyzer</span>
          </div>
          <div className="flex items-center gap-6 text-[#B47A9A]/80">
            <span>Security</span>
            <span>Code Quality</span>
            <span>Git Hygiene</span>
            <span>CI/CD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
