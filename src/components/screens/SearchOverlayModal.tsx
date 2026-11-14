import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  Tag, 
  ArrowRight,
  Mic, 
  MicOff, 
  Check,
  Camera,
  Sparkles
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { SavedItem } from '../../types';
import { SwiftBadge } from '../ui/AppleDesignSystem';
import { suggestKeywordsForQuery, extractSavedKeywords } from '../../lib/keywordService';
import { clsx } from 'clsx';

export const SearchOverlayModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    items, 
    setSelectedItem,
    recordItemVisit,
    searchQuery,
    setSearchQuery,
    showToast
  } = useCollectly();

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync searchQuery from parent context when modal opens
  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery, isSearchModalOpen]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        showToast('Voice Search', 'Microphone not detected or permission denied.', 'info');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      showToast('Voice Search', 'Voice recognition is simulated or not supported in this browser.', 'info');
      // Simulated voice input for testing
      const sampleVoiceQueries = [
        "restaurant in Fort Kochi",
        "minimalist architecture Kyoto",
        "Figma auto layout",
        "ambient AI interface"
      ];
      const randomQuery = sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
      setQuery(randomQuery);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setQuery(`Visual search: ${fileName}`);
      showToast('Image Search', `Analyzing visual features of "${file.name}"...`, 'info');
    }
  };

  // Keyboard shortcut listener for Command+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Reset or focus input on open
  useEffect(() => {
    if (!isSearchModalOpen) {
      setIsListening(false);
    }
  }, [isSearchModalOpen]);

  // Suggested keywords based on current query
  const suggestedKeywords = useMemo(() => {
    return suggestKeywordsForQuery(query, items, 8);
  }, [query, items]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const isAskAi = q.startsWith('ask ai:') || q.startsWith('ai:');
    const cleanQ = isAskAi ? q.replace(/^(ask ai:|ai:)\s*/i, '') : q;
    const tokens = cleanQ.split(/\s+/).filter(Boolean);

    return items
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const contentLower = (item.content || '').toLowerCase();
        const categoryLower = item.category.toLowerCase();
        const tagsLower = item.tags.map(t => t.toLowerCase());

        const matchedKeywords: string[] = [];

        // Exact matches
        if (titleLower.includes(cleanQ)) {
          score += 50;
          matchedKeywords.push('Title match');
        }
        if (categoryLower === cleanQ) {
          score += 30;
          matchedKeywords.push('Category: ' + item.category);
        }
        if (item.sourceDomain.toLowerCase().includes(cleanQ)) {
          score += 20;
          matchedKeywords.push('Domain: ' + item.sourceDomain);
        }

        // Token checks
        tokens.forEach(token => {
          if (titleLower.includes(token)) score += 10;
          if (descLower.includes(token)) score += 5;
          if (contentLower.includes(token)) score += 8;
          if (categoryLower.includes(token)) score += 6;
          tagsLower.forEach(t => {
            if (t.includes(token)) {
              score += 12;
              matchedKeywords.push('#' + t);
            }
          });
        });

        return {
          item,
          score,
          matchedKeyword: matchedKeywords[0] || (score > 0 ? 'Matched in file' : '')
        };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, items]);

  if (!isSearchModalOpen) return null;

  const handleSelectItem = (item: SavedItem) => {
    recordItemVisit(item.id);
    setSelectedItem(item);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:pt-16 sm:px-4">
      {/* Blurred overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Spotlight Window */}
      <div className="relative w-full max-w-2xl bg-[var(--surface-primary)] rounded-[16px] shadow-2xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden flex flex-col max-h-[82vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar with Unified Voice, Image, and Ask AI Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search size={18} className="text-[#007AFF] shrink-0" strokeWidth={2.2} />
            
            <input
              type="text"
              autoFocus
              placeholder={isListening ? "Listening... Speak now" : "Ask AI anything, search by voice, or drop image..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-[14.5px] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none min-w-0"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Actions: Voice, Image, Ask AI */}
          <div className="flex items-center gap-1.5 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] dark:border-white/[0.06]">
            {/* 1. Voice Search */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={clsx(
                "h-7.5 px-2.5 rounded-full text-[11.5px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs",
                isListening
                  ? "bg-[#D92D20] text-white animate-pulse"
                  : "bg-black/[0.04] dark:bg-white/[0.08] text-[var(--text-primary)] hover:bg-black/[0.08] dark:hover:bg-white/[0.12]"
              )}
              title={isListening ? "Stop listening" : "Search by Voice"}
            >
              {isListening ? <MicOff size={13} /> : <Mic size={13} className="text-[#007AFF]" />}
              <span>{isListening ? 'Listening' : 'Voice'}</span>
            </button>

            {/* 2. Image Search */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSearch}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="h-7.5 px-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[var(--text-primary)] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[11.5px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Search by Image"
            >
              <Camera size={13} className="text-[#34C759]" />
              <span>Image</span>
            </button>

            {/* 3. Ask AI */}
            <button
              type="button"
              onClick={() => setQuery('Ask AI: ')}
              className="h-7.5 px-3 rounded-full bg-[#007AFF] hover:bg-[#0069D9] text-white text-[11.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Ask AI Knowledge Engine"
            >
              <Sparkles size={12.5} />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Dynamic Keywords Strip: Auto-detected from user's saved files */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/[0.04] dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10.5px] font-semibold text-[var(--text-muted)] uppercase tracking-wider shrink-0 mr-1">
            Keywords:
          </span>
          {suggestedKeywords.map(({ keyword, matchedFilesCount }) => {
            const isSelected = query.toLowerCase() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                onClick={() => setQuery(keyword)}
                className={clsx(
                  "px-2.5 py-0.5 rounded-[5px] text-[11.5px] font-medium transition-all shrink-0 cursor-pointer select-none",
                  isSelected
                    ? "bg-[#007AFF] text-white shadow-2xs"
                    : "bg-black/[0.04] dark:bg-white/[0.06] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.07] dark:hover:bg-white/[0.1]"
                )}
              >
                <span>{keyword}</span>
                <span className="text-[10px] opacity-70 ml-1">({matchedFilesCount})</span>
              </button>
            );
          })}
        </div>

        {/* Search Results / Suggestions List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {query.trim() === '' ? (
            /* Prompt Suggestions when empty */
            <div className="py-8 px-4 text-center space-y-3">
              <p className="text-[12.5px] text-[var(--text-muted)]">
                Try asking a question, speaking via voice, or selecting a suggestion:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {[
                  "Summarize my recent reads",
                  "Find minimalist architecture",
                  "What design systems are saved?",
                  "Restaurants in Kochi"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuery(prompt)}
                    className="px-3 py-1.5 rounded-[8px] bg-black/[0.03] dark:bg-white/[0.05] hover:bg-[#007AFF]/10 text-[var(--text-secondary)] hover:text-[#007AFF] text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map(({ item, matchedKeyword }) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="group p-2.5 rounded-[9px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center justify-between gap-3 cursor-pointer transition-colors select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[6px] bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.favicon ? (
                      <img 
                        src={item.favicon} 
                        alt="" 
                        className="w-4 h-4 object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">
                        {item.sourceDomain.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[13.5px] font-medium text-[var(--text-primary)] truncate group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF]">
                      {item.title}
                    </h4>
                    <p className="text-[11.5px] text-[var(--text-secondary)] truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {matchedKeyword && (
                    <SwiftBadge variant="subtle" className="text-[10.5px]">
                      {matchedKeyword}
                    </SwiftBadge>
                  )}
                  <ArrowRight size={13} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">
                No matches found for "{query}"
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                Try searching for other keywords, categories, or speak via Voice Search.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[9px]">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[9px]">esc</kbd> Dismiss</span>
          </div>
          <span>Collectly Spotlight</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlayModal;
