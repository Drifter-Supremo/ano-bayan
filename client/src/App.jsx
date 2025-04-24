import React, { useState, useEffect } from "react"; // Keep useEffect for LocationLogger
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// Removed auth and getRedirectResult imports as they are no longer needed here
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { motion } from "framer-motion"; // Import motion
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaylistGridView from "./components/PlaylistGridView";
import LoginScreen from "./components/LoginScreen";
import Drawer from "./components/Drawer";
import "./App.css";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Removed isCheckingRedirect state
  // Removed redirect checking effect

  // Shuffle state is no longer needed here as it's handled internally by Slideshow

  // Removed loading indicator for redirect check

  return (
    <Router>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        // Removed shuffle props
      />
      <AppContent
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        // Removed shuffle prop
      />
      {/* Keep LocationLogger if desired, or remove it too */}
      <LocationLogger />
      <AnimatedRoutes /> {/* Use the new AnimatedRoutes component */}
    </Router>
  );
}

// Component to log location changes (optional, can be removed)
function LocationLogger() {
  const location = useLocation();
  useEffect(() => {
    // console.log(`App: Location changed to: ${location.pathname}${location.search}${location.hash}`); // Removed log
  }, [location]);
  return null; // This component doesn't render anything
}
// Shared page transition component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
// New component to handle animated route transitions
function AnimatedRoutes() {
  const location = useLocation();
  // Removed playlistAnimationStatus ref
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><LoginScreen /></PageTransition>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageTransition><Home /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist/:playlistName"
          element={
            <PageTransition>
              <PlaylistGridView />
            </PageTransition>
          } // Removed prop
        />
      </Routes>
    </AnimatePresence>
  );
}


function AppContent({ isDrawerOpen, setIsDrawerOpen }) {
  const location = useLocation();
  // Removed console logs
  // hide hamburger on login page
  if (location.pathname === "/login") {
    return null;
  }
  return (
    <motion.button
      className="fixed top-4 left-4 z-50 text-white text-lg p-2 bg-black/40 rounded"
      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      aria-label="Open menu"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      &#9776;
    </motion.button>
  );
}

export default App;
