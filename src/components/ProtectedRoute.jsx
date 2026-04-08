import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [workspaceChecked, setWorkspaceChecked] = useState(false);
  const [hasWorkspace, setHasWorkspace] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const user = data?.session?.user;
      setAuthenticated(Boolean(user));

      if (user) {
        // Check if user has a workspace
        const { data: workspaces, error } = await supabase
          .from('workspaces')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        if (!mounted) return;

        if (error) {
          console.error('Error checking workspace:', error);
          setHasWorkspace(false);
        } else {
          setHasWorkspace(Boolean(workspaces && workspaces.length > 0));
        }
        setWorkspaceChecked(true);
      } else {
        setWorkspaceChecked(true);
      }

      setAuthChecked(true);
    };

    verify();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const user = session?.user;
      setAuthenticated(Boolean(user));

      if (user) {
        // Check workspace when auth state changes
        const { data: workspaces, error } = await supabase
          .from('workspaces')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        if (!mounted) return;

        if (error) {
          console.error('Error checking workspace:', error);
          setHasWorkspace(false);
        } else {
          setHasWorkspace(Boolean(workspaces && workspaces.length > 0));
        }
      } else {
        setHasWorkspace(false);
      }

      setWorkspaceChecked(true);
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

  if (!authChecked || !workspaceChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-sm text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasWorkspace) {
    return <Navigate to="/workspace" replace />;
  }

  return children;
}
