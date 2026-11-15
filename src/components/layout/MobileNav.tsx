import React from 'react';
import { 
  InstaHomeIcon, 
  InstaReelsIcon, 
  InstaBookmarkIcon, 
  InstaSearchIcon, 
  InstaGridIcon,
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
    setSelectedCollectionId,
    setSelectedCategoryId,
    setSelectedTagFilter,
    setSelectedTypeFilter
  } = useCollectly();

  const handleNav = (screen: ScreenId) => {
    setActiveScreen(screen);
    setSelectedCollectionId(null);
    setSelectedCategoryId(null);
    setSelectedTagFilter(null);
    if (screen === 'all-saves') {
      setSelectedTypeFilter('all');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-3 left-2.5 right-2.5 max-w-[420px] mx-auto z-40 h-[64px] px-2 rounded-full glass-dock flex items-center justify-around select-none shadow-[0_16px_40px_rgba(0,0,0,0.65)] border border-white/15 transition-all">
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => handleNav('dashboard')}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'dashboard'
            ? "bg-white/20 dark:bg-white/20 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Home"
        title="Home"
      >
        <InstaHomeIcon size={20} filled={activeScreen === 'dashboard'} strokeWidth={2} />
      </button>

      {/* 2. Saved Files & Items */}
      <button
        type="button"
        onClick={() => handleNav('all-saves')}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'all-saves' || activeScreen === 'recently-saved'
            ? "bg-white/20 dark:bg-white/20 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Saved Files"
        title="Saved Files"
      >
        <InstaBookmarkIcon size={20} filled={activeScreen === 'all-saves'} strokeWidth={2} />
      </button>

      {/* 3. Dedicated Reels & Videos */}
      <button
        type="button"
        onClick={() => handleNav('reels')}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'reels'
            ? "bg-white/20 dark:bg-white/20 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Reels & Video Clips"
        title="Reels & Video Clips"
      >
        <InstaReelsIcon size={20} filled={activeScreen === 'reels'} strokeWidth={2} />
      </button>

      {/* 4. Center Save Action (Instagram Gradient Button) */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="w-11 h-11 flex items-center justify-center rounded-full insta-gradient-bg text-white shadow-[0_4px_18px_rgba(225,48,108,0.45)] active:scale-90 transition-all cursor-pointer -translate-y-0.5"
        aria-label="Save New Item or File"
        title="Save New Item or File"
      >
        <InstaPlusIcon size={21} strokeWidth={2.4} />
      </button>

      {/* 5. Collections */}
      <button
        type="button"
        onClick={() => handleNav('collections')}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'collections' || activeScreen === 'collection-detail'
            ? "bg-white/20 dark:bg-white/20 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Collections"
        title="Collections"
      >
        <InstaGridIcon size={19} filled={activeScreen === 'collections'} strokeWidth={2} />
      </button>

      {/* 6. Settings (Clean bottom gear) */}
      <button
        type="button"
        onClick={() => handleNav('settings')}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer",
          activeScreen === 'settings'
            ? "bg-white/20 dark:bg-white/20 text-white shadow-inner scale-105"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Settings"
        title="Settings"
      >
        <InstaGearIcon size={19} filled={activeScreen === 'settings'} strokeWidth={2} />
      </button>
    </nav>
  );
};

export default MobileNav;
