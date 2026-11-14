import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { clsx } from 'clsx';

export const AppleToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCollectly();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none select-none max-w-md w-full px-4">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border transition-all duration-200 animate-in fade-in slide-in-from-top-3",
              "glass-dropdown bg-[var(--surface-primary)]/90 backdrop-blur-2xl text-[var(--text-primary)]"
            )}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-[#34C759] shrink-0" />}
            {toast.type === 'danger' && <AlertCircle size={16} className="text-[#FF3B30] shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle size={16} className="text-[#FF9500] shrink-0" />}
            {(!toast.type || toast.type === 'info') && <Info size={16} className="text-[#007AFF] shrink-0" />}

            <div className="flex flex-col pr-1">
              <span className="text-[13px] font-semibold leading-tight">{toast.title}</span>
              {toast.description && (
                <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">{toast.description}</span>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 -mr-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
