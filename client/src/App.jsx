import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaylistGridView from "./components/PlaylistGridView";
import LoginScreen from "./components/LoginScreen";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={
  <ProtectedRoute>
    <Home />
  </ProtectedRoute>
} />
        <Route path="/playlist/:playlistName" element={<PlaylistGridView />} />
      </Routes>
    </Router>
  );
}

export default App;
