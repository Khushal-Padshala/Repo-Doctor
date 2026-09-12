import React from 'react';
import { RepoDoctorLogo } from './RepoDoctorLogo';
import { GitHubButton } from './GitHubButton';
import { ShieldCheck } from 'lucide-react';

interface AuthCardProps {
  onLoginWithGitHub: () => void;
  onLoginWithGoogle: () => void;
  isGitHubLoading?: boolean;
  isGoogleLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onLoginWithGitHub,
  onLoginWithGoogle,
  isGitHubLoading = false,
  isGoogleLoading = false,
  title = 'Repo Doctor',
  subtitle = 'Continuous repository health & automated remediation.'
}) => {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
      {/* Header Branding */}
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4">
          <RepoDoctorLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          {title}
        </h1>
        <p className="mt-2 text-xs font-sans text-blue-600 font-bold uppercase tracking-wider">
          {subtitle}
        </p>
        <p className="mt-3 text-xs text-slate-600 max-w-xs leading-relaxed font-sans">
          Sign in to connect repositories, run static and security audits, and generate verified pull requests.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative mt-8 space-y-3 font-sans">
        {/* Primary Emphasized GitHub Button */}
        <GitHubButton
          onClick={onLoginWithGitHub}
          isLoading={isGitHubLoading}
          loadingText="Authenticating with GitHub..."
          id="auth-card-github-btn"
        />

        {/* 'or' divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium">
            or
          </span>
        </div>

        {/* Secondary Google Button */}
        <button
          id="auth-card-google-btn"
          type="button"
          onClick={onLoginWithGoogle}
          disabled={isGitHubLoading || isGoogleLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
        >
          {isGoogleLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span>Authenticating with Google...</span>
            </span>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Security Badges */}
      <div className="relative mt-8 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>SOC2 Type II Certified · Zero Source Code Retention</span>
        </div>
      </div>
    </div>
  );
};
