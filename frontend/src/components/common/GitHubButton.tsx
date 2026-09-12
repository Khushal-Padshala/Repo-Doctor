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
      className={`group relative flex w-full items-center justify-center gap-3 rounded-full bg-[#F3E9EC] px-5 py-3.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] transition-all duration-200 hover:bg-[#B47A9A] hover:text-[#00030E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-lg ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-[#00030E]" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <Github className="h-4 w-4 text-[#00030E] transition-transform duration-200 group-hover:scale-105" />
          <span>{label}</span>
          <span className="ml-1 rounded-full bg-[#2C1B2F] border border-[#5E3A5C] px-2 py-0.5 text-[9px] font-urbanist font-bold text-[#B47A9A]">
            Recommended
          </span>
        </>
      )}
    </button>
  );
};
