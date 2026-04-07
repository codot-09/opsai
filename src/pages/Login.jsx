import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/dashboard', { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error(error.message);
      alert('Unable to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md space-y-8 p-10 glass border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Secure access</p>
          <h1 className="text-4xl font-bold">Welcome back to OpsAI</h1>
          <p className="text-white/60">Use your Google account to sign in and access your dashboard.</p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-white text-black py-4 text-sm font-semibold uppercase tracking-[0.08em] shadow-xl shadow-white/10 hover:bg-white/90 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-white/50">
          After sign in, you will be redirected to workspace setup.
        </p>
      </motion.div>
    </div>
  );
}
