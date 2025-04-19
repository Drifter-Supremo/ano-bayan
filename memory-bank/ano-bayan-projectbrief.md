\# Ano Bayan Slideshow — MVP Edition

\*\*Tagline:\*\*    
\*A slick, animated, password-protected slideshow viewer for your curated spicy folders.\*

\---

\#\# Goals

\- Privately view curated image folders from any device  
\- Password-protected, locally managed, aesthetically pleasing  
\- No AI, no image generation, no scraping — just spice and smooth UX

\---

\#\# Core Tech Stack

\- \*\*Frontend:\*\* Vite \+ React (developed with Roo Code or Cline)  
\- \*\*Styling:\*\* TailwindCSS \+ Framer Motion for transitions  
\- \*\*Backend:\*\* Express.js server (deployed on Railway)  
\- \*\*Deployment:\*\* Manual Railway deployment (not tied to GitHub)  
\- \*\*Auth:\*\* Basic session-based or password-protected auth middleware  
\- \*\*Image Storage:\*\* Hosted inside the backend server (not public CDN)  
\- \*\*Image Access:\*\* Protected routes — only authenticated users can load media

\---

\#\# Key Features

\#\#\# 1\. Slideshow Viewer  
\- Loads images from \`/ano-bayan\` directory  
\- Manual & auto-play modes  
\- Fullscreen support  
\- Transitions: fade, slide, zoom, pan  
\- Adjustable slideshow speed  
\- Shuffle toggle

\#\#\# 2\. Folder-Based Playlist Support  
\- Load subfolders as playlists (e.g. \`/ano-bayan/cheerleader/\`, \`/ano-bayan/lingerie/\`)  
\- UI for switching playlists  
\- Option to filter by folders, tags, or favorites

\#\#\# 3\. Manual Tagging \+ Favorites  
\- Support for \`tags.json\` with structure like:  
\`\`\`json  
{  
  "cheer1.jpg": \["cheerleader", "blonde", "playful"\],  
  "lingerie1.jpg": \["lingerie", "dominant", "black"\]  
}

* bility to filter slideshow by tags or favorites

### **4\. Custom Themes**

* Theme toggles (e.g. “Dark Neon,” “Red Room,” “Soft Glow”)

* Custom accent colors and border options

* Minimal UI mode toggle

### **5\. Music Support (Optional)**

* Auto-play ambient MP3s (from `public/music/`)

* Loop background music or playlist toggle

* Mute button

### **6\. Password Login**

* JS or server-side auth with login page

* Sessions or token stored in cookie/localStorage

* Panic key option (hides or redirects)

---

## **Stretch Goals (Post-MVP)**

* Electron app wrapper (for full offline use)

* Image zoom & drag

* "Panic Key" (swap app view with decoy page)

* Session timer (auto lock after idle)

* Sort by favorite count

* Gesture controls for mobile (swipe/tap)

---

## **Folder Structure**

ano-bayan-slideshow/  
├── server/  
│   ├── index.js            \# Express server  
│   ├── auth.js             \# Auth middleware  
│   ├── routes/  
│   │   └── images.js       \# Auth-protected image API  
│   └── /ano-bayan/         \# Image storage  
├── client/  
│   ├── public/  
│   │   ├── music/  
│   │   │   └── ambient.mp3  
│   ├── src/  
│   │   ├── components/  
│   │   ├── App.tsx  
│   │   └── main.tsx  
│   └── index.html  
├── tags.json  
├── .gitignore              \# Exclude image folder from GitHub  
├── README.md

## **Deployment Plan (Railway)**

1. Build frontend with Vite (`npm run build`)

2. Serve frontend via Express backend (static folder)

3. Add password login using session-based auth (Express middleware)

4. Deploy entire app via Railway CLI (no GitHub repo exposure)

5. Access app from any device with password

**NOTE:** All images live on the server and are only accessible **after login**. No unauthenticated image access.

---

## **Security Notes**

* Do **not** commit `/ano-bayan` folder to GitHub

* Ensure auth middleware wraps all media routes

* Passwords and sessions should be stored securely (basic bcrypt \+ session storage works for MVP)

