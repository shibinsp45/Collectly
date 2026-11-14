import React from 'react';
import { ArrowLeft, Plus, Layers } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { SwiftButton } from '../ui/AppleDesignSystem';

export const CategoryDetailScreen: React.FC = () => {
  const { 
    selectedCategoryId, 
    setSelectedCategoryId, 
    setActiveScreen, 
    categories, 
    items, 
    viewMode,
    setIsAddModalOpen 
  } = useCollectly();

  const category = categories.find(c => c.id === selectedCategoryId);
  const categoryItems = items.filter(
    i => i.category.toLowerCase() === category?.name.toLowerCase() && !i.isArchived
  );

  if (!category) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-secondary)]">Category not found.</p>
        <SwiftButton className="mt-3" onClick={() => setActiveScreen('categories')}>
          Back to Categories
        </SwiftButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="p-6 rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <Layers size={14} className="text-[#007AFF]" />
            <span>Category • {categoryItems.length} items</span>
          </div>
          <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
            {category.name}
          </h2>
          <p className="text-[13.5px] text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SwiftButton
            variant="bordered"
            icon={ArrowLeft}
            onClick={() => {
              setSelectedCategoryId(null);
              setActiveScreen('categories');
            }}
          >
            All Categories
          </SwiftButton>
          <SwiftButton
            variant="prominent"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add to Category
          </SwiftButton>
        </div>
      </div>

      {categoryItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {categoryItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-3">
          <Layers size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">No items in this category yet</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Save new articles, resources, or notes and select "{category.name}" to view them here.
          </p>
          <div className="pt-2">
            <SwiftButton
              variant="prominent"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add First Item
            </SwiftButton>
          </div>
        </div>
      )}
    </div>
  );
};
