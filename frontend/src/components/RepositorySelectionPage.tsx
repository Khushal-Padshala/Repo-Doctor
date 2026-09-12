import React, { useState } from 'react';
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  GitBranch,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { parseGitHubUrl, ParsedRepoInfo } from '../services/repositoryService';

interface RepositorySelectionPageProps {
  user: UserProfile | null;
  onSelectRepository?: (repoItem: any) => void;
  onCustomRepoSubmit: (repoUrl: string) => void;
  onAnalyzeRepository?: (repoUrl: string) => void;
  onSwitchAccount: () => void;
  isAnalyzing?: boolean;
}

export const RepositorySelectionPage: React.FC<RepositorySelectionPageProps> = ({
  user,
  onCustomRepoSubmit,
  onAnalyzeRepository,
  onSwitchAccount,
  isAnalyzing = false
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isGitHubConnecting, setIsGitHubConnecting] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(user?.provider === 'github');

  const parsedInfo: ParsedRepoInfo = parseGitHubUrl(repoUrl);
  const isInputNonEmpty = repoUrl.trim().length > 0;
  const isInvalid = isInputNonEmpty && !parsedInfo.isValid;
  const isValid = isInputNonEmpty && parsedInfo.isValid;

  const handleAnalyze = () => {
    if (!isValid) return;
    const submitFn = onAnalyzeRepository || onCustomRepoSubmit;
    submitFn(parsedInfo.url || repoUrl.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  const handleConnectGitHub = () => {
    setIsGitHubConnecting(true);
    setTimeout(() => {
      setIsGitHubConnecting(false);
      setIsGitHubConnected(true);
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#00030E] px-4 py-16 sm:px-6 lg:px-8 text-[#F3E9EC] flex flex-col justify-between selection:bg-[#B47A9A] selection:text-[#00030E]">
      {/* Background subtle grid and lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(180,122,154,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,122,154,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-[#5E3A5C]/20 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-3xl">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#5E3A5C]/60 pb-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#B47A9A]" />
              <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]">
                REPOSITORY INTELLIGENCE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F3E9EC] font-urbanist">
              Analyze a repository
            </h1>
            <p className="mt-1 text-sm text-[#F3E9EC]/70 font-urbanist">
              Connect a GitHub repository and run a complete repository health analysis.
            </p>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {!isGitHubConnected ? (
              <button
                id="connect-github-btn"
                type="button"
                onClick={handleConnectGitHub}
                disabled={isGitHubConnecting}
                className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-4 py-2 font-urbanist text-xs font-bold text-[#F3E9EC] transition hover:border-[#B47A9A] hover:bg-[#2C1B2F] hover:text-[#F3E9EC] disabled:opacity-50"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{isGitHubConnecting ? 'Connecting...' : 'Connect GitHub'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-3.5 py-1.5 font-urbanist text-xs font-bold text-[#B47A9A]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#B47A9A]" />
                <span>GitHub Connected</span>
              </div>
            )}

            <button
              id="switch-account-button"
              type="button"
              onClick={onSwitchAccount}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3.5 py-2 font-urbanist text-xs font-semibold text-[#B47A9A] transition hover:border-[#B47A9A] hover:bg-[#2C1B2F] hover:text-[#F3E9EC]"
              title="Switch user account"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Switch account</span>
            </button>
          </div>
        </div>

        {/* Main Central Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3E9EC] font-urbanist">
                Analyze any GitHub repository
              </h2>
              <p className="mt-3 text-sm text-[#F3E9EC]/70 leading-relaxed max-w-xl font-urbanist">
                Paste a GitHub repository URL and let Repo Doctor inspect its structure, security,
                code quality, Git hygiene, testing, documentation and CI/CD configuration.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label
                  htmlFor="repository-url-input"
                  className="block font-urbanist text-xs font-bold uppercase tracking-widest text-[#B47A9A]"
                >
                  GITHUB REPOSITORY URL
                </label>

                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#B47A9A]">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </div>

                  <input
                    id="repository-url-input"
                    type="text"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value);
                      if (!hasInteracted) setHasInteracted(true);
                    }}
                    onBlur={() => setHasInteracted(true)}
                    placeholder="https://github.com/user/repository"
                    className={`w-full rounded-2xl border bg-[#00030E] py-4 pl-12 pr-12 font-mono text-sm text-[#F3E9EC] placeholder-[#B47A9A]/40 transition focus:outline-none ${
                      isInvalid && hasInteracted
                        ? 'border-[#8A334E] focus:border-[#8A334E] focus:ring-1 focus:ring-[#8A334E]/20'
                        : isValid
                        ? 'border-[#B47A9A] focus:border-[#B47A9A] focus:ring-1 focus:ring-[#B47A9A]/30'
                        : 'border-[#5E3A5C] focus:border-[#B47A9A]'
                    }`}
                    autoComplete="off"
                    autoFocus
                  />

                  {repoUrl && (
                    <button
                      type="button"
                      onClick={() => setRepoUrl('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#B47A9A] hover:text-[#F3E9EC]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Status / Validation Message */}
                {isInvalid && hasInteracted ? (
                  <p className="flex items-center gap-1.5 font-urbanist text-xs text-[#8A334E] font-semibold">
                    <AlertCircle className="h-3.5 w-3.5 text-[#8A334E]" />
                    <span>Enter a valid GitHub repository URL.</span>
                  </p>
                ) : (
                  <p className="font-urbanist text-xs text-[#F3E9EC]/70">
                    Enter a public GitHub repository URL to begin inspection.
                  </p>
                )}
              </div>

              {/* Extracted Preview Card (Only shows when a valid URL is entered) */}
              {isValid && (
                <div
                  id="repository-preview-card"
                  className="rounded-2xl border border-[#5E3A5C] bg-[#2C1B2F]/60 p-5 transition animate-in fade-in duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00030E] border border-[#5E3A5C] text-[#B47A9A] shrink-0">
                        <GitBranch className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="font-urbanist text-[11px] font-bold uppercase tracking-widest text-[#B47A9A]">
                          REPOSITORY
                        </div>
                        <div className="font-mono text-base font-semibold text-[#F3E9EC]">
                          {parsedInfo.fullName}
                        </div>
                        <div className="font-urbanist text-xs text-[#F3E9EC]/70 flex items-center gap-2 mt-0.5 font-medium">
                          <span>GitHub repository</span>
                          <span>•</span>
                          <span className="text-[#B47A9A] font-bold">public</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id="preview-analyze-btn"
                      type="button"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F3E9EC] px-6 py-2.5 font-urbanist text-xs font-bold uppercase tracking-wider text-[#00030E] hover:bg-[#B47A9A] transition disabled:opacity-50"
                    >
                      <span>Analyze Repository</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </form>

            {/* Public Repositories Supported & Format hints */}
            <div className="pt-6 border-t border-[#5E3A5C]/60 text-center space-y-2 font-urbanist">
              <p className="text-xs text-[#F3E9EC]/70 font-medium">
                Public GitHub repositories supported
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#B47A9A]/80">
                <span>https://github.com/user/repo</span>
                <span>•</span>
                <span>github.com/user/repo</span>
                <span>•</span>
                <span>user/repo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Below Form */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A]/80 p-4 text-center font-urbanist">
            <div className="text-xs font-bold text-[#F3E9EC] uppercase tracking-wider">
              Read-Only Inspection
            </div>
            <p className="mt-1 text-[11px] text-[#B47A9A]">
              Zero code storage or clone retention
            </p>
          </div>

          <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A]/80 p-4 text-center font-urbanist">
            <div className="text-xs font-bold text-[#F3E9EC] uppercase tracking-wider">
              42 Health & Security Checks
            </div>
            <p className="mt-1 text-[11px] text-[#B47A9A]">
              AST parsing, secrets, hygiene, and CI/CD
            </p>
          </div>

          <div className="rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A]/80 p-4 text-center font-urbanist">
            <div className="text-xs font-bold text-[#F3E9EC] uppercase tracking-wider">
              Automated Remediation
            </div>
            <p className="mt-1 text-[11px] text-[#B47A9A]">
              1-click verified pull request generation
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mx-auto mt-16 text-center text-xs font-mono text-[#B47A9A]/60">
        Repo Doctor v2.4 • Non-invasive AST and security repository scanner
      </div>
    </div>
  );
};
