import React from 'react';
import { Github, Loader2 } from 'lucide-react';

interface GitHubButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const GitHubButton: React.FC<GitHubButtonProps> = ({
  onClick,
  isLoading = false,
  loadingText = 'Authenticating with GitHub...',
  className = '',
  label = 'Continue with GitHub',
  disabled = false,
  id = 'continue-with-github-btn'
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-md ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <Github className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-105" />
          <span>{label}</span>
          <span className="ml-1 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
            Recommended
          </span>
        </>
      )}
    </button>
  );
};
