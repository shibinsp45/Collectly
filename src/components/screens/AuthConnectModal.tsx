import React, { useState } from 'react';
import { Check, LogOut, RefreshCw } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftSheet, SwiftButton } from '../ui/AppleDesignSystem';

export const AuthConnectModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    loginWithGoogle, 
    loginWithInstagram, 
    disconnectGoogle, 
    disconnectInstagram,
    syncInstagramSaves,
    syncGoogleSaves,
    isSyncingInstagram,
    isSyncingGoogle
  } = useCollectly();

  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customInstaHandle, setCustomInstaHandle] = useState('');
  const [isEditingGoogle, setIsEditingGoogle] = useState(false);
  const [isEditingInsta, setIsEditingInsta] = useState(false);

  return (
    <SwiftSheet
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title="Connected Accounts & Saves Sync"
      subtitle="Login with Google & Instagram IDs to collect saved posts & starred places"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* 1. Google Account & Saved Lists */}
        <div className="p-3.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Google Brand Mark */}
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

        {/* 2. Instagram Account & Saved Posts List */}
        <div className="p-3.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Instagram Mark */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center font-bold text-[13px] shadow-2xs">
                IG
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

        {/* Notice */}
        <p className="text-[11.5px] text-[var(--text-muted)] text-center px-2">
          Collectly securely indexes your saved links and posts offline in your local database for instant voice and keyword search.
        </p>

        <div className="flex justify-end pt-2">
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
