import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaylistGridView from "./components/PlaylistGridView";
import LoginScreen from "./components/LoginScreen";
import Drawer from "./components/Drawer";
import "./App.css";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Shuffle state is no longer needed here as it's handled internally by Slideshow

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

function AppContent({ openDrawer }) {
  const location = useLocation();
  // hide hamburger on login page
  if (location.pathname === "/login") return null;
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
