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
  const [mode, setMode] = useState("preview"); // "preview" or "cinematic"
  const [list, setList] = useState(images);
  const [index, setIndex] = useState(initialIndex);
  const [hovered, setHovered] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [duration, setDuration] = useState(6000);
  const touchStart = useRef(null);

  // Initialize list when mode or images change
  useEffect(() => {
    if (mode === "cinematic") {
      setList(shuffle(images));
      setIndex(0);
      setAutoPlay(true);
    } else {
      setList(images);
      setIndex(initialIndex);
      setAutoPlay(false);
    }
  }, [mode, images, initialIndex]);

  // Adjust duration based on orientation
  const onLoad = e => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const base = 6000;
    const extra = h > w ? 2000 : h === w ? 1000 : 0;
    setDuration(base + extra);
  };

  // Auto-play for cinematic
  useEffect(() => {
    if (mode === "cinematic" && autoPlay && !hovered) {
      const timer = setTimeout(() => {
        setIndex(i => (i + 1) % list.length);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [mode, autoPlay, hovered, index, list.length, duration]);

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % list.length);
  }, [list.length]);

  // Keyboard nav
  useEffect(() => {
    const handler = e => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

  const variants =
    mode === "preview"
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : { initial: { opacity: 0, scale: 1.1 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.1 } };

  const transition = { duration: mode === "preview" ? 0.5 : 1.2, ease: "easeInOut" };

  const imgUrl = list[index] || "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        mode === "preview" ? "bg-black/80" : "bg-black/95"
      } select-none`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          className={`${
            mode === "preview" ? "object-contain" : "object-cover"
          } max-h-[90vh] max-w-[98vw] rounded shadow-lg`}
          draggable={false}
        />
      </AnimatePresence>

      {/* Close */}
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl p-2">
          ×
        </button>
      )}
      {/* Prev */}
      <button onClick={prev} className="absolute left-4 text-white text-3xl p-2">
        ‹
      </button>
      {/* Next */}
      <button onClick={next} className="absolute right-4 text-white text-3xl p-2">
        ›
      </button>

      {/* Mode toggle and controls */}
      {mode === "preview" && (
        <button
          onClick={() => setMode("cinematic")}
          className="absolute bottom-8 text-white text-4xl p-2"
        >
          ▶
        </button>
      )}
      {mode === "cinematic" && (
        <button
          onClick={() => setAutoPlay(a => !a)}
          className="absolute bottom-8 text-white text-4xl p-2"
        >
          {autoPlay ? "❚❚" : "▶"}
        </button>
      )}
    </div>
  );
}
