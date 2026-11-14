import React, { useState } from 'react';
import { 
  ExternalLink, 
  Archive, 
  Trash2, 
  Pin, 
  MoreHorizontal, 
  RotateCcw
} from 'lucide-react';
import { SavedItem, ViewMode } from '../../types';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftBadge } from '../ui/AppleDesignSystem';
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
    archiveItem, 
    restoreItem, 
    deleteItem, 
    togglePinItem,
    recordItemVisit
  } = useCollectly();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const formattedDate = new Date(item.dateSaved).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const isInstagram = item.sourceDomain.includes('instagram.com') || item.type === 'social';

  // ==========================================
  // LIST VIEW ROW (Linear & Apple precision)
  // ==========================================
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className={clsx(
          "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-[9px] cursor-pointer transition-all duration-150 select-none",
          "bg-[var(--surface-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
          "border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16]",
          item.isPinned && "ring-1 ring-[#007AFF]/30"
        )}
      >
        {/* Source Icon / Favicon */}
        <div className="w-5 h-5 rounded-[4px] bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
          {item.favicon ? (
            <img 
              src={item.favicon} 
              alt="" 
              className="w-3.5 h-3.5 object-contain" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          ) : (
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {item.sourceDomain.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[13.5px] font-medium text-[var(--text-primary)] truncate group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
            {item.title}
          </span>
          {isInstagram && (
            <span className="text-[10px] font-medium text-[#E1306C] px-1.5 py-0.2 rounded bg-[#E1306C]/10 shrink-0">
              Instagram
            </span>
          )}
        </div>

        {/* Metadata info */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 text-[12px] text-[var(--text-secondary)]">
          <span className="truncate max-w-[120px] text-[var(--text-muted)]">{item.sourceDomain}</span>
          <SwiftBadge variant="subtle">{item.category}</SwiftBadge>
          <span className="text-[var(--text-muted)] text-[11px]">{formattedDate}</span>
        </div>

        {/* Action icons on hover */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.url && (
            <button
              onClick={handleOpenExternal}
              className="p-1 rounded-[5px] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-[var(--text-secondary)] cursor-pointer"
              title="Open Link"
            >
              <ExternalLink size={13} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); togglePinItem(item.id); }}
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
  // GRID VIEW CARD (Apple Solid Surface)
  // ==========================================
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group relative flex flex-col rounded-[12px] overflow-hidden cursor-pointer transition-all duration-150 select-none",
        "bg-[var(--surface-primary)] hover:bg-[#FAFAFB] dark:hover:bg-[#202022]",
        "border border-black/[0.07] dark:border-white/[0.08] hover:border-black/[0.14] dark:hover:border-white/[0.16]",
        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)]",
        item.isPinned && "border-l-4 border-l-[#007AFF]"
      )}
    >
      {/* Optional Thumbnail Image */}
      {item.previewImage && (
        <div className="relative w-full h-36 bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden border-b border-black/[0.04] dark:border-white/[0.05]">
          <img 
            src={item.previewImage} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
          />
          {isInstagram && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[5px] text-[10px] font-medium tracking-tight bg-black/70 backdrop-blur-md text-white">
              Instagram
            </span>
          )}
          {item.isPinned && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/95 dark:bg-black/90 backdrop-blur-md flex items-center justify-center text-[#007AFF] shadow-xs">
              <Pin size={10} fill="currentColor" />
            </span>
          )}
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        {/* Source line */}
        <div className="flex items-center justify-between text-[11.5px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded-[3px] bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
              {item.favicon ? (
                <img 
                  src={item.favicon} 
                  alt="" 
                  className="w-3.5 h-3.5 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
              ) : (
                <span className="text-[9px] font-bold text-[var(--text-muted)]">
                  {item.sourceDomain.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="truncate font-medium text-[var(--text-muted)]">{item.sourceDomain}</span>
          </div>

          <span className="text-[11px] text-[var(--text-muted)] shrink-0">{formattedDate}</span>
        </div>

        {/* Title & Preview */}
        <div className="space-y-1">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
            {item.title}
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer: Category & Clean Contextual Actions */}
        <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
          <SwiftBadge variant="subtle" className="text-[11px]">
            {item.category}
          </SwiftBadge>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {item.url && (
              <button
                onClick={handleOpenExternal}
                className="p-1 rounded-[5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Open Source"
              >
                <ExternalLink size={13} />
              </button>
            )}

            {item.isArchived ? (
              <button
                onClick={() => restoreItem(item.id)}
                className="p-1 rounded-[5px] text-[var(--text-muted)] hover:text-[#34C759] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Restore item"
              >
                <RotateCcw size={13} />
              </button>
            ) : (
              <button
                onClick={() => archiveItem(item.id)}
                className="p-1 rounded-[5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Archive item"
              >
                <Archive size={13} />
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-[5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="More actions"
              >
                <MoreHorizontal size={13} />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1.5 w-36 glass-dropdown rounded-[9px] p-1 z-40 text-[12px] select-none">
                    <button
                      onClick={() => { togglePinItem(item.id); setIsMenuOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded-[5px] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] flex items-center gap-2 text-[var(--text-primary)] cursor-pointer"
                    >
                      <Pin size={12} /> {item.isPinned ? 'Unpin' : 'Pin to top'}
                    </button>
                    <button
                      onClick={() => { deleteItem(item.id); setIsMenuOpen(false); }}
                      className="w-full text-left px-2 py-1.5 rounded-[5px] hover:bg-[#D92D20]/10 flex items-center gap-2 text-[#D92D20] cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
