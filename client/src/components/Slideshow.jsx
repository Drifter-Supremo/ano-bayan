import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utility: shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Slideshow({ images = [], initialIndex = 0, onClose }) {
  const [list, setList] = useState(images);
  const [index, setIndex] = useState(initialIndex);
  const [autoPlay, setAutoPlay] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const touchStart = useRef(null);
  const slideshowRef = useRef(null); // Ref for the main div

  // Initialize list
  useEffect(() => {
    setList(images);
    setIndex(initialIndex);
    setAutoPlay(false); // Start paused
  }, [images, initialIndex]);

  // Adjust duration based on orientation
  const onLoad = e => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const base = 6000;
    const extra = h > w ? 2000 : h === w ? 1000 : 0;
    setDuration(base + extra);
  };

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (autoPlay) {
      timer = setTimeout(() => {
        setIndex(i => (i + 1) % list.length);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, index, list.length, duration]);

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % list.length);
  }, [list.length]);

  // Fullscreen API handler
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      slideshowRef.current?.requestFullscreen().catch(err => {
        console.error(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
         console.error(`Exit fullscreen failed: ${err.message}`);
      });
    }
  };

  // Listen for fullscreen changes & handle Escape key
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleKey = e => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => console.error(`Exit fullscreen failed: ${err.message}`));
        } else if (onClose) {
          onClose(); // Close component if not fullscreen
        }
      }
      // Toggle play/pause with Space bar
      if (e.key === " ") {
         e.preventDefault(); // Prevent page scroll
         setAutoPlay(a => !a);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener("keydown", handleKey);
    };
  }, [prev, next, onClose]);


  // Touch nav
  const handleTouchStart = e => {
    touchStart.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      dx > 0 ? prev() : next();
    }
  };

  // Simple fade for preview, fade+zoom for cinematic (when autoplaying)
  const variants = autoPlay
      ? { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const transition = { duration: autoPlay ? 1.2 : 0.5, ease: "easeInOut" };

  const imgUrl = list[index] || "";

  return (
    <div
      ref={slideshowRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={imgUrl}
          src={imgUrl}
          alt=""
          onLoad={onLoad}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="object-contain max-h-full max-w-full" // Let fullscreen handle sizing
          draggable={false}
        />
      </AnimatePresence>

      {/* --- Controls --- */}
      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl p-2 z-10">
        ×
      </button>
      {/* Prev */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl p-2 z-10">
        ‹
      </button>
      {/* Next */}
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl p-2 z-10">
        ›
      </button>
      {/* Fullscreen */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 left-4 text-white text-2xl p-2 z-10"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? '↙️' : '↗️'}
      </button>
      {/* Play/Pause */}
      <button
        onClick={() => setAutoPlay(a => !a)}
        className="absolute bottom-8 text-white text-4xl p-2 z-10"
        aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
      >
        {autoPlay ? "❚❚" : "▶"}
      </button>
    </div>
  );
}
