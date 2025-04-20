# Ano Bayan Slideshow – Phase 2: UI/UX Plan

## Core Principles
- **Minimalism:** Only show what’s needed, use whitespace, avoid clutter.
- **Beauty:** Subtle gradients, smooth animations, elegant typography.
- **Focus:** The image is always the star; UI elements never distract.
- **Dark mode/theme by default**
- **Responsive:** Simple, beautiful experience on both desktop and mobile (`@media (max-width: 768px)` for mobile tweaks).

---

## Implementation Phases

### **Phase 2.1: Slideshow MVP**
- [x] Full-screen image display (centered, max size)
- [x] Dark, semi-transparent background
- [x] Basic left/right navigation (arrows, keyboard, swipe)
- [ ] Minimal progress indicator (bar or dots) *(removed for now; revisit later with Framer Motion or advanced UI)*
- [x] Responsive for mobile (touch/swipe, large tap targets)

### **Phase 2.2: Playlist Gallery & Overlay Prep**
- [x] Home page playlist gallery complete: clean, minimalist tile grid, robust full-viewport background (#032934), no white space, no playlist titles, hover effect only
- [x] Playlist grid/album view: shows all images in a selected playlist, robust to any backend response
- [x] Routing: clicking a playlist thumbnail opens its grid view (`/playlist/:playlistName`)
- [x] Error & empty state handling: friendly message for empty playlists, errors shown if API fails
- [x] Modal accessibility: modal closes with Escape key, click outside, or close button
- [x] Navigation controls: prev/next arrows, keyboard, swipe enabled in slideshow
- [x] Cinematic mode: autoplay with fade+zoom transitions, shuffle, play/pause controls
- [x] Browser fullscreen toggle (F11 style) integrated
- [x] Slideshow controls use SVG icons, refined styling, and auto-hide on inactivity

*Note: Overlay (star/tags on hover) for grid/preview views will be implemented after playlist grid and preview/detailed view are set up.*

### **Phase 2.3: Playlist/Folder Drawer**
- [x] Slide-out drawer/modal for folder/playlist selection (desktop only)
- [x] Only visible on click (hamburger toggle, backdrop click to close)
- [ ] Responsive drawer for mobile
- [x] Shuffle option: toggle to randomize image order in the slideshow modal

### **Phase 2.4: Settings & Auth UI**
- [x] Minimal login page and authentication guard (Firebase Google Auth)
- [x] Styled Google Sign-in button with logo
- [ ] Minimal menu (top-right) for login/logout, preferences
- [ ] Only visible if logged in

*Note: Auth now integrated with Supabase. Environment variable loading was fixed by placing .env in the client directory.*

### **Phase 2.5: Polish & Animations**
- [x] Slideshow transitions with Framer Motion (fade, fade+zoom)
- [ ] Drawer open/close and backdrop animations
- [ ] Playlist thumbnail hover and grid animations
- [ ] Loading skeletons and progress indicators
- [ ] Responsive tweaks and finishing touches

---

## Inspiration
- Apple Photos (minimal overlays, focus on image)
- Unsplash (clean grid, elegant modals)
- Google Photos (simple controls, subtle gradients)

---

> **Note:** Always prioritize minimal, beautiful, and responsive design. Mobile experience should be as clean and functional as desktop.
