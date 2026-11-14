import React, { useState } from 'react';
import { 
  House, 
  Library, 
  Folder, 
  MapPin, 
  Plus, 
  Settings, 
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  ChevronRight
} from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { useCollectly } from '../../context/CollectlyContext';
import { ScreenId } from '../../types';
import { clsx } from 'clsx';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    items,
    collections, 
    categories,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedCategoryId,
    setSelectedCategoryId,
    setIsAddModalOpen,
    setSelectedTypeFilter,
    theme,
    setTheme
  } = useCollectly();

  // Accordion state for Collections and Categories in sidebar - Collapsed by default!
  const [isCollectionsExpanded, setIsCollectionsExpanded] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const handleNav = (screen: ScreenId) => {
    setActiveScreen(screen);
    setSelectedCollectionId(null);
    setSelectedCategoryId(null);
    setIsMobileOpen(false);
  };

  // On mobile drawer, ALWAYS show the expanded version with the name!
  // On desktop/tablet, respect isCollapsed.
  const isRail = isCollapsed && !isMobileOpen;

  const navItems = [
    { id: 'dashboard' as ScreenId, label: 'Home', icon: House, onClick: () => handleNav('dashboard') },
    { id: 'all-saves' as ScreenId, label: 'Saves', icon: Library, onClick: () => { setSelectedTypeFilter('all'); handleNav('all-saves'); } },
    { id: 'collections' as ScreenId, label: 'Collections', icon: Folder, onClick: () => handleNav('collections') },
    { id: 'all-saves' as ScreenId, label: 'Instagram', icon: InstagramIcon, onClick: () => { setSelectedTypeFilter('social'); handleNav('all-saves'); } },
    { id: 'all-saves' as ScreenId, label: 'Google', icon: MapPin, onClick: () => { setSelectedTypeFilter('location'); handleNav('all-saves'); } },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop (mobile < md only) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar: Slender dock / rail on tablet & desktop, full expanded drawer on mobile */}
      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-200 select-none shadow-2xl md:shadow-none",
          "bg-[#F2F2F7] dark:bg-[#161618] border-r border-black/[0.08] dark:border-white/[0.07] text-[#6E6E73] dark:text-[#A1A1A6]",
          isRail ? "md:w-[68px]" : "md:w-[230px]",
          isMobileOpen ? "translate-x-0 w-[260px] max-w-[85vw]" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top Header */}
        <div className={clsx(
          "h-13 sm:h-12 flex items-center border-b border-black/[0.06] dark:border-white/[0.06] px-3.5",
          isRail ? "justify-center" : "justify-between"
        )}>
          {/* Logo & Name (Always visible when expanded and on mobile!) */}
          {!isRail ? (
            <div 
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-[5px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                  Collectly
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">Personal Knowledge</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Action icon on right: Close ✕ on mobile, Collapse ≡ on desktop */}
          {!isRail && (
            <div>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
                aria-label="Close menu"
              >
                <X size={17} />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden md:flex p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <Menu size={17} />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 py-3 px-2 space-y-3 overflow-y-auto no-scrollbar">
          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = activeScreen === item.id && index === 0;
              const Icon = item.icon;

              if (isRail) {
                return (
                  <button
                    key={`${item.label}-${index}`}
                    onClick={item.onClick}
                    title={item.label}
                    className={clsx(
                      "w-full py-2.5 px-1 rounded-[8px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group relative",
                      isActive 
                        ? "text-[var(--text-primary)] bg-black/[0.08] dark:bg-white/[0.12] font-semibold shadow-xs" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#007AFF] dark:bg-white rounded-r" />
                    )}
                    <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} className={clsx("transition-transform group-hover:scale-105", isActive && "text-[#007AFF] dark:text-white")} />
                    <span className="text-[10px] tracking-tight leading-tight text-center truncate max-w-[56px]">
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Full Expanded Mode with item names
              return (
                <button
                  key={`${item.label}-${index}`}
                  onClick={item.onClick}
                  className={clsx(
                    "w-full h-9 px-3 rounded-[8px] flex items-center gap-3 text-[13px] font-medium transition-all cursor-pointer active:scale-98",
                    isActive 
                      ? "bg-[#007AFF] text-white font-semibold shadow-xs" 
                      : "text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"
                  )}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? "text-white" : "text-[var(--text-muted)]"} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Create Action Button */}
          {isRail ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              title="Save Item / Create"
              className="w-full py-2.5 px-1 rounded-[8px] flex flex-col items-center justify-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full border border-dashed border-[var(--text-muted)] group-hover:border-[var(--text-primary)] flex items-center justify-center">
                <Plus size={13} />
              </div>
              <span className="text-[10px] tracking-tight leading-tight">Create</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setIsMobileOpen(false);
              }}
              className="w-full h-9 px-3 rounded-[8px] flex items-center gap-2.5 text-[12.5px] font-semibold text-white bg-[#007AFF] hover:bg-[#0069D9] transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.4} />
              <span>Save New Item</span>
            </button>
          )}

          {/* Full Collections & Categories (Visible when expanded & on mobile!) */}
          {!isRail && (
            <div className="pt-2 space-y-2">
              {/* Collapsible Collections Accordion (Collapsed by default) */}
              <div className="rounded-[8px] overflow-hidden">
                <div 
                  onClick={() => setIsCollectionsExpanded(prev => !prev)}
                  className="px-2.5 py-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] rounded-[6px] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronRight 
                      size={12} 
                      className={clsx("transition-transform duration-200 shrink-0", isCollectionsExpanded && "rotate-90")} 
                    />
                    <span className="truncate">Collections</span>
                    <span className="text-[10px] font-normal lowercase opacity-70">({collections.length})</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNav('collections');
                    }}
                    className="hover:text-[var(--text-primary)] cursor-pointer lowercase text-[11px] px-1 py-0.5 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    title="View all collections"
                  >
                    view all
                  </button>
                </div>
                {isCollectionsExpanded && (
                  <div className="mt-1 space-y-0.5 pl-2 animate-in fade-in duration-150">
                    {collections.slice(0, 5).map(col => {
                      const isSelected = selectedCollectionId === col.id;
                      const count = items.filter(i => i.collectionId === col.id && !i.isArchived).length;
                      return (
                        <button
                          key={col.id}
                          onClick={() => {
                            setSelectedCollectionId(col.id);
                            setSelectedCategoryId(null);
                            setActiveScreen('collection-detail');
                            setIsMobileOpen(false);
                          }}
                          className={clsx(
                            "w-full h-8 px-2.5 rounded-[7px] flex items-center gap-2.5 text-[12.5px] transition-colors cursor-pointer",
                            isSelected 
                              ? "bg-black/[0.08] dark:bg-white/[0.12] text-[var(--text-primary)] font-semibold" 
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                          )}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                          <span className="truncate flex-1 text-left">{col.name}</span>
                          <span className="text-[11px] text-[var(--text-muted)]">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Collapsible Categories Accordion (Collapsed by default) */}
              <div className="rounded-[8px] overflow-hidden">
                <div 
                  onClick={() => setIsCategoriesExpanded(prev => !prev)}
                  className="px-2.5 py-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] rounded-[6px] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronRight 
                      size={12} 
                      className={clsx("transition-transform duration-200 shrink-0", isCategoriesExpanded && "rotate-90")} 
                    />
                    <span className="truncate">Categories</span>
                    <span className="text-[10px] font-normal lowercase opacity-70">({categories.length})</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNav('categories');
                    }}
                    className="hover:text-[var(--text-primary)] cursor-pointer lowercase text-[11px] px-1 py-0.5 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    title="View all categories"
                  >
                    view all
                  </button>
                </div>
                {isCategoriesExpanded && (
                  <div className="mt-1 space-y-0.5 pl-2 animate-in fade-in duration-150">
                    {categories.slice(0, 6).map(cat => {
                      const isSelected = selectedCategoryId === cat.id;
                      const count = items.filter(i => i.category.toLowerCase() === cat.name.toLowerCase() && !i.isArchived).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setSelectedCollectionId(null);
                            setActiveScreen('category-detail');
                            setIsMobileOpen(false);
                          }}
                          className={clsx(
                            "w-full h-8 px-2.5 rounded-[7px] flex items-center gap-2 text-[12.5px] transition-colors cursor-pointer",
                            isSelected 
                              ? "bg-black/[0.08] dark:bg-white/[0.12] text-[var(--text-primary)] font-semibold" 
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                          )}
                        >
                          <span className="truncate flex-1 text-left">{cat.name}</span>
                          <span className="text-[11px] text-[var(--text-muted)]">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Rail: Settings, Theme and User Profile */}
        <div className="p-2.5 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
          {isRail ? (
            <button
              onClick={() => handleNav('settings')}
              title="Settings"
              className={clsx(
                "w-full py-2 rounded-[8px] flex flex-col items-center justify-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer",
                activeScreen === 'settings' && "text-[var(--text-primary)] bg-black/[0.08] dark:bg-white/[0.12]"
              )}
            >
              <Settings size={18} />
              <span className="text-[10px]">Settings</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('settings')}
              className={clsx(
                "w-full h-8.5 px-3 rounded-[7px] flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer",
                activeScreen === 'settings' && "bg-black/[0.08] dark:bg-white/[0.12] text-[var(--text-primary)] font-medium"
              )}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          )}

          {/* User Avatar Circle and Details */}
          <div className={clsx("flex items-center", isRail ? "justify-center" : "justify-between px-1")}>
            <div 
              onClick={() => handleNav('settings')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div 
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center text-[12px] font-bold shadow-xs shrink-0"
                title="Ansu (Pro Plan)"
              >
                A
              </div>
              {!isRail && (
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[var(--text-primary)] leading-tight">Ansu</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Pro Plan</span>
                </div>
              )}
            </div>

            {!isRail && (
              <div className="flex items-center bg-black/[0.06] dark:bg-white/[0.08] p-0.5 rounded-[6px]">
                <button
                  onClick={() => setTheme('light')}
                  className={clsx("p-1 rounded-[4px] cursor-pointer", theme === 'light' ? "bg-white text-black shadow-2xs" : "text-[var(--text-secondary)]")}
                  title="Light"
                >
                  <Sun size={11} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={clsx("p-1 rounded-[4px] cursor-pointer", theme === 'dark' ? "bg-[#2C2C2E] text-white shadow-2xs" : "text-[var(--text-secondary)]")}
                  title="Dark"
                >
                  <Moon size={11} />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={clsx("p-1 rounded-[4px] cursor-pointer", theme === 'system' ? "bg-white dark:bg-[#2C2C2E] text-[#007AFF] shadow-2xs" : "text-[var(--text-secondary)]")}
                  title="System"
                >
                  <Laptop size={11} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
