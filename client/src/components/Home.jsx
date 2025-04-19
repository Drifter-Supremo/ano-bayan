import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch playlists");
        return res.json();
      })
      .then(setPlaylists)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();

  if (loading) return <div className="text-center py-10 text-xl text-white/70">Loading playlists...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#032934] flex flex-col items-center justify-center">
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
