import { SavedItem } from '../types';

export const SAMPLE_INSTAGRAM_SAVES: Partial<SavedItem>[] = [
  {
    title: 'Minimalist Architecture & Concrete Courtyards by @ignant',
    url: 'https://www.instagram.com/p/C_abc12345/',
    description: 'Monolithic studio spaces in Kyoto with warm cedar wood and integrated Japanese garden courtyards.',
    category: 'Instagram',
    tags: ['Architecture', 'Kyoto', 'Minimalism', 'Interior'],
    type: 'social',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.instagram.com/favicon.ico',
    sourceDomain: 'instagram.com',
    author: '@ignant',
    sourceOrigin: 'instagram'
  },
  {
    title: 'Scandinavian Living & Artisanal Ceramics by @kinfolk',
    url: 'https://www.instagram.com/p/DB_xyz7890/',
    description: 'Copenhagen coffee studio and tactile handmade ceramic collections for daily rituals.',
    category: 'Instagram',
    tags: ['Design', 'Ceramics', 'Copenhagen', 'Lifestyle'],
    type: 'social',
    previewImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.instagram.com/favicon.ico',
    sourceDomain: 'instagram.com',
    author: '@kinfolk',
    sourceOrigin: 'instagram'
  },
  {
    title: 'Warm Japandi Lighting & Wooden Joinery by @archdigest',
    url: 'https://www.instagram.com/p/DA_5554321/',
    description: 'Custom walnut wall-hung storage units and concealed indirect ambient lighting.',
    category: 'Instagram',
    tags: ['Architecture', 'Japandi', 'Woodwork', 'Lighting'],
    type: 'social',
    previewImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.instagram.com/favicon.ico',
    sourceDomain: 'instagram.com',
    author: '@archdigest',
    sourceOrigin: 'instagram'
  }
];

export const SAMPLE_GOOGLE_SAVES: Partial<SavedItem>[] = [
  {
    title: 'Kashi Art Cafe & Gallery — Fort Kochi',
    url: 'https://maps.google.com/?cid=kashi-art-cafe-kochi',
    description: 'Historic heritage art cafe in Fort Nagar, Fort Kochi known for artisanal pour-overs and reading courtyards.',
    category: 'Travel & Places',
    tags: ['Kochi', 'Cafe', 'Art Gallery', 'Kerala'],
    type: 'location',
    previewImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.google.com/favicon.ico',
    sourceDomain: 'maps.google.com',
    author: 'Google Maps Saved Places',
    sourceOrigin: 'google'
  },
  {
    title: 'Designing for Calm & Ambient Interfaces',
    url: 'https://linear.app/blog/ambient-ai-interfaces',
    description: 'How calm interfaces and non-blocking background workflows replace conversational chat noise in professional software.',
    category: 'Technology',
    tags: ['UX', 'Linear', 'Productivity', 'Design'],
    type: 'article',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.google.com/favicon.ico',
    sourceDomain: 'google.com/saves',
    author: 'Google Collections',
    sourceOrigin: 'google'
  },
  {
    title: 'Loafer’s Corner Cafe — Princess Street, Kochi',
    url: 'https://maps.google.com/?cid=loafers-corner-kochi',
    description: 'Colonial balcony cafe overlooking Princess Street with vintage posters, fresh ginger lime, and cold brew.',
    category: 'Travel & Places',
    tags: ['Kochi', 'Cafe', 'Balcony', 'Travel'],
    type: 'location',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    favicon: 'https://www.google.com/favicon.ico',
    sourceDomain: 'maps.google.com',
    author: 'Google Maps Starred',
    sourceOrigin: 'google'
  }
];
