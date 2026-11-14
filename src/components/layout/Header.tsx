import React from 'react';
import { 
  Bell, 
  Cloud, 
  Sun, 
  Moon, 
  Menu
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobileNav,
}) => {
  const { 
    user,
    theme,
    setTheme,
    setIsAuthModalOpen,
    showToast
  } = useCollectly();

  return (
    <header className="sticky top-0 z-30 h-12 px-2.5 sm:px-4 bg-[#F5F5F7]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.07] flex items-center justify-between gap-2 sm:gap-3 select-none text-[var(--text-primary)]">
      {/* 1. Left Navigation Menu Toggle */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* 2. Right System Status & Controls */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
        {/* Connected Accounts indicator (Desktop only) */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.06] cursor-pointer transition-colors"
          title="Google & Instagram Connected Accounts"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
          <span>{user.name}</span>
        </button>

        {/* Cloud Sync Icon */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="hidden sm:flex w-7 h-7 items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          title="Cloud Sync Active"
        >
          <Cloud size={14} />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => showToast('Notifications', 'All your Instagram and Google saves are up to date.', 'info')}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:bg-black/[0.05] dark:active:bg-white/[0.08] cursor-pointer"
            title="Notifications"
          >
            <Bell size={14} />
          </button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#D92D20] rounded-full" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hidden sm:flex w-7 h-7 items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center font-bold text-[11.5px] cursor-pointer shadow-xs active:scale-95 transition-transform"
          title="Profile & Sync Accounts"
        >
          {user.avatar || 'A'}
        </div>
      </div>
    </header>
  );
};

export default Header;
