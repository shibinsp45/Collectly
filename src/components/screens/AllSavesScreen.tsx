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
  Layers
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { ContentType, SortOption } from '../../types';
import { SwiftButton, SwiftBadge } from '../ui/AppleDesignSystem';
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
    setSelectedCategoryId
  } = useCollectly();

  const typesList: { id: ContentType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Saves' },
    { id: 'article', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'design', label: 'Design' },
    { id: 'note', label: 'Notes' },
    { id: 'location', label: 'Locations' },
    { id: 'social', label: 'Social' },
    { id: 'learning', label: 'Learning' },
  ];

  const filteredItems = useMemo(() => {
    let result = items.filter(item => !item.isArchived);

    // Filter by type
    if (selectedTypeFilter !== 'all') {
      result = result.filter(item => item.type === selectedTypeFilter);
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
    <div className="space-y-5 max-w-6xl mx-auto pb-16">
      {/* Sub-header Filter & Toolbar (Linear & Apple precision) */}
      <div className="flex flex-col gap-3">
        {/* Horizontal Type Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {typesList.map(type => {
            const isSelected = selectedTypeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                className={clsx(
                  "h-8 px-3 rounded-[8px] text-[13px] font-medium transition-all duration-150 select-none whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-[#007AFF] text-white shadow-xs font-semibold"
                    : "bg-[var(--surface-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[var(--text-secondary)] border border-black/[0.06] dark:border-white/[0.08]"
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Second Row: In-page filter options & sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Active filter badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategoryId && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#007AFF]/10 text-[#007AFF] text-[12px] font-medium">
                Category: {categories.find(c => c.id === selectedCategoryId)?.name}
                <button onClick={() => setSelectedCategoryId(null)} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTagFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#5856D6]/10 text-[#5856D6] text-[12px] font-medium">
                Tag: #{selectedTagFilter}
                <button onClick={() => setSelectedTagFilter(null)} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-primary)] text-[12px] font-medium">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="cursor-pointer hover:opacity-75">
                  <X size={12} />
                </button>
              </span>
            )}

            {!selectedCategoryId && !selectedTagFilter && !searchQuery && (
              <span className="text-[12.5px] text-[var(--text-muted)]">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[var(--text-muted)]">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="h-8 px-2.5 text-[12.5px] font-medium rounded-[7px] bg-[var(--surface-primary)] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title (A-Z)</option>
              <option value="visits">Most visited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Container (Grid vs List) */}
      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-3">
          <Bookmark size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">No items found</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            {searchQuery || selectedTypeFilter !== 'all' || selectedCategoryId || selectedTagFilter
              ? "No items match your active filters. Try clearing some filters or searching for something else."
              : "Your library is empty. Start saving links, articles, notes, or locations to organize your knowledge."}
          </p>
          <div className="pt-2">
            <SwiftButton
              variant="prominent"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Capture New Item
            </SwiftButton>
          </div>
        </div>
      )}
    </div>
  );
};
