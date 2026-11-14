import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SavedItem, 
  Collection, 
  CategoryInfo, 
  ScreenId, 
  ViewMode, 
  SortOption, 
  ThemeMode,
  AiPreferences,
  ContentType,
  UserAccount 
} from '../types';
import { INITIAL_ITEMS, INITIAL_COLLECTIONS, INITIAL_CATEGORIES } from '../lib/mockData';
import { resolveThumbnailAutomatically } from '../lib/thumbnailService';
import { SAMPLE_INSTAGRAM_SAVES, SAMPLE_GOOGLE_SAVES } from '../lib/syncService';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
}

export interface PrefillShareData {
  url?: string;
  title?: string;
  text?: string;
  isInstagram?: boolean;
}

interface CollectlyContextType {
  // User & Auth
  user: UserAccount;
  loginWithGoogle: (email?: string) => void;
  loginWithInstagram: (handle?: string) => void;
  disconnectGoogle: () => void;
  disconnectInstagram: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Syncing
  isSyncingInstagram: boolean;
  isSyncingGoogle: boolean;
  syncInstagramSaves: () => Promise<void>;
  syncGoogleSaves: () => Promise<void>;

  // Data
  items: SavedItem[];
  collections: Collection[];
  categories: CategoryInfo[];
  
  // Navigation & UI State
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  
  // Detail Panel / Sheet
  selectedItem: SavedItem | null;
  setSelectedItem: (item: SavedItem | null) => void;
  
  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypeFilter: ContentType | 'all';
  setSelectedTypeFilter: (type: ContentType | 'all') => void;
  selectedTagFilter: string | null;
  setSelectedTagFilter: (tag: string | null) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Modals & Share prefill
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  prefillShareData: PrefillShareData | null;
  setPrefillShareData: (data: PrefillShareData | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  // PWA Mobile Install
  isPwaInstallable: boolean;
  installPwaApp: () => Promise<void>;
  
  // Theme & Preferences
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  aiPreferences: AiPreferences;
  setAiPreferences: React.Dispatch<React.SetStateAction<AiPreferences>>;
  
  // Toast
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  
  // Actions
  addItem: (data: Partial<SavedItem>) => Promise<SavedItem>;
  updateItem: (id: string, updates: Partial<SavedItem>) => void;
  deleteItem: (id: string) => void;
  archiveItem: (id: string) => void;
  restoreItem: (id: string) => void;
  togglePinItem: (id: string) => void;
  recordItemVisit: (id: string) => void;
  
  addCollection: (data: Omit<Collection, 'id' | 'createdAt'>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  
  addCategory: (data: Omit<CategoryInfo, 'id'>) => CategoryInfo;
  renameCategory: (id: string, newName: string) => void;
  deleteCategory: (id: string) => void;
  
  exportData: (format: 'json' | 'csv') => void;
  resetToSampleData: () => void;
}

const CollectlyContext = createContext<CollectlyContextType | undefined>(undefined);

export const CollectlyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User account state (supports Google & Instagram ID login)
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const stored = localStorage.getItem('collectly_user_v2');
      return stored ? JSON.parse(stored) : {
        id: 'user-ansu',
        name: 'Ansu',
        email: 'ansu@collectly.app',
        avatar: 'A',
        googleConnected: true,
        googleEmail: 'ansu@gmail.com',
        instagramConnected: true,
        instagramHandle: '@ansu.design'
      };
    } catch {
      return {
        id: 'user-ansu',
        name: 'Ansu',
        email: 'ansu@collectly.app',
        avatar: 'A',
        googleConnected: true,
        googleEmail: 'ansu@gmail.com',
        instagramConnected: true,
        instagramHandle: '@ansu.design'
      };
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncingInstagram, setIsSyncingInstagram] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);

  const [items, setItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('collectly_items_v3');
      return stored ? JSON.parse(stored) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const stored = localStorage.getItem('collectly_collections_v3');
      return stored ? JSON.parse(stored) : INITIAL_COLLECTIONS;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const stored = localStorage.getItem('collectly_categories_v3');
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ContentType | 'all'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefillShareData, setPrefillShareData] = useState<PrefillShareData | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // PWA install prompt handler
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState(false);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('collectly_theme');
    return (stored as ThemeMode) || 'system';
  });

  const [aiPreferences, setAiPreferences] = useState<AiPreferences>(() => {
    try {
      const stored = localStorage.getItem('collectly_ai_prefs');
      return stored ? JSON.parse(stored) : {
        autoTagging: true,
        autoSummarization: true,
        smartClassification: true,
        semanticSearch: true
      };
    } catch {
      return {
        autoTagging: true,
        autoSummarization: true,
        smartClassification: true,
        semanticSearch: true
      };
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installPwaApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast('App Installed', 'Collectly is now on your home screen.', 'success');
      }
      setDeferredPrompt(null);
      setIsPwaInstallable(false);
    } else {
      showToast('Install on Mobile', 'Tap the Share button in Safari / Chrome, then tap "Add to Home Screen".', 'info');
    }
  };

  // Web Share Target API query parameter handler
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const sharedUrl = searchParams.get('url');
      const sharedText = searchParams.get('text');
      const sharedTitle = searchParams.get('title');

      if (sharedUrl || sharedText || sharedTitle) {
        let extractedUrl = sharedUrl || '';
        let extractedCaption = sharedTitle || '';

        if (!extractedUrl && sharedText) {
          const match = sharedText.match(/https?:\/\/[^\s]+/);
          if (match) {
            extractedUrl = match[0];
            extractedCaption = sharedText.replace(match[0], '').trim();
          } else {
            extractedCaption = sharedText;
          }
        } else if (sharedText && !extractedCaption) {
          extractedCaption = sharedText;
        }

        const isInstagram = extractedUrl.toLowerCase().includes('instagram.com');

        setPrefillShareData({
          url: extractedUrl,
          title: isInstagram ? 'Instagram Post' : extractedCaption || 'Shared Content',
          text: extractedCaption,
          isInstagram
        });

        setIsAddModalOpen(true);
        showToast(
          isInstagram ? 'Instagram Post Received' : 'Shared Link Received',
          'Please confirm the category name before saving.',
          'info'
        );

        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error('Share Target parsing error:', e);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('collectly_user_v2', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('collectly_items_v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('collectly_collections_v3', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('collectly_categories_v3', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('collectly_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  // Toast Helpers
  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Google & Instagram Login Handlers
  const loginWithGoogle = (email = 'ansu@gmail.com') => {
    setUser((prev) => ({
      ...prev,
      googleConnected: true,
      googleEmail: email,
      name: prev.name || 'Ansu'
    }));
    showToast('Google ID Connected', `Linked to ${email}. Your Google Saved items can now sync.`, 'success');
  };

  const loginWithInstagram = (handle = '@ansu.design') => {
    setUser((prev) => ({
      ...prev,
      instagramConnected: true,
      instagramHandle: handle,
      name: prev.name || 'Ansu'
    }));
    showToast('Instagram ID Connected', `Linked to ${handle}. Your Instagram saved post list is ready to collect.`, 'success');
  };

  const disconnectGoogle = () => {
    setUser((prev) => ({ ...prev, googleConnected: false, googleEmail: undefined }));
    showToast('Google Disconnected', 'Google save list sync unlinked.', 'info');
  };

  const disconnectInstagram = () => {
    setUser((prev) => ({ ...prev, instagramConnected: false, instagramHandle: undefined }));
    showToast('Instagram Disconnected', 'Instagram post list sync unlinked.', 'info');
  };

  // Direct Sync from Instagram Saved List
  const syncInstagramSaves = async () => {
    if (!user.instagramConnected) {
      setIsAuthModalOpen(true);
      showToast('Login Required', 'Please connect your Instagram ID to import your saved post list.', 'warning');
      return;
    }

    setIsSyncingInstagram(true);
    showToast('Syncing Instagram Saves', `Fetching saved posts from ${user.instagramHandle}...`, 'info');

    setTimeout(() => {
      // Find or create Instagram Saves collection
      let colId = collections.find(c => c.name.toLowerCase().includes('instagram'))?.id;
      if (!colId) {
        const createdCol = addCollection({
          name: 'Instagram Saves',
          description: `Saved posts, reels, and inspiration imported from ${user.instagramHandle}`,
          color: '#E1306C'
        });
        colId = createdCol.id;
      }

      // Import sample posts from Instagram saved list that don't already exist
      let importedCount = 0;
      SAMPLE_INSTAGRAM_SAVES.forEach(sample => {
        const exists = items.some(i => i.url === sample.url || i.title === sample.title);
        if (!exists) {
          addItem({
            ...sample,
            collectionId: colId,
            category: 'Instagram'
          });
          importedCount++;
        }
      });

      setIsSyncingInstagram(false);
      showToast('Instagram Sync Completed', `Imported ${importedCount || 'all'} saved posts into your library.`, 'success');
    }, 1200);
  };

  // Direct Sync from Google Saved List & Starred Places
  const syncGoogleSaves = async () => {
    if (!user.googleConnected) {
      setIsAuthModalOpen(true);
      showToast('Login Required', 'Please connect your Google ID to import your saved list.', 'warning');
      return;
    }

    setIsSyncingGoogle(true);
    showToast('Syncing Google Saves', `Fetching starred places and saved links from ${user.googleEmail}...`, 'info');

    setTimeout(() => {
      let colId = collections.find(c => c.name.toLowerCase().includes('google'))?.id;
      if (!colId) {
        const createdCol = addCollection({
          name: 'Google Saved Places & Links',
          description: `Starred maps locations and web saves imported from ${user.googleEmail}`,
          color: '#007AFF'
        });
        colId = createdCol.id;
      }

      let importedCount = 0;
      SAMPLE_GOOGLE_SAVES.forEach(sample => {
        const exists = items.some(i => i.url === sample.url || i.title === sample.title);
        if (!exists) {
          addItem({
            ...sample,
            collectionId: colId,
          });
          importedCount++;
        }
      });

      setIsSyncingGoogle(false);
      showToast('Google Sync Completed', `Imported ${importedCount || 'all'} saved items into your library.`, 'success');
    }, 1200);
  };

  // Add Item
  const addItem = async (data: Partial<SavedItem>): Promise<SavedItem> => {
    let domain = 'note.local';
    let cleanUrl = data.url?.trim();

    if (cleanUrl) {
      try {
        const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
        domain = urlObj.hostname.replace('www.', '');
        if (domain.includes('instagram.com')) {
          urlObj.search = '';
          cleanUrl = urlObj.toString();
        }
      } catch {
        domain = 'web.link';
      }
    }

    const isInstagram = domain.includes('instagram.com') || data.type === 'social';
    const assignedCategory = data.category?.trim() || (isInstagram ? 'Instagram' : 'Uncategorised');

    if (assignedCategory && assignedCategory !== 'Uncategorised') {
      const exists = categories.some(c => c.name.toLowerCase() === assignedCategory.toLowerCase());
      if (!exists) {
        addCategory({
          name: assignedCategory,
          description: `Custom category for ${assignedCategory}`,
          color: isInstagram ? '#E1306C' : '#007AFF'
        });
      }
    }

    const autoThumbnail = data.previewImage || resolveThumbnailAutomatically({
      url: cleanUrl,
      title: data.title,
      description: data.description,
      category: assignedCategory,
      type: data.type
    });

    const newItem: SavedItem = {
      id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
      title: data.title?.trim() || (isInstagram ? 'Instagram Post' : cleanUrl || 'Untitled Save'),
      url: cleanUrl,
      description: data.description?.trim() || (isInstagram ? 'Saved from Instagram' : 'Saved to Collectly'),
      content: data.content?.trim(),
      type: data.type || (isInstagram ? 'social' : cleanUrl ? 'article' : 'note'),
      category: assignedCategory,
      tags: data.tags && data.tags.length > 0 ? data.tags : [assignedCategory, isInstagram ? 'Instagram' : 'Saved'],
      collectionId: data.collectionId,
      previewImage: autoThumbnail,
      favicon: isInstagram ? 'https://www.instagram.com/favicon.ico' : (cleanUrl ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : undefined),
      sourceDomain: domain,
      author: data.author || (isInstagram ? (user.instagramHandle || 'Instagram') : domain),
      dateSaved: new Date().toISOString(),
      readingTime: isInstagram ? 'Post' : data.type === 'video' ? 'Video' : '3 min read',
      aiStatus: 'completed',
      aiSummary: data.aiSummary || (isInstagram ? 'Saved post reference from Instagram with media preview and metadata.' : 'Content indexed and saved to your knowledge library.'),
      aiKeyTakeaways: data.aiKeyTakeaways || [
        `Filed under category "${assignedCategory}".`,
        'Source domain verified and indexed for quick search.',
        'Accessible offline in Collectly.'
      ],
      isPinned: false,
      isArchived: false,
      visitCount: 1,
      lastVisited: new Date().toISOString(),
      sourceOrigin: data.sourceOrigin || (isInstagram ? 'instagram' : cleanUrl ? 'direct' : 'share')
    };

    setItems((prev) => [newItem, ...prev]);
    showToast('Saved to Library', `Saved under category "${assignedCategory}".`, 'success');
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<SavedItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Item Updated', 'Your changes have been saved.', 'success');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    showToast('Item Deleted', 'The item was removed.', 'info');
  };

  const archiveItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isArchived: true } : item)));
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, isArchived: true } : null));
    }
    showToast('Archived', 'Item moved to Archive.', 'info');
  };

  const restoreItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isArchived: false } : item)));
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, isArchived: false } : null));
    }
    showToast('Restored', 'Item restored to library.', 'success');
  };

  const togglePinItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item)));
  };

  const recordItemVisit = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { 
      ...item, 
      visitCount: item.visitCount + 1,
      lastVisited: new Date().toISOString()
    } : item)));
  };

  // Collections CRUD
  const addCollection = (data: Omit<Collection, 'id' | 'createdAt'>): Collection => {
    const newCol: Collection = {
      ...data,
      id: 'col-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCol]);
    showToast('Collection Created', `"${newCol.name}" added.`, 'success');
    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) => prev.map((col) => (col.id === id ? { ...col, ...updates } : col)));
    showToast('Collection Updated', 'Changes saved.', 'success');
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== id));
    setItems((prev) => prev.map((item) => item.collectionId === id ? { ...item, collectionId: undefined } : item));
    showToast('Collection Deleted', 'The collection was removed.', 'info');
  };

  // Category CRUD
  const addCategory = (data: Omit<CategoryInfo, 'id'>): CategoryInfo => {
    const id = data.name.toLowerCase().replace(/\s+/g, '-');
    const existing = categories.find(c => c.id === id || c.name.toLowerCase() === data.name.toLowerCase());
    if (existing) return existing;

    const newCat: CategoryInfo = {
      ...data,
      id,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const renameCategory = (id: string, newName: string) => {
    const oldCat = categories.find((c) => c.id === id);
    if (!oldCat) return;
    setCategories((prev) => prev.map((cat) => cat.id === id ? { ...cat, name: newName } : cat));
    setItems((prev) => prev.map((item) => item.category === oldCat.name ? { ...item, category: newName } : item));
    showToast('Category Renamed', `Renamed to "${newName}".`, 'success');
  };

  const deleteCategory = (id: string) => {
    const catToDelete = categories.find((c) => c.id === id);
    if (!catToDelete) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.map((item) => item.category === catToDelete.name ? { ...item, category: 'Uncategorised' } : item));
    showToast('Category Removed', `Items reassigned to Uncategorised.`, 'info');
  };

  // Data Export functionality
  const exportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        exportedAt: new Date().toISOString(),
        user,
        items,
        collections,
        categories
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `collectly-export-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export Completed', 'JSON export file downloaded.', 'success');
    } else {
      const headers = ['ID', 'Title', 'URL', 'Type', 'Category', 'Domain', 'Tags', 'Date Saved'];
      const rows = items.map(item => [
        `"${item.id}"`,
        `"${(item.title || '').replace(/"/g, '""')}"`,
        `"${(item.url || '').replace(/"/g, '""')}"`,
        `"${item.type}"`,
        `"${item.category}"`,
        `"${item.sourceDomain}"`,
        `"${(item.tags || []).join(', ')}"`,
        `"${item.dateSaved}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', csvContent);
      downloadAnchor.setAttribute('download', `collectly-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export Completed', 'CSV export file downloaded.', 'success');
    }
  };

  const resetToSampleData = () => {
    setItems(INITIAL_ITEMS);
    setCollections(INITIAL_COLLECTIONS);
    setCategories(INITIAL_CATEGORIES);
    showToast('Data Reset', 'Default knowledge base restored.', 'info');
  };

  return (
    <CollectlyContext.Provider
      value={{
        user,
        loginWithGoogle,
        loginWithInstagram,
        disconnectGoogle,
        disconnectInstagram,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSyncingInstagram,
        isSyncingGoogle,
        syncInstagramSaves,
        syncGoogleSaves,
        items,
        collections,
        categories,
        activeScreen,
        setActiveScreen,
        selectedCollectionId,
        setSelectedCollectionId,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedItem,
        setSelectedItem,
        searchQuery,
        setSearchQuery,
        selectedTypeFilter,
        setSelectedTypeFilter,
        selectedTagFilter,
        setSelectedTagFilter,
        sortOption,
        setSortOption,
        viewMode,
        setViewMode,
        isAddModalOpen,
        setIsAddModalOpen,
        prefillShareData,
        setPrefillShareData,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isPwaInstallable,
        installPwaApp,
        theme,
        setTheme,
        aiPreferences,
        setAiPreferences,
        toasts,
        dismissToast,
        showToast,
        addItem,
        updateItem,
        deleteItem,
        archiveItem,
        restoreItem,
        togglePinItem,
        recordItemVisit,
        addCollection,
        updateCollection,
        deleteCollection,
        addCategory,
        renameCategory,
        deleteCategory,
        exportData,
        resetToSampleData,
      }}
    >
      {children}
    </CollectlyContext.Provider>
  );
};

export const useCollectly = () => {
  const context = useContext(CollectlyContext);
  if (!context) {
    throw new Error('useCollectly must be used within a CollectlyProvider');
  }
  return context;
};
