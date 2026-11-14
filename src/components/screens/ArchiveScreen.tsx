import React from 'react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { SwiftButton } from '../ui/AppleDesignSystem';

export const ArchiveScreen: React.FC = () => {
  const { items, viewMode, restoreItem, deleteItem, showToast } = useCollectly();

  const archivedItems = items.filter(i => i.isArchived);

  const handleRestoreAll = () => {
    archivedItems.forEach(item => restoreItem(item.id));
    showToast('All Restored', 'All archived items have been restored to your library.', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            Archive
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Archived references and completed reading materials.
          </p>
        </div>

        {archivedItems.length > 0 && (
          <SwiftButton
            variant="bordered"
            icon={RotateCcw}
            onClick={handleRestoreAll}
          >
            Restore All
          </SwiftButton>
        )}
      </div>

      {archivedItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {archivedItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-3">
          <Archive size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Your archive is empty</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Items you archive from your saves will be preserved here instead of cluttering your main views.
          </p>
        </div>
      )}
    </div>
  );
};
