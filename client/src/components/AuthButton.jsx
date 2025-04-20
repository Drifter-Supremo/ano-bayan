import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, signOutGoogle } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="px-6 py-3 rounded bg-white text-black text-lg shadow hover:bg-gray-200 transition font-semibold"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
      <span className="text-white">{user.displayName}</span>
      <button
        onClick={signOutGoogle}
        className="ml-2 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
      >
        Sign out
      </button>
    </div>
  );
}
