import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

/**
 * Custom hook to manage user authentication state
 * Provides current user, session, and loading states
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
            setUser(null);
            setSession(null);
          } else {
            setSession(session);
            setUser(session?.user || null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err);
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (mounted) {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
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

  return {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
  };
};

/**
 * Custom hook to get current workspace information
 */
export const useWorkspace = () => {
  const { user, isAuthenticated } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWorkspace(null);
      setWorkspaceError(null);
      return;
    }

    const fetchWorkspace = async () => {
      setWorkspaceLoading(true);
      setWorkspaceError(null);

      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No workspace found
            setWorkspace(null);
          } else {
            setWorkspaceError(error.message);
            setWorkspace(null);
          }
        } else {
          setWorkspace(data);
        }
      } catch (err) {
        setWorkspaceError(err.message);
        setWorkspace(null);
      } finally {
        setWorkspaceLoading(false);
      }
    };

    fetchWorkspace();
  }, [user, isAuthenticated]);

  return {
    workspace,
    workspaceLoading,
    workspaceError,
    hasWorkspace: Boolean(workspace),
  };
};