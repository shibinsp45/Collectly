import React, { useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Search, 
  Plus, 
  FileText, 
  Video, 
  MapPin, 
  Bookmark, 
  X,
  Layers,
  FolderDown,
  UploadCloud,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { ContentType, SortOption } from '../../types';
import { InstaBookmarkIcon, InstaReelsIcon } from '../ui/InstagramDesignIcons';
import { clsx } from 'clsx';

export const AllSavesScreen: React.FC = () => {
  const { 
    items, 
    viewMode, 
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
    { id: 'all', label: '📁 All Saved Files' },
    { id: 'document', label: '📄 Documents & PDFs' },
    { id: 'article', label: '📰 Articles' },
    { id: 'video', label: '🎬 Videos & Reels' },
    { id: 'design', label: '🎨 Design & CAD' },
    { id: 'social', label: '📸 Social & Instagram' },
    { id: 'note', label: '📝 Notes' },
    { id: 'location', label: '📍 Places' },
  ];

  const filteredItems = useMemo(() => {
    let result = items.filter(item => !item.isArchived);

    // Filter by type
    if (selectedTypeFilter !== 'all') {
      if (selectedTypeFilter === 'video') {
        result = result.filter(item => item.type === 'video' || item.type === 'social');
      } else {
        result = result.filter(item => item.type === selectedTypeFilter);
      }
    }

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
  }, [items, selectedTypeFilter, selectedCategoryId, selectedTagFilter, searchQuery, sortOption, categories]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-6xl mx-auto pb-28 md:pb-16 px-1.5 sm:px-3 animate-in fade-in duration-200">
      {/* Top Banner: Saved Files & Knowledge Hub */}
      <div className="glass-card p-4 sm:p-5 rounded-[22px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#007AFF] text-white flex items-center justify-center shadow-md shrink-0">
            <InstaBookmarkIcon size={20} strokeWidth={2.4} filled />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                Saved Files & Bookmarks
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#007AFF] text-white shadow-2xs">
                {filteredItems.length} Files
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-normal">
              All your cloud bookmarks, PDFs, blueprints, notes, and Instagram saves.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick toggle to dedicated Reels page */}
          <button
            type="button"
            onClick={() => setActiveScreen('reels')}
            className="flex-1 sm:flex-none h-9 px-3.5 rounded-[10px] bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <InstaReelsIcon size={14} className="text-[#E1306C]" />
            <span>Open Reels Feed</span>
          </button>

          {/* Capture / Upload Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none h-9 px-4 rounded-[10px] insta-gradient-bg text-white text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Save New File</span>
          </button>
        </div>
      </div>

      {/* Filter & Toolbar Area */}
      <div className="flex flex-col gap-2.5">
        {/* Horizontal Type Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          {typesList.map(type => {
            const isSelected = selectedTypeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                className={clsx(
                  "h-8 px-3.5 rounded-full text-[12.5px] font-medium transition-all select-none whitespace-nowrap cursor-pointer",
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
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          {/* Active filter badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCategoryId && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#007AFF]/15 text-[#007AFF] text-[12px] font-medium border border-[#007AFF]/25">
                Category: {categories.find(c => c.id === selectedCategoryId)?.name}
                <button onClick={() => setSelectedCategoryId(null)} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTagFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#5856D6]/15 text-[#5856D6] text-[12px] font-medium border border-[#5856D6]/25">
                Tag: #{selectedTagFilter}
                <button onClick={() => setSelectedTagFilter(null)} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] glass-card text-[var(--text-primary)] text-[12px] font-medium">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {!selectedCategoryId && !selectedTagFilter && !searchQuery && (
              <span className="text-[12px] text-[var(--text-muted)]">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>

          {/* Sort & View Mode Switcher */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[12px] text-[var(--text-muted)] hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="h-8 px-2.5 text-[12px] font-medium rounded-[8px] glass-card text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title (A-Z)</option>
              <option value="visits">Most visited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout: 2 Columns on Mobile, 3 Columns on Tablet/Desktop */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredItems.map((item, idx) => {
            // Mobile bento emphasis: every 5th item spans full 2 cols on mobile
            const isBentoWide = idx % 5 === 0 && item.previewImage;

            return (
              <div 
                key={item.id} 
                className={clsx(
                  "transition-all duration-300",
                  isBentoWide && "sm:col-span-1 md:col-span-2"
                )}
              >
                <ItemCard item={item} viewMode="grid" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-[22px] py-16 text-center p-8 space-y-3">
          <Bookmark size={34} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-bold text-[var(--text-primary)]">No Saved Files</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            {searchQuery || selectedTypeFilter !== 'all' || selectedCategoryId || selectedTagFilter
              ? "No items match your active filters. Try clearing some filters to view your files."
              : "Your saved collection is empty. Capture files, documents, reels, or notes to get started."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 px-4 rounded-full insta-gradient-bg text-white text-[12.5px] font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Plus size={14} />
              <span>Capture New Item</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSavesScreen;
