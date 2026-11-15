import React from 'react';
import { 
  ExternalLink, 
  Trash2, 
  Pin, 
  Eye,
  Tag,
  RotateCcw,
  Pencil
} from 'lucide-react';
import { SavedItem, ViewMode } from '../../types';
import { useCollectly } from '../../context/CollectlyContext';
import { InstagramIcon } from '../ui/InstagramIcon';
import { 
  InstaBookmarkIcon, 
  InstaReelsIcon, 
  InstaShareIcon 
} from '../ui/InstagramDesignIcons';
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    showToast(
      item.isPinned ? 'Post Unpinned' : 'Post Pinned',
      item.isPinned ? `"${item.title}" removed from pinned.` : `"${item.title}" pinned to the top!`,
      'success'
    );
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

  // ==============================================================
  // LIST VIEW TILE CARD (Apple / Raycast 3-Column Compact Grid Tile)
  // ==============================================================
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className={clsx(
          "group relative flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-[16px] cursor-pointer transition-all duration-200 select-none",
          "glass-card hover:bg-white/80 dark:hover:bg-[#201530]/80",
          "hover:border-[#E1306C]/40 dark:hover:border-[#E1306C]/50",
          "hover:shadow-[0_8px_24px_rgba(225,48,108,0.15)]",
          item.isPinned && "ring-1 ring-[#E1306C]/60 bg-[#E1306C]/[0.06] dark:bg-[#E1306C]/[0.12]"
        )}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* App / Source Squircle Icon on Left */}
          <div className="w-10 h-10 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {isInstagram ? (
              <div className="w-full h-full insta-gradient-bg flex items-center justify-center text-white">
                <InstagramIcon size={19} strokeWidth={2.2} />
              </div>
            ) : item.favicon ? (
              <img 
                src={item.favicon} 
                alt="" 
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
            ) : (
              <span className="text-[12px] font-bold text-[var(--text-secondary)]">
                {item.sourceDomain.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Title & URL Stack */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-[13px] sm:text-[13.5px] font-semibold text-[var(--text-primary)] truncate leading-tight group-hover:text-[#E1306C] dark:group-hover:text-[#FD1D1D] transition-colors">
              {item.title}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] truncate leading-tight font-normal">
              {item.url || item.sourceDomain}
            </p>
          </div>
        </div>

        {/* Action buttons on right (Edit, External Link, Pin/Unpin) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {/* Edit Post Button */}
          <button
            type="button"
            onClick={handleEdit}
            className="w-7 h-7 rounded-full bg-black/[0.06] dark:bg-white/[0.1] hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-[var(--text-secondary)] transition-all cursor-pointer shadow-2xs"
            title="Edit post"
          >
            <Pencil size={12} strokeWidth={2} />
          </button>

          {/* Open Link */}
          {item.url && (
            <button
              type="button"
              onClick={handleOpenExternal}
              className="w-7 h-7 rounded-full bg-black/[0.06] dark:bg-white/[0.1] hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-[var(--text-secondary)] transition-all cursor-pointer shadow-2xs"
              title="Open link"
            >
              <InstaShareIcon size={13} strokeWidth={2} />
            </button>
          )}

          {/* Pin / Unpin Button */}
          <button
            type="button"
            onClick={handleTogglePin}
            className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs",
              item.isPinned 
                ? "insta-gradient-bg text-white" 
                : "bg-black/[0.06] dark:bg-white/[0.1] text-[var(--text-secondary)] hover:bg-[#E1306C] hover:text-white"
            )}
            title={item.isPinned ? "Unpin post" : "Pin post to top"}
          >
            <InstaBookmarkIcon size={12} filled={item.isPinned} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // REFERENCE UI GRID CARD (Pixel Perfect Glass)
  // ==========================================
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group relative flex flex-col rounded-[22px] overflow-hidden cursor-pointer select-none transition-all duration-300",
        "glass-card hover:bg-white/85 dark:hover:bg-[#1C142A]/85",
        "hover:border-[#E1306C]/40 dark:hover:border-[#E1306C]/50",
        "shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(225,48,108,0.18)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:scale-[1.015]",
        item.isPinned && "ring-1 ring-[#E1306C]/70 shadow-[0_4px_20px_rgba(225,48,108,0.22)]"
      )}
    >
      {/* 1. Top Cover / Thumbnail Media (Aspect 16:10 like reference UI) */}
      <div className="relative w-full aspect-[16/10] bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden border-b border-black/[0.05] dark:border-white/[0.06]">
        {item.previewImage ? (
          <img 
            src={item.previewImage} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black/[0.02] to-black/[0.05] dark:from-white/[0.02] dark:to-white/[0.05] p-4 text-center">
            <div className="w-10 h-10 rounded-[12px] bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center font-bold text-[14px] text-[var(--text-muted)] mb-1">
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold insta-gradient-bg text-white flex items-center gap-1 shadow-sm">
              <InstagramIcon size={11} strokeWidth={2.2} />
              <span>Instagram</span>
            </span>
          )}
          {item.isPinned && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E1306C] text-white flex items-center gap-1 shadow-xs">
              <InstaBookmarkIcon size={10} filled />
              <span>Pinned</span>
            </span>
          )}
        </div>

        {/* Top-Right: Floating Translucent Circular Actions (Pin, Edit, External Link, Trash) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {/* 1. Pin / Unpin Button */}
          <button
            type="button"
            onClick={handleTogglePin}
            className={clsx(
              "w-7.5 h-7.5 rounded-full backdrop-blur-xl shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-white/10",
              item.isPinned
                ? "insta-gradient-bg text-white"
                : "bg-black/65 dark:bg-black/80 text-white/90 hover:text-white hover:bg-[#E1306C]"
            )}
            title={item.isPinned ? "Unpin post" : "Pin post to top"}
          >
            <InstaBookmarkIcon size={13} filled={item.isPinned} strokeWidth={2} />
          </button>

          {/* 2. Direct Edit Details Button */}
          <button
            type="button"
            onClick={handleEdit}
            className="w-7.5 h-7.5 rounded-full bg-black/65 dark:bg-black/80 hover:bg-[#E1306C] text-white/90 hover:text-white backdrop-blur-xl shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-white/10"
            title="Edit details"
          >
            <Pencil size={12} strokeWidth={2} />
          </button>

          {/* 3. External Link Button */}
          {item.url && (
            <button
              type="button"
              onClick={handleOpenExternal}
              className="w-7.5 h-7.5 rounded-full bg-black/65 dark:bg-black/80 hover:bg-[#E1306C] text-white/90 hover:text-white backdrop-blur-xl shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-white/10"
              title="Open original link"
            >
              <InstaShareIcon size={12} strokeWidth={2} />
            </button>
          )}

          {/* 4. Delete Item Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-7.5 h-7.5 rounded-full bg-black/65 dark:bg-black/80 hover:bg-[#FD1D1D] text-white/90 hover:text-white backdrop-blur-xl shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-white/10"
            title="Delete post"
          >
            <Trash2 size={12} strokeWidth={2} />
          </button>
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
