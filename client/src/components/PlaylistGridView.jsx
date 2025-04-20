import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import Slideshow from "./Slideshow";

const storage = getStorage(app);

export default function PlaylistGridView() { // Removed shuffleEnabled prop
  const { playlistName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const scrollPos = useRef(0); // Store scroll position locally

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const folderRef = ref(storage, `ano-bayan-images/${playlistName}`);
        const res = await listAll(folderRef);
        const urls = await Promise.all(res.items.map(i => getDownloadURL(i)));
        setImages(urls); // Removed shuffle logic here
      } catch {
        setError("Failed to load images");
      }
      setLoading(false);
    }
    fetchImages();
  }, [playlistName]); // Removed shuffleEnabled dependency

  // Restore scroll position when slideshow closes
  useEffect(() => {
    if (!showSlideshow) {
      // Need a slight delay for the browser to re-render the grid
      // before attempting to scroll.
      requestAnimationFrame(() => {
         window.scrollTo(0, scrollPos.current);
      });
    }
  }, [showSlideshow]);

  if (loading) {
    return <div className="text-center py-10 text-white/70">Loading images...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-400">{error}</div>;
  }

  if (showSlideshow) {
    return (
      <Slideshow
        images={images}
        initialIndex={startIndex}
        onClose={() => setShowSlideshow(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#032934] p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, idx) => (
          <div
            key={url}
            className="cursor-pointer rounded shadow-lg overflow-hidden"
            onClick={() => {
              // Save scroll position before showing slideshow
              scrollPos.current = window.pageYOffset || document.documentElement.scrollTop;
              setStartIndex(idx);
              setShowSlideshow(true);
            }}
          >
            <img
              src={url}
              alt=""
              className="w-full aspect-[3/4] object-cover hover:scale-105 transition"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
