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
  const [authStatusMessage, setAuthStatusMessage] = useState<string | null>(null);

  const handleGitHubLogin = () => {
    setIsGitHubLoading(true);
    setAuthStatusMessage('Connecting to GitHub API...');

    setTimeout(() => {
      setAuthStatusMessage('Verifying developer credentials...');
      setTimeout(() => {
        setIsGitHubLoading(false);
        onLoginSuccess('github');
      }, 400);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setAuthStatusMessage('Authenticating with Google Identity...');

    setTimeout(() => {
      setIsGoogleLoading(false);
      onLoginSuccess('google');
    }, 700);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 bg-[#00030E] text-[#F3E9EC]">
      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex justify-start">
        <button
          id="sign-in-back-to-landing-btn"
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 font-urbanist text-xs font-semibold text-[#B47A9A] hover:text-[#F3E9EC] transition"
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

      {/* Optional short status indicator during simulation */}
      {authStatusMessage && (isGitHubLoading || isGoogleLoading) && (
        <div className="mt-6 flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-4 py-1.5 font-urbanist text-xs font-medium text-[#F3E9EC] backdrop-blur-sm animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A]" />
          <span>{authStatusMessage}</span>
        </div>
      )}
    </div>
  );
};
