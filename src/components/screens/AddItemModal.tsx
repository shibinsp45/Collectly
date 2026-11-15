import React, { useState, useEffect } from 'react';
import { Link, FileText, MapPin, Plus, Check, RotateCw, Image as ImageIcon } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftSheet, SwiftButton, SwiftSegmentedControl } from '../ui/AppleDesignSystem';
import { ContentType } from '../../types';
import { resolveThumbnailAutomatically } from '../../lib/thumbnailService';
import { detectMatchingKeywordsInText } from '../../lib/keywordService';
import { clsx } from 'clsx';

export const AddItemModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    addItem, 
    collections, 
    categories,
    items,
    prefillShareData,
    setPrefillShareData
  } = useCollectly();

  const [activeTab, setActiveTab] = useState<'url' | 'note' | 'location'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Mandatory Category state
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInstagramDetected, setIsInstagramDetected] = useState(false);

  // AI-Driven Thumbnail selection
  const [thumbOffset, setThumbOffset] = useState(0);

  // Sync prefilled data from Web Share Target or Instagram share
  useEffect(() => {
    if (prefillShareData) {
      if (prefillShareData.url) {
        setUrl(prefillShareData.url);
        setActiveTab('url');
      }
      if (prefillShareData.title) {
        setTitle(prefillShareData.title);
      }
      if (prefillShareData.text && !prefillShareData.title) {
        setTitle(prefillShareData.text.slice(0, 80));
      }
      if (prefillShareData.isInstagram) {
        setIsInstagramDetected(true);
        setCategoryName('Instagram');
      }
    }
  }, [prefillShareData]);

  // Real-time URL check for Instagram
  useEffect(() => {
    const isInsta = url.toLowerCase().includes('instagram.com');
    setIsInstagramDetected(isInsta);
    if (isInsta && (!categoryName || categoryName === 'Uncategorised')) {
      setCategoryName('Instagram');
    }
  }, [url]);

  // Derive content type
  const derivedType: ContentType = isInstagramDetected 
    ? 'social' 
    : activeTab === 'location' 
    ? 'location' 
    : activeTab === 'note' 
    ? 'note' 
    : 'article';

  // Automatically detect keywords matching existing saved files
  const detectedKeywords = detectMatchingKeywordsInText(
    `${title} ${noteContent} ${url} ${categoryName}`,
    items
  );

  // Automatically determine the thumbnail based on the content
  const previewThumbnail = resolveThumbnailAutomatically({
    url,
    title,
    description: noteContent,
    category: categoryName,
    type: derivedType
  }, thumbOffset);

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setNoteContent('');
    setCategoryName('');
    setCategoryError(false);
    setSelectedCollectionId('');
    setIsInstagramDetected(false);
    setThumbOffset(0);
    setPrefillShareData(null);
  };

  const handleClose = () => {
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Category is required before saving!
    const finalCategory = categoryName.trim();
    if (!finalCategory) {
      setCategoryError(true);
      return;
    }

    if (activeTab === 'url' && !url.trim()) return;
    if (activeTab === 'note' && !noteContent.trim() && !title.trim()) return;
    if (activeTab === 'location' && !title.trim() && !url.trim()) return;

    setIsSubmitting(true);

    let type: ContentType = 'article';
    if (isInstagramDetected) {
      type = 'social';
    } else if (activeTab === 'note') {
      type = 'note';
    } else if (activeTab === 'location') {
      type = 'location';
    } else {
      const lower = url.toLowerCase();
      if (lower.includes('youtube.com') || lower.includes('youtu.be')) type = 'video';
      else if (lower.includes('twitter.com') || lower.includes('x.com')) type = 'social';
      else if (lower.includes('figma.com') || lower.includes('dribbble.com')) type = 'design';
      else if (lower.includes('maps.google.com') || lower.includes('goo.gl/maps')) type = 'location';
      else type = 'article';
    }

    let defaultTitle = title.trim();
    if (!defaultTitle) {
      if (isInstagramDetected) {
        defaultTitle = 'Instagram Post';
      } else if (activeTab === 'url') {
        try {
          const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
          defaultTitle = parsed.hostname.replace('www.', '') + ' save';
        } catch {
          defaultTitle = url.trim();
        }
      } else {
        defaultTitle = 'Quick Note';
      }
    }

    await addItem({
      url: url.trim() || undefined,
      title: defaultTitle,
      description: noteContent.trim() || (isInstagramDetected ? 'Saved from Instagram' : `Saved link`),
      content: noteContent.trim() || undefined,
      type,
      category: finalCategory,
      collectionId: selectedCollectionId || undefined,
      previewImage: previewThumbnail,
    });

    setIsSubmitting(false);
    handleClose();
  };

  return (
    <SwiftSheet
      isOpen={isAddModalOpen}
      onClose={handleClose}
      title={isInstagramDetected ? "Save Instagram Post" : "Save Content"}
      subtitle={isInstagramDetected ? "Instagram post detected • Select category to save" : "Capture link, note, or place"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Instagram Post Banner if detected */}
        {isInstagramDetected && (
          <div className="p-3 rounded-[10px] bg-[#E1306C]/[0.08] border border-[#E1306C]/25 flex items-center justify-between text-[12.5px]">
            <div className="flex items-center gap-2 text-[#E1306C] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#E1306C]" />
              <span>Instagram Post Detected</span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">social reference</span>
          </div>
        )}

        {/* Mode Switcher */}
        {!isInstagramDetected && (
          <div className="flex justify-center pb-1">
            <SwiftSegmentedControl<'url' | 'note' | 'location'>
              options={[
                { value: 'url', label: 'Link / URL', icon: Link },
                { value: 'note', label: 'Note', icon: FileText },
                { value: 'location', label: 'Location', icon: MapPin },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>
        )}

        {/* URL or Note Inputs */}
        {activeTab === 'url' && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              {isInstagramDetected ? "Instagram Post URL" : "URL or Web Link"}
            </label>
            <input
              type="url"
              autoFocus={!url}
              required
              placeholder="https://www.instagram.com/p/... or website link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 px-3.5 text-[13.5px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
            />
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">Location Name</label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Kashi Art Cafe, Fort Kochi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3.5 text-[13.5px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">Maps Link (Optional)</label>
              <input
                type="url"
                placeholder="https://maps.google.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-10 px-3.5 text-[13.5px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
          </div>
        )}

        {/* Title or Caption */}
        {activeTab === 'url' && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">Title or Caption</label>
            <input
              type="text"
              placeholder={isInstagramDetected ? "Post caption or creator handle..." : "Article or page title..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3.5 text-[13px] rounded-[8px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
          </div>
        )}

        {activeTab === 'note' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">Note Title</label>
              <input
                type="text"
                autoFocus
                placeholder="Idea, meeting takeaway, or reference title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3.5 text-[13.5px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">Content</label>
              <textarea
                rows={3}
                required
                placeholder="Type or paste text..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full p-3 text-[13px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* AUTOMATIC CONTENT-AWARE THUMBNAIL PREVIEW               */}
        {/* ========================================================= */}
        {(url || title || noteContent || isInstagramDetected) && (
          <div className="space-y-1.5 p-2.5 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-[var(--text-muted)] flex items-center gap-1.5">
                <ImageIcon size={12} className="text-[#007AFF]" />
                <span>Thumbnail (Auto-Selected from Content)</span>
              </span>
              <button
                type="button"
                onClick={() => setThumbOffset(prev => prev + 1)}
                className="flex items-center gap-1 text-[#007AFF] hover:underline cursor-pointer font-medium"
                title="Shuffle alternative thumbnail"
              >
                <RotateCw size={11} />
                <span>Shuffle</span>
              </button>
            </div>
            <div className="relative w-full h-24 rounded-[7px] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06]">
              <img 
                src={previewThumbnail} 
                alt="Auto-selected thumbnail" 
                className="w-full h-full object-cover transition-opacity duration-200"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                AI Match
              </span>
            </div>
          </div>
        )}

        {/* Detected Keywords from Saved Files */}
        {detectedKeywords.length > 0 && (
          <div className="p-2.5 rounded-[9px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.07] space-y-1.5">
            <span className="text-[11px] font-medium text-[var(--text-muted)]">
              Keywords detected in your saved files:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detectedKeywords.map(({ keyword, matchedItem }) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setCategoryName(matchedItem.category)}
                  className="px-2 py-0.5 rounded-[5px] bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title={`Matches existing file "${matchedItem.title}". Click to adopt category.`}
                >
                  <span>#{keyword}</span>
                  <span className="text-[9.5px] opacity-75">({matchedItem.category})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MANDATORY CATEGORY SECTION: User must name/select category   */}
        {/* ============================================================== */}
        <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12.5px] font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <span>Category Name</span>
              <span className="text-[#007AFF]">*</span>
            </label>
            <span className="text-[11px] text-[var(--text-muted)]">Required before saving</span>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-0.5">
            {categories.map((c) => {
              const isSelected = categoryName.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryName(c.name);
                    setCategoryError(false);
                  }}
                  className={clsx(
                    "px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium transition-all cursor-pointer flex items-center gap-1 select-none",
                    isSelected
                      ? "bg-[#007AFF] text-white shadow-xs"
                      : "bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[var(--text-secondary)] border border-black/[0.05] dark:border-white/[0.07]"
                  )}
                >
                  {isSelected && <Check size={11} strokeWidth={2.5} />}
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Category Input: User can type any custom category name */}
          <div className="space-y-1">
            <input
              type="text"
              required
              placeholder="Type category name (e.g. Design, Architecture, Reels, Recipes)..."
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (categoryError && e.target.value.trim()) {
                  setCategoryError(false);
                }
              }}
              className={clsx(
                "w-full h-9 px-3 text-[13px] rounded-[8px] bg-black/[0.04] dark:bg-white/[0.06] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors",
                categoryError
                  ? "border-[#FD1D1D] focus:ring-[#FD1D1D]/40 bg-[#FD1D1D]/[0.03]"
                  : "border-black/[0.08] dark:border-white/[0.1] focus:ring-[#007AFF]"
              )}
            />
            {categoryError && (
              <p className="text-[11.5px] font-medium text-[#FD1D1D] flex items-center gap-1 animate-in fade-in duration-150">
                <span>⚠️ Category is required before saving this item.</span>
              </p>
            )}
          </div>
        </div>

        {/* Optional Collection Assignment */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11.5px] font-medium text-[var(--text-muted)]">Assign to Collection (Optional)</label>
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="w-full h-8 px-2.5 text-[12.5px] rounded-[7px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            <option value="">None</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          <SwiftButton
            type="button"
            variant="plain"
            onClick={handleClose}
          >
            Cancel
          </SwiftButton>
          <SwiftButton
            type="submit"
            variant="prominent"
            icon={Plus}
            disabled={isSubmitting || !categoryName.trim() || (activeTab === 'url' && !url.trim())}
          >
            {isSubmitting ? 'Saving...' : 'Save Item'}
          </SwiftButton>
        </div>
      </form>
    </SwiftSheet>
  );
};
