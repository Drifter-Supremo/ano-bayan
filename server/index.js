require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static('../client/dist'));
app.use('/slideshow-dataset', express.static(path.join(__dirname, '../client/public/slideshow-dataset')));

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
