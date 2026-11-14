import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Pin, 
  Check, 
  Copy,
  Calendar, 
  Folder, 
  Tag as TagIcon,
  Pencil,
  Clock
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftButton, SwiftBadge } from '../ui/AppleDesignSystem';
import { resolveThumbnailAutomatically } from '../../lib/thumbnailService';
import { RotateCw } from 'lucide-react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedCollectionId, setEditedCollectionId] = useState('');
  const [copied, setCopied] = useState(false);

  if (!selectedItem) return null;

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
      description: editedDescription.trim(),
      category: editedCategory || selectedItem.category,
      collectionId: editedCollectionId || undefined,
    });
    setIsEditing(false);
  };

  const handleCopyLink = () => {
    if (selectedItem.url) {
      navigator.clipboard.writeText(selectedItem.url);
      setCopied(true);
      showToast('Link Copied', 'URL copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateThumbnail = () => {
    const newThumb = resolveThumbnailAutomatically({
      url: selectedItem.url,
      title: selectedItem.title,
      description: selectedItem.description,
      category: selectedItem.category,
      type: selectedItem.type
    }, Math.floor(Math.random() * 6) + 1);
    updateItem(selectedItem.id, { previewImage: newThumb });
    showToast('Thumbnail Updated', 'Content-aware thumbnail regenerated.', 'success');
  };

  const formattedDate = new Date(selectedItem.dateSaved).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const activeCollection = collections.find(c => c.id === selectedItem.collectionId);

  return (
    <>
      {/* Dimmed backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
        onClick={() => setSelectedItem(null)}
      />

      {/* Details Inspector Panel */}
      <aside 
        className={clsx(
          "fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] md:w-[400px] flex flex-col select-none",
          "bg-[var(--surface-primary)] shadow-2xl border-l border-black/[0.08] dark:border-white/[0.08]",
          "animate-in slide-in-from-right duration-200"
        )}
      >
        {/* Top Action Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePinItem(selectedItem.id)}
              className={clsx(
                "p-1.5 rounded-[6px] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer",
                selectedItem.isPinned ? "text-[#007AFF]" : "text-[var(--text-secondary)]"
              )}
              title={selectedItem.isPinned ? "Unpin item" : "Pin item to top"}
            >
              <Pin size={15} fill={selectedItem.isPinned ? "currentColor" : "none"} />
            </button>

            {selectedItem.isArchived ? (
              <button
                onClick={() => restoreItem(selectedItem.id)}
                className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[#34C759] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Restore from archive"
              >
                <RotateCcw size={15} />
              </button>
            ) : (
              <button
                onClick={() => archiveItem(selectedItem.id)}
                className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Archive item"
              >
                <Archive size={15} />
              </button>
            )}

            <button
              onClick={() => deleteItem(selectedItem.id)}
              className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[#D92D20] hover:bg-[#D92D20]/10 transition-colors cursor-pointer"
              title="Delete item"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <button
            onClick={() => setSelectedItem(null)}
            className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Close panel"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Preview Image if available */}
          {selectedItem.previewImage && (
            <div className="relative group/thumb w-full h-44 rounded-[10px] overflow-hidden bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
              <img 
                src={selectedItem.previewImage} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRegenerateThumbnail}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-[6px] bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-[11px] font-medium flex items-center gap-1.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer shadow-xs"
                title="Regenerate thumbnail with AI"
              >
                <RotateCw size={11} />
                <span>Change Image</span>
              </button>
            </div>
          )}

          {/* Title & Description */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-muted)] tracking-wider">Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-[13.5px] rounded-[8px] bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-[var(--text-muted)] tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-[13px] rounded-[8px] bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <SwiftButton size="sm" variant="plain" onClick={() => setIsEditing(false)}>Cancel</SwiftButton>
                <SwiftButton size="sm" variant="prominent" onClick={handleSaveEdit}>Save</SwiftButton>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-[16px] font-semibold text-[var(--text-primary)] leading-snug tracking-tight">
                  {selectedItem.title}
                </h2>
                <button
                  onClick={handleStartEdit}
                  className="p-1 rounded-[5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  title="Edit details"
                >
                  <Pencil size={13} />
                </button>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {selectedItem.description}
              </p>
            </div>
          )}

          {/* External URL card with Copy button */}
          {selectedItem.url && (
            <div className="flex items-center justify-between p-3 rounded-[9px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
              <div className="min-w-0 pr-2">
                <p className="text-[10.5px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Source URL</p>
                <p className="text-[12.5px] text-[var(--text-primary)] font-medium truncate mt-0.5">{selectedItem.sourceDomain}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check size={14} className="text-[#34C759]" /> : <Copy size={14} />}
                </button>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-[6px] text-[#007AFF] hover:bg-[#007AFF]/10 transition-colors cursor-pointer"
                  title="Open source link"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Clean Executive Summary (Notion/Linear style, no AI slop gradients) */}
          <div className="p-3.5 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
            <h4 className="text-[12px] font-semibold text-[var(--text-primary)]">
              Summary & Key Points
            </h4>
            <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
              {selectedItem.aiSummary || selectedItem.description}
            </p>
            {selectedItem.aiKeyTakeaways && selectedItem.aiKeyTakeaways.length > 0 && (
              <ul className="space-y-1 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.06]">
                {selectedItem.aiKeyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-[12px] text-[var(--text-secondary)] flex items-start gap-1.5">
                    <span className="text-[var(--text-muted)]">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <TagIcon size={13} className="opacity-70" />
                <span>Category</span>
              </div>
              <SwiftBadge variant="subtle">{selectedItem.category}</SwiftBadge>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Folder size={13} className="opacity-70" />
                <span>Collection</span>
              </div>
              <span className="font-medium text-[var(--text-primary)]">
                {activeCollection?.name || 'None'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar size={13} className="opacity-70" />
                <span>Date Saved</span>
              </div>
              <span className="text-[var(--text-muted)] text-[12px]">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.05]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Clock size={13} className="opacity-70" />
                <span>Type</span>
              </div>
              <span className="text-[var(--text-muted)] text-[12px] capitalize">{selectedItem.readingTime || selectedItem.type}</span>
            </div>
          </div>

          {/* Tags */}
          {selectedItem.tags && selectedItem.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-[var(--text-muted)] tracking-wider">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedItem.tags.map((tag) => (
                  <SwiftBadge key={tag} variant="outline" className="text-[11px]">
                    #{tag}
                  </SwiftBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
