\# TASKS.md — Ano Bayan Slideshow (MVP Edition)

A private, password-protected, fully animated slideshow web app for curated image collections — deployed via Railway.

\---

\#\# 🔧 PHASE 1: PROJECT SETUP

\#\#\# 1.1 Initialize Fullstack Project  
- [x] Create a `client/` folder for Vite + React frontend  
- [x] Create a `server/` folder for Express backend  
- [x] Set up root `package.json` (or separate for frontend/backend)  
- [x] Add `.gitignore` and exclude `server/ano-bayan/` folder

\#\#\# 1.2 Vite + React Setup  
- [x] Scaffold Vite app inside `client/`  
- [x] Install TailwindCSS  
- [x] Set up global layout + theme

\#\#\# 1.3 Express Server Setup  
- [x] Install Express and related packages in `server/`  
- [x] Add basic `index.js` or `server.js` entry point  
- [x] Configure static file serving for `client/dist`  
- [x] Set up Railway deployment config (e.g. `PORT`, `start` script)

\---

\#\# 🎨 PHASE 2: FRONTEND UI

\#\#\# 2.1 Slideshow Component
\- \[ \] Load images from API (do not hardcode paths)
\- \[x] Display one image at a time with animation
\- [x] Add manual nav: next / prev buttons
\- \[x] Add auto-play mode with adjustable timing
\- \[x] Add shuffle mode
\- \[x] Add double-tap zoom with spring animation

\#\#\# 2.2 UI Features
\- \[x] Fullscreen toggle
\- \[x] Transition effects (fade, slide, zoom via Framer Motion or CSS)
\- \[x] Responsive layout (desktop \+ mobile)
\- \[ \] Minimal UI toggle (hide controls)

\#\#\# 2.3 Playlist/Folder Support
\- \[ \] Detect image subfolders (e.g. \`/cheerleader/\`, \`/office-sins/\`)
\- \[x] Add dropdown or sidebar to select folder/playlist
\- \[ \] Load only images from selected folder

\#\#\# 2.4 Favorites \+ Tags  
\- \[ \] Create \`tags.json\` file format to store tags/favorites  
\- \[ \] UI: toggle favorite icon per image  
\- \[ \] Filter by tags or favorites  
\- \[ \] Display current tags (read-only for now)

\---

\#\# 🔐 PHASE 3: AUTHENTICATION \+ ACCESS CONTROL

\#\#\# 3.1 Password Login
\- \[x] Create login page
\- \[x] Fix login screen animations (logo and sign-in button)
\- \[ \] Set up Express session or token-based auth
\- \[ \] Add bcrypt password check (hardcoded password is fine for MVP)
\- \[ \] Store session securely (cookie or in-memory)

\#\#\# 3.2 Route Protection  
\- \[ \] Protect image folder access via Express middleware  
\- \[ \] Only allow authenticated users to:  
  \- View slideshow  
  \- Fetch image data  
  \- Load playlists

\#\#\# 3.3 Logout \+ Session Timeout  
\- \[ \] Add logout button  
\- \[ \] Optional: auto-logout after X minutes of inactivity

\---

\#\# 🗂️ PHASE 4: BACKEND MEDIA HANDLING

\#\#\# 4.1 Directory Scanning  
\- \[ \] Backend scans \`/server/ano-bayan/\` and returns:  
  \- Folder names (playlist options)  
  \- Image file names per folder

\#\#\# 4.2 Image Serving  
\- \[ \] Serve image files securely (only after login)  
\- \[ \] Prevent direct URL access to unauthenticated images

\#\#\# 4.3 Music (Optional)  
\- \[ \] Allow MP3s in \`/music/\` folder  
\- \[ \] Add playback controls in frontend  
\- \[ \] Loop toggle, mute toggle

\---

\#\# 🌐 PHASE 5: DEPLOYMENT (RAILWAY)

\#\#\# 5.1 Prepare for Production  
\- \[ \] Build frontend with \`vite build\`  
\- \[ \] Copy \`dist/\` to \`server/public/\` or serve statically  
\- \[ \] Ensure \`.env\` or config vars are ready (e.g. \`PORT\`, \`SESSION\_SECRET\`)

\#\#\# 5.2 Deploy to Railway  
\- \[ \] Push backend manually or via Railway CLI  
\- \[ \] Test login, slideshow, tag filtering on deployed version  
\- \[ \] Confirm image protection is secure in production

\---

\#\# 🧼 PHASE 6: POLISH \+ STRETCH GOALS

\#\#\# 6.1 Panic Key  
\- \[ \] Add keybind (e.g. \`\~\`) to switch app view to decoy screen

\#\#\# 6.2 Visual Enhancements  
\- \[ \] Add theme toggle (Neon, Red Room, Glow)  
\- \[ \] Add image border toggle  
\- \[ \] Add image count / slide progress bar

\#\#\# 6.3 Final Touches  
\- \[ \] Add favicon, title, basic branding (Ano Bayan logo?)
\- \[x] Responsive testing on mobile/tablet
\- \[ \] Final pass for performance

\---

\#\# ✅ PHASE 7: DONE WHEN…

\- \[ \] Login system is working and secure  
\- \[ \] Images load by folder or tag  
\- \[ \] App works beautifully on desktop and mobile  
\- \[ \] All images are \*\*not\*\* accessible without login  
\- \[ \] Deployed on Railway, accessible across devices

\---

\*\*MVP Status:\*\* In Development    
\*\*Lead Developer:\*\* Roo Code (supervised by MVP)    
\*\*Start Date:\*\* \[fill in\]    
\*\*Target Completion:\*\* \[fill in\]
