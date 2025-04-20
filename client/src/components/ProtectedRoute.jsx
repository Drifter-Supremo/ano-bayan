import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
        if (!user) {
          navigate("/login", { replace: true });
        }
      }
    });
    return () => { mounted = false; };
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
}
