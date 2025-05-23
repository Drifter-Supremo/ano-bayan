import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"; 

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

  // Effect 2: Redirect unauthorized users
  useEffect(() => {
    if (!authLoading) {
      // Only allow specific user
      if (!user || user.uid !== "QhXpKWU6d8anCHpbtdfqx3FVDSZ2") {
        if (user) firebaseSignOut(auth);
        navigate("/login", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // Show loading indicator while auth check is in progress
  if (authLoading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#032934] text-white">Checking authentication...</div>;
  }

  // Render children only if user exists after loading is complete
  return user ? children : null; // If no user, navigation should have already happened
}
