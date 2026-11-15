import React from 'react';
import { 
  Fingerprint
} from 'lucide-react';
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
    setIsBiometricModalOpen,
  } = useCollectly();

  return (
    <header className="sticky top-0 z-30 h-11 sm:h-12 px-3 sm:px-4 bg-white/60 dark:bg-[#120B1C]/65 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 select-none text-[var(--text-primary)] transition-colors">
      {/* 1. Left: Mobile Collectly Brand (No hamburger menu, no side navbar on mobile) */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-[8px] insta-gradient-bg text-white flex items-center justify-center font-bold text-[12px] shadow-sm">
            C
          </div>
          <span className="text-[14px] font-bold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
            Collectly
          </span>
        </div>
      </div>

      {/* 2. Right: Quick Search and Mobile-Only Biometric Fingerprint & PIN Lock Security Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {/* Quick Search Icon: Shown on all pages EXCEPT Dashboard */}
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

        {/* MOBILE ONLY: Biometric Fingerprint & PIN Lock Security Button (Removed on desktop and tablet) */}
        <button
          type="button"
          onClick={() => setIsBiometricModalOpen(true)}
          className="md:hidden w-7.5 h-7.5 flex items-center justify-center rounded-[8px] text-[#E1306C] dark:text-[#FD1D1D] bg-white/10 dark:bg-white/[0.06] hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10 shadow-2xs"
          title="Mobile Fingerprint & Phone PIN Lock"
          aria-label="Mobile Fingerprint & Phone PIN Lock"
        >
          <Fingerprint size={15} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
};

export default Header;
