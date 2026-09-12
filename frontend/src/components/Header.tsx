import React from 'react';
import { GitBranch, LogIn, FolderGit2, Activity, ArrowRight } from 'lucide-react';
import { ScreenType, RepositoryData, UserProfile } from '../types';
import { RepoDoctorLogo } from './common/RepoDoctorLogo';
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
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  repository,
  onNewScan,
  user,
  onLogout,
  onSwitchAccount,
  onSignIn
}) => {
  const isEntryScreen = currentScreen === 'landing' || currentScreen === 'sign-in';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2C1B2F] bg-[#00030E]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-6">
          <button
            id="header-brand-button"
            onClick={() => {
              if (user) {
                onNavigate('repositories');
              } else {
                onNavigate('landing');
              }
            }}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <RepoDoctorLogo size="sm" showPulse={false} />
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#F3E9EC] transition font-urbanist">
                Repo Doctor
              </span>
              <span className="rounded-full bg-[#0B0E1A] px-2 py-0.5 text-[10px] font-urbanist font-bold text-[#B47A9A] border border-[#5E3A5C]">
                v2.4
              </span>
            </div>
          </button>

          {/* Repository Breadcrumb if active and in dashboard/issue view */}
          {repository && !isEntryScreen && currentScreen !== 'repositories' && (
            <div className="hidden items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3.5 py-1.5 text-xs text-[#F3E9EC] md:flex font-urbanist">
              <GitBranch className="h-3.5 w-3.5 text-[#B47A9A]" />
              <span className="font-mono text-xs text-[#F3E9EC]/80">
                {repository.owner}/<span className="text-[#F3E9EC] font-semibold">{repository.name}</span>
              </span>
              <span className="text-[#5E3A5C]">/</span>
              <span className="font-mono text-[11px] text-[#B47A9A]">
                {repository.defaultBranch || 'main'}
              </span>
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Engine Active Status */}
          <div className="hidden items-center gap-2 rounded-full border border-[#5E3A5C]/60 bg-[#0B0E1A]/80 px-3 py-1 text-[11px] font-urbanist font-bold text-[#B47A9A] lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B47A9A] animate-pulse" />
            <span className="uppercase tracking-wider">HEALTH ENGINE ONLINE</span>
          </div>

          {/* If user is logged in */}
          {user ? (
            <>
              {currentScreen !== 'repositories' && !isEntryScreen && (
                <button
                  id="header-repositories-button"
                  onClick={() => onNavigate('repositories')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-urbanist text-xs font-bold transition ${
                    currentScreen === 'repositories'
                      ? 'bg-[#2C1B2F] text-[#F3E9EC] border border-[#5E3A5C]'
                      : 'text-[#F3E9EC]/70 hover:bg-[#0B0E1A] hover:text-[#F3E9EC] border border-transparent'
                  }`}
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Analyze Repo</span>
                </button>
              )}

              {repository && !isEntryScreen && currentScreen !== 'dashboard' && (
                <button
                  id="header-dashboard-button"
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-urbanist text-xs font-bold text-[#F3E9EC]/80 hover:bg-[#0B0E1A] hover:text-[#F3E9EC] transition"
                >
                  <Activity className="h-3.5 w-3.5 text-[#B47A9A]" />
                  <span>Dashboard</span>
                </button>
              )}

              {repository && !isEntryScreen && (
                <button
                  id="header-switch-repo-button"
                  onClick={onNewScan}
                  className="flex items-center gap-1.5 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-4 py-1.5 font-urbanist text-xs font-bold text-[#F3E9EC] transition hover:border-[#B47A9A] hover:bg-[#2C1B2F]"
                >
                  <span>Analyze New Repo</span>
                </button>
              )}

              <UserMenu
                user={user}
                onLogout={onLogout}
                onSwitchAccount={onSwitchAccount}
              />
            </>
          ) : (
            <button
              id="header-sign-in-btn"
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-4 py-1.5 font-urbanist text-xs font-bold text-[#F3E9EC] hover:bg-[#2C1B2F] hover:border-[#B47A9A] transition shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5 text-[#B47A9A]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
