import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Mic, 
  MicOff, 
  Bell, 
  Cloud, 
  Sun, 
  Moon, 
  Menu,
  Check
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { clsx } from 'clsx';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobileNav,
}) => {
  const { 
    user,
    theme,
    setTheme,
    setIsSearchModalOpen,
    setSearchQuery,
    setIsAuthModalOpen,
    showToast
  } = useCollectly();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for Voice Search in the top pill bar
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setSearchQuery(transcript);
        setIsSearchModalOpen(true);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [setSearchQuery, setIsSearchModalOpen]);

  const handleVoiceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!recognitionRef.current) {
      showToast('Voice Search', 'Voice search opened. Speak or type your search query.', 'info');
      setIsSearchModalOpen(true);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsSearchModalOpen(true);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 h-12 px-2.5 sm:px-4 bg-[#F5F5F7]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.07] flex items-center justify-between gap-2 sm:gap-3 select-none text-[var(--text-primary)]">
      {/* 1. Left Navigation Menu Toggle */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* 2. Center Pill Search Bar (Full Width & Clean) */}
      <div className="flex-1 max-w-xl mx-1 sm:mx-4 min-w-0">
        <div 
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full h-8.5 sm:h-8 px-3 rounded-full bg-black/[0.04] dark:bg-[#1E1E22] hover:bg-black/[0.08] dark:hover:bg-[#25252A] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-2 cursor-pointer transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2 text-[var(--text-muted)] min-w-0 flex-1">
            <Search size={13.5} className="shrink-0 text-[#007AFF]" />
            <span className="text-[12.5px] truncate hidden sm:inline">
              Search Collectly, voice, keywords...
            </span>
            <span className="text-[12.5px] truncate sm:hidden">
              Search...
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Voice Search Button */}
            <button
              onClick={handleVoiceClick}
              className={clsx(
                "w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center",
                isListening 
                  ? "bg-[#D92D20] text-white animate-pulse" 
                  : "text-[var(--text-muted)] hover:text-[#007AFF] hover:bg-black/[0.05] dark:hover:bg-white/10"
              )}
              title={isListening ? "Listening..." : "Search via voice"}
            >
              {isListening ? <MicOff size={12.5} /> : <Mic size={12.5} />}
            </button>
            <kbd className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[9.5px] bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* 3. Right System Status & Window Controls (Aligned on Mobile) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Connected Accounts indicator (Desktop only) */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.06] cursor-pointer transition-colors"
          title="Google & Instagram Connected Accounts"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
          <span>{user.name}</span>
        </button>

        {/* Cloud Sync Icon (Desktop/Tablet only to avoid mobile crowding) */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="hidden sm:flex w-7 h-7 items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          title="Cloud Sync Active"
        >
          <Cloud size={14} />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => showToast('Notifications', 'All your Instagram and Google saves are up to date.', 'info')}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:bg-black/[0.05] dark:active:bg-white/[0.08] cursor-pointer"
            title="Notifications"
          >
            <Bell size={14} />
          </button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#D92D20] rounded-full" />
        </div>

        {/* Theme Toggle (Desktop/Tablet only; accessible on mobile in Settings & Drawer) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hidden sm:flex w-7 h-7 items-center justify-center rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center font-bold text-[11.5px] cursor-pointer shadow-xs active:scale-95 transition-transform"
          title="Profile & Sync Accounts"
        >
          {user.avatar || 'A'}
        </div>
      </div>
    </header>
  );
};
