import React, { useState } from 'react';
import { Folder, Plus, MoreHorizontal, Pencil, Trash2, ArrowRight } from 'lucide-react';
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
    setActiveScreen 
  } = useCollectly();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007AFF');

  const colorOptions = [
    '#007AFF', // Blue
    '#5856D6', // Purple
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF2D55', // Pink
    '#AF52DE', // Violet
    '#5AC8FA', // Sky
    '#8E8E93'  // Gray
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: name.trim(),
        description: description.trim(),
        color,
      });
    } else {
      addCollection({
        name: name.trim(),
        description: description.trim(),
        color,
      });
    }
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            Collections
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Curate thematic spaces to cluster related research, links, and documents.
          </p>
        </div>
        <SwiftButton
          variant="prominent"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          New Collection
        </SwiftButton>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map(col => {
          const colItems = items.filter(i => i.collectionId === col.id && !i.isArchived);
          return (
            <div
              key={col.id}
              onClick={() => {
                setSelectedCollectionId(col.id);
                setActiveScreen('collection-detail');
              }}
              className="group p-5 rounded-[14px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {colItems.length} {colItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Edit / Delete actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleOpenEdit(col, e)}
                      className="p-1 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
                      title="Edit collection"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete collection "${col.name}"? Items inside will remain saved in Inbox.`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="p-1 rounded-[6px] text-[var(--text-secondary)] hover:text-[#D92D20] hover:bg-[#D92D20]/10 cursor-pointer"
                      title="Delete collection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mt-3 group-hover:text-[#007AFF] transition-colors">
                  {col.name}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                  {col.description || 'No description provided.'}
                </p>
              </div>

              {/* Bottom preview strip */}
              <div className="pt-4 mt-4 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span>View contents</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
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
            <div className="flex items-center gap-2">
              {colorOptions.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <SwiftButton type="button" variant="plain" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </SwiftButton>
            <SwiftButton type="submit" variant="prominent">
              {editingCollection ? 'Save Changes' : 'Create Collection'}
            </SwiftButton>
          </div>
        </form>
      </SwiftSheet>
    </div>
  );
};
