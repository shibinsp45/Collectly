import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftButton, SwiftSheet } from '../ui/AppleDesignSystem';
import { Collection } from '../../types';

export const CollectionsScreen: React.FC = () => {
  const { 
    collections, 
    items, 
    addCollection, 
    updateCollection, 
    deleteCollection, 
    setSelectedCollectionId,
    setActiveScreen,
    showToast
  } = useCollectly();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007AFF');

  const colorOptions = [
    { hex: '#007AFF', label: 'Blue' },
    { hex: '#5856D6', label: 'Purple' },
    { hex: '#34C759', label: 'Green' },
    { hex: '#FF9500', label: 'Orange' },
    { hex: '#FF2D55', label: 'Pink' },
    { hex: '#AF52DE', label: 'Violet' },
    { hex: '#5AC8FA', label: 'Sky' },
    { hex: '#8E8E93', label: 'Gray' }
  ];

  const handleOpenCreate = () => {
    setName('');
    setDescription('');
    setColor('#007AFF');
    setEditingCollection(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (col: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description);
    setColor(col.color);
    setIsCreateOpen(true);
  };

  const handleConfirmDelete = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      showToast('Collection Deleted', `"${collectionToDelete.name}" was removed. Items remain safe in your library.`, 'info');
      setCollectionToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: name.trim(),
        description: description.trim(),
        color,
      });
      showToast('Updated', `Collection "${name.trim()}" updated.`, 'success');
    } else {
      addCollection({
        name: name.trim(),
        description: description.trim(),
        color,
      });
      showToast('Created', `Collection "${name.trim()}" created.`, 'success');
    }
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto pb-24 md:pb-16 select-none font-sans text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            Collections ({collections.length})
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] mt-0.5">
            Curate thematic spaces to cluster related research, links, and documents.
          </p>
        </div>
        <SwiftButton
          variant="prominent"
          icon={Plus}
          onClick={handleOpenCreate}
          className="min-h-[44px]"
          aria-label="New Collection"
        >
          New Collection
        </SwiftButton>
      </div>

      {/* Grid of collections: 2x2 Bento on Mobile, 3 cols on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {collections.map(col => {
          const colItems = items.filter(i => i.collectionId === col.id && !i.isArchived);
          return (
            <div
              key={col.id}
              onClick={() => {
                setSelectedCollectionId(col.id);
                setActiveScreen('collection-detail');
              }}
              className="group p-3.5 sm:p-5 rounded-[18px] glass-card hover:border-black/[0.14] dark:hover:border-white/[0.18] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: col.color }} />
                    <span className="text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {colItems.length} {colItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Accessible Edit / Delete Actions */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(col, e)}
                      className="min-w-[34px] min-h-[34px] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.1] flex items-center justify-center cursor-pointer transition-colors"
                      title="Edit collection"
                      aria-label={`Edit collection ${col.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCollectionToDelete(col);
                      }}
                      className="min-w-[34px] min-h-[34px] rounded-full text-[var(--text-secondary)] hover:text-[#FD1D1D] hover:bg-[#FD1D1D]/10 flex items-center justify-center cursor-pointer transition-colors"
                      title="Delete collection"
                      aria-label={`Delete collection ${col.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-[14px] sm:text-[16px] font-semibold text-[var(--text-primary)] mt-2 sm:mt-3 group-hover:text-[#007AFF] transition-colors line-clamp-1">
                  {col.name}
                </h3>
                <p className="text-[11px] sm:text-[13px] text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed font-normal">
                  {col.description || 'No description provided.'}
                </p>
              </div>

              {/* Bottom preview strip */}
              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[11px] sm:text-[12px] text-[var(--text-muted)]">
                <span>View contents</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. Create / Edit Collection Sheet */}
      <SwiftSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={editingCollection ? "Edit Collection" : "Create New Collection"}
        subtitle="Group related knowledge and references"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">Collection Name</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Design Systems & Tokens"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 text-[14px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of what goes in this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-[13px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">Accent Color</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {colorOptions.map(({ hex, label }) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  aria-label={`Select ${label} accent color`}
                  title={label}
                >
                  <span 
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs" 
                    style={{ backgroundColor: hex }}
                  >
                    {color === hex && <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <SwiftButton type="button" variant="plain" onClick={() => setIsCreateOpen(false)} className="min-h-[44px]">
              Cancel
            </SwiftButton>
            <SwiftButton type="submit" variant="prominent" className="min-h-[44px]">
              {editingCollection ? 'Save Changes' : 'Create Collection'}
            </SwiftButton>
          </div>
        </form>
      </SwiftSheet>

      {/* 2. Custom Deletion Confirmation Sheet (Replaces native window.confirm) */}
      <SwiftSheet
        isOpen={Boolean(collectionToDelete)}
        onClose={() => setCollectionToDelete(null)}
        title="Delete Collection?"
        subtitle="Saved bookmarks and files will remain in your library."
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3.5 rounded-[12px] bg-[#FD1D1D]/10 border border-[#FD1D1D]/20 flex items-start gap-3">
            <AlertTriangle className="text-[#FD1D1D] shrink-0 mt-0.5" size={18} />
            <p className="text-[12.5px] text-[var(--text-primary)] leading-normal">
              Are you sure you want to delete <span className="font-bold">"{collectionToDelete?.name}"</span>? The items inside will not be deleted; they will be unassigned.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <SwiftButton 
              type="button" 
              variant="plain" 
              onClick={() => setCollectionToDelete(null)}
              className="min-h-[44px]"
            >
              Cancel
            </SwiftButton>
            <SwiftButton 
              type="button" 
              variant="danger"
              onClick={handleConfirmDelete}
              className="min-h-[44px]"
            >
              Delete Collection
            </SwiftButton>
          </div>
        </div>
      </SwiftSheet>
    </div>
  );
};

export default CollectionsScreen;
