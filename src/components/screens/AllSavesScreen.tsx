import React, { useMemo } from 'react';
import { 
  Plus, 
  X,
  Bookmark,
  Sparkles,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { ContentType, SortOption } from '../../types';
import { InstaBookmarkIcon, InstaReelsIcon } from '../ui/InstagramDesignIcons';
import { InstagramIcon } from '../ui/InstagramIcon';
import { clsx } from 'clsx';

export const AllSavesScreen: React.FC = () => {
  const { 
    items, 
    user,
    searchQuery, 
    setSearchQuery,
    selectedTypeFilter, 
    setSelectedTypeFilter,
    selectedTagFilter,
    setSelectedTagFilter,
    sortOption,
    setSortOption,
    setIsAddModalOpen,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    setActiveScreen
  } = useCollectly();

  const typesList: { id: ContentType | 'all'; label: string }[] = [
    { id: 'all', label: '✨ All Combined' },
    { id: 'social', label: '📸 Instagram & Reels' },
    { id: 'document', label: '📄 Documents & PDFs' },
    { id: 'design', label: '🎨 Blueprints & CAD' },
    { id: 'article', label: '📰 Articles & Guides' },
    { id: 'note', label: '📝 Notes' },
  ];

  const sortedAllItems = useMemo(() => {
    let result = items.filter(item => !item.isArchived);

    // Filter by category
    if (selectedCategoryId) {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        result = result.filter(item => item.category.toLowerCase() === cat.name.toLowerCase());
      }
    }

    // Filter by tag
    if (selectedTagFilter) {
      result = result.filter(item => item.tags.some(t => t.toLowerCase() === selectedTagFilter.toLowerCase()));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sourceDomain.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortOption === 'newest') {
        return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
      } else if (sortOption === 'oldest') {
        return new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime();
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'visits') {
        return b.visitCount - a.visitCount;
      }
      return 0;
    });
  }, [items, selectedCategoryId, selectedTagFilter, searchQuery, sortOption, categories]);

  // Specific filtered items when a filter is explicitly selected
  const filteredItems = useMemo(() => {
    if (selectedTypeFilter === 'all') return sortedAllItems;
    if (selectedTypeFilter === 'social' || selectedTypeFilter === 'video') {
      return sortedAllItems.filter(item => item.type === 'social' || item.type === 'video' || item.sourceDomain.includes('instagram.com'));
    }
    return sortedAllItems.filter(item => item.type === selectedTypeFilter);
  }, [sortedAllItems, selectedTypeFilter]);

  // Section 1: Instagram Reels & Visual Saves
  const instagramSaves = useMemo(() => {
    return sortedAllItems.filter(item => 
      item.type === 'social' || 
      item.type === 'video' || 
      item.sourceDomain.includes('instagram.com')
    );
  }, [sortedAllItems]);

  // Section 2: Documents, Blueprints & PDFs
  const documentSaves = useMemo(() => {
    return sortedAllItems.filter(item => 
      item.type === 'document' || 
      item.type === 'design' || 
      item.tags.some(t => ['pdf', 'cad', 'blueprint', 'document'].includes(t.toLowerCase())) ||
      item.category.toLowerCase().includes('design') ||
      item.category.toLowerCase().includes('document')
    );
  }, [sortedAllItems]);

  // Section 3: Articles, Notes & Web Links
  const articleSaves = useMemo(() => {
    return sortedAllItems.filter(item => 
      item.type === 'article' || 
      item.type === 'note' || 
      item.type === 'location'
    );
  }, [sortedAllItems]);

  const isMultiSectionView = selectedTypeFilter === 'all' && !searchQuery.trim() && !selectedCategoryId && !selectedTagFilter;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-6xl mx-auto pb-28 md:pb-16 px-1.5 sm:px-3 animate-in fade-in duration-200">
      {/* Top Banner: Unified Saves & Instagram Knowledge Hub */}
      <div className="glass-card p-3.5 sm:p-5 rounded-[20px] sm:rounded-[22px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] insta-gradient-bg text-white flex items-center justify-center shadow-md shrink-0">
            <InstaBookmarkIcon size={19} strokeWidth={2.4} filled />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                Saves & Instagram
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold insta-gradient-bg text-white shadow-2xs">
                {sortedAllItems.length} Saved
              </span>
            </div>
            <p className="text-[11.5px] sm:text-[13px] text-[var(--text-secondary)] font-normal">
              Unified library of your Instagram reels, CAD blueprints, and document saves.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick toggle to dedicated Reels feed */}
          <button
            type="button"
            onClick={() => setActiveScreen('reels')}
            className="flex-1 sm:flex-none h-8.5 sm:h-9 px-3 rounded-[10px] bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <InstaReelsIcon size={13} className="text-[#E1306C]" />
            <span>Watch Fullscreen Reels</span>
          </button>

          {/* Capture / Upload Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none h-8.5 sm:h-9 px-3.5 rounded-[10px] insta-gradient-bg text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Save</span>
          </button>
        </div>
      </div>

      {/* Filter & Toolbar Area */}
      <div className="flex flex-col gap-2">
        {/* Horizontal Type Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          {typesList.map(type => {
            const isSelected = selectedTypeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                className={clsx(
                  "h-7.5 sm:h-8 px-3 sm:px-3.5 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-all select-none whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "insta-gradient-bg text-white shadow-xs font-semibold scale-102"
                    : "glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/25"
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Second Row: In-page filter options & sorting */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Active filter badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCategoryId && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] bg-[#007AFF]/15 text-[#007AFF] text-[11.5px] font-medium border border-[#007AFF]/25">
                Category: {categories.find(c => c.id === selectedCategoryId)?.name}
                <button onClick={() => setSelectedCategoryId(null)} className="cursor-pointer hover:opacity-75">
                  <X size={11} />
                </button>
              </span>
            )}

            {selectedTagFilter && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] bg-[#5856D6]/15 text-[#5856D6] text-[11.5px] font-medium border border-[#5856D6]/25">
                Tag: #{selectedTagFilter}
                <button onClick={() => setSelectedTagFilter(null)} className="cursor-pointer hover:opacity-75">
                  <X size={11} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] glass-card text-[var(--text-primary)] text-[11.5px] font-medium">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="cursor-pointer hover:opacity-75">
                  <X size={11} />
                </button>
              </span>
            )}

            {!selectedCategoryId && !selectedTagFilter && !searchQuery && (
              <span className="text-[11.5px] text-[var(--text-muted)]">
                {isMultiSectionView ? 'Grouped by category sections below' : `Showing ${filteredItems.length} files`}
              </span>
            )}
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11.5px] text-[var(--text-muted)] hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="h-7.5 px-2 text-[11.5px] font-medium rounded-[8px] glass-card text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title (A-Z)</option>
              <option value="visits">Most visited</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MULTI-SECTION SAVED VIEW: DEDICATED SECTIONS FOR INSTAGRAM, DOCS & ARTICLES */}
      {/* ========================================================================= */}
      {isMultiSectionView ? (
        <div className="space-y-7 pt-1">
          {/* SECTION 1: 📸 Instagram Reels & Visual Saves */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full insta-gradient-bg flex items-center justify-center text-white shadow-2xs">
                  <InstagramIcon size={13} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
                    Instagram Reels & Visual Saves
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Synced from @{user.instagramHandle} ({instagramSaves.length} items)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('social')}
                className="text-[11.5px] text-[#E1306C] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>See all reels</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* 2X2 Bento Grid on Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {instagramSaves.slice(0, 4).map(item => (
                <ItemCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>
          </section>

          {/* SECTION 2: 📁 Documents, Blueprints & CAD Files */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-2xs">
                  <Layers size={13} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
                    Files, Blueprints & Documents
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    CAD architecture, specs, PDF contracts ({documentSaves.length} files)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('document')}
                className="text-[11.5px] text-[#007AFF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>See all documents</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* 2X2 Bento Grid on Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {documentSaves.slice(0, 4).map(item => (
                <ItemCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>
          </section>

          {/* SECTION 3: 📰 Articles, Notes & Web Links */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full bg-[#34C759] flex items-center justify-center text-white shadow-2xs">
                  <FileText size={13} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
                    Articles, Notes & Guides
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Deep dives, design principles, Notion notes ({articleSaves.length} items)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('article')}
                className="text-[11.5px] text-[#34C759] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>See all articles</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* 2X2 Bento Grid on Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {articleSaves.slice(0, 4).map(item => (
                <ItemCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* SINGLE FILTER / SEARCH RESULTS VIEW: 2X2 BENTO GRID */
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 pt-1">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card rounded-[22px] py-14 text-center p-8 space-y-3">
            <Bookmark size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">No Saved Files</h3>
            <p className="text-[12.5px] text-[var(--text-secondary)] max-w-sm mx-auto">
              No items match your active filters. Try clearing filters or saving a new link.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTypeFilter('all');
                  setSearchQuery('');
                  setSelectedCategoryId(null);
                  setSelectedTagFilter(null);
                }}
                className="h-8.5 px-4 rounded-full insta-gradient-bg text-white text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Sparkles size={13} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AllSavesScreen;
