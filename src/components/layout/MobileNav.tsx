import React from 'react';
import { 
  InstaHomeIcon, 
  InstaSearchIcon, 
  InstaPlusIcon, 
  InstaReelsIcon 
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
    setSelectedTypeFilter,
    user
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

  // Map active screen to tab index matching Instagram bottom bar:
  // 0: Home, 1: Search / Saves, 2: Plus, 3: Reels, 4: Profile
  const isHomeActive = activeScreen === 'dashboard';
  const isSearchActive = activeScreen === 'all-saves' || activeScreen === 'recently-saved' || activeScreen === 'collections' || activeScreen === 'collection-detail';
  const isReelsActive = activeScreen === 'reels';
  const isProfileActive = activeScreen === 'settings';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[62px] bg-white/92 dark:bg-[#120B1C]/92 backdrop-blur-2xl border-t border-black/[0.07] dark:border-white/[0.08] flex items-center justify-around px-3 select-none transition-colors duration-300">
      {/* 1. Home Tab (with Instagram Soft Capsule Pill when active) */}
      <button
        type="button"
        onClick={() => handleNav('dashboard')}
        className={clsx(
          "relative flex items-center justify-center h-10 px-4 rounded-full transition-all duration-300 active:scale-75 cursor-pointer ease-[cubic-bezier(0.25,1,0.5,1)]",
          isHomeActive
            ? "bg-black/[0.08] dark:bg-white/[0.14] text-black dark:text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Home"
        title="Home"
      >
        <InstaHomeIcon 
          size={23} 
          filled={isHomeActive} 
          strokeWidth={isHomeActive ? 2.4 : 2} 
          className="transition-transform duration-300"
        />
      </button>

      {/* 2. Search & Saves Tab */}
      <button
        type="button"
        onClick={() => handleNav('all-saves')}
        className={clsx(
          "relative flex items-center justify-center h-10 px-4 rounded-full transition-all duration-300 active:scale-75 cursor-pointer ease-[cubic-bezier(0.25,1,0.5,1)]",
          isSearchActive
            ? "bg-black/[0.08] dark:bg-white/[0.14] text-black dark:text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Search & Saves"
        title="Search & Saves"
      >
        <InstaSearchIcon 
          size={23} 
          filled={isSearchActive} 
          strokeWidth={isSearchActive ? 2.6 : 2} 
          className="transition-transform duration-300"
        />
      </button>

      {/* 3. Instagram Create / Plus Tab (Square with +) */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="relative flex items-center justify-center h-10 px-3 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-75 active:rotate-12 transition-all duration-300 cursor-pointer ease-[cubic-bezier(0.25,1,0.5,1)]"
        aria-label="New Post"
        title="New Post"
      >
        <InstaPlusIcon 
          size={23} 
          strokeWidth={2.2} 
          className="transition-transform duration-200"
        />
      </button>

      {/* 4. Instagram Reels Tab */}
      <button
        type="button"
        onClick={() => handleNav('reels')}
        className={clsx(
          "relative flex items-center justify-center h-10 px-4 rounded-full transition-all duration-300 active:scale-75 cursor-pointer ease-[cubic-bezier(0.25,1,0.5,1)]",
          isReelsActive
            ? "bg-black/[0.08] dark:bg-white/[0.14] text-black dark:text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Reels"
        title="Reels"
      >
        <InstaReelsIcon 
          size={23} 
          filled={isReelsActive} 
          strokeWidth={isReelsActive ? 2.4 : 2} 
          className="transition-transform duration-300"
        />
      </button>

      {/* 5. Instagram Profile Avatar Tab */}
      <button
        type="button"
        onClick={() => handleNav('settings')}
        className={clsx(
          "relative flex items-center justify-center h-10 px-3.5 rounded-full transition-all duration-300 active:scale-75 cursor-pointer ease-[cubic-bezier(0.25,1,0.5,1)]",
          isProfileActive
            ? "bg-black/[0.08] dark:bg-white/[0.14]"
            : "hover:opacity-80"
        )}
        aria-label="Profile"
        title="Profile"
      >
        <div className={clsx(
          "w-6.5 h-6.5 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold transition-all duration-300 shadow-2xs",
          isProfileActive 
            ? "ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-[#120B1C]" 
            : "border border-black/20 dark:border-white/25",
          "insta-gradient-bg text-white"
        )}>
          {user.avatar || 'A'}
        </div>
      </button>
    </nav>
  );
};

export default MobileNav;
