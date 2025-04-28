import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import Slideshow from "./Slideshow";
import { motion } from "framer-motion";
import SkeletonItem from "./SkeletonItem";

const storage = getStorage(app);

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Child animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function PlaylistGridView() { // Removed prop
  const { playlistName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const scrollPos = useRef(0); // Store scroll position locally
  // Determine initial animation state from localStorage
  const storageKey = `animated_${playlistName}`;
  const hasAnimatedInitially = localStorage.getItem(storageKey) === 'true';

  // Log component mount and unmount
  useEffect(() => {
    console.log(`[PlaylistGridView MOUNT] Playlist: ${playlistName}, Has animated (localStorage): ${hasAnimatedInitially}`);
    return () => {
      console.log(`[PlaylistGridView UNMOUNT] Playlist: ${playlistName}`);
    };
  }, [playlistName, hasAnimatedInitially]); // Add dependencies for logging consistency

  // Effect to set localStorage flag immediately on first mount if needed
  useEffect(() => {
    if (!hasAnimatedInitially) {
      console.log(`[PlaylistGridView MOUNT EFFECT] Setting localStorage key '${storageKey}' to true immediately.`);
      localStorage.setItem(storageKey, 'true');
    }
  }, []); // Runs only once on mount

  useEffect(() => {
    console.log(`[PlaylistGridView EFFECT START] Playlist: ${playlistName}, Has animated (localStorage): ${hasAnimatedInitially}`);
    async function fetchImages() {
      // Fetching logic remains the same
      setLoading(true);
      try {
        const folderRef = ref(storage, playlistName); // Access playlist folder directly from root
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

  // Restore scroll position and log slideshow state changes
  useEffect(() => {
    console.log(`[PlaylistGridView EFFECT Slideshow] showSlideshow: ${showSlideshow}, Has animated (localStorage): ${hasAnimatedInitially}`);
    if (!showSlideshow) {
      // Need a slight delay for the browser to re-render the grid
      // before attempting to scroll.
      requestAnimationFrame(() => {
         window.scrollTo(0, scrollPos.current);
      });
    }
  }, [showSlideshow]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#032934] p-4">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-3 gap-4"
          variants={containerVariants}
          initial={hasAnimatedInitially ? false : "hidden"}
          animate="show"
        >
          {Array(9).fill().map((_, i) => (
            <SkeletonItem key={`skeleton-${i}`} />
          ))}
        </motion.div>
      </div>
    );
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
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-3 gap-4"
        variants={containerVariants}
        // Use the value read from localStorage
        initial={hasAnimatedInitially ? false : "hidden"}
        animate="show"
        // Removed onAnimationComplete handler
      >
        {images.map((url, idx) => (
          <motion.div
            key={url}
            className="cursor-pointer rounded shadow-lg overflow-hidden"
            variants={itemVariants} // Apply item variants
            onClick={() => {
              console.log(`[PlaylistGridView CLICK] Opening slideshow for ${playlistName}. Index: ${idx}, Has animated (localStorage): ${localStorage.getItem(storageKey) === 'true'}`);
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
