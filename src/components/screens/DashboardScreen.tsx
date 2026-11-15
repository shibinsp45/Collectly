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
    <div className="space-y-3.5 sm:space-y-6 max-w-7xl mx-auto pb-24 md:pb-20 select-none font-sans text-[var(--text-primary)]">
      {/* 1. UNIFIED SEARCH BAR: ACCESSIBLE 44px TOUCH TARGETS */}
      <div className="space-y-2">
        <div className="glass-card group relative rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 hover:border-white/30 transition-all duration-300 shadow-md hover:shadow-2xl">
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
            <div className="flex-1 flex items-center gap-2.5 sm:gap-3 text-[var(--text-muted)] min-w-0 py-1 pl-1">
              <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Search size={16} className="text-[#E1306C]" />
              </div>
              <span className="text-[14px] sm:text-[16px] truncate text-[var(--text-secondary)] font-normal group-hover:text-[var(--text-primary)] transition-colors">
                Ask AI anything, speak by voice, or drop an image...
              </span>
            </div>

            {/* Search Options: Voice, Image, and Ask AI (WCAG 44pt Touch Compliant) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5 sm:pt-0">
              {/* 1. Voice Search Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearchModalOpen(true);
                }}
                className="min-h-[44px] px-3.5 sm:px-4 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] sm:text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                title="Search by Voice"
                aria-label="Search by Voice"
              >
                <Mic size={14} className="text-[#E1306C]" />
                <span>Voice</span>
              </button>

              {/* 2. Image Search Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  imageInputRef.current?.click();
                }}
                className="min-h-[44px] px-3.5 sm:px-4 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] sm:text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                title="Search by Image"
                aria-label="Search by Image"
              >
                <Camera size={14} className="text-[#34C759]" />
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
                className="min-h-[44px] px-4 sm:px-5 rounded-full insta-gradient-bg text-white text-[12.5px] sm:text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md hover:scale-105"
                title="Ask AI Knowledge Engine"
                aria-label="Ask AI Knowledge Engine"
              >
                <Sparkles size={14} />
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

      {/* 2. STREAMLINED 1-LINE MOBILE WIDGET BAR (44px WCAG & Apple HIG Touch Compliant) */}
      <div className="md:hidden glass-card rounded-[18px] p-1.5 px-2 flex items-center justify-between gap-1 border border-white/15 shadow-sm">
        {/* Quick Save Link */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex-1 min-h-[44px] px-2 rounded-[12px] hover:bg-white/10 active:bg-white/20 flex items-center justify-center gap-1.5 text-center transition-all cursor-pointer select-none active:scale-95"
          aria-label="Quick Save Link"
        >
          <Plus size={16} className="text-[#007AFF] shrink-0" strokeWidth={2.4} />
          <span className="text-[11.5px] font-semibold text-[var(--text-primary)]">Save</span>
        </button>

        {/* Sync Reels */}
        <button
          type="button"
          onClick={() => sendMobilePushNotification('Instagram Sync', 'Saved 2 new architecture reels to your library.')}
          className="flex-1 min-h-[44px] px-2 rounded-[12px] hover:bg-white/10 active:bg-white/20 flex items-center justify-center gap-1.5 text-center transition-all cursor-pointer select-none active:scale-95"
          aria-label="Sync Instagram Reels"
        >
          <InstagramIcon size={16} strokeWidth={2.4} className="shrink-0" />
          <span className="text-[11.5px] font-semibold text-[var(--text-primary)]">Sync</span>
        </button>

        {/* Watch Reels */}
        <button
          type="button"
          onClick={() => setActiveScreen('reels')}
          className="flex-1 min-h-[44px] px-2 rounded-[12px] hover:bg-white/10 active:bg-white/20 flex items-center justify-center gap-1.5 text-center transition-all cursor-pointer select-none active:scale-95"
          aria-label="Watch Reels"
        >
          <Sparkles size={16} className="text-[#E1306C] shrink-0" />
          <span className="text-[11.5px] font-semibold text-[var(--text-primary)]">Reels</span>
        </button>

        {/* Push Notification Toggle */}
        <button
          type="button"
          onClick={togglePushNotifications}
          className={clsx(
            "min-h-[44px] px-2.5 rounded-[12px] flex items-center justify-center gap-1 transition-all cursor-pointer select-none shrink-0 active:scale-95",
            pushNotificationsEnabled
              ? "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30"
              : "bg-white/10 text-[var(--text-secondary)] border border-white/10"
          )}
          title="Push Notification Toggle"
          aria-label="Push Notification Toggle"
        >
          <span className="text-[11px] font-bold">🔔 {pushNotificationsEnabled ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* 3. RECENT KNOWLEDGE & SAVED STREAM: 2X2 BENTO GRID ON MOBILE */}
      <section className="space-y-2.5 pt-0.5">
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
            className="min-h-[44px] px-2 text-[12px] text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer active:scale-95 transition-transform"
            aria-label="View Full Library"
          >
            <span>View library</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Keyword tags detected from saved content (Swipeable on Mobile with 44px touch targets) */}
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
                className="min-h-[36px] sm:min-h-[40px] px-3 rounded-[8px] bg-[var(--surface-primary)] hover:bg-[#007AFF]/10 active:bg-[#007AFF]/20 border border-black/[0.06] dark:border-white/[0.08] hover:border-[#007AFF]/40 text-[var(--text-secondary)] hover:text-[#007AFF] text-[11px] sm:text-[12px] font-medium shrink-0 transition-all active:scale-95 cursor-pointer select-none shadow-2xs flex items-center"
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
