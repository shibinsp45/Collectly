import React from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Download, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Database,
  Smartphone,
  Share2,
  Check
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SwiftButton, SwiftToggle, SwiftSegmentedControl } from '../ui/AppleDesignSystem';
import { ThemeMode, ViewMode } from '../../types';

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
    items,
    collections,
    categories,
    isPwaInstallable,
    installPwaApp,
    showToast
  } = useCollectly();

  const handleToggleAi = (key: keyof typeof aiPreferences) => {
    setAiPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Preference Saved', 'Setting updated.', 'success');
  };

  return (
    <div className="space-y-7 max-w-3xl mx-auto pb-20">
      <div>
        <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
          Settings
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
          Manage appearance, mobile installation, and knowledge export.
        </p>
      </div>

      {/* 1. Account Profile */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Account
        </h3>
        <div className="p-3.5 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 text-[var(--text-primary)] flex items-center justify-center text-[14px] font-bold">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">Ansu</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#007AFF]/10 text-[#007AFF] uppercase">
                  Pro
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">ansu@collectly.app</p>
            </div>
          </div>
          <SwiftButton variant="bordered" size="sm">Edit</SwiftButton>
        </div>
      </div>

      {/* 2. Appearance Section (Light / Dark Mode) */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Appearance & Theme
        </h3>
        <div className="p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs space-y-3.5">
          {/* Theme Selector */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--text-primary)]">Color Theme</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Switch between Apple Light, Dark, or System mode</p>
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

          <div className="h-px bg-black/[0.05] dark:bg-white/[0.06]" />

          {/* Default View Mode */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--text-primary)]">Default Layout</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Choose between Card grid or Compact list</p>
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
        </div>
      </div>

      {/* 3. Mobile Web App & Share Target Installation */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Mobile App & Share Target
        </h3>
        <div className="p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-[#007AFF]" />
                <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)]">
                  Install on Mobile (PWA)
                </h4>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Install Collectly on your iOS or Android home screen to enable one-tap Instagram & web sharing.
              </p>
            </div>
            <SwiftButton
              variant="prominent"
              size="sm"
              icon={Download}
              onClick={installPwaApp}
            >
              Install App
            </SwiftButton>
          </div>

          <div className="p-3 rounded-[9px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.07] text-[12px] text-[var(--text-secondary)] space-y-1.5">
            <p className="font-medium text-[var(--text-primary)]">How to save from Instagram on iPhone / Android:</p>
            <ol className="list-decimal list-inside space-y-1 text-[11.5px] text-[var(--text-muted)]">
              <li>Open any post or reel in the Instagram app.</li>
              <li>Tap the <strong>Share</strong> button, then select <strong>Collectly</strong>.</li>
              <li>Collectly will open, extract the post, and prompt you for the category name before saving.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 4. Automated Categorization & Search Preferences */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Preferences & Organization
        </h3>
        <div className="p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs space-y-1">
          <SwiftToggle
            checked={aiPreferences.smartClassification}
            onChange={() => handleToggleAi('smartClassification')}
            label="Suggest Category on Save"
            description="Auto-suggest matching categories based on URL domain or topic."
          />
          <div className="h-px bg-black/[0.05] dark:bg-white/[0.06]" />
          <SwiftToggle
            checked={aiPreferences.autoSummarization}
            onChange={() => handleToggleAi('autoSummarization')}
            label="Summary & Key Points Extraction"
            description="Extract concise summaries and key takeaways for long articles."
          />
          <div className="h-px bg-black/[0.05] dark:bg-white/[0.06]" />
          <SwiftToggle
            checked={aiPreferences.autoTagging}
            onChange={() => handleToggleAi('autoTagging')}
            label="Auto-generate Tags"
            description="Derive searchable tags from domain and titles."
          />
        </div>
      </div>

      {/* 5. Data Export & Portability */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Data Export
        </h3>
        <div className="p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs flex items-center justify-between gap-4">
          <div>
            <p className="text-[13.5px] font-medium text-[var(--text-primary)]">Download Your Archive</p>
            <p className="text-[12px] text-[var(--text-secondary)]">Export your items and collections anytime.</p>
          </div>
          <div className="flex items-center gap-2">
            <SwiftButton
              variant="bordered"
              size="sm"
              icon={Download}
              onClick={() => exportData('json')}
            >
              JSON
            </SwiftButton>
            <SwiftButton
              variant="bordered"
              size="sm"
              icon={Download}
              onClick={() => exportData('csv')}
            >
              CSV
            </SwiftButton>
          </div>
        </div>
      </div>

      {/* 6. System Reset */}
      <div className="p-4 rounded-[12px] bg-[var(--surface-primary)] border border-black/[0.07] dark:border-white/[0.08] shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-[var(--text-primary)]">Reset Sample Library</p>
          <p className="text-[11.5px] text-[var(--text-secondary)]">Restore default knowledge base items</p>
        </div>
        <SwiftButton
          variant="danger"
          size="sm"
          icon={RotateCcw}
          onClick={() => {
            if (confirm('Restore the default Collectly knowledge base sample items?')) {
              resetToSampleData();
            }
          }}
        >
          Reset Data
        </SwiftButton>
      </div>
    </div>
  );
};
