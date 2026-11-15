# Collectly — Project Guidelines & Architecture

## gstack
Use the `/browse` skill from gstack for all web browsing and never use `mcp__claude-in-chrome__*` tools.

---

## Overview
**Collectly** is an Apple & Instagram-inspired AI personal knowledge management application ("Save everything. Find anything.").

### Core Capabilities
1. **Instagram Ambient Glassmorphism**:
   - Liquid frosted cards (`.glass-card`), deep obsidian violet velvet mesh backdrop (`#0A0710`), and Instagram gradient accents (`#833AB4`, `#E1306C`, `#FD1D1D`, `#FCAF45`).
   - Pixel-perfect custom line icons matching the Instagram design system.

2. **Mobile-Exclusive Security (Fingerprint & Phone PIN)**:
   - Fingerprint icon and avatar "A" are removed from desktop/tablet views.
   - On mobile, users unlock saved files using mobile fingerprint sensor (WebAuthn) or phone PIN lock (4-digit numeric keypad with haptic shake feedback, default PIN: `1234`).

3. **Dedicated Views for Saves & Reels**:
   - **Saves Screen (`/all-saves`)**: All saved files, PDFs, design blueprints, notes, articles, and bookmarks with category filters, sort options, and file upload.
   - **Reels Screen (`/reels`)**: Dedicated vertical 9:16 reels feed for Instagram reels, motion clips, video previews, soundwave badges, and creators.
   - **Bento Grid Layout on Mobile**: Asymmetrical, mobile-optimized bento layout with clear safe-area padding (`pb-28`) ensuring the floating dock never obscures cards.

4. **Full-Screen Centered File Preview Popup**:
   - Clicking any item/file opens a full-screen popup modal at the exact center of the screen with a deep backdrop blur (`backdrop-blur-2xl bg-black/80`).
   - Includes high-res media view, Cover Thumbnail Decision Studio (pick from 6 curated candidates, custom URL, or device upload), AI summary, key highlights, and tags.

5. **Mobile Push Notifications & Interactive Widget**:
   - Native Web Push Notification toggle with instant simulated test alert trigger.
   - 4-action mobile quick bento widget for 1-tap capture, reel sync, and quick access.

6. **Search & Exploration**:
   - Search bar expands option buttons (`Voice`, `Image`, `Ask AI`) on hover.
   - "Try asking: ..." suggestion chips placed directly below the search bar container.

---

## Tech Stack
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React, Custom SVG Instagram Design Icons
- **State**: React Context API (`CollectlyContext`) with persistent `localStorage` synchronization
- **Package Manager**: Bun (`bun run dev`, `bun run build`)
