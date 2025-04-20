import React from "react";
import { supabase } from "../supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // quick way to force re-check auth for testing
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition text-xs z-50"
    >
      Log Out
    </button>
  );
}
