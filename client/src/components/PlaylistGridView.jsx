import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ImageModal({ image, onClose }) {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <img
        src={image}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain border border-white/10"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-4 right-4 text-white text-3xl bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 focus:outline-none"
        onClick={onClose}
        aria-label="Close preview"
      >
        ×
      </button>
    </div>
  );
}


export default function PlaylistGridView() {
  const { playlistName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/playlists/${encodeURIComponent(playlistName)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch images");
        return res.json();
      })
      .then(data => {
        let imgs;
        if (Array.isArray(data)) {
          imgs = data;
        } else if (data && Array.isArray(data.images)) {
          imgs = data.images;
        } else {
          console.log('Unexpected API response:', data);
          imgs = [];
        }
        setImages(imgs);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [playlistName]);

  // Allow closing modal with Escape key
  useEffect(() => {
    if (!modalImage) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setModalImage(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  if (loading) return <div className="text-center py-10 text-xl text-white/70">Loading images...</div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-[#032934] pb-8">
      <div className="max-w-6xl mx-auto px-2 md:px-6 pt-8">
        {images.length === 0 ? (
          <div className="text-center text-white/70 py-16 text-lg">No images found in this playlist.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {images.map((img, idx) => (
              <div
                key={img}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-[#021C1B]"
                onClick={() => setModalImage(img)}
              >
                <img
                  src={img}
                  alt={img.split('/').pop()}
                  className="w-full aspect-[3/4] object-cover object-center group-hover:scale-105 group-hover:brightness-110 transition duration-200"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
}

