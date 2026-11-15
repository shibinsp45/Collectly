import React from 'react';
import { 
  InstaHomeIcon, 
  InstaReelsIcon, 
  InstaBookmarkIcon, 
  InstaSearchIcon, 
  InstaGearIcon,
  InstaPlusIcon 
} from '../ui/InstagramDesignIcons';
import { useCollectly } from '../../context/CollectlyContext';
import { ScreenId } from '../../types';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    setIsAddModalOpen, 
    setIsSearchModalOpen,
    setSelectedCollectionId,
    setSelectedCategoryId
  } = useCollectly();

  const handleNav = (screen: ScreenId) => {
    setActiveScreen(screen);
    setSelectedCollectionId(null);
    setSelectedCategoryId(null);
  };

  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 max-w-[390px] mx-auto z-40 h-[62px] px-2.5 rounded-full glass-dock flex items-center justify-between select-none shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-all">
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => handleNav('dashboard')}
        className={clsx(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'dashboard'
            ? "bg-white/20 dark:bg-white/15 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Home"
        title="Home"
      >
        <InstaHomeIcon size={21} filled={activeScreen === 'dashboard'} strokeWidth={2} />
      </button>

      {/* 2. Saves & Media / Reels */}
      <button
        type="button"
        onClick={() => handleNav('all-saves')}
        className={clsx(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'all-saves' || activeScreen === 'recently-saved'
            ? "bg-white/20 dark:bg-white/15 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Saves & Reels"
        title="Saves & Reels"
      >
        <InstaReelsIcon size={21} filled={activeScreen === 'all-saves'} strokeWidth={2} />
      </button>

      {/* 3. New Save / Plus Action (Instagram Gradient Button in Center) */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="w-11 h-11 flex items-center justify-center rounded-full insta-gradient-bg text-white shadow-[0_4px_16px_rgba(225,48,108,0.4)] active:scale-90 transition-all cursor-pointer"
        aria-label="Save New Item"
        title="Save New Item"
      >
        <InstaPlusIcon size={20} strokeWidth={2.4} />
      </button>

      {/* 4. Collections / Saved Ribbon */}
      <button
        type="button"
        onClick={() => handleNav('collections')}
        className={clsx(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'collections' || activeScreen === 'collection-detail'
            ? "bg-white/20 dark:bg-white/15 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Collections"
        title="Collections"
      >
        <InstaBookmarkIcon size={20} filled={activeScreen === 'collections'} strokeWidth={2} />
      </button>

      {/* 5. Search (Quick Spotlight Search) */}
      <button
        type="button"
        onClick={() => setIsSearchModalOpen(true)}
        className="w-11 h-11 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-90 transition-all cursor-pointer"
        aria-label="Search"
        title="Search"
      >
        <InstaSearchIcon size={20} strokeWidth={2} />
      </button>

      {/* 6. Settings (Gear with frosted active pill, matching reference screenshot) */}
      <button
        type="button"
        onClick={() => handleNav('settings')}
        className={clsx(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'settings'
            ? "bg-white/20 dark:bg-white/15 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Settings"
        title="Settings"
      >
        <InstaGearIcon size={20} filled={activeScreen === 'settings'} strokeWidth={2} />
      </button>
    </nav>
  );
};

export default MobileNav;
