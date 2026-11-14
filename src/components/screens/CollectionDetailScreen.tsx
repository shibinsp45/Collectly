import React from 'react';
import { ArrowLeft, Plus, Folder, Bookmark } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { SwiftButton } from '../ui/AppleDesignSystem';

export const CollectionDetailScreen: React.FC = () => {
  const { 
    selectedCollectionId, 
    setSelectedCollectionId, 
    setActiveScreen, 
    collections, 
    items, 
    viewMode,
    setIsAddModalOpen 
  } = useCollectly();

  const collection = collections.find(c => c.id === selectedCollectionId);
  const collectionItems = items.filter(i => i.collectionId === selectedCollectionId && !i.isArchived);

  if (!collection) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-secondary)]">Collection not found.</p>
        <SwiftButton className="mt-3" onClick={() => setActiveScreen('collections')}>
          Back to Collections
        </SwiftButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Collection Header Card (Apple Inset Header) */}
      <div className="p-6 rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: collection.color }} />
            <span>Collection • {collectionItems.length} items</span>
          </div>
          <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
            {collection.name}
          </h2>
          <p className="text-[13.5px] text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SwiftButton
            variant="bordered"
            icon={ArrowLeft}
            onClick={() => {
              setSelectedCollectionId(null);
              setActiveScreen('collections');
            }}
          >
            Collections
          </SwiftButton>
          <SwiftButton
            variant="prominent"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add to Collection
          </SwiftButton>
        </div>
      </div>

      {/* Items in collection */}
      {collectionItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {collectionItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-3">
          <Folder size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">This collection is empty</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Save articles, links, and documents directly to "{collection.name}" to keep them organized together.
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
