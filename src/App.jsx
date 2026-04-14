import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase.js';
import { getCurrentWorkspace } from './lib/workspace.js';
import { AppProviders } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/MainLayout.jsx';
import Loader from './components/ui/Loader.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Leads = lazy(() => import('./pages/Leads.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const Tasks = lazy(() => import('./pages/Tasks.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Workspace = lazy(() => import('./pages/Workspace.jsx'));
const Subscription = lazy(() => import('./pages/Subscription.jsx'));

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
          if (!session.user.id) {
            console.error('User missing ID');
            navigate('/login', { replace: true });
            setLoading(false);
            return;
          }

          const { workspace, error } = await getCurrentWorkspace();

          if (error) {
            console.error('Error checking workspace:', error);
            navigate('/workspace', { replace: true });
          } else if (!workspace) {
            navigate('/workspace', { replace: true });
          } else if (workspace.subscribed === true) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/subscription', { replace: true });
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

    timeoutId = setTimeout(() => {
      if (!sessionRestored) {
        console.warn('Session restoration timeout, redirecting to login');
        navigate('/login', { replace: true });
        setLoading(false);
        sessionRestored = true;
      }
    }, 10000);

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Root redirect auth state change:', event, session?.user?.id);
      await checkSession(session);
    });

    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
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
        <Loader label="Restoring session..." />
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-gray-900"><Loader label="Loading app..." /></div>}>
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
            <Route
              path="/subscription"
              element={
                <ProtectedRoute allowUnsubscribed>
                  <MainLayout>
                    <Subscription />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppProviders>
    </BrowserRouter>
  );
}
