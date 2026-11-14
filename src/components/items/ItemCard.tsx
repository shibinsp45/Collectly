import React from 'react';
import { 
  ExternalLink, 
  Trash2, 
  Pin, 
  Eye,
  Tag,
  RotateCcw
} from 'lucide-react';
import { SavedItem, ViewMode } from '../../types';
import { useCollectly } from '../../context/CollectlyContext';
import { InstagramIcon } from '../ui/InstagramIcon';
import { clsx } from 'clsx';

interface ItemCardProps {
  item: SavedItem;
  viewMode?: ViewMode;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  viewMode = 'grid' 
}) => {
  const { 
    setSelectedItem, 
    deleteItem, 
    togglePinItem,
    recordItemVisit,
    restoreItem,
    showToast
  } = useCollectly();

  const handleClick = () => {
    recordItemVisit(item.id);
    setSelectedItem(item);
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      recordItemVisit(item.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem(item.id);
    showToast('Item Deleted', 'The bookmark was removed from your library.', 'info');
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinItem(item.id);
  };

  // Format date like reference UI: "Mar 12, 2026"
  const formattedDate = new Date(item.dateSaved).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isInstagram = item.sourceDomain.includes('instagram.com') || item.type === 'social';

  // Construct tags label e.g. "Design, UX" or "Home Decor, Health"
  const secondaryTags = item.tags 
    ? item.tags.filter(t => t.toLowerCase() !== item.category.toLowerCase()).slice(0, 2)
    : [];
  const tagsDisplay = secondaryTags.length > 0 
    ? `${item.category}, ${secondaryTags.join(', ')}`
    : item.category;

  // ==========================================
  // LIST VIEW ROW
  // ==========================================
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className={clsx(
          "group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-[12px] cursor-pointer transition-all duration-150 select-none",
          "bg-white dark:bg-[#1E1E22] hover:bg-black/[0.02] dark:hover:bg-white/[0.04]",
          "border border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.16] dark:hover:border-white/[0.18]",
          item.isPinned && "ring-1 ring-[#007AFF]/40"
        )}
      >
        {/* Source Icon / Favicon */}
        <div className="w-6 h-6 rounded-[5px] bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
          {item.favicon ? (
            <img 
              src={item.favicon} 
              alt="" 
              className="w-4 h-4 object-contain" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          ) : isInstagram ? (
            <InstagramIcon size={13} className="text-[#E1306C]" />
          ) : (
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {item.sourceDomain.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Title & Preview */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[13.5px] font-semibold text-[var(--text-primary)] truncate group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
            {item.title}
          </span>
          {isInstagram && (
            <span className="text-[9.5px] font-semibold text-[#E1306C] px-1.5 py-0.2 rounded bg-[#E1306C]/10 shrink-0">
              Instagram
            </span>
          )}
        </div>

        {/* Metadata info */}
        <div className="hidden md:flex items-center gap-3 shrink-0 text-[11.5px] text-[var(--text-muted)]">
          <span className="truncate max-w-[130px]">{item.sourceDomain}</span>
          <div className="flex items-center gap-1">
            <Tag size={11} className="shrink-0 opacity-70" />
            <span className="truncate max-w-[120px]">{item.category}</span>
          </div>
          <span className="text-[11px]">{formattedDate}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.url && (
            <button
              onClick={handleOpenExternal}
              className="p-1 rounded-[5px] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-[var(--text-secondary)] cursor-pointer"
              title="Open Source Link"
            >
              <ExternalLink size={13} />
            </button>
          )}
          <button
            onClick={handleTogglePin}
            className={clsx(
              "p-1 rounded-[5px] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] cursor-pointer",
              item.isPinned ? "text-[#007AFF]" : "text-[var(--text-secondary)]"
            )}
            title={item.isPinned ? "Unpin" : "Pin"}
          >
            <Pin size={13} fill={item.isPinned ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // REFERENCE UI GRID CARD (Pixel Perfect)
  // ==========================================
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group relative flex flex-col rounded-[16px] overflow-hidden cursor-pointer select-none transition-all duration-200",
        "bg-white dark:bg-[#1A1A1E]",
        "border border-black/[0.08] dark:border-white/[0.08]",
        "hover:border-black/[0.18] dark:hover:border-white/[0.2]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)]",
        item.isPinned && "ring-1 ring-[#007AFF]/60 shadow-[0_2px_12px_rgba(0,122,255,0.12)]"
      )}
    >
      {/* 1. Top Cover / Thumbnail Media (Aspect 16:10 like reference UI) */}
      <div className="relative w-full aspect-[16/10] bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden border-b border-black/[0.05] dark:border-white/[0.06]">
        {item.previewImage ? (
          <img 
            src={item.previewImage} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            onError={(e) => {
              // Graceful fallback to styled monogram banner if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black/[0.02] to-black/[0.05] dark:from-white/[0.02] dark:to-white/[0.05] p-4 text-center">
            <div className="w-10 h-10 rounded-[10px] bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center font-bold text-[14px] text-[var(--text-muted)] mb-1">
              {item.sourceDomain.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium truncate max-w-[180px]">
              {item.sourceDomain}
            </span>
          </div>
        )}

        {/* Top-Left: Type Badge or Pinned Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          {isInstagram && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 dark:bg-black/80 backdrop-blur-md text-white flex items-center gap-1 shadow-2xs">
              <InstagramIcon size={10} />
              <span>Instagram</span>
            </span>
          )}
          {item.isPinned && (
            <span className="w-6 h-6 rounded-full bg-white/95 dark:bg-black/90 backdrop-blur-md flex items-center justify-center text-[#007AFF] shadow-xs">
              <Pin size={11} fill="currentColor" />
            </span>
          )}
        </div>

        {/* Top-Right: Floating Translucent Circular Actions (Eye, External Link, Trash) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          {/* Quick Preview Eye */}
          <button
            type="button"
            onClick={handleClick}
            className="w-7 h-7 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all"
            title="Preview Details"
          >
            <Eye size={13} strokeWidth={2} />
          </button>

          {/* Open External Link */}
          {item.url && (
            <button
              type="button"
              onClick={handleOpenExternal}
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-black/75 dark:text-white/80 hover:text-[#007AFF] dark:hover:text-[#0A84FF] hover:bg-white dark:hover:bg-black shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all"
              title="Open Source Link"
            >
              <ExternalLink size={12.5} strokeWidth={2} />
            </button>
          )}

          {/* Delete Action */}
          {item.isArchived ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); restoreItem(item.id); }}
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-black/75 dark:text-white/80 hover:text-[#34C759] hover:bg-white dark:hover:bg-black shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all"
              title="Restore Item"
            >
              <RotateCcw size={12.5} strokeWidth={2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-black/75 dark:text-white/80 hover:text-[#FF3B30] hover:bg-white dark:hover:bg-black shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all"
              title="Delete Item"
            >
              <Trash2 size={12.5} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Card Content Area (Matching reference UI text hierarchy) */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Line 1: Domain on Left • Date on Right */}
          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-muted)] font-normal mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {item.favicon && (
                <img 
                  src={item.favicon} 
                  alt="" 
                  className="w-3.5 h-3.5 rounded-[2px] object-contain shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
              )}
              <span className="truncate max-w-[150px] sm:max-w-[170px] hover:text-[var(--text-secondary)] transition-colors">
                {item.sourceDomain}
              </span>
            </div>
            <span className="shrink-0 text-[11px] text-[var(--text-muted)] font-normal">
              {formattedDate}
            </span>
          </div>

          {/* Line 2: Bold 1-Line Title */}
          <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[var(--text-primary)] leading-tight line-clamp-1 group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
            {item.title}
          </h3>

          {/* Line 3: 1-Line Description Snippet */}
          <p className="text-[12px] text-[var(--text-secondary)] line-clamp-1 leading-normal mt-1 font-normal">
            {item.description}
          </p>
        </div>

        {/* Line 4: Outlined Tag Icon + Category & Tags */}
        <div className="mt-3 pt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] truncate">
          <Tag size={12} className="shrink-0 opacity-70" strokeWidth={1.8} />
          <span className="truncate hover:text-[var(--text-secondary)] transition-colors">
            {tagsDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
