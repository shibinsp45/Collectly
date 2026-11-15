import React from 'react';
import { InstaSearchIcon } from '../ui/InstagramDesignIcons';
import { useCollectly } from '../../context/CollectlyContext';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const { 
    activeScreen,
    setIsSearchModalOpen,
  } = useCollectly();

  return (
    // Desktop & Tablet only: Completely hidden on mobile UI as requested
    <header className="hidden md:flex sticky top-0 z-30 h-11 sm:h-12 px-3 sm:px-4 bg-white/60 dark:bg-[#120B1C]/65 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] items-center justify-between gap-2 select-none text-[var(--text-primary)] transition-colors">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[13.5px] font-semibold text-[var(--text-secondary)]">
          Collectly Knowledge Cloud
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {activeScreen !== 'dashboard' && (
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-[8px] text-[var(--text-secondary)] hover:text-[#E1306C] dark:hover:text-[#FD1D1D] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title="Search by text, voice, or image (⌘K)"
            aria-label="Quick Search"
          >
            <InstaSearchIcon size={16} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
