import React, { useEffect } from "react"; // Removed useState
import { signInWithGoogle, auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth"; // Removed getRedirectResult

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Listener: Handles cases where user is already logged in when visiting /login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is found (already logged in or just logged in via popup), navigate home
        navigate("/", { replace: true });
      }
      // No need to log if user is null
    });
    return () => unsub();
  }, [navigate]); // Only navigate dependency needed

  // Removed the useEffect hook that called getRedirectResult
  // Removed the loadingRedirect state and the loading indicator conditional return

  // Removed handleSignIn wrapper as it only contained a log

  return (
    <motion.div key={location.key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-[#032934] p-4 sm:p-6 overflow-hidden">
      <div className="w-full max-w-[24rem] sm:max-w-[28rem] relative">
        <motion.img
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src="/ano-bayan-landing-page-image.png"
          alt="Ano Bayan Landing"
          className="w-full h-auto aspect-square object-contain drop-shadow-xl rounded-2xl"
          draggable={false}
        />
      </div>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onClick={signInWithGoogle}
        className="w-full max-w-[20rem] flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-xl shadow-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Sign in with Google
      </motion.button>
    </motion.div>
  );
}
