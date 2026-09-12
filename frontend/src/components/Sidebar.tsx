import React from 'react';
import {
  Home,
  GitBranch,
  ShieldCheck,
  Code2,
  FolderGit2,
  GitPullRequest,
  Workflow,
  FileText,
  Plus,
  Activity,
} from 'lucide-react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onNewScan: () => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onNewScan,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200 bg-white/80 backdrop-blur-md px-4 py-6 select-none shrink-0 min-h-screen">
      {/* Top Brand & Nav */}
      <div className="space-y-8">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-3 cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition">
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block">
              Repo Doctor
            </span>
            <span className="text-[10px] font-semibold text-slate-600 block">
              v2.4 Pro Audit
            </span>
          </div>
        </div>

        {/* Section 1: TRACK & AUDIT */}
        <div className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">
            AUDIT & DIAGNOSTICS
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('all');
              onNavigate('dashboard');
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              currentScreen === 'dashboard' && activeCategory === 'all'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="h-4 w-4 text-slate-600" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('repositories')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              currentScreen === 'repositories'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <GitBranch className="h-4 w-4 text-slate-600" />
            <span>Repositories</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('security');
              onNavigate('dashboard');
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              activeCategory === 'security' && currentScreen === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-slate-600" />
            <span>Security & Secrets</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('quality');
              onNavigate('dashboard');
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              activeCategory === 'quality' && currentScreen === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Code2 className="h-4 w-4 text-slate-600" />
            <span>Code Quality</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('hygiene');
              onNavigate('dashboard');
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              activeCategory === 'hygiene' && currentScreen === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="h-4 w-4 text-slate-600" />
            <span>Git Hygiene</span>
          </button>
        </div>

        {/* Section 2: ENGINES & REMEDIATION */}
        <div className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">
            ENGINES & CI
          </div>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <GitPullRequest className="h-4 w-4 text-slate-600" />
            <span>Pull Request Curer</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Workflow className="h-4 w-4 text-slate-600" />
            <span>CI / CD Workflows</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <FileText className="h-4 w-4 text-slate-600" />
            <span>Audit Reports</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Pill Button */}
      <div className="pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onNewScan}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 py-3 px-4 text-xs font-bold text-slate-900 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span>Run Checkup</span>
        </button>
      </div>
    </aside>
  );
};
