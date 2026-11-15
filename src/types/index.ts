export type ContentType = 
  | 'article'
  | 'video'
  | 'social'
  | 'design'
  | 'tool'
  | 'note'
  | 'location'
  | 'learning'
  | 'document';

export type ScreenId = 
  | 'dashboard'
  | 'all-saves'
  | 'recently-saved'
  | 'collections'
  | 'categories'
  | 'archive'
  | 'settings'
  | 'collection-detail'
  | 'category-detail';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  googleConnected: boolean;
  googleEmail?: string;
  instagramConnected: boolean;
  instagramHandle?: string;
  biometricsEnabled?: boolean;
  biometricsRegistered?: boolean;
}

export interface SavedItem {
  id: string;
  title: string;
  url?: string;
  description: string;
  content?: string;
  type: ContentType;
  category: string;
  tags: string[];
  collectionId?: string;
  previewImage?: string;
  favicon?: string;
  sourceDomain: string;
  author?: string;
  dateSaved: string; // ISO string
  readingTime?: string;
  aiSummary?: string;
  aiKeyTakeaways?: string[];
  aiStatus: 'idle' | 'processing' | 'completed' | 'needs-attention';
  isPinned?: boolean;
  isArchived?: boolean;
  visitCount: number;
  lastVisited?: string;
  sourceOrigin?: 'instagram' | 'google' | 'direct' | 'share';
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  itemCount?: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  color: string;
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'newest' | 'oldest' | 'title' | 'visits';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AiPreferences {
  autoTagging: boolean;
  autoSummarization: boolean;
  smartClassification: boolean;
  semanticSearch: boolean;
}
