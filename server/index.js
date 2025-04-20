require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
// Make sure this path is correct relative to where server/index.js is run from
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Serve the dataset images (if they are still needed and not handled by Firebase)
// const datasetPath = path.join(__dirname, '../client/public/slideshow-dataset');
// app.use('/slideshow-dataset', express.static(datasetPath));

// API routes should come BEFORE the catch-all

// Config for playlist thumbnails
const playlistThumbs = {
  'alanah-rae': 'alanah-rae-thumb.jpg',
  'dylan-ryder': 'dylan-ryder-thumb.jpg',
  'jessie-rogers': 'jessie-rogers-thumb.jpg',
  'kelly-madison': 'kelly-madison-thumb.jpg',
  'natalia-starr': 'natalia-starr-thumb.jpg',
  'toetally-devine': 'toetally-devine-thumb.jpg',
};
const DATASET_DIR = path.join(__dirname, '../client/public/slideshow-dataset');

// GET /api/playlists - list all playlists/folders with thumbnails
app.get('/api/playlists', (req, res) => {
  fs.readdir(DATASET_DIR, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: 'Failed to read playlists' });
    const playlists = entries.filter(e => e.isDirectory()).map(dir => {
      const name = dir.name;
      const thumb = playlistThumbs[name] || null;
      return {
        name,
        thumbnail: thumb ? `/slideshow-dataset/${name}/${thumb}` : null,
      };
    });
    res.json(playlists);
  });
});

// GET /api/playlists/:playlistName - list all images in a playlist (excluding thumbnail)
app.get('/api/playlists/:playlistName', (req, res) => {
  const playlist = req.params.playlistName;
  const folder = path.join(DATASET_DIR, playlist);
  fs.readdir(folder, (err, files) => {
    if (err) return res.status(404).json({ error: 'Playlist not found' });
    const thumb = playlistThumbs[playlist];
    const images = files.filter(f => f !== thumb && /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.json({
      name: playlist,
      images: images.map(img => `/slideshow-dataset/${playlist}/${img}`),
    });
  });
});

// Catch-all route: If no API route or static file matched, send index.html.
// This MUST be the last route defined.
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
