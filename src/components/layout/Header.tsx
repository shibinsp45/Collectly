import React from 'react';
import { 
  Bell, 
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
    <header className="sticky top-0 z-30 h-12 px-3 sm:px-4 bg-[#F5F5F7]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.07] flex items-center justify-between gap-2 select-none text-[var(--text-primary)]">
      {/* 1. Left Navigation Menu Toggle (Mobile) */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* 2. Right System Toolbar: Only Notifications, Dark/Light Mode Toggle, and Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => showToast('Notifications', 'All your Instagram and Google saves are up to date.', 'info')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell size={15} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D92D20] rounded-full" />
        </div>

        {/* Dark & White Mode Toggle (Always accessible on all screen sizes) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Profile Avatar (Opens Profile & Account Details Modal) */}
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center font-bold text-[11.5px] cursor-pointer shadow-xs active:scale-95 transition-transform ml-1"
          title="Open Profile & Sync Details"
        >
          {user.avatar || 'A'}
        </button>
      </div>
    </header>
  );
};

export default Header;
