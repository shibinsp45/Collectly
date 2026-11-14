import React, { useState } from 'react';
import { Layers, Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftButton, SwiftSheet, SwiftBadge } from '../ui/AppleDesignSystem';
import { CategoryInfo } from '../../types';

export const CategoryManagementScreen: React.FC = () => {
  const { 
    categories, 
    items, 
    addCategory, 
    renameCategory, 
    deleteCategory, 
    setSelectedCategoryId,
    setActiveScreen 
  } = useCollectly();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setIsModalOpen(true);
  };

  const handleOpenRename = (cat: CategoryInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      renameCategory(editingCategory.id, categoryName.trim());
    } else {
      addCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || 'Custom user category',
        color: '#007AFF',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            Categories
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Organize content by high-level domains and topics.
          </p>
        </div>
        <SwiftButton
          variant="prominent"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Category
        </SwiftButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat) => {
          const catItems = items.filter(i => i.category.toLowerCase() === cat.name.toLowerCase() && !i.isArchived);
          const isSystemUncategorized = cat.id === 'uncategorised';

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setActiveScreen('category-detail');
              }}
              className="group p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                  </span>

                  {!isSystemUncategorized && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenRename(cat, e)}
                        className="p-1 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
                        title="Rename"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete category "${cat.name}"? Items inside will be moved to Uncategorised.`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1 rounded-[6px] text-[var(--text-secondary)] hover:text-[#D92D20] hover:bg-[#D92D20]/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mt-2 group-hover:text-[#007AFF] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[12.5px] text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[11.5px] text-[var(--text-muted)]">
                <span>Browse category</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <SwiftSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Rename Category" : "Add Custom Category"}
        subtitle="Create custom taxonomy for knowledge clustering"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">Category Name</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Architecture & Systems"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full h-10 px-3.5 text-[14px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
          </div>

          {!editingCategory && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">Description</label>
              <textarea
                rows={2}
                placeholder="What belongs in this category..."
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full p-3 text-[13px] rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#007AFF] resize-none"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <SwiftButton type="button" variant="plain" onClick={() => setIsModalOpen(false)}>
              Cancel
            </SwiftButton>
            <SwiftButton type="submit" variant="prominent">
              {editingCategory ? 'Save Name' : 'Create Category'}
            </SwiftButton>
          </div>
        </form>
      </SwiftSheet>
    </div>
  );
};
