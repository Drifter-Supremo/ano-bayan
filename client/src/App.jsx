import React, { useState, useEffect } from "react"; // Keep useEffect for LocationLogger
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// Removed auth and getRedirectResult imports as they are no longer needed here
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
        openDrawer={() => setIsDrawerOpen(true)}
        // Removed shuffle prop
      />
      {/* Keep LocationLogger if desired, or remove it too */}
      <LocationLogger />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist/:playlistName"
          element={<PlaylistGridView />} // Removed shuffle prop
        />
      </Routes>
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


function AppContent({ openDrawer }) {
  const location = useLocation();
  // Removed console logs
  // hide hamburger on login page
  if (location.pathname === "/login") {
    return null;
  }
  return (
    <button
      className="fixed top-4 left-4 z-50 text-white text-lg p-2 bg-black/40 rounded"
      onClick={openDrawer}
      aria-label="Open menu"
    >
      &#9776;
    </button>
  );
}

export default App;
