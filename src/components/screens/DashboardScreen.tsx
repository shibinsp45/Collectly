import React, { useState, useRef } from 'react';
import { 
  Bookmark, 
  LayoutGrid, 
  Share2, 
  MapPin, 
  FileText, 
  Video, 
  Palette, 
  StickyNote, 
  SlidersHorizontal,
  MoreHorizontal,
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
    setIsAuthModalOpen,
    setSearchQuery,
    pushNotificationsEnabled,
    togglePushNotifications,
    sendMobilePushNotification,
    isWidgetActive,
    setIsWidgetActive,
    showToast
  } = useCollectly();

  const [activeTab, setActiveTab] = useState<'your-saves' | 'all-items' | 'instagram' | 'google' | 'articles' | 'videos' | 'design' | 'notes'>('your-saves');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeItems = [...items.filter(i => !i.isArchived)].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
  });
  const savedKeywords = extractSavedKeywords(items).slice(0, 8);

  const tabs = [
    { id: 'your-saves', label: 'Your saves', icon: Bookmark },
    { id: 'all-items', label: 'All items', icon: LayoutGrid },
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { id: 'google', label: 'Google Saves', icon: MapPin },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'notes', label: 'Notes', icon: StickyNote },
  ] as const;

  // Filter items based on activeTab
  const getFilteredItems = () => {
    switch (activeTab) {
      case 'instagram':
        return activeItems.filter(i => i.type === 'social' || i.sourceOrigin === 'instagram');
      case 'google':
        return activeItems.filter(i => i.type === 'location' || i.sourceOrigin === 'google');
      case 'articles':
        return activeItems.filter(i => i.type === 'article' || i.type === 'document');
      case 'videos':
        return activeItems.filter(i => i.type === 'video');
      case 'design':
        return activeItems.filter(i => i.type === 'design' || i.category.toLowerCase().includes('design'));
      case 'notes':
        return activeItems.filter(i => i.type === 'note');
      case 'all-items':
        return activeItems;
      default:
        return activeItems.slice(0, 6);
    }
  };

  const filteredItems = getFilteredItems();

  const handleOpenType = (type: any) => {
    setSelectedTypeFilter(type);
    setActiveScreen('all-saves');
  };

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
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-16 select-none font-sans text-[var(--text-primary)]">
      {/* 1. Responsive Horizontal Category Pills Bar (Mobile Edge-to-Edge Scrollable) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1.5 no-scrollbar border-b border-black/[0.06] dark:border-white/[0.06] pt-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 touch-pan-x">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-[8px] flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0",
                  isActive
                    ? "bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
                )}
              >
                <Icon size={14} className={isActive ? "text-white dark:text-black" : "text-[var(--text-muted)]"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action: Manage Sync */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-[8px] flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all active:scale-95 cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          title="Manage connected sync services (Google & Instagram)"
        >
          <SlidersHorizontal size={14} className="text-[var(--text-muted)]" />
          <span className="hidden sm:inline">Manage </span>
          <span>sync</span>
        </button>
      </div>

      {/* When filtering specific category tab, show filtered items */}
      {activeTab !== 'your-saves' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] sm:text-[18px] font-bold tracking-tight capitalize text-[var(--text-primary)]">
                {activeTab.replace('-', ' ')} ({filteredItems.length})
              </h2>
              <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)]">
                Saved knowledge items and collections under {activeTab}
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8.5 px-4 rounded-[8px] bg-[#007AFF] hover:bg-[#0069D9] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-transform"
            >
              <Plus size={14} />
              <span>Add to {activeTab}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* UNIFIED ALL-IN-ONE SEARCH BOX: HOVER EXPANDS OPTIONS           */}
          {/* ============================================================== */}
          <div className="space-y-2.5">
            <div className="glass-card group relative rounded-[24px] p-3.5 sm:p-4 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                {/* Natural Language Prompt Area */}
                <div className="flex-1 flex items-center gap-3 text-[var(--text-muted)] min-w-0 py-1 pl-1">
                  <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Search size={18} className="text-[#E1306C]" />
                  </div>
                  <span className="text-[15px] sm:text-[16px] truncate text-[var(--text-secondary)] font-normal group-hover:text-[var(--text-primary)] transition-colors">
                    Ask AI anything, speak by voice, or drop an image...
                  </span>
                </div>

                {/* Search Options: Voice, Image, and Ask AI (Enlarge on hover!) */}
                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  {/* 1. Voice Search Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchModalOpen(true);
                    }}
                    className="h-9 group-hover:h-10 px-3.5 group-hover:px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] group-hover:text-[13px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                    title="Search by Voice"
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
                    className="h-9 group-hover:h-10 px-3.5 group-hover:px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] group-hover:text-[13px] font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-white/10 group-hover:border-white/25 hover:scale-105"
                    title="Search by Image"
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
                    className="h-9 group-hover:h-10 px-4.5 group-hover:px-5.5 rounded-full insta-gradient-bg text-white text-[13px] group-hover:text-[13.5px] font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md hover:scale-105"
                    title="Ask AI Knowledge Engine"
                  >
                    <Sparkles size={14} />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Suggestion Prompts Row - Placed directly below the search bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 touch-pan-x">
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

          {/* ============================================================== */}
          {/* MOBILE INTERACTIVE WIDGET & PUSH NOTIFICATION CONTROLS        */}
          {/* ============================================================== */}
          <div className="md:hidden glass-card rounded-[22px] p-4 space-y-3 border border-white/15 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] insta-gradient-bg text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                  📱
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Collectly Mobile Widget</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Lock screen & Quick Capture shortcuts</p>
                </div>
              </div>

              {/* Push Notification Toggle */}
              <button
                type="button"
                onClick={togglePushNotifications}
                className={clsx(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all",
                  pushNotificationsEnabled
                    ? "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30"
                    : "bg-white/10 text-[var(--text-secondary)] border border-white/10"
                )}
              >
                <span>🔔 Push {pushNotificationsEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            {/* Mobile 4-Key Quick Bento Widget Bar */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="p-2.5 rounded-[14px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all"
              >
                <Plus size={16} className="text-[#007AFF]" />
                <span className="text-[10.5px] font-semibold text-[var(--text-primary)]">Save Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sendMobilePushNotification('Instagram Sync', 'Saved 2 new architecture reels to your library.');
                }}
                className="p-2.5 rounded-[14px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all"
              >
                <InstagramIcon size={16} strokeWidth={2.2} />
                <span className="text-[10.5px] font-semibold text-[var(--text-primary)]">Sync Reels</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('reels')}
                className="p-2.5 rounded-[14px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all"
              >
                <Sparkles size={16} className="text-[#E1306C]" />
                <span className="text-[10.5px] font-semibold text-[var(--text-primary)]">Watch Reels</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('all-saves')}
                className="p-2.5 rounded-[14px] glass-card flex flex-col items-center justify-center gap-1 text-center hover:bg-white/15 active:scale-95 transition-all"
              >
                <Bookmark size={16} className="text-[#34C759]" />
                <span className="text-[10.5px] font-semibold text-[var(--text-primary)]">Saved Files</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: FEATURED IN YOUR LIBRARY (6 MODULES IN 3-COL GRID)  */}
          {/* ============================================================== */}
          <section className="space-y-3 sm:space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] sm:text-[14.5px] font-semibold tracking-tight text-[var(--text-primary)]">
                Featured in your library
              </h3>
              <span className="text-[11.5px] text-[var(--text-muted)]">Connected Modules & Sync</span>
            </div>

            {/* 6 Core Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Card 1: Instagram Saves */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] insta-gradient-bg text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <InstagramIcon size={17} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Instagram Saves
                        </h4>
                        <span className="text-[11px] text-[#34C759] flex items-center gap-1 font-medium">
                          ● Synced (14 items)
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)} 
                      className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    Saved reels, visual references and posts from @{user.instagramHandle || 'ansu'}.
                  </p>
                  <button 
                    onClick={() => handleOpenType('social')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('social')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Card 2: Google Saves */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-[#4285F4] flex items-center justify-center font-bold text-[14px] shrink-0 shadow-2xs">
                        G
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Google Saves
                        </h4>
                        <span className="text-[11px] text-[#34C759] flex items-center gap-1 font-medium">
                          ● Synced (9 places)
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)} 
                      className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    Starred Google Maps locations, bookmarks and travel references.
                  </p>
                  <button 
                    onClick={() => handleOpenType('location')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('location')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Card 3: Design Hub */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#EA1821] to-[#FF7700] text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-2xs">
                        De
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Design Hub
                        </h4>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          UI, tokens & assets
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleOpenType('design')} className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    UI components, design systems, layouts and visual inspiration.
                  </p>
                  <button 
                    onClick={() => handleOpenType('design')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('design')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Card 4: Articles & Docs */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-2xs">
                        Ar
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Articles & Docs
                        </h4>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          Reading & research
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleOpenType('article')} className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    Deep dives, engineering blog posts, papers and documentation.
                  </p>
                  <button 
                    onClick={() => handleOpenType('article')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('article')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Card 5: Video Hub */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-[#5856D6] text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-2xs">
                        Vi
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Video Hub
                        </h4>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          YouTube & media
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleOpenType('video')} className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    YouTube tutorials, podcasts, product keynotes and tech talks.
                  </p>
                  <button 
                    onClick={() => handleOpenType('video')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('video')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Card 6: Notes & Snippets */}
              <div className="glass-card p-4.5 rounded-[22px] hover:border-white/25 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-[#34C759] text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-2xs">
                        Nt
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                          Notes & Snippets
                        </h4>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          Memos & code
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleOpenType('note')} className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>

                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    Personal quick notes, code snippets, ideas and copied memos.
                  </p>
                  <button 
                    onClick={() => handleOpenType('note')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer font-medium"
                  >
                    View saved items
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenType('note')}
                    className="h-8 px-4.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    Open
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: Real Saved Knowledge Stream & Detected Keywords */}
          <section className="space-y-3 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] sm:text-[14.5px] font-semibold tracking-tight text-[var(--text-primary)]">
                  Recent Knowledge & Sync Stream ({activeItems.length})
                </h3>
                <p className="text-[11.5px] sm:text-[12px] text-[var(--text-secondary)]">
                  Connected via Google ID ({user.googleEmail}) & Instagram ID (@{user.instagramHandle})
                </p>
              </div>

              <button
                onClick={() => setActiveScreen('all-saves')}
                className="text-[12px] text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1 font-medium cursor-pointer active:scale-95 transition-transform"
              >
                <span>View library</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Keyword tags detected from saved content (Swipeable on Mobile) */}
            {savedKeywords.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 no-scrollbar text-[12px] touch-pan-x">
                <span className="text-[10.5px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider shrink-0 mr-1">
                  Detected Keywords:
                </span>
                {savedKeywords.map(({ keyword, matchedFilesCount }) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setSearchQuery(keyword);
                      setIsSearchModalOpen(true);
                    }}
                    className="h-7 sm:h-7.5 px-2.5 sm:px-3 rounded-[6px] bg-[var(--surface-primary)] hover:bg-[#007AFF]/10 active:bg-[#007AFF]/20 border border-black/[0.06] dark:border-white/[0.08] hover:border-[#007AFF]/40 text-[var(--text-secondary)] hover:text-[#007AFF] text-[11.5px] sm:text-[12px] font-medium shrink-0 transition-all active:scale-95 cursor-pointer select-none shadow-2xs"
                  >
                    <span>#{keyword}</span>
                    <span className="text-[10px] text-[var(--text-muted)] ml-1">({matchedFilesCount})</span>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {activeItems.slice(0, 6).map(item => (
                <ItemCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
