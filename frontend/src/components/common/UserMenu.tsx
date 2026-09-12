import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types';
import {
  LogOut,
  User,
  Github,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface UserMenuProps {
  user: UserProfile;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onSwitchAccount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-urbanist" ref={menuRef}>
      {/* Trigger Button */}
      <button
        id="user-profile-menu-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[#5E3A5C] bg-[#0B0E1A] px-3 py-1.5 text-xs text-[#F3E9EC] transition-all duration-200 hover:border-[#B47A9A] hover:bg-[#2C1B2F] focus:outline-none"
      >
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#2C1B2F] text-[#B47A9A] font-urbanist text-[11px] font-bold border border-[#5E3A5C]">
          {user.name.charAt(0)}
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#B47A9A] border border-[#00030E]" />
        </div>

        <span className="hidden font-bold sm:inline">{user.name}</span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-[#B47A9A] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#F3E9EC]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-[#5E3A5C] bg-[#0B0E1A] p-2 shadow-2xl backdrop-blur-xl z-50">
          {/* User Details Header */}
          <div className="border-b border-[#2C1B2F] px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3E9EC] font-urbanist">
                {user.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2C1B2F] px-2 py-0.5 text-[10px] font-urbanist font-bold text-[#B47A9A] border border-[#5E3A5C]">
                <Github className="h-2.5 w-2.5" />
                {user.provider}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-[#F3E9EC]/70 truncate">
              {user.username}
            </p>
            <p className="text-[10px] text-[#B47A9A]/80 truncate font-urbanist">
              {user.email}
            </p>
          </div>

          {/* Menu Options */}
          <div className="py-1">
            <button
              id="user-menu-switch-account-btn"
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSwitchAccount();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#F3E9EC] transition-colors hover:bg-[#2C1B2F] hover:text-[#F3E9EC]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#B47A9A]" />
              <span>Switch account</span>
            </button>

            <button
              id="user-menu-logout-btn"
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#B47A9A] transition-colors hover:bg-[#2C1B2F] hover:text-[#F3E9EC]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
