import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll } from "firebase/storage";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Drawer({ open, onClose, shuffleEnabled, toggleShuffle }) {
  const [playlists, setPlaylists] = useState([]);
  const storage = getStorage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const user = auth.currentUser;
      if (!user || user.uid !== "QhXpKWU6d8anCHpbtdfqx3FVDSZ2") {
        onClose();
        navigate("/login");
        return;
      }
      async function fetchPlaylists() {
        try {
          const rootRef = ref(storage);
          const folderRes = await listAll(rootRef);
          setPlaylists(folderRes.prefixes.map(pref => pref.name));
        } catch (err) {
          console.error("Failed to fetch playlists for drawer:", err);
        }
      }
      fetchPlaylists();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-[#032934] w-64 h-full p-4 text-white flex flex-col overflow-hidden">
        {/* Drawer closes on backdrop click; removed close button */}
        <ul className="mt-8 space-y-3 flex-grow overflow-y-auto h-0 overscroll-contain">
          <li
            className={`cursor-pointer ${location.pathname === "/" ? "font-bold" : ""}`}
            onClick={() => { navigate("/"); onClose(); }}
          >
            Home
          </li>
          {playlists.map(name => (
            <li
              key={name}
              className={`cursor-pointer ${location.pathname.includes(name) ? "font-bold" : ""}`}
              onClick={() => { navigate(`/playlist/${encodeURIComponent(name)}`); onClose(); }}
            >
              {name}
            </li>
          ))}
        </ul>
        {/* Shuffle toggle removed */}
        <div className="mt-auto pt-4">
          <button
            className="w-full text-left text-sm py-1 hover:underline"
            onClick={() => { signOut(auth); onClose(); navigate("/login"); }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
