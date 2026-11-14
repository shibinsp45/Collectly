import React, { useState } from 'react';
import { Check, LogOut, RefreshCw, Cloud, ShieldCheck } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftSheet, SwiftButton } from '../ui/AppleDesignSystem';
import { InstagramIcon } from '../ui/InstagramIcon';

export const AuthConnectModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    items,
    loginWithGoogle, 
    loginWithInstagram, 
    disconnectGoogle, 
    disconnectInstagram,
    syncInstagramSaves,
    syncGoogleSaves,
    isSyncingInstagram,
    isSyncingGoogle
  } = useCollectly();

  const activeSavesCount = items.filter(i => !i.isArchived).length;

  return (
    <SwiftSheet
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title="User Profile & Connected Accounts"
      subtitle="Manage your profile identity, cloud sync engine, and linked platforms"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* 1. User Profile Identity Card */}
        <div className="p-4 rounded-[14px] bg-gradient-to-br from-black/[0.04] to-black/[0.01] dark:from-white/[0.06] dark:to-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center font-bold text-[16px] shrink-0 shadow-xs">
              {user.avatar || 'A'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight truncate">
                  {user.name}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] truncate font-normal mt-0.5">
                {user.email || 'ansu@collectly.app'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-[6px] text-[10.5px] font-semibold bg-[#007AFF]/10 text-[#007AFF] dark:text-[#0A84FF] shrink-0">
            Pro Plan
          </span>
        </div>

        {/* 2. Cloud Sync Engine Status Card (Moved from top header) */}
        <div className="p-3.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-[#007AFF]/10 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center shrink-0">
                <Cloud size={15} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Collectly Cloud Sync</h4>
                <p className="text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                  ● Active & Synchronized ({activeSavesCount} items)
                </p>
              </div>
            </div>

            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Auto-sync on
            </span>
          </div>

          <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
            Continuous background synchronization of Instagram saved posts, Google starred places, and web bookmarks.
          </p>
        </div>

        {/* 3. Google Account & Saved Lists */}
        <div className="p-3.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center font-bold text-[14px] text-[#4285F4] shadow-2xs">
                G
              </div>
              <div>
                <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Google ID</h4>
                <p className="text-[11.5px] text-[var(--text-secondary)]">
                  {user.googleConnected ? user.googleEmail : 'Not connected'}
                </p>
              </div>
            </div>

            {user.googleConnected ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                <Check size={11} strokeWidth={2.5} /> Connected
              </span>
            ) : (
              <SwiftButton
                size="sm"
                variant="prominent"
                onClick={() => loginWithGoogle('ansu@gmail.com')}
              >
                Sign In
              </SwiftButton>
            )}
          </div>

          {user.googleConnected && (
            <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-[var(--text-muted)]">
                Sync Google Starred Places & Saves
              </span>
              <div className="flex items-center gap-1.5">
                <SwiftButton
                  size="sm"
                  variant="bordered"
                  onClick={syncGoogleSaves}
                  disabled={isSyncingGoogle}
                >
                  <RefreshCw size={12} className={isSyncingGoogle ? "animate-spin" : ""} />
                  <span>{isSyncingGoogle ? 'Syncing...' : 'Sync Saves'}</span>
                </SwiftButton>
                <button
                  onClick={disconnectGoogle}
                  className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[#D92D20] cursor-pointer"
                  title="Disconnect Google"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Instagram Account & Saved Posts List */}
        <div className="p-3.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center font-bold text-[13px] shadow-2xs">
                <InstagramIcon size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Instagram ID</h4>
                <p className="text-[11.5px] text-[var(--text-secondary)]">
                  {user.instagramConnected ? user.instagramHandle : 'Not connected'}
                </p>
              </div>
            </div>

            {user.instagramConnected ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                <Check size={11} strokeWidth={2.5} /> Connected
              </span>
            ) : (
              <SwiftButton
                size="sm"
                variant="prominent"
                onClick={() => loginWithInstagram('@ansu.design')}
              >
                Sign In
              </SwiftButton>
            )}
          </div>

          {user.instagramConnected && (
            <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-[var(--text-muted)]">
                Sync Instagram Saved Posts & Reels
              </span>
              <div className="flex items-center gap-1.5">
                <SwiftButton
                  size="sm"
                  variant="bordered"
                  onClick={syncInstagramSaves}
                  disabled={isSyncingInstagram}
                >
                  <RefreshCw size={12} className={isSyncingInstagram ? "animate-spin" : ""} />
                  <span>{isSyncingInstagram ? 'Syncing...' : 'Sync Posts'}</span>
                </SwiftButton>
                <button
                  onClick={disconnectInstagram}
                  className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[#D92D20] cursor-pointer"
                  title="Disconnect Instagram"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security & Offline Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-[var(--text-muted)] text-center px-2">
          <ShieldCheck size={13} className="text-[#34C759] shrink-0" />
          <span>Locally indexed & synced securely for Ansu</span>
        </div>

        <div className="flex justify-end pt-1">
          <SwiftButton
            variant="plain"
            onClick={() => setIsAuthModalOpen(false)}
          >
            Done
          </SwiftButton>
        </div>
      </div>
    </SwiftSheet>
  );
};

export default AuthConnectModal;
