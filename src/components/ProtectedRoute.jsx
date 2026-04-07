import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthenticated(Boolean(data?.session?.user));
      setAuthChecked(true);
    };

    verify();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthenticated(Boolean(session?.user));
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      } else if (subscription?.subscription?.unsubscribe) {
        subscription.subscription.unsubscribe();
      }
    };
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-sm text-white/70">Checking authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
