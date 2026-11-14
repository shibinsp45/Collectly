import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  Tag, 
  ArrowRight,
  Mic,
  MicOff,
  Check
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
    showToast
  } = useCollectly();

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  // Keyboard shortcut listener for Command+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Suggested keywords detected across all saved files
  const suggestedKeywords = useMemo(() => {
    return suggestKeywordsForQuery(query, items, 8);
  }, [query, items]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);

    return items
      .filter(item => !item.isArchived)
      .map(item => {
        let score = 0;
        const matchedKeywords: string[] = [];

        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const categoryLower = item.category.toLowerCase();
        const tagsLower = (item.tags || []).map(t => t.toLowerCase());
        const domainLower = item.sourceDomain.toLowerCase();
        const contentLower = (item.content || '').toLowerCase();

        // Exact match
        if (titleLower.includes(q)) {
          score += 60;
          matchedKeywords.push('Title');
        }
        if (descLower.includes(q)) {
          score += 30;
          matchedKeywords.push('Description');
        }
        if (categoryLower.includes(q)) {
          score += 25;
          matchedKeywords.push('Category: ' + item.category);
        }
        if (domainLower.includes(q)) {
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
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Spotlight Window */}
      <div className="relative w-full max-w-2xl bg-[var(--surface-primary)] rounded-[14px] shadow-2xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden flex flex-col max-h-[82vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar with Voice Search Mic */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <Search size={18} className="text-[#007AFF] shrink-0" strokeWidth={2} />
          
          <input
            type="text"
            autoFocus
            placeholder={isListening ? "Listening... Speak now" : "Search files or keywords..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[14.5px] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}

          {/* Voice Search Microphone Button */}
          <button
            onClick={toggleVoiceSearch}
            className={clsx(
              "p-1.5 rounded-[7px] transition-all cursor-pointer flex items-center justify-center",
              isListening
                ? "bg-[#D92D20] text-white animate-pulse shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[#007AFF] hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
            )}
            title={isListening ? "Stop listening" : "Search by voice"}
            aria-label="Voice search"
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} strokeWidth={2} />}
          </button>
        </div>

        {/* Dynamic Keywords Strip: Auto-detected from user's saved files */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/[0.04] dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider shrink-0 mr-1">
            Detected Keywords:
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

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* If no query: Show Recent Saves */}
          {!query && (
            <div className="p-2 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Recent Knowledge Files
              </span>
              <div className="space-y-1">
                {items.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="flex items-center justify-between p-2 rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock size={13} className="text-[var(--text-muted)] shrink-0" />
                      <span className="text-[13px] text-[var(--text-primary)] truncate">{item.title}</span>
                    </div>
                    <SwiftBadge variant="subtle">{item.category}</SwiftBadge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If query entered: Display matches with detected keyword highlight */}
          {query && searchResults.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-[11px] font-medium text-[var(--text-muted)]">
                <span>{searchResults.length} {searchResults.length === 1 ? 'file' : 'files'} matching "{query}"</span>
                <span className="text-[#007AFF]">Ranked by relevance</span>
              </div>

              {searchResults.map(({ item, matchedKeyword }) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="flex items-start gap-3 p-3 rounded-[9px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.08] cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-[6px] bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    {item.favicon ? (
                      <img src={item.favicon} alt="" className="w-4 h-4 object-contain" />
                    ) : (
                      <Tag size={13} className="text-[#007AFF]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-semibold text-[var(--text-primary)] truncate">
                        {item.title}
                      </h4>
                      {matchedKeyword && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#007AFF]/10 text-[#007AFF] font-medium shrink-0">
                          {matchedKeyword}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)]">
                      <span>{item.sourceDomain}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      {item.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">#{item.tags.slice(0, 3).join(' #')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query && searchResults.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Search size={24} className="mx-auto text-[var(--text-muted)] opacity-40" />
              <p className="text-[13.5px] font-medium text-[var(--text-primary)]">No matching files</p>
              <p className="text-[12px] text-[var(--text-secondary)] max-w-sm mx-auto">
                No saved files contain "{query}". Try checking your spelling or clicking a detected keyword chip above.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>Voice & Keyword Search Enabled</span>
          </div>
          <span>Collectly Index</span>
        </div>
      </div>
    </div>
  );
};
