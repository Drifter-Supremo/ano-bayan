import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
const storage = getStorage(app);

function ImageModal({ images, initialImageIndex, shuffleEnabled, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [displayImages, setDisplayImages] = useState([]);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Update displayImages and reset index when images or shuffle mode change
  useEffect(() => {
    if (images.length === 0) return;
    if (shuffleEnabled) {
      const shuffled = [...images];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDisplayImages(shuffled);
    } else {
      setDisplayImages(images);
    }
    setCurrentIndex(initialImageIndex);
  }, [images, shuffleEnabled, initialImageIndex]);

  const prevImage = useCallback(() => {
    setCurrentIndex(i => (i - 1 + displayImages.length) % displayImages.length);
  }, [displayImages]);

  const nextImage = useCallback(() => {
    setCurrentIndex(i => (i + 1) % displayImages.length);
  }, [displayImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prevImage, nextImage, onClose]);

  // Mobile swipe navigation
  const handleTouchStart = e => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = e => {
    touchEndX.current = e.changedTouches[0].clientX;
    const dx = touchEndX.current - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) prevImage();
      else nextImage();
    }
  };

  if (initialImageIndex === null || displayImages.length === 0) return null;

  const currentImageUrl = displayImages[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none group"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} mode="wait">
<motion.img
  key={currentImageUrl}
  src={currentImageUrl}
  alt={`Slideshow image ${currentIndex + 1}`}
  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] max-w-[98vw] object-contain rounded shadow-lg"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={e => e.stopPropagation()}
          draggable={false}
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white/70 hover:text-white px-3 py-2 md:px-4 md:py-3 rounded-lg bg-black/10 md:bg-transparent focus:outline-none active:scale-95"
        style={{ touchAction: 'manipulation' }}
        onClick={(e) => { e.stopPropagation(); prevImage(); }}
        aria-label="Previous"
      >&#8592;</button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white/70 hover:text-white px-3 py-2 md:px-4 md:py-3 rounded-lg bg-black/10 md:bg-transparent focus:outline-none active:scale-95"
        style={{ touchAction: 'manipulation' }}
        onClick={(e) => { e.stopPropagation(); nextImage(); }}
        aria-label="Next"
      >&#8594;</button>

      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 focus:outline-none"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close preview"
      >
        ×
      </button>
    </div>
  );
}


export default function PlaylistGridView({ shuffleEnabled }) {
  const { playlistName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(null);


  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        // List all images in the playlist folder using Firebase
        const folderRef = ref(storage, `ano-bayan-images/${playlistName}`);
        const imagesRes = await listAll(folderRef);
        const imageRefs = imagesRes.items;
        const imageUrls = await Promise.all(imageRefs.map(item => getDownloadURL(item)));
        setImages(imageUrls);
      } catch (err) {
        setError("Failed to load images");
      }
      setLoading(false);
    }
    fetchImages();
  }, [playlistName]);


  if (loading) return <div className="text-center py-10 text-xl text-white/70">Loading images...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-[#032934] pb-8">
      <div className="max-w-6xl mx-auto px-2 md:px-6 pt-8">
        {images.length === 0 ? (
          <div className="text-center text-white/70 py-16 text-lg">No images found in this playlist.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {images.map((img, idx) => (
  <div
    key={img}
    className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-[#021C1B]"
    onClick={() => setModalImageIndex(idx)}
  >
    <img
      src={img}
      alt={img.split('/').pop()}
      className="w-full aspect-[3/4] object-cover object-center group-hover:scale-105 group-hover:brightness-110 transition duration-200"
      draggable={false}
    />
  </div>
))}
          </div>
        )}
      </div>
      <ImageModal
        images={images}
        initialImageIndex={modalImageIndex}
        shuffleEnabled={shuffleEnabled}
        onClose={() => setModalImageIndex(null)}
      />
    </div>
  );
}
