import React, { useRef } from 'react';
import { 
  Bookmark, 
  ArrowRight,
  Mic,
  Plus,
  Search,
  Sparkles,
  Camera
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { extractSavedKeywords } from '../../lib/keywordService';
import { ItemCard } from '../items/ItemCard';
import { InstagramIcon } from '../ui/InstagramIcon';
import { clsx } from 'clsx';

export const DashboardScreen: React.FC = () => {
  const { 
    items, 
    user,
    setActiveScreen, 
    setSelectedTypeFilter,
    setIsAddModalOpen,
    setIsSearchModalOpen,
    setSearchQuery,
    pushNotificationsEnabled,
    togglePushNotifications,
    sendMobilePushNotification,
    showToast
  } = useCollectly();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeItems = [...items.filter(i => !i.isArchived)].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
  });
  
  const savedKeywords = extractSavedKeywords(items).slice(0, 8);

  const handleImageUploadSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      showToast('Search by Image', `Matching visual saves for "${cleanName}"`, 'info');
      setSearchQuery(cleanName);
      setIsSearchModalOpen(true);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 md:pb-20 select-none font-sans text-[var(--text-primary)]">
      {/* 1. UNIFIED SEARCH BAR: HOVER EXPANDS OPTIONS */}
      <div className="space-y-2">
        <div className="glass-card group relative rounded-[22px] sm:rounded-[24px] p-3 sm:p-4 hover:border-white/30 transition-all duration-300 shadow-md hover:shadow-2xl">
          {/* Hidden File Input for Image Search */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUploadSearch}
          />

          {/* Input Row with larger interactive buttons on hover */}
          <div 
            onClick={() => setIsSearchModalOpen(true)}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
          >
            {/* Natural Language Prompt Area */}
            <div className="flex-1 flex items-center gap-2.5 sm:gap-3 text-[var(--text-muted)] min-w-0 py-0.5 sm:py-1 pl-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 dark:bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Search size={16} className="text-[#E1306C]" />
              </div>
              <span className="text-[14px] sm:text-[16px] truncate text-[var(--text-secondary)] font-normal group-hover:text-[var(--text-primary)] transition-colors">
                Ask AI anything, speak by voice, or drop an image...
              </span>
            </div>

            {/* Search Options: Voice, Image, and Ask AI (Enlarge on hover) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5 sm:pt-0">
              {/* 1. Voice Search Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearchModalOpen(true);
                }}
                className="h-8.5 sm:h-9 group-hover:h-10 px-3 sm:px-3.5 group-hover:px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] sm:text-[12.5px] group-hover:text-[13px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                title="Search by Voice"
              >
                <Mic size={13} className="text-[#E1306C]" />
                <span>Voice</span>
              </button>

              {/* 2. Image Search Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  imageInputRef.current?.click();
                }}
                className="h-8.5 sm:h-9 group-hover:h-10 px-3 sm:px-3.5 group-hover:px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] sm:text-[12.5px] group-hover:text-[13px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                title="Search by Image"
              >
                <Camera size={13} className="text-[#34C759]" />
                <span>Image</span>
              </button>

              {/* 3. Ask AI Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('Ask AI: ');
                  setIsSearchModalOpen(true);
                }}
                className="h-8.5 sm:h-9 group-hover:h-10 px-3.5 sm:px-4.5 group-hover:px-5.5 rounded-full insta-gradient-bg text-white text-[12.5px] sm:text-[13px] group-hover:text-[13.5px] font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md hover:scale-105"
                title="Ask AI Knowledge Engine"
              >
                <Sparkles size={13} />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Prompts Row - HIDDEN ON MOBILE AS REQUESTED */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 touch-pan-x">
          <span className="text-[12.5px] text-[var(--text-muted)] font-medium shrink-0">Try asking:</span>
          {[
            "Summarize my recent reads",
            "Find minimalist architecture",
            "What design systems are saved?",
            "Restaurants in Kochi"
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setSearchQuery(prompt);
                setIsSearchModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-[10px] glass-card hover:bg-white/15 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[12px] sm:text-[12.5px] whitespace-nowrap shrink-0 transition-all cursor-pointer border border-white/10 shadow-2xs active:scale-95"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* 2. MOBILE INTERACTIVE WIDGET & SHORTCUTS */}
      <div className="md:hidden glass-card rounded-[20px] p-3.5 space-y-2.5 border border-white/15 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-[8px] insta-gradient-bg text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
              📱
            </div>
            <div>
              <h4 className="text-[12.5px] font-bold text-[var(--text-primary)]">Collectly Mobile Widget</h4>
              <p className="text-[10.5px] text-[var(--text-muted)]">Quick capture & lockscreen shortcuts</p>
            </div>
          </div>

          {/* Push Notification Toggle */}
          <button
            type="button"
            onClick={togglePushNotifications}
            className={clsx(
              "px-2.5 py-1 rounded-full text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer",
              pushNotificationsEnabled
                ? "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30"
                : "bg-white/10 text-[var(--text-secondary)] border border-white/10"
            )}
          >
            <span>🔔 Push {pushNotificationsEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* 4 Quick Action Keys */}
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-[12px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={15} className="text-[#007AFF]" />
            <span className="text-[10px] font-semibold text-[var(--text-primary)]">Save Link</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sendMobilePushNotification('Instagram Sync', 'Saved 2 new architecture reels to your library.');
            }}
            className="p-2 rounded-[12px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <InstagramIcon size={15} strokeWidth={2.2} />
            <span className="text-[10px] font-semibold text-[var(--text-primary)]">Sync Reels</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTypeFilter('social');
              setActiveScreen('all-saves');
            }}
            className="p-2 rounded-[12px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles size={15} className="text-[#E1306C]" />
            <span className="text-[10px] font-semibold text-[var(--text-primary)]">Reels</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTypeFilter('all');
              setActiveScreen('all-saves');
            }}
            className="p-2 rounded-[12px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Bookmark size={15} className="text-[#34C759]" />
            <span className="text-[10px] font-semibold text-[var(--text-primary)]">All Saves</span>
          </button>
        </div>
      </div>

      {/* 3. RECENT KNOWLEDGE & SAVED STREAM: 2X2 BENTO GRID ON MOBILE */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13.5px] sm:text-[14.5px] font-bold tracking-tight text-[var(--text-primary)]">
              Recent Knowledge & Saves ({activeItems.length})
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[var(--text-secondary)]">
              Connected via Google ({user.googleEmail}) & Instagram (@{user.instagramHandle})
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedTypeFilter('all');
              setActiveScreen('all-saves');
            }}
            className="text-[11.5px] sm:text-[12px] text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer active:scale-95 transition-transform"
          >
            <span>View library</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Keyword tags detected from saved content (Swipeable on Mobile) */}
        {savedKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 no-scrollbar text-[12px] touch-pan-x">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider shrink-0 mr-1">
              Detected:
            </span>
            {savedKeywords.map(({ keyword, matchedFilesCount }) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchQuery(keyword);
                  setIsSearchModalOpen(true);
                }}
                className="h-6.5 sm:h-7.5 px-2.5 sm:px-3 rounded-[6px] bg-[var(--surface-primary)] hover:bg-[#007AFF]/10 active:bg-[#007AFF]/20 border border-black/[0.06] dark:border-white/[0.08] hover:border-[#007AFF]/40 text-[var(--text-secondary)] hover:text-[#007AFF] text-[11px] sm:text-[12px] font-medium shrink-0 transition-all active:scale-95 cursor-pointer select-none shadow-2xs"
              >
                <span>#{keyword}</span>
                <span className="text-[9.5px] text-[var(--text-muted)] ml-1">({matchedFilesCount})</span>
              </button>
            ))}
          </div>
        )}

        {/* 2X2 BENTO CARD LAYOUT ON MOBILE, 3 COLS ON DESKTOP */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
          {activeItems.slice(0, 6).map(item => (
            <ItemCard key={item.id} item={item} viewMode="grid" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;
