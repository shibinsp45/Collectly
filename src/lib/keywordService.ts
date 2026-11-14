import { SavedItem } from '../types';

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
  'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
  'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'post', 'save', 'saved', 'link',
  'http', 'https', 'com', 'www'
]);

export interface KeywordSuggestion {
  keyword: string;
  matchedFilesCount: number;
  sampleItem: SavedItem;
}

/**
 * Extract distinct relevant keywords from all saved files.
 */
export function extractSavedKeywords(items: SavedItem[]): KeywordSuggestion[] {
  const keywordMap = new Map<string, { count: number; sampleItem: SavedItem }>();

  items.forEach(item => {
    if (item.isArchived) return;

    // Collect words from tags, title, category, description
    const tokens: string[] = [];

    // Tags are high priority keywords
    (item.tags || []).forEach(t => tokens.push(t.toLowerCase().trim()));
    if (item.category) tokens.push(item.category.toLowerCase().trim());

    // Words from title and description
    const words = `${item.title} ${item.description} ${item.sourceDomain}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    tokens.push(...words);

    tokens.forEach(token => {
      if (token.length < 3 || STOP_WORDS.has(token)) return;

      const capitalized = token.charAt(0).toUpperCase() + token.slice(1);
      const existing = keywordMap.get(capitalized);
      if (existing) {
        existing.count += 1;
      } else {
        keywordMap.set(capitalized, { count: 1, sampleItem: item });
      }
    });
  });

  return Array.from(keywordMap.entries())
    .map(([keyword, data]) => ({
      keyword,
      matchedFilesCount: data.count,
      sampleItem: data.sampleItem
    }))
    .sort((a, b) => b.matchedFilesCount - a.matchedFilesCount);
}

/**
 * Find keywords matching user input query.
 */
export function suggestKeywordsForQuery(
  query: string,
  items: SavedItem[],
  limit = 8
): KeywordSuggestion[] {
  const allKeywords = extractSavedKeywords(items);
  if (!query.trim()) {
    // Return top popular keywords
    return allKeywords.slice(0, limit);
  }

  const q = query.toLowerCase().trim();
  return allKeywords
    .filter(k => k.keyword.toLowerCase().includes(q))
    .slice(0, limit);
}

/**
 * Automatically detect if any keyword in user text matches an existing saved file.
 */
export function detectMatchingKeywordsInText(
  text: string,
  items: SavedItem[]
): { keyword: string; matchedItem: SavedItem }[] {
  if (!text || text.length < 3) return [];

  const lowerText = text.toLowerCase();
  const allKeywords = extractSavedKeywords(items);

  const detected: { keyword: string; matchedItem: SavedItem }[] = [];
  const seen = new Set<string>();

  for (const { keyword, sampleItem } of allKeywords) {
    if (lowerText.includes(keyword.toLowerCase()) && !seen.has(keyword.toLowerCase())) {
      detected.push({ keyword, matchedItem: sampleItem });
      seen.add(keyword.toLowerCase());
      if (detected.length >= 4) break;
    }
  }

  return detected;
}
