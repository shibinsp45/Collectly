import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Plus, 
  Filter, 
  FolderDown, 
  Layers, 
  ExternalLink, 
  Volume2, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { InstagramIcon } from '../ui/InstagramIcon';
import { InstaBookmarkIcon, InstaReelsIcon } from '../ui/InstagramDesignIcons';
import { SavedItem } from '../../types';
import { clsx } from 'clsx';

export const ReelsScreen: React.FC = () => {
  const { 
    items, 
    setSelectedItem, 
    setIsAddModalOpen, 
    setActiveScreen, 
    togglePinItem, 
    showToast 
  } = useCollectly();

  const [filterTag, setFilterTag] = useState<string>('all');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Filter items that are Reels, Videos, Instagram posts, or rich media
  const reelItems = useMemo(() => {
    return items.filter(item => {
      const isReelOrVideo = 
        item.type === 'video' || 
        item.type === 'social' || 
        item.category.toLowerCase() === 'instagram' ||
        item.sourceDomain.includes('instagram.com') ||
        (item.tags && item.tags.some(t => t.toLowerCase() === 'reel' || t.toLowerCase() === 'video'));

      if (!isReelOrVideo) return false;
      if (filterTag === 'all') return true;
      return (
        item.category.toLowerCase().includes(filterTag.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase()))
      );
    });
  }, [items, filterTag]);

  const categoriesFilter = [
    { id: 'all', label: 'All Reels' },
    { id: 'Architecture', label: 'Architecture' },
    { id: 'Design', label: 'UI Design' },
    { id: 'Travel', label: 'Travel' },
    { id: 'Technology', label: 'Tech' },
  ];

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-24 md:pb-16 px-1 sm:px-2 animate-in fade-in duration-200">
      {/* Top Banner / Navigation */}
      <div className="glass-card p-4 sm:p-5 rounded-[22px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] insta-gradient-bg text-white flex items-center justify-center shadow-md shrink-0">
            <InstaReelsIcon size={22} strokeWidth={2.4} filled={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                Reels & Video Clips
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold insta-gradient-bg text-white shadow-2xs">
                {reelItems.length} Reels
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-normal">
              High-definition Instagram reels, motion design clips, and saved video captures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick link to All Saved Files */}
          <button
            type="button"
            onClick={() => setActiveScreen('all-saves')}
            className="flex-1 sm:flex-none h-9 px-3.5 rounded-[10px] bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <Bookmark size={14} className="text-[#007AFF]" />
            <span>Show All Saved Files</span>
          </button>

          {/* Save New Reel */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none h-9 px-4 rounded-[10px] insta-gradient-bg text-white text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Save Reel</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 touch-pan-x">
        {categoriesFilter.map(cat => {
          const isActive = filterTag === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterTag(cat.id)}
              className={clsx(
                "h-8 px-3.5 rounded-full text-[12.5px] font-medium transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "insta-gradient-bg text-white shadow-sm font-semibold scale-102"
                  : "bg-white/10 dark:bg-white/[0.06] hover:bg-white/15 text-[var(--text-secondary)] border border-white/10"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Bento Grid / Reels Grid for Mobile & Desktop */}
      {reelItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
          {reelItems.map((reel, idx) => {
            // Bento sizing on mobile: every 4th card is featured 2-columns wide
            const isFeatured = idx % 5 === 0;

            return (
              <div
                key={reel.id}
                onClick={() => setSelectedItem(reel)}
                className={clsx(
                  "group relative rounded-[20px] overflow-hidden glass-card cursor-pointer transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(225,48,108,0.25)] hover:border-white/30",
                  isFeatured ? "col-span-2 aspect-[16/10] sm:aspect-[9/16]" : "aspect-[9/16]"
                )}
              >
                {/* Reel Thumbnail / Media Preview */}
                <img
                  src={reel.previewImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold insta-gradient-bg text-white flex items-center gap-1 shadow-xs">
                    <InstagramIcon size={10} strokeWidth={2.4} />
                    <span>Reel</span>
                  </span>

                  {reel.isPinned && (
                    <span className="p-1 rounded-full bg-black/50 text-[#FD1D1D] backdrop-blur-md">
                      <InstaBookmarkIcon size={12} filled />
                    </span>
                  )}
                </div>

                {/* Center Animated Play Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-black/45 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform duration-300">
                    <Play size={20} className="ml-1 text-white fill-white" />
                  </div>
                </div>

                {/* Bottom Metadata Card Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 z-10 space-y-1 text-white">
                  {/* Creator handle & Audio indicator */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-white/80">
                    <span className="truncate max-w-[130px] font-semibold">{reel.author || '@instagram'}</span>
                    <span className="flex items-center gap-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                      <Volume2 size={10} />
                      {reel.readingTime || 'Original audio'}
                    </span>
                  </div>

                  {/* Reel Title */}
                  <h3 className="text-[12.5px] sm:text-[13px] font-bold leading-snug line-clamp-2 text-white group-hover:text-[#FCAF45] transition-colors">
                    {reel.title}
                  </h3>

                  {/* Tags */}
                  {reel.tags && reel.tags.length > 0 && (
                    <div className="flex items-center gap-1 pt-0.5 overflow-hidden">
                      {reel.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9.5px] text-white/70 font-medium truncate">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-[22px] p-10 text-center space-y-3">
          <InstaReelsIcon size={36} className="mx-auto text-[var(--text-muted)] opacity-50" />
          <h3 className="text-[16px] font-bold text-[var(--text-primary)]">No Reels Found</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            You don't have any reels under "{filterTag}". Sync with Instagram or save a reel URL to view it here.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 rounded-full insta-gradient-bg text-white text-[12.5px] font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Add Instagram Reel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelsScreen;
