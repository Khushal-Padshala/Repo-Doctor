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
  Sparkles,
  Search
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
  const [repoUrl, setRepoUrl] = useState('https://github.com/Khushal-Padshala/Repo-Doctor');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isGitHubConnecting, setIsGitHubConnecting] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(user?.provider === 'github');

  const effectiveUrl = repoUrl.trim() || 'https://github.com/Khushal-Padshala/Repo-Doctor';
  const parsedInfo: ParsedRepoInfo = parseGitHubUrl(effectiveUrl);
  const isInputNonEmpty = repoUrl.trim().length > 0;
  const isInvalid = isInputNonEmpty && !parsedInfo.isValid;
  const isValid = parsedInfo.isValid;

  const handleAnalyze = () => {
    const submitFn = onAnalyzeRepository || onCustomRepoSubmit;
    const target = parsedInfo.isValid ? (parsedInfo.url || effectiveUrl) : effectiveUrl;
    submitFn(target);
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

  const sampleRepos = [
    'https://github.com/Khushal-Padshala/Repo-Doctor',
    'https://github.com/facebook/react',
    'https://github.com/vercel/next.js',
    'https://github.com/tailwindlabs/tailwindcss'
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 text-slate-900 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              REPOSITORY AUDIT INTELLIGENCE
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isGitHubConnected ? (
              <button
                id="connect-github-btn"
                type="button"
                onClick={handleConnectGitHub}
                disabled={isGitHubConnecting}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 shadow-xs cursor-pointer"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{isGitHubConnecting ? 'Connecting...' : 'Connect GitHub'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>GitHub Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Central Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Analyze any GitHub repository
            </h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Paste a public or private GitHub repository URL to inspect security, code smells, git hygiene, and CI/CD pipelines.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="repository-url-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                GITHUB REPOSITORY URL
              </label>

              <div className="relative flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-600">
                  <Search className="h-4 w-4 text-slate-600" />
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
                  placeholder="https://github.com/owner/repository"
                  className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-11 pr-10 font-mono text-xs text-slate-900 placeholder-slate-400 transition focus:outline-none focus:bg-white ${
                    isInvalid && hasInteracted
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                      : isValid
                      ? 'border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                      : 'border-slate-200 focus:border-slate-400'
                  }`}
                  autoComplete="off"
                  autoFocus
                />

                {repoUrl && (
                  <button
                    type="button"
                    onClick={() => setRepoUrl('')}
                    className="absolute right-3 rounded-md p-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {isInvalid && hasInteracted ? (
                <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)
                </p>
              ) : (
                <p className="text-[11px] text-slate-600">
                  Enter any public GitHub repo URL to diagnose health scores and automated cures.
                </p>
              )}
            </div>

            {/* Quick Sample Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Quick Test Repositories:</span>
              <div className="flex flex-wrap gap-2">
                {sampleRepos.map((sample) => {
                  const name = sample.replace('https://github.com/', '');
                  return (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setRepoUrl(sample);
                        setHasInteracted(true);
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-repo-submit-btn"
              type="submit"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition duration-150 shadow-sm bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                  <span>Diagnosing Repository Health...</span>
                </>
              ) : (
                <>
                  <span>Analyze Repository</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
