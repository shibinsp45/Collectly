import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Download, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Smartphone,
  Check,
  Fingerprint,
  LogOut,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  InstaReelsIcon, 
  InstaGearIcon, 
  InstaBookmarkIcon 
} from '../ui/InstagramDesignIcons';
import { InstagramIcon } from '../ui/InstagramIcon';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftToggle, SwiftSegmentedControl } from '../ui/AppleDesignSystem';
import { ThemeMode, ViewMode } from '../../types';
import { clsx } from 'clsx';

export const SettingsScreen: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    viewMode, 
    setViewMode, 
    aiPreferences, 
    setAiPreferences,
    exportData,
    resetToSampleData,
    user,
    loginWithGoogle,
    loginWithInstagram,
    disconnectGoogle,
    disconnectInstagram,
    syncInstagramSaves,
    syncGoogleSaves,
    isSyncingInstagram,
    isSyncingGoogle,
    isBiometricsEnabled,
    enableBiometrics,
    disableBiometrics,
    setIsBiometricModalOpen,
    setIsAuthModalOpen,
    installPwaApp,
    showToast
  } = useCollectly();

  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'storage'>('account');

  const handleToggleAi = (key: keyof typeof aiPreferences) => {
    setAiPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Preference Saved', 'Setting updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-28 pt-1">
      {/* 1. Header with Clapperboard / Reels & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] insta-gradient-bg text-white flex items-center justify-center shadow-md">
          <InstaReelsIcon size={20} strokeWidth={2.2} />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[var(--text-primary)] tracking-tight">
            Settings
          </h1>
        </div>
      </div>

      {/* 2. Top Navigation Tabs (Account, Appearance, Storage/Sync) */}
      <div className="flex items-center gap-6 border-b border-black/[0.08] dark:border-white/[0.1] pb-2 text-[14px]">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={clsx(
            "relative pb-2 font-semibold transition-colors cursor-pointer",
            activeTab === 'account'
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <span>Account</span>
          {activeTab === 'account' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] insta-gradient-bg rounded-full shadow-xs" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={clsx(
            "relative pb-2 font-semibold transition-colors cursor-pointer",
            activeTab === 'appearance'
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <span>Appearance</span>
          {activeTab === 'appearance' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] insta-gradient-bg rounded-full shadow-xs" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('storage')}
          className={clsx(
            "relative pb-2 font-semibold transition-colors cursor-pointer",
            activeTab === 'storage'
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <span>Sync & Export</span>
          {activeTab === 'storage' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] insta-gradient-bg rounded-full shadow-xs" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ACCOUNT & CONNECTED FEEDS                         */}
      {/* ========================================================= */}
      {activeTab === 'account' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Card: Account & Cloud Sync */}
          <div className="glass-card p-5 sm:p-6 rounded-[24px] space-y-4">
            <div>
              <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                Account
              </h2>
              <p className="text-[12.5px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Sign in to sync your settings and watch progress across devices.
              </p>
            </div>

            {/* Profile Row with White Pill Sign In / Profile button */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <span>{user.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#34C759]/15 text-[#34C759]">
                    ● Online
                  </span>
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">
                  {user.email || 'ansu@collectly.app'}
                </p>
              </div>

              {/* White Pill Button matching reference UI! */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-[13px] shadow-md hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
              >
                Profile Details
              </button>
            </div>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {/* Instagram Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] insta-gradient-bg text-white flex items-center justify-center shadow-xs shrink-0">
                  <InstagramIcon size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Instagram</h4>
                  <p className="text-[11.5px] text-[var(--text-muted)]">
                    {user.instagramConnected ? user.instagramHandle : 'Sync your watchlist, history and progress'}
                  </p>
                </div>
              </div>

              {user.instagramConnected ? (
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-[#34C759]/15 px-3 py-1.5 rounded-full">
                    <Check size={11} strokeWidth={2.5} /> Connected
                  </span>
                  <button
                    type="button"
                    onClick={syncInstagramSaves}
                    disabled={isSyncingInstagram}
                    className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[#E1306C] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sync Instagram Saves"
                  >
                    <RefreshCw size={13} className={isSyncingInstagram ? "animate-spin" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={disconnectInstagram}
                    className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[#FD1D1D] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Disconnect Instagram"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => loginWithInstagram('@ansu.design')}
                  className="px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] font-semibold border border-white/10 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  Connect
                </button>
              )}
            </div>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {/* Google Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-white dark:bg-white/[0.08] border border-black/10 dark:border-white/10 text-[#4285F4] flex items-center justify-center font-bold text-[16px] shadow-xs shrink-0">
                  G
                </div>
                <div>
                  <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Google ID</h4>
                  <p className="text-[11.5px] text-[var(--text-muted)]">
                    {user.googleConnected ? user.googleEmail : 'Sync starred places, maps and saved articles'}
                  </p>
                </div>
              </div>

              {user.googleConnected ? (
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-[#34C759]/15 px-3 py-1.5 rounded-full">
                    <Check size={11} strokeWidth={2.5} /> Connected
                  </span>
                  <button
                    type="button"
                    onClick={syncGoogleSaves}
                    disabled={isSyncingGoogle}
                    className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[#4285F4] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sync Google Saves"
                  >
                    <RefreshCw size={13} className={isSyncingGoogle ? "animate-spin" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={disconnectGoogle}
                    className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[#FD1D1D] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Disconnect Google"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => loginWithGoogle('ansu@gmail.com')}
                  className="px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/[0.08] hover:bg-white/20 text-[var(--text-primary)] text-[12.5px] font-semibold border border-white/10 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  Connect
                </button>
              )}
            </div>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {/* Biometric Fingerprint Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#E1306C]/15 text-[#E1306C] dark:text-[#FD1D1D] flex items-center justify-center shadow-xs shrink-0">
                  <Fingerprint size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Fingerprint Login</h4>
                  <p className="text-[11.5px] text-[var(--text-muted)]">
                    {isBiometricsEnabled ? 'Touch ID / Windows Hello active on device' : 'Unlock Collectly using biometric sensor'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isBiometricsEnabled ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsBiometricModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-[11.5px] font-medium border border-white/10 cursor-pointer active:scale-95 transition-all"
                    >
                      Test Sensor
                    </button>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-[#34C759]/15 px-3 py-1.5 rounded-full">
                      <Check size={11} strokeWidth={2.5} /> Enrolled
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={enableBiometrics}
                    className="px-4 py-1.5 rounded-full insta-gradient-bg text-white text-[12.5px] font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Enroll Sensor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: APPEARANCE (Liquid Glass & Instagram Theme)        */}
      {/* ========================================================= */}
      {activeTab === 'appearance' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="glass-card p-5 sm:p-6 rounded-[24px] space-y-4">
            <div>
              <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                Appearance
              </h2>
              <p className="text-[12.5px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Change the look of the site to suit your needs.
              </p>
            </div>

            {/* Visual Theme Selection Cards */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">Color Theme</p>
                  <p className="text-[11.5px] text-[var(--text-muted)]">Switch between Liquid Light, Dark, or System mode</p>
                </div>
                <SwiftSegmentedControl<ThemeMode>
                  options={[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'Auto', icon: Laptop },
                  ]}
                  value={theme}
                  onChange={setTheme}
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={clsx(
                    "p-3 rounded-[16px] border-2 transition-all flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95",
                    theme === 'light'
                      ? "border-[#E1306C] bg-white/20 dark:bg-white/10 shadow-md ring-2 ring-[#E1306C]/30"
                      : "border-black/[0.08] dark:border-white/[0.1] hover:border-white/20"
                  )}
                >
                  <div className="w-full h-12 rounded-[10px] bg-[#F9F7FC] border border-black/10 flex items-center justify-center text-[#1C1C1E] shadow-2xs">
                    <Sun size={20} className="text-[#FF9500]" />
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">Light Mode</span>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={clsx(
                    "p-3 rounded-[16px] border-2 transition-all flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95",
                    theme === 'dark'
                      ? "border-[#E1306C] bg-white/20 dark:bg-white/10 shadow-md ring-2 ring-[#E1306C]/30"
                      : "border-black/[0.08] dark:border-white/[0.1] hover:border-white/20"
                  )}
                >
                  <div className="w-full h-12 rounded-[10px] bg-[#0A0710] border border-white/10 flex items-center justify-center text-white shadow-2xs">
                    <Moon size={20} className="text-[#E1306C]" />
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">Dark Mode</span>
                </button>

                {/* System / Auto Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={clsx(
                    "p-3 rounded-[16px] border-2 transition-all flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95",
                    theme === 'system'
                      ? "border-[#E1306C] bg-white/20 dark:bg-white/10 shadow-md ring-2 ring-[#E1306C]/30"
                      : "border-black/[0.08] dark:border-white/[0.1] hover:border-white/20"
                  )}
                >
                  <div className="w-full h-12 rounded-[10px] bg-gradient-to-r from-[#F9F7FC] to-[#0A0710] border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text-primary)] shadow-2xs">
                    <Laptop size={20} className="text-[#007AFF]" />
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">System Auto</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {/* Default View Mode */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-[13.5px] font-medium text-[var(--text-primary)]">Default Layout</p>
                <p className="text-[12px] text-[var(--text-muted)]">Choose between 16:10 Cards or Compact 3-Column List</p>
              </div>
              <SwiftSegmentedControl<ViewMode>
                options={[
                  { value: 'grid', label: 'Cards', icon: LayoutGrid },
                  { value: 'list', label: 'List', icon: List },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </div>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {/* AI Suggestion Toggles */}
            <div className="space-y-3 pt-1">
              <SwiftToggle
                checked={aiPreferences.smartClassification}
                onChange={() => handleToggleAi('smartClassification')}
                label="Suggest Category on Save"
                description="Auto-suggest matching categories based on URL domain or topic."
              />
              <SwiftToggle
                checked={aiPreferences.autoSummarization}
                onChange={() => handleToggleAi('autoSummarization')}
                label="Summary & Key Points Extraction"
                description="Extract concise summaries and key takeaways for long articles."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SYNC, PWA & EXPORT                                */}
      {/* ========================================================= */}
      {activeTab === 'storage' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* PWA Mobile App */}
          <div className="glass-card p-5 sm:p-6 rounded-[24px] space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone size={17} className="text-[#E1306C]" />
                  <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                    Install on Mobile (PWA)
                  </h3>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  Install Collectly on your iOS or Android home screen for one-tap Instagram & web sharing.
                </p>
              </div>

              <button
                type="button"
                onClick={installPwaApp}
                className="px-4 py-2 rounded-full insta-gradient-bg text-white font-semibold text-[12.5px] shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer"
              >
                Install App
              </button>
            </div>

            <div className="p-3.5 rounded-[14px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-[12px] text-[var(--text-secondary)] space-y-1.5">
              <p className="font-semibold text-[var(--text-primary)]">Saving from Instagram on Mobile:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11.5px] text-[var(--text-muted)]">
                <li>Tap <strong>Share</strong> on any post or reel in Instagram.</li>
                <li>Select <strong>Collectly</strong> in your apps sheet.</li>
                <li>Collectly automatically organizes it into your library with thumbnail and tags.</li>
              </ol>
            </div>
          </div>

          {/* Data Export */}
          <div className="glass-card p-5 sm:p-6 rounded-[24px] flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Download Your Library</h3>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">Export all bookmarks and notes anytime.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => exportData('json')}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => exportData('csv')}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-[12px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                CSV
              </button>
            </div>
          </div>

          {/* Reset Library */}
          <div className="glass-card p-5 sm:p-6 rounded-[24px] flex items-center justify-between">
            <div>
              <h3 className="text-[13.5px] font-medium text-[var(--text-primary)]">Reset Sample Library</h3>
              <p className="text-[11.5px] text-[var(--text-muted)]">Restore default knowledge base items</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Restore the default Collectly knowledge base sample items?')) {
                  resetToSampleData();
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#FD1D1D]/15 text-[#FD1D1D] hover:bg-[#FD1D1D]/25 text-[12px] font-semibold active:scale-95 transition-all cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
