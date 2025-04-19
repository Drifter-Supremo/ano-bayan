import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PlaylistGridView from "./components/PlaylistGridView";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlist/:playlistName" element={<PlaylistGridView />} />
      </Routes>
    </Router>
  );
}

export default App;
