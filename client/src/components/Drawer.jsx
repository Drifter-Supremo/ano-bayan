import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll } from "firebase/storage";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // Use AnimatePresence to handle the exit animation
  return (
    <AnimatePresence>
      {open && ( // Only render when open is true
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop with fade */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* Drawer Panel with slide */}
          <motion.div
            className="relative bg-[#032934] w-64 h-full p-4 text-white flex flex-col overflow-hidden"
            initial={{ x: "-100%", opacity: 0 }} // Start fully off-screen left
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }} // Exit back to the left
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
