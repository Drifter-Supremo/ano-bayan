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

// SVG Icons for Controls
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>;
const ExpandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
const ShrinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;


export default function Slideshow({ images = [], initialIndex = 0, onClose }) {
  const [list, setList] = useState(images);
  const [index, setIndex] = useState(initialIndex);
  const [autoPlay, setAutoPlay] = useState(false);
  const [duration, setDuration] = useState(6000);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [showControls, setShowControls] = useState(true);
  const touchStart = useRef(null);
  const slideshowRef = useRef(null);
  const controlsTimeout = useRef(null);
  const isCoarse = typeof window !== "undefined" &&
                   window.matchMedia("(pointer: coarse)").matches;
  const [zoomed, setZoomed]   = useState(false);
  const [origin, setOrigin]   = useState("50% 50%");
  const lastTapRef            = useRef(0);

  // keep the latest autoplay value so toggleZoom always sees the truth
  const autoPlayRef = useRef(autoPlay);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);

  // Store original images separately
  const originalImages = useRef(images);

  // Initialize list based on autoplay state (shuffle if starting in autoplay)
  useEffect(() => {
    setList(autoPlay ? shuffle(originalImages.current) : originalImages.current);
    setIndex(initialIndex);
    // Don't reset autoplay here, let the button control it
  }, [images, initialIndex]); // Rerun if original images change

  // Effect to shuffle/unshuffle when autoplay toggles
  useEffect(() => {
    if (autoPlay) {
      // Shuffle when starting autoplay
      const shuffledList = shuffle(originalImages.current);
      setList(shuffledList);
      // Find the current image in the shuffled list to maintain position if possible, else start at 0
      const currentImage = list[index];
      const newIndex = shuffledList.findIndex(img => img === currentImage);
      setIndex(newIndex !== -1 ? newIndex : 0);
    } else {
      // Revert to original order when stopping autoplay
      const currentImage = list[index]; // Get current image from potentially shuffled list
      setList(originalImages.current);
      // Find the index of the current image in the original list
      const originalIndex = originalImages.current.findIndex(img => img === currentImage);
      setIndex(originalIndex !== -1 ? originalIndex : 0); // Go back to its original position
    }
    // Intentionally omitting list and index from dependencies to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, originalImages]);

  // Reset zoom whenever the slide, autoplay, or fullscreen changes
  useEffect(() => setZoomed(false), [index, autoPlay, isFullscreen]);

  // Adjust duration based on orientation
  const onLoad = e => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const base = 5000; // New base: 5 seconds
    const extra = h > w ? 1500 : h === w ? 750 : 0; // New extra times
    setDuration(base + extra);
  };

  // Auto-play timer
  useEffect(() => {
    let timer;
    // Only advance if autoplay is on AND controls are hidden
    if (autoPlay && !showControls) {
      timer = setTimeout(() => {
        setIndex(i => (i + 1) % list.length);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, index, list.length, duration, showControls]);


  // Control visibility logic
  const handleInteraction = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000); // Hide after 3s inactivity
  }, []);

  useEffect(() => {
    handleInteraction(); // Show on mount/index change
    return () => clearTimeout(controlsTimeout.current);
  }, [handleInteraction]); // Only run on mount


  const prev = useCallback(() => {
    setIndex(i => (i - 1 + list.length) % list.length);
    handleInteraction();
  }, [list.length, handleInteraction]);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % list.length);
    handleInteraction();
  }, [list.length, handleInteraction]);

  // Fullscreen API handler
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      slideshowRef.current?.requestFullscreen().catch(err => console.error(`FS request failed: ${err.message}`));
    } else {
      document.exitFullscreen().catch(err => console.error(`FS exit failed: ${err.message}`));
    }
    handleInteraction();
  }, [handleInteraction]);

  // Listen for fullscreen changes & handle Escape/Space key
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleKey = e => {
      handleInteraction();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") {
        if (document.fullscreenElement) document.exitFullscreen().catch(err => console.error(`FS exit failed: ${err.message}`));
        else if (onClose) onClose();
      }
      if (e.key === " ") { e.preventDefault(); setAutoPlay(a => !a); }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener("keydown", handleKey);
    };
  }, [prev, next, onClose, handleInteraction]); // Added handleInteraction dependency

  // Touch nav: only allow swipe if single-finger (native pinch-to-zoom will work)
  const handleTouchStart = e => {
    if (e.touches.length === 1) {
      touchStart.current = e.touches[0].clientX;
    } else {
      touchStart.current = null;
    }
    handleInteraction();
  };
  const toggleZoom = (e) => {
    if (!isCoarse || autoPlayRef.current) return;   // ignore while autoplay is running
    const now = Date.now();
    if (now - lastTapRef.current < 300) {           // double-tap detected
      const touch = e.changedTouches[0];
      // Find the image element
      const img = slideshowRef.current.querySelector('img');
      if (img) {
        const rect = img.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);                   // zoom toward tap point
        setZoomed(z => !z);
      } else {
        // Fallback to center zoom if image not found
        setOrigin('50% 50%');
        setZoomed(z => !z);
      }
      e.preventDefault();                           // stop browser double-tap zoom
    }
    lastTapRef.current = now;
  };

  const handleTouchEnd = e => {
    toggleZoom(e);
    // Only trigger swipe if single touch throughout
    if (touchStart.current == null || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
  };


  // Transitions: fade+zoom if autoplaying, simple fade otherwise
  const variants = autoPlay
      ? { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const transition = { duration: autoPlay ? 1.2 : 0.5, ease: "easeInOut" };

  const imgUrl = list[index] || "";

  // Base classes for all control buttons
  const buttonBaseClass = "absolute text-white/80 hover:text-white bg-black/40 rounded-full transition-opacity duration-300";
  const controlVisibilityClass = showControls ? 'opacity-100' : 'opacity-0 pointer-events-none';

  return (
    <div
      ref={slideshowRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none overflow-hidden touch-zoom-container h-screen"
      onMouseMove={handleInteraction}
      onClick={handleInteraction} // Show controls on click anywhere
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={imgUrl}                      // keeps exit / enter keyed on slide
          style={{ transformOrigin: origin }}
          animate={{ scale: zoomed ? 2 : 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.8 }}
        >
          <motion.img
            src={imgUrl}
            alt=""
            onLoad={onLoad}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* --- Unified Controls Container --- */}
      <div className={`absolute inset-0 z-10 ${controlVisibilityClass}`}>
          {/* Close */}
          <button onClick={onClose} className={`${buttonBaseClass} top-4 right-4 p-2`}>
            <CloseIcon />
          </button>
          {/* Prev */}
          <button onClick={prev} className={`${buttonBaseClass} left-4 top-1/2 -translate-y-1/2 p-3`}>
            <ChevronLeftIcon />
          </button>
          {/* Next */}
          <button onClick={next} className={`${buttonBaseClass} right-4 top-1/2 -translate-y-1/2 p-3`}>
            <ChevronRightIcon />
          </button>
          {/* Fullscreen */}
          <button
            onClick={toggleFullScreen}
            className={`${buttonBaseClass} top-4 left-4 p-2`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
          </button>
           {/* Play/Pause */}
          <button
            onClick={() => { setAutoPlay(a => !a); handleInteraction(); }}
            className={`${buttonBaseClass} bottom-6 left-1/2 -translate-x-1/2 p-3`} // Adjusted bottom padding
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? <PauseIcon /> : <PlayIcon />}
          </button>
       </div>
    </div>
  );
}
