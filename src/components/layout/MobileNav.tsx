import React from 'react';
import { House, Library, Plus, Folder, Search } from 'lucide-react';
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

  const navItems = [
    { id: 'dashboard' as ScreenId, label: 'Home', icon: House },
    { id: 'all-saves' as ScreenId, label: 'Saves', icon: Library },
    { id: 'add' as const, label: 'Add', icon: Plus, isAction: true },
    { id: 'collections' as ScreenId, label: 'Collections', icon: Folder },
    { id: 'search' as const, label: 'Search', icon: Search, isAction: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[64px] pb-[env(safe-area-inset-bottom,6px)] bg-[#F5F5F7]/95 dark:bg-[#161618]/95 backdrop-blur-2xl border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-around px-2 select-none shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const isAction = 'isAction' in item && item.isAction;
        const isActive = !isAction && activeScreen === item.id;
        const Icon = item.icon;

        if (item.id === 'add') {
          return (
            <button
              key={item.label}
              onClick={() => setIsAddModalOpen(true)}
              className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-[#007AFF] text-white shadow-md active:scale-90 transition-transform cursor-pointer"
              aria-label="Add content"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>
          );
        }

        if (item.id === 'search') {
          return (
            <button
              key={item.label}
              onClick={() => setIsSearchModalOpen(true)}
              className="flex flex-col items-center justify-center w-14 h-12 text-[var(--text-secondary)] active:scale-90 transition-transform cursor-pointer"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={2} />
              <span className="text-[10px] font-medium mt-0.5">Search</span>
            </button>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => handleNav(item.id as ScreenId)}
            className={clsx(
              "flex flex-col items-center justify-center w-14 h-12 transition-all active:scale-90 cursor-pointer",
              isActive ? "text-[#007AFF] dark:text-[#0A84FF]" : "text-[var(--text-secondary)]"
            )}
          >
            <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className={clsx("text-[10px] mt-0.5", isActive ? "font-semibold" : "font-medium")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
