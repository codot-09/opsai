import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase.js';
import { AppProviders } from './contexts/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Chat from './pages/Chat.jsx';
import Tasks from './pages/Tasks.jsx';
import Settings from './pages/Settings.jsx';
import Landing from './pages/Landing.jsx';
import Workspace from './pages/Workspace.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/MainLayout.jsx';

function RootRedirect() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    let sessionRestored = false;

    const checkSession = async (session) => {
      if (sessionRestored) return;

      try {
        clearTimeout(timeoutId);

        if (session?.user) {
          // Validate user has required fields
          if (!session.user.id) {
            console.error('User missing ID');
            navigate('/login', { replace: true });
            setLoading(false);
            return;
          }

          // Check if user has a workspace
          const { data: workspaces, error } = await supabase
            .from('workspaces')
            .select('id')
            .eq('owner_id', session.user.id)
            .limit(1);

          if (error) {
            console.error('Error checking workspace:', error);
            navigate('/workspace', { replace: true });
          } else if (workspaces && workspaces.length > 0) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/workspace', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }

        sessionRestored = true;
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error in session check:', err);
        clearTimeout(timeoutId);
        navigate('/login', { replace: true });
        setLoading(false);
        sessionRestored = true;
      }
    };

    // Set a timeout to prevent hanging
    timeoutId = setTimeout(() => {
      if (!sessionRestored) {
        console.warn('Session restoration timeout, redirecting to login');
        navigate('/login', { replace: true });
        setLoading(false);
        sessionRestored = true;
      }
    }, 10000); // 10 second timeout

    // Listen for auth state changes (including initial session restoration)
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Root redirect auth state change:', event, session?.user?.id);
      await checkSession(session);
    });

    // Also try to get the current session immediately
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', sessionError);
          await checkSession(null);
        } else {
          await checkSession(session);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        await checkSession(null);
      }
    };

    getInitialSession();

    return () => {
      clearTimeout(timeoutId);
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      } else if (subscription?.subscription?.unsubscribe) {
        subscription.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="text-sm text-gray-600">Restoring session...</div>
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<RootRedirect />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Leads />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tasks />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
    </BrowserRouter>
  );
}
