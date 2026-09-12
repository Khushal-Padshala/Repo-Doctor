import React, { useState } from 'react';
import { AuthCard } from './common/AuthCard';
import { ArrowLeft } from 'lucide-react';

interface SignInPageProps {
  onLoginSuccess: (provider: 'github' | 'google') => void;
  onBackToLanding: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onLoginSuccess,
  onBackToLanding
}) => {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsGitHubLoading(true);

    setTimeout(() => {
      setTimeout(() => {
        setIsGitHubLoading(false);
        onLoginSuccess('github');
      }, 400);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);

    setTimeout(() => {
      setIsGoogleLoading(false);
      onLoginSuccess('google');
    }, 700);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 bg-slate-50 text-slate-900 font-sans">
      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex justify-start">
        <button
          id="sign-in-back-to-landing-btn"
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to overview</span>
        </button>
      </div>

      {/* Authentication Card */}
      <AuthCard
        onLoginWithGitHub={handleGitHubLogin}
        onLoginWithGoogle={handleGoogleLogin}
        isGitHubLoading={isGitHubLoading}
        isGoogleLoading={isGoogleLoading}
      />
    </div>
  );
};
