import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { app, auth } from "../firebase";
const storage = getStorage(app);

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      setError(null);
      try {
        // List all folders (playlists) in the bucket using Firebase
        const rootRef = ref(storage); // Reference the root of the bucket
        const folderRes = await listAll(rootRef);
        const folders = folderRes.prefixes; // Array of folder references
        // For each folder, get the first image as thumbnail
        const playlistPromises = folders.map(async (folderRef) => {
          const imagesRes = await listAll(folderRef);
          const imageRefs = imagesRes.items;
          if (!imageRefs.length) return null;
          const thumbnailUrl = await getDownloadURL(imageRefs[0]);
          return {
            name: folderRef.name,
            thumbnail: thumbnailUrl,
            };
          });
        const playlistsWithThumbs = (await Promise.all(playlistPromises)).filter(Boolean);
        setPlaylists(playlistsWithThumbs);
      } catch (err) {
        setError(err.message || "Failed to fetch playlists");
      } finally {
        setLoading(false);
      }
    }
    // Only fetch playlists if a user is currently logged in when the component mounts
    if (auth.currentUser) {
      fetchPlaylists();
    } else {
      // Handle case where user is not logged in on mount (optional: show message or redirect)
      setLoading(false); // Stop loading indicator
      // setError("Please log in to view playlists."); // Example message
    }
  }, []);

  const navigate = useNavigate();

  if (loading) return <div className="text-center py-10 text-xl text-white/70">Loading playlists...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <motion.div
      className="min-h-screen bg-[#032934] flex flex-col items-center justify-center relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 py-12">
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.name}
            className="group rounded-2xl overflow-hidden shadow-xl bg-neutral-900/70 cursor-pointer aspect-square" // Removed hover styles handled by motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            onClick={() => navigate(`/playlist/${encodeURIComponent(playlist.name)}`)}
          >
            {playlist.thumbnail && (
              <img
                src={playlist.thumbnail}
                alt={playlist.name + " thumbnail"}
                className="w-full aspect-square object-cover object-center group-hover:brightness-110 transition duration-200"
                draggable={false}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
