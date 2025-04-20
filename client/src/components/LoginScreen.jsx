import React from "react";
import SupabaseAuthButton from "./SupabaseAuthButton";

export default function LoginScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#032934]">
      <img
        src="/ano-bayan-landing-page-image.png"
        alt="Ano Bayan Landing"
        className="w-48 h-48 object-contain mb-8 drop-shadow-lg rounded-xl"
        draggable={false}
      />
      <SupabaseAuthButton />
    </div>
  );
}
