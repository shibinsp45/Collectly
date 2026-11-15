import React from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  Menu,
  Fingerprint
} from 'lucide-react';
import { InstaSearchIcon } from '../ui/InstagramDesignIcons';
import { useCollectly } from '../../context/CollectlyContext';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobileNav,
}) => {
  const { 
    activeScreen,
    user,
    theme,
    setTheme,
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    setIsOnboardingOpen,
    setIsBiometricModalOpen,
    isBiometricsEnabled,
    showToast
  } = useCollectly();

  return (
    <header className="sticky top-0 z-30 h-12 px-3 sm:px-4 bg-white/60 dark:bg-[#120B1C]/65 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 select-none text-[var(--text-primary)] transition-colors">
      {/* 1. Left Navigation Menu Toggle & Mobile App Icon */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[8px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer active:scale-95 transition-all"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Mobile App Icon: Clicking opens onboarding & setup options! */}
        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="md:hidden w-7 h-7 rounded-[8px] insta-gradient-bg text-white flex items-center justify-center font-bold text-[12px] shadow-sm active:scale-95 transition-transform cursor-pointer"
          title="Collectly Setup & Onboarding"
        >
          C
        </button>
      </div>

      {/* 2. Right System Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {/* Quick Search Icon: Shown on all pages EXCEPT Dashboard */}
        {activeScreen !== 'dashboard' && (
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[var(--text-secondary)] hover:text-[#E1306C] dark:hover:text-[#FD1D1D] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title="Search by text, voice, or image (⌘K)"
            aria-label="Quick Search"
          >
            <InstaSearchIcon size={17} strokeWidth={2.2} />
          </button>
        )}

        {/* MOBILE ONLY: Biometric Fingerprint & PIN Lock Security Button (Removed on desktop and tablet) */}
        <button
          type="button"
          onClick={() => setIsBiometricModalOpen(true)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[8px] text-[#E1306C] dark:text-[#FD1D1D] bg-white/10 dark:bg-white/[0.06] hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10 shadow-2xs"
          title="Mobile Fingerprint & Phone PIN Lock"
          aria-label="Mobile Fingerprint & Phone PIN Lock"
        >
          <Fingerprint size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
};

export default Header;
