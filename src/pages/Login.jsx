import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          // Validate user has required fields
          if (!session.user.id) {
            console.error('User missing ID');
            navigate('/login', { replace: true });
            return;
          }

          // Check if user has a workspace
          const { data: workspaces, error } = await supabase
            .from('workspaces')
            .select('id, subscribed')
            .eq('owner_id', session.user.id)
            .limit(1);

          if (error) {
            console.error('Error checking workspace:', error);
            navigate('/workspace', { replace: true });
          } else if (workspaces && workspaces.length > 0) {
            const workspace = workspaces[0];
            if (workspace.subscribed === true) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/subscription', { replace: true });
            }
          } else {
            navigate('/workspace', { replace: true });
          }
        }
      } catch (err) {
        console.error('Unexpected error in session check:', err);
        navigate('/login', { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error.message);
      alert('Unable to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md space-y-8 p-8 border border-gray-200 rounded-2xl bg-white shadow-sm"
      >
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-medium">Login</p>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Welcome to OpsAI</h1>
          <p className="text-sm text-gray-600 leading-relaxed">Sign in with your Google account to access your workspace.</p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white py-3 text-sm font-semibold transition hover:bg-blue-700 active:bg-blue-800"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500 leading-relaxed">
          You'll be redirected to workspace setup after signing in.
        </p>
      </motion.div>
    </div>
  );
}
