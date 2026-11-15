import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const navRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null); // 0 to 1
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleNav = useCallback((screen: ScreenId) => {
    setActiveScreen(screen);
    setSelectedCollectionId(null);
    setSelectedCategoryId(null);
    setSelectedTagFilter(null);
    if (screen === 'all-saves') {
      setSelectedTypeFilter('all');
    }
  }, [setActiveScreen, setSelectedCollectionId, setSelectedCategoryId, setSelectedTagFilter, setSelectedTypeFilter]);

  // Compute active index: 0: Home, 1: Search, 2: Create, 3: Reels, 4: Profile
  const getActiveIndex = useCallback(() => {
    switch (activeScreen) {
      case 'dashboard':
        return 0;
      case 'all-saves':
      case 'recently-saved':
      case 'collections':
      case 'collection-detail':
        return 1;
      case 'reels':
        return 3;
      case 'settings':
        return 4;
      default:
        return 0;
    }
  }, [activeScreen]);

  const activeIndex = getActiveIndex();
  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Execute navigation for a given index
  const triggerIndexAction = useCallback((index: number) => {
    switch (index) {
      case 0:
        handleNav('dashboard');
        break;
      case 1:
        handleNav('all-saves');
        break;
      case 2:
        setIsAddModalOpen(true);
        break;
      case 3:
        handleNav('reels');
        break;
      case 4:
        handleNav('settings');
        break;
    }
  }, [handleNav, setIsAddModalOpen]);

  // Handle pointer / touch dragging along the navbar
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateDragPosition(e.clientX);
  };

  const updateDragPosition = (clientX: number) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(relativeX, rect.width));
    const fraction = clampedX / rect.width;
    setDragPosition(fraction);
    const index = Math.min(4, Math.max(0, Math.floor(fraction * 5)));
    setHoveredIndex(index);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateDragPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (hoveredIndex !== null) {
      triggerIndexAction(hoveredIndex);
    }
    setDragPosition(null);
    setHoveredIndex(null);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragPosition(null);
    setHoveredIndex(null);
  };

  // Compute smooth horizontal translation for the sliding capsule indicator
  // When dragging, smoothly interpolate between 0% and 80% (for 5 items, each 20% width)
  const capsuleLeftPercent = isDragging && dragPosition !== null
    ? Math.max(1, Math.min(81, (dragPosition * 100) - 9))
    : (currentIndex * 20) + 1;

  return (
    <nav 
      ref={navRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={clsx(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 h-[62px]",
        "bg-white/92 dark:bg-[#120B1C]/92 backdrop-blur-2xl",
        "border-t border-black/[0.07] dark:border-white/[0.08]",
        "flex items-center px-2 select-none touch-none transition-colors duration-300",
        isDragging && "cursor-grabbing"
      )}
      style={{ touchAction: 'none' }}
    >
      {/* ============================================================== */}
      {/* 1. CONTINUOUS SLIDING CAPSULE INDICATOR                        */}
      {/* Glides seamlessly between tabs on tap or during touch-drag     */}
      {/* ============================================================== */}
      <div 
        className={clsx(
          "absolute top-2.5 h-[42px] w-[18%] rounded-full",
          "bg-black/[0.08] dark:bg-white/[0.14]",
          "pointer-events-none z-0 shadow-2xs border border-black/[0.03] dark:border-white/[0.05]",
          isDragging 
            ? "transition-none scale-105 opacity-90 shadow-md" 
            : "transition-all duration-320 ease-[cubic-bezier(0.25,1,0.5,1)]"
        )}
        style={{
          left: `${capsuleLeftPercent}%`
        }}
      />

      {/* ============================================================== */}
      {/* 2. FIVE INSTAGRAM NAVIGATION TABS                              */}
      {/* ============================================================== */}

      {/* Tab 0: Home */}
      <button
        type="button"
        onClick={() => handleNav('dashboard')}
        className={clsx(
          "relative z-10 flex-1 flex items-center justify-center h-12 rounded-full",
          "transition-all duration-200 active:scale-75 cursor-pointer",
          currentIndex === 0 
            ? "text-black dark:text-white font-semibold scale-105" 
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Home"
        title="Home"
      >
        <InstaHomeIcon 
          size={23} 
          filled={currentIndex === 0} 
          strokeWidth={currentIndex === 0 ? 2.4 : 2} 
          className="transition-transform duration-200"
        />
      </button>

      {/* Tab 1: Search & Saves */}
      <button
        type="button"
        onClick={() => handleNav('all-saves')}
        className={clsx(
          "relative z-10 flex-1 flex items-center justify-center h-12 rounded-full",
          "transition-all duration-200 active:scale-75 cursor-pointer",
          currentIndex === 1 
            ? "text-black dark:text-white font-semibold scale-105" 
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Search & Saves"
        title="Search & Saves"
      >
        <InstaSearchIcon 
          size={23} 
          filled={currentIndex === 1} 
          strokeWidth={currentIndex === 1 ? 2.6 : 2} 
          className="transition-transform duration-200"
        />
      </button>

      {/* Tab 2: Instagram New Post (Square with +) */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className={clsx(
          "relative z-10 flex-1 flex items-center justify-center h-12 rounded-full",
          "transition-all duration-200 active:scale-75 cursor-pointer",
          currentIndex === 2 
            ? "text-black dark:text-white scale-110" 
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="New Post"
        title="New Post"
      >
        <InstaPlusIcon 
          size={23} 
          strokeWidth={2.2} 
          className={clsx("transition-transform duration-200", currentIndex === 2 && "rotate-90 text-[#E1306C]")}
        />
      </button>

      {/* Tab 3: Instagram Reels */}
      <button
        type="button"
        onClick={() => handleNav('reels')}
        className={clsx(
          "relative z-10 flex-1 flex items-center justify-center h-12 rounded-full",
          "transition-all duration-200 active:scale-75 cursor-pointer",
          currentIndex === 3 
            ? "text-black dark:text-white font-semibold scale-105" 
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
        aria-label="Reels"
        title="Reels"
      >
        <InstaReelsIcon 
          size={23} 
          filled={currentIndex === 3} 
          strokeWidth={currentIndex === 3 ? 2.4 : 2} 
          className="transition-transform duration-200"
        />
      </button>

      {/* Tab 4: Profile & Settings */}
      <button
        type="button"
        onClick={() => handleNav('settings')}
        className={clsx(
          "relative z-10 flex-1 flex items-center justify-center h-12 rounded-full",
          "transition-all duration-200 active:scale-75 cursor-pointer",
          currentIndex === 4 ? "scale-105" : "hover:opacity-80"
        )}
        aria-label="Profile"
        title="Profile"
      >
        <div className={clsx(
          "w-6.5 h-6.5 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold transition-all duration-200 shadow-2xs",
          currentIndex === 4 
            ? "ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-[#120B1C] scale-105" 
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
