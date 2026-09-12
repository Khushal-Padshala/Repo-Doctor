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
  subtitle = "Continuous repository health & automated remediation."
}) => {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-10 shadow-2xl">
      {/* Header Branding */}
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4">
          <RepoDoctorLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3E9EC] font-urbanist">
          {title}
        </h1>
        <p className="mt-2 text-xs font-urbanist text-[#B47A9A] font-semibold uppercase tracking-wider">
          {subtitle}
        </p>
        <p className="mt-3 text-xs text-[#F3E9EC]/70 max-w-xs leading-relaxed font-urbanist">
          Sign in to connect repositories, run static and security audits, and generate verified pull requests.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative mt-8 space-y-3.5 font-urbanist">
        {/* Primary Emphasized GitHub Button */}
        <GitHubButton
          onClick={onLoginWithGitHub}
          isLoading={isGitHubLoading}
          loadingText="Authenticating with GitHub..."
          id="auth-card-github-btn"
        />

        {/* 'or' divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-[#5E3A5C]" />
          <span className="absolute bg-[#0B0E1A] px-3 font-urbanist text-xs text-[#B47A9A] font-medium">
            or
          </span>
        </div>

        {/* Secondary Google Button */}
        <button
          id="auth-card-google-btn"
          type="button"
          onClick={onLoginWithGoogle}
          disabled={isGitHubLoading || isGoogleLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-5 py-3 font-urbanist text-xs font-bold uppercase tracking-wider text-[#F3E9EC] transition-all duration-200 hover:border-[#B47A9A] hover:bg-[#2C1B2F] hover:text-[#F3E9EC] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#B47A9A] border-t-transparent" />
              <span>Authenticating with Google...</span>
            </span>
          ) : (
            <>
              {/* Google SVG Icon */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Security note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-urbanist text-[#F3E9EC]/70 font-medium">
        <ShieldCheck className="h-3.5 w-3.5 text-[#B47A9A] shrink-0" />
        <span>Read-only AST scans · Zero code retention</span>
      </div>

      {/* Terms and Privacy Policy */}
      <div className="mt-6 border-t border-[#5E3A5C]/60 pt-4 text-center">
        <p className="text-[11px] text-[#B47A9A]/70 leading-relaxed font-urbanist">
          By continuing, you agree to our{' '}
          <span className="text-[#F3E9EC] hover:text-[#B47A9A] underline underline-offset-2 cursor-pointer transition">
            Terms
          </span>{' '}
          and{' '}
          <span className="text-[#F3E9EC] hover:text-[#B47A9A] underline underline-offset-2 cursor-pointer transition">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};
