import React from 'react';
import { AnimatedBackground } from './landing/AnimatedBackground';
import { LandingHero } from './landing/LandingHero';
import { AnalysisCategoriesSection } from './landing/AnalysisCategoriesSection';
import { HealthScorePreviewSection } from './landing/HealthScorePreviewSection';

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
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-slate-900">
      {/* Subtle procedural background grid & ambient lighting */}
      <AnimatedBackground />

      <main className="relative z-10">
        {/* 1. HERO SECTION */}
        <LandingHero
          onAnalyzeClick={handleAnalyzeClick}
          onSeeHowItWorksClick={handleSeeHowItWorksClick}
          isAnalyzing={isGitHubLoading}
        />

        {/* 2. CATEGORY ANALYSIS SECTION (6 Boxes) */}
        <AnalysisCategoriesSection onAnalyzeClick={handleAnalyzeClick} />

        {/* 3. REPOSITORY HEALTH SCORE SECTION */}
        <HealthScorePreviewSection />
      </main>

      {/* Clean Modern Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-12 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Repo Doctor</span>
            <span>·</span>
            <span>AI-Powered Repository Health Diagnostics & Automated Remediation</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-slate-600">
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
