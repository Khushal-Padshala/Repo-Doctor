import React from 'react';
import {
  FolderGit2,
  GitBranch,
  Star,
  GitFork,
  ArrowRight,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RepoSelectionItem } from '../../data/mockData';

interface RepositoryCardProps {
  repo: RepoSelectionItem;
  onAnalyze: (repo: RepoSelectionItem) => void;
  isAnalyzing?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-[#B47A9A]',
  'Node.js': 'bg-[#5E3A5C]',
  Python: 'bg-amber-400',
  JavaScript: 'bg-[#B47A9A]',
  Go: 'bg-indigo-400',
  Rust: 'bg-[#8A334E]'
};

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  onAnalyze,
  isAnalyzing = false
}) => {
  const langColor = LANGUAGE_COLORS[repo.language] || 'bg-neutral-400';

  return (
    <div
      id={`repo-card-${repo.name}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-5 transition-all duration-200 hover:border-[#B47A9A] hover:bg-[#2C1B2F]/60 hover:shadow-xl font-urbanist"
    >
      {/* Top Header: Icon + Names */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#5E3A5C] bg-[#00030E] text-[#F3E9EC] transition-colors group-hover:border-[#B47A9A] group-hover:text-[#B47A9A]">
              <FolderGit2 className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#F3E9EC] transition-colors font-urbanist">
                  {repo.name}
                </h3>
                {repo.overallScore !== undefined && (
                  <span className="inline-flex items-center rounded-full bg-[#2C1B2F] px-2.5 py-0.5 text-[10px] font-urbanist font-bold text-[#B47A9A] border border-[#5E3A5C]">
                    Grade {repo.letterGrade} • {repo.overallScore}/100
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#F3E9EC]/60">
                {repo.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-[#F3E9EC]/70 line-clamp-2 leading-relaxed font-urbanist">
          {repo.description}
        </p>
      </div>

      {/* Metadata & Footer Section */}
      <div className="mt-5 border-t border-[#5E3A5C]/60 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#F3E9EC]/70 font-urbanist">
            {/* Language */}
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${langColor}`} />
              <span className="font-semibold text-[#F3E9EC]">{repo.language}</span>
            </div>

            {/* Default Branch */}
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#B47A9A]/80">
              <GitBranch className="h-3 w-3 text-[#B47A9A]" />
              <span>{repo.defaultBranch}</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-[11px] text-[#B47A9A]/80 font-medium">
              <Star className="h-3 w-3 text-[#B47A9A]" />
              <span>{repo.stars}</span>
            </div>

            {/* Last Scanned */}
            <span className="hidden text-[11px] text-[#B47A9A]/60 sm:inline font-medium">
              • {repo.lastScanned}
            </span>
          </div>

          {/* Analyze Action Button */}
          <button
            id={`analyze-btn-${repo.name}`}
            type="button"
            onClick={() => onAnalyze(repo)}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E9EC] px-4 py-1.5 font-urbanist text-xs font-bold text-[#00030E] transition-all duration-200 hover:bg-[#B47A9A] hover:text-[#00030E] focus:outline-none disabled:opacity-50 shadow-md"
          >
            {isAnalyzing ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#00030E] border-t-transparent" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#00030E]" />
                <span>Analyze</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
