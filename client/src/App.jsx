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
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const toggleShuffle = () => setShuffleEnabled(s => !s);

  return (
    <Router>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        shuffleEnabled={shuffleEnabled}
        toggleShuffle={toggleShuffle}
      />
      <AppContent
        isDrawerOpen={isDrawerOpen}
        openDrawer={() => setIsDrawerOpen(true)}
        shuffleEnabled={shuffleEnabled}
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
          element={<PlaylistGridView shuffleEnabled={shuffleEnabled} />}
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
