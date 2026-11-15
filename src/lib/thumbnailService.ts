// Intelligent Content-Aware Thumbnail Selector

interface ContentContext {
  url?: string;
  title?: string;
  description?: string;
  category?: string;
  type?: string;
}

// Curated high-resolution Unsplash photo IDs categorized by topic
export const THEMATIC_THUMBNAILS: Record<string, string[]> = {
  // Architecture & Interior Design
  architecture: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  ],
  // Design Systems, UI/UX & Figma
  design: [
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80'
  ],
  // Apple, SwiftUI & Materials
  apple: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510519138197-06b8628c6711?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=80'
  ],
  // Technology, Coding, Engineering
  technology: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  ],
  // Instagram, Reels, Social Media
  instagram: [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  ],
  // Food, Cafes, Coffee, Kochi, Restaurants
  cafe: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  ],
  // Travel, Places, Scenery
  travel: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  ],
  // Reading, Learning, Research & Books
  learning: [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
  ],
  // Business, Product Management, Strategy
  business: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  ],
  // Personal Notes, Thoughts, Ideas
  personal: [
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  ]
};

// Extract YouTube video ID
export function extractYouTubeThumbnail(url: string): string | null {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Intelligent Content-Aware Thumbnail Resolver
 * Analyzes URL, title, description, and category to pick the most relevant thumbnail.
 */
export function resolveThumbnailAutomatically(context: ContentContext, offset = 0): string {
  const { url = '', title = '', description = '', category = '', type = '' } = context;

  // 1. YouTube Video Thumbnail
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const ytThumb = extractYouTubeThumbnail(url);
    if (ytThumb) return ytThumb;
  }

  // 2. Aggregate text for keyword analysis
  const combined = `${url} ${title} ${description} ${category} ${type}`.toLowerCase();

  // 3. Category & topic matching logic
  let poolKey = 'technology';

  if (combined.includes('instagram') || combined.includes('reel') || combined.includes('post') || type === 'social') {
    if (combined.includes('arch') || combined.includes('house') || combined.includes('interior') || combined.includes('room')) {
      poolKey = 'architecture';
    } else if (combined.includes('cafe') || combined.includes('coffee') || combined.includes('food') || combined.includes('eat')) {
      poolKey = 'cafe';
    } else {
      poolKey = 'instagram';
    }
  } else if (combined.includes('cafe') || combined.includes('coffee') || combined.includes('kochi') || combined.includes('restaurant') || combined.includes('food')) {
    poolKey = 'cafe';
  } else if (combined.includes('travel') || combined.includes('hotel') || combined.includes('nature') || combined.includes('trip') || combined.includes('kerala')) {
    poolKey = 'travel';
  } else if (combined.includes('figma') || combined.includes('design') || combined.includes('ui') || combined.includes('ux') || combined.includes('layout')) {
    poolKey = 'design';
  } else if (combined.includes('apple') || combined.includes('swift') || combined.includes('ios') || combined.includes('macos')) {
    poolKey = 'apple';
  } else if (combined.includes('book') || combined.includes('reading') || combined.includes('learn') || combined.includes('guide') || combined.includes('paper')) {
    poolKey = 'learning';
  } else if (combined.includes('business') || combined.includes('startup') || combined.includes('saas') || combined.includes('market') || combined.includes('growth')) {
    poolKey = 'business';
  } else if (combined.includes('arch') || combined.includes('building') || combined.includes('interior') || combined.includes('minimalism')) {
    poolKey = 'architecture';
  } else if (type === 'note' || combined.includes('note') || combined.includes('journal') || combined.includes('personal')) {
    poolKey = 'personal';
  } else if (combined.includes('tech') || combined.includes('code') || combined.includes('software') || combined.includes('api') || combined.includes('system')) {
    poolKey = 'technology';
  }

  const pool = THEMATIC_THUMBNAILS[poolKey] || THEMATIC_THUMBNAILS.technology;
  const index = Math.abs(offset) % pool.length;
  return pool[index];
}

/**
 * Returns a list of 4-8 candidate thumbnails tailored for an item
 */
export function getCandidatesForContent(context: ContentContext): string[] {
  const { url = '', title = '', description = '', category = '', type = '' } = context;
  const combined = `${url} ${title} ${description} ${category} ${type}`.toLowerCase();

  let poolKey = 'technology';
  if (combined.includes('instagram') || combined.includes('reel') || type === 'social') {
    poolKey = 'instagram';
  } else if (combined.includes('cafe') || combined.includes('coffee') || combined.includes('food') || combined.includes('kochi')) {
    poolKey = 'cafe';
  } else if (combined.includes('travel') || combined.includes('hotel') || combined.includes('places') || combined.includes('kerala')) {
    poolKey = 'travel';
  } else if (combined.includes('figma') || combined.includes('design') || combined.includes('ui') || combined.includes('layout')) {
    poolKey = 'design';
  } else if (combined.includes('apple') || combined.includes('swift') || combined.includes('ios')) {
    poolKey = 'apple';
  } else if (combined.includes('arch') || combined.includes('space') || combined.includes('interior')) {
    poolKey = 'architecture';
  } else if (combined.includes('book') || combined.includes('reading') || combined.includes('learning')) {
    poolKey = 'learning';
  } else if (combined.includes('business') || combined.includes('saas') || combined.includes('market')) {
    poolKey = 'business';
  }

  const primaryPool = THEMATIC_THUMBNAILS[poolKey] || THEMATIC_THUMBNAILS.technology;
  // Combine primary pool with 2 from design or technology for variety
  const secondaryPool = poolKey === 'design' ? THEMATIC_THUMBNAILS.apple : THEMATIC_THUMBNAILS.design;
  return Array.from(new Set([...primaryPool, ...secondaryPool.slice(0, 2)]));
}
