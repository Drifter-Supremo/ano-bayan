import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import LogoutButton from "./LogoutButton";
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
        const rootRef = ref(storage, 'ano-bayan-images');
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
    fetchPlaylists();
  }, []);

  const navigate = useNavigate();

  if (loading) return <div className="text-center py-10 text-xl text-white/70">Loading playlists...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#032934] flex flex-col items-center justify-center relative">
      <LogoutButton />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 py-12">
        {playlists.map((playlist) => (
          <div
            key={playlist.name}
            className="group rounded-2xl overflow-hidden shadow-xl bg-neutral-900/70 hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer aspect-square"
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
          </div>
        ))}
      </div>
    </div>
  );
}
