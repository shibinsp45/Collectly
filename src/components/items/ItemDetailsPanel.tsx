import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Pin, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  Edit3, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon,
  Maximize2,
  FileText,
  Share2,
  Play
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftButton, SwiftBadge } from '../ui/AppleDesignSystem';
import { InstagramIcon } from '../ui/InstagramIcon';
import { InstaBookmarkIcon } from '../ui/InstagramDesignIcons';
import { getCandidatesForContent, resolveThumbnailAutomatically } from '../../lib/thumbnailService';
import { clsx } from 'clsx';

export const ItemDetailsPanel: React.FC = () => {
  const { 
    selectedItem, 
    setSelectedItem, 
    updateItem, 
    deleteItem, 
    archiveItem, 
    restoreItem, 
    togglePinItem, 
    collections, 
    categories,
    showToast 
  } = useCollectly();

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedCollectionId, setEditedCollectionId] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedItem]);

  if (!selectedItem) return null;

  const currentThumbnail = selectedItem.previewImage || resolveThumbnailAutomatically(selectedItem);
  const candidateThumbnails = getCandidatesForContent(selectedItem);

  const handleSelectThumbnail = (url: string) => {
    updateItem(selectedItem.id, { previewImage: url });
    showToast('Cover Thumbnail Updated', 'Saved new preview image for this post.', 'success');
  };

  const handleCustomImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim()) {
      updateItem(selectedItem.id, { previewImage: customImageUrl.trim() });
      setCustomImageUrl('');
      showToast('Custom Thumbnail Saved', 'Custom preview URL applied to post.', 'success');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateItem(selectedItem.id, { previewImage: reader.result });
          showToast('Image Uploaded', 'Device file saved as post thumbnail.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setEditedTitle(selectedItem.title);
    setEditedDescription(selectedItem.description);
    setEditedCategory(selectedItem.category);
    setEditedCollectionId(selectedItem.collectionId || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateItem(selectedItem.id, {
      title: editedTitle.trim() || selectedItem.title,
      description: editedDescription.trim() || selectedItem.description,
      category: editedCategory || selectedItem.category,
      collectionId: editedCollectionId || undefined,
    });
    setIsEditing(false);
    showToast('Saved', 'Item details updated.', 'success');
  };

  const handleCopyLink = () => {
    if (selectedItem.url) {
      navigator.clipboard.writeText(selectedItem.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Link Copied', 'URL copied to clipboard.', 'info');
    }
  };

  const isInstagram = selectedItem.sourceDomain.includes('instagram.com') || selectedItem.type === 'social';

  const formattedDate = new Date(selectedItem.dateSaved).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200"
      onClick={() => setSelectedItem(null)}
    >
      {/* Centered Glassmorphism Popup Modal */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative w-full max-w-5xl max-h-[92vh] rounded-[24px] overflow-hidden flex flex-col",
          "glass-panel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20 select-none animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Top Header Toolbar */}
        <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.1] bg-white/40 dark:bg-black/30 backdrop-blur-xl shrink-0">
          {/* Left Metadata Pill */}
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            {isInstagram ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold insta-gradient-bg text-white flex items-center gap-1 shadow-xs shrink-0">
                <InstagramIcon size={12} strokeWidth={2.4} />
                <span>Instagram Post</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#007AFF] text-white flex items-center gap-1 shadow-xs shrink-0 capitalize">
                <FileText size={12} />
                <span>{selectedItem.type}</span>
              </span>
            )}
            <span className="text-[12px] text-[var(--text-muted)] truncate hidden sm:inline">
              {selectedItem.sourceDomain} • {formattedDate}
            </span>
          </div>

          {/* Right Toolbar Actions (WCAG 2.2 AA 44x44pt Touch Targets) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Pin / Unpin */}
            <button
              onClick={() => togglePinItem(selectedItem.id)}
              className={clsx(
                "min-w-[44px] min-h-[44px] rounded-full hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center",
                selectedItem.isPinned ? "text-[#E1306C]" : "text-[var(--text-secondary)]"
              )}
              title={selectedItem.isPinned ? "Unpin item" : "Pin item to top"}
              aria-label={selectedItem.isPinned ? "Unpin item" : "Pin item to top"}
            >
              <Pin size={17} fill={selectedItem.isPinned ? "currentColor" : "none"} />
            </button>

            {/* Copy Link */}
            {selectedItem.url && (
              <button
                onClick={handleCopyLink}
                className="min-w-[44px] min-h-[44px] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
                title="Copy URL"
                aria-label="Copy URL"
              >
                {copied ? <Check size={17} className="text-[#34C759]" /> : <Copy size={17} />}
              </button>
            )}

            {/* Open Original */}
            {selectedItem.url && (
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-[44px] min-h-[44px] rounded-full text-[var(--text-secondary)] hover:text-[#007AFF] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
                title="Open original link"
                aria-label="Open original link"
              >
                <ExternalLink size={17} />
              </a>
            )}

            {/* Archive / Restore */}
            {selectedItem.isArchived ? (
              <button
                onClick={() => restoreItem(selectedItem.id)}
                className="min-w-[44px] min-h-[44px] rounded-full text-[var(--text-secondary)] hover:text-[#34C759] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
                title="Restore item"
                aria-label="Restore item"
              >
                <RotateCcw size={17} />
              </button>
            ) : (
              <button
                onClick={() => archiveItem(selectedItem.id)}
                className="min-w-[44px] min-h-[44px] rounded-full text-[var(--text-secondary)] hover:text-[#FF9500] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
                title="Archive item"
                aria-label="Archive item"
              >
                <Archive size={17} />
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => deleteItem(selectedItem.id)}
              className="min-w-[44px] min-h-[44px] rounded-full text-[var(--text-secondary)] hover:text-[#FD1D1D] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
              title="Delete item"
              aria-label="Delete item"
            >
              <Trash2 size={17} />
            </button>

            {/* Close Button - 44px Accessible Touch Target */}
            <button
              onClick={() => setSelectedItem(null)}
              className="ml-1 min-w-[44px] min-h-[44px] rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-95"
              title="Close preview (Esc)"
              aria-label="Close preview"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] dark:divide-white/[0.1]">
          {/* Left Column: Full-Scale High-Res File Preview & Cover Studio */}
          <div className="md:col-span-7 p-4 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Media Preview Box */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-[18px] overflow-hidden glass-card shadow-lg border border-white/20 group">
                <img 
                  src={currentThumbnail} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                
                {selectedItem.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs">
                    <div className="w-14 h-14 rounded-full insta-gradient-bg text-white flex items-center justify-center shadow-2xl">
                      <Play size={24} className="ml-1 fill-white" />
                    </div>
                  </div>
                )}

                {/* Quick Toggle Cover Studio */}
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(!isStudioOpen)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <ImageIcon size={12} />
                  <span>{isStudioOpen ? 'Hide Studio' : 'Thumbnail Studio'}</span>
                </button>
              </div>

              {/* Cover Thumbnail Decision Studio Accordion */}
              {isStudioOpen && (
                <div className="glass-card rounded-[16px] p-3.5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[var(--text-primary)]">
                      Pick Thumbnail for All Cards
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Instant Sync</span>
                  </div>

                  {/* 6 Curated Candidates */}
                  <div className="grid grid-cols-6 gap-2">
                    {candidateThumbnails.map((candUrl: string, idx: number) => {
                      const isSelected = currentThumbnail === candUrl;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectThumbnail(candUrl)}
                          className={clsx(
                            "relative aspect-square rounded-[8px] overflow-hidden cursor-pointer border-2 transition-all hover:scale-105",
                            isSelected 
                              ? "border-[#E1306C] shadow-md ring-2 ring-[#E1306C]/40" 
                              : "border-transparent opacity-75 hover:opacity-100"
                          )}
                        >
                          <img src={candUrl} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom URL or Upload */}
                  <div className="flex items-center gap-2 pt-1">
                    <form onSubmit={handleCustomImageSubmit} className="flex-1 flex gap-1.5">
                      <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 h-7.5 px-2.5 rounded-[7px] text-[11.5px] glass-card text-[var(--text-primary)] focus:outline-none"
                      />
                      <button type="submit" className="h-7.5 px-3 rounded-[7px] insta-gradient-bg text-white text-[11px] font-semibold">
                        Apply
                      </button>
                    </form>
                    <label className="h-7.5 px-2.5 rounded-[7px] glass-card hover:bg-white/10 text-[var(--text-primary)] text-[11px] flex items-center gap-1 cursor-pointer">
                      <Upload size={12} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Author / Source Information */}
            <div className="pt-2 flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
              <span>Author: <strong className="text-[var(--text-primary)]">{selectedItem.author || selectedItem.sourceDomain}</strong></span>
              <span className="px-2.5 py-0.5 rounded-full glass-card text-[11px]">
                {selectedItem.visitCount} views
              </span>
            </div>
          </div>

          {/* Right Column: AI Insights, Full Notes, Details & Tags */}
          <div className="md:col-span-5 p-4 sm:p-6 space-y-4">
            {/* Title & Edit Section */}
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] glass-card text-[14px] font-semibold text-[var(--text-primary)] focus:outline-none"
                  placeholder="Post title"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-[8px] glass-card text-[12.5px] text-[var(--text-primary)] focus:outline-none resize-none"
                  placeholder="Description..."
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="h-8 px-4 rounded-[8px] insta-gradient-bg text-white text-[12px] font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="h-8 px-3 rounded-[8px] glass-card text-[12px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] leading-snug">
                    {selectedItem.title}
                  </h2>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="p-1 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    title="Edit Title / Note"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            )}

            {/* AI Executive Summary Card */}
            <div className="glass-card rounded-[16px] p-4 space-y-2 border border-white/15 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#E1306C] dark:text-[#FD1D1D] font-bold text-[12.5px]">
                <Sparkles size={14} />
                <span>AI Knowledge Summary</span>
              </div>
              <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
                {selectedItem.aiSummary || selectedItem.description}
              </p>

              {/* Key Takeaways */}
              {selectedItem.aiKeyTakeaways && selectedItem.aiKeyTakeaways.length > 0 && (
                <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] space-y-1.5">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Key Highlights
                  </span>
                  <ul className="space-y-1">
                    {selectedItem.aiKeyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="text-[11.5px] text-[var(--text-primary)] flex items-start gap-1.5">
                        <span className="text-[#34C759] font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Category & Tags */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-muted)] font-medium">Category</span>
                <span className="px-2.5 py-0.5 rounded-full insta-gradient-bg text-white font-semibold text-[11px]">
                  {selectedItem.category}
                </span>
              </div>

              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11.5px] text-[var(--text-muted)] font-medium">Tags</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedItem.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 rounded-[6px] bg-white/10 dark:bg-white/[0.06] text-[var(--text-secondary)] text-[11px] border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar on Bottom */}
            <div className="pt-3 border-t border-black/[0.08] dark:border-white/[0.1] flex items-center justify-between">
              {selectedItem.url ? (
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 px-4 rounded-[10px] insta-gradient-bg text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <ExternalLink size={13} />
                  <span>Open Full Content</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="h-9 px-4 rounded-[10px] glass-card text-[var(--text-primary)] text-[12px] font-medium hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPanel;
