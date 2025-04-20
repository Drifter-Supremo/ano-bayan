import React from "react";
import { supabase } from "../supabaseClient";

export default function SupabaseAuthButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 rounded bg-white text-black text-base shadow hover:bg-gray-200 transition font-semibold"
    >
      Sign in with Google
    </button>
  );
}
