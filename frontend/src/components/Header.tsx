import React from 'react';
import { GitBranch, LogIn, Activity, Search, Bell, Settings, HelpCircle, Plus } from 'lucide-react';
import { ScreenType, RepositoryData, UserProfile } from '../types';
import { UserMenu } from './common/UserMenu';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  repository: RepositoryData | null;
  onNewScan: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onSignIn: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  repository,
  onNewScan,
  user,
  onLogout,
  onSwitchAccount,
  onSignIn,
  activeTab = 'overview',
  onTabChange,
}) => {
  const isEntryScreen = currentScreen === 'landing' || currentScreen === 'sign-in';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Greeting & Section Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Good afternoon, {user?.name?.split(' ')[0] || 'Developer'}
            </h1>
          </div>

          {/* Subtabs like reference Origin image */}
          {!isEntryScreen && (
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  if (onTabChange) onTabChange('overview');
                  onNavigate('dashboard');
                }}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  activeTab === 'overview' && currentScreen === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onTabChange) onTabChange('issues');
                  onNavigate('dashboard');
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'issues'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Issues ({repository?.issues?.filter(i => !i.isResolved).length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onTabChange) onTabChange('remediations');
                  onNavigate('dashboard');
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'remediations'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Remediations
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls, Repo Breadcrumb & User Profile */}
        <div className="flex items-center gap-3">
          {/* Active Repo Chip if available */}
          {repository && !isEntryScreen && currentScreen !== 'repositories' && (
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700">
              <GitBranch className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold text-slate-900">{repository.owner}/{repository.name}</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[11px] text-slate-500">{repository.defaultBranch || 'main'}</span>
            </div>
          )}

          {/* Engine Status pill with noticeable animated ping & pulse blink */}
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="animate-pulse tracking-tight">Audit Engine Online</span>
          </div>

          {/* New Scan button */}
          <button
            type="button"
            onClick={onNewScan}
            title="Scan repository"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* User Profile */}
          {user ? (
            <UserMenu
              user={user}
              onLogout={onLogout}
              onSwitchAccount={onSwitchAccount}
            />
          ) : (
            <button
              id="header-sign-in-btn"
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/15 hover:shadow-lg transition cursor-pointer border border-white/20"
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
              }}
            >
              <LogIn className="h-3.5 w-3.5 text-cyan-200" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
