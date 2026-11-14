# Collectly 

> **Save everything. Find anything.**  
> A premium AI-powered personal knowledge management web application inspired by **Notion**'s structured hierarchy, **Linear**'s interface precision, **Folo**'s content discovery, and **Apple's SwiftUI** visual refinement.

---

## 🧭 Design System & SwiftUI Aesthetics

- **Restrained Apple Glass Materials**: Subtle translucency (`backdrop-blur: 24px`, specular hairline borders) on sidebars, top navigation bars, dynamic island notifications, modal sheets, and the Spotlight search overlay.
- **Solid Content Surfaces**: Knowledge cards maintain solid background fills (`#FFFFFF` in light mode, `#1C1C1E` in dark mode) for maximum readability without unreadable blur stacking.
- **Apple Typography & Radii**:
  - Native system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI"`
  - Squircle continuous corners: controls (8px), inputs (10px), cards (12px), dialogs (18px), pills (999px)
  - Apple system color palette: `#007AFF` / `#0A84FF` San Francisco blue, `#34C759` mint green, `#5856D6` purple, `#FF9500` orange.
- **Consistent Lucide Iconography**: 16px/18px sizing, 1.8–2.0px stroke weight, zero emoji-as-icon clutter.

---

## 🚀 10 Core Fully Functional Screens

1. **Dashboard (Home)**:
   - Time-sensitive greeting ("Good morning / afternoon / evening, Jeflin")
   - Real-time knowledge metrics (Total saves, collections, categories, weekly influx)
   - Frequently accessed items (driven by actual visit counts)
   - Chronological recent saves stream
   - Curated collections grid
   - Category discovery pills
2. **All Saves**:
   - Filter by content type (*Articles, Videos, Design, Notes, Locations, Social, Learning*)
   - Filter by category & active tag
   - Sort by Newest, Oldest, Title (A-Z), and Most Visited
   - Responsive Grid View vs. High-Precision Linear-style Compact List View
3. **Capture & Add Modal**:
   - SwiftUI-style segmented mode switcher (*Link / URL, Note / Text, Location*)
   - Instant non-blocking save with asynchronous simulated AI auto-classification and tag extraction
4. **Spotlight AI Search (⌘K / Ctrl+K)**:
   - Natural language query understanding (e.g. *"Where is that restaurant I saved in Kochi?"*, *"Show me articles about AI product design"*)
   - Keyword token matching + semantic entity recognition
   - Relevance ranking badges
5. **Item Details Inspector**:
   - macOS-style side inspector panel & mobile sheet
   - Apple Intelligence summary card with key takeaways
   - Source identity favicon, external link launcher, and link copier
   - In-place title, description, and metadata editor
   - Pin, archive, and delete operations
6. **Collections Management**:
   - Thematic spaces with custom color pickers and item counters
   - Create, edit, and delete collections
   - Drill-down into individual collection detail views
7. **Category Management**:
   - Domain taxonomy management (Design, Technology, Learning, Business, Travel & Places, Personal, Media, Uncategorised)
   - Add custom categories and rename existing ones
8. **Recently Saved**:
   - Chronological timeline view of all saves with relative time indicators
9. **Archive**:
   - Separated archived knowledge references with one-click restore or permanent deletion
10. **Settings**:
    - Account profile preview with Pro Plan status
    - Native Apple Appearance switcher: Light, Dark, System
    - Default Content View preference (Cards vs. Compact List)
    - Apple Intelligence toggles (Auto-classification, Key takeaways, Tag suggestions, Semantic search)
    - Full Data Export: One-click JSON and CSV export file downloads
    - Cache & reset demo data capabilities

---

## 🛠️ Tech Stack & Architecture

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Lucide React** (Apple-compatible stroke icons)
- **Local Persistent Storage** with automatic sync

---

## 💻 Running Locally

```bash
# Navigate to project
cd Collectly

# Install dependencies (using Bun or npm)
bun install
# or: npm install

# Start Vite dev server
bun run dev
# or: npm run dev
```

App will run at `http://localhost:5173`.
