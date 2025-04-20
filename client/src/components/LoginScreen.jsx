import React, { useEffect } from "react";
import { signInWithGoogle, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function LoginScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/", { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#032934]">
      <img
        src="/ano-bayan-landing-page-image.png"
        alt="Ano Bayan Landing"
        className="w-[28rem] h-[28rem] object-contain mb-8 drop-shadow-lg rounded-xl"
        draggable={false}
      />
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 rounded bg-white text-black text-base shadow hover:bg-gray-200 transition font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  );
}
