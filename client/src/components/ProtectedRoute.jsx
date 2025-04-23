import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; // Removed getRedirectResult import

export default function ProtectedRoute({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Effect 1: Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []); // Run only once on mount

  // Effect 2: Decide navigation
  useEffect(() => {
    // Wait until initial auth state check is finished
    if (!authLoading) {
      if (!user) {
        navigate("/login", { replace: true });
      }
      // If user exists, do nothing, allow rendering children
    }
  }, [user, authLoading, navigate]);

  // Show loading indicator while auth check is in progress
  if (authLoading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#032934] text-white">Checking authentication...</div>;
  }

  // Render children only if user exists after loading is complete
  return user ? children : null; // If no user, navigation should have already happened
}
