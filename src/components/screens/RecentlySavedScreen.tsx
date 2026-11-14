import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { ItemCard } from '../items/ItemCard';
import { SwiftButton } from '../ui/AppleDesignSystem';

export const RecentlySavedScreen: React.FC = () => {
  const { items, viewMode, setIsAddModalOpen } = useCollectly();

  const recentItems = items
    .filter(i => !i.isArchived)
    .sort((a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            Recently Saved
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Your knowledge influx ordered chronologically by save date.
          </p>
        </div>
        <SwiftButton
          variant="prominent"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Capture
        </SwiftButton>
      </div>

      {recentItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-[16px] bg-[var(--surface-primary)] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-3">
          <Clock size={32} className="mx-auto text-[var(--text-muted)] opacity-40" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">No recent saves</h3>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Items you capture will show up here chronologically.
          </p>
        </div>
      )}
    </div>
  );
};
