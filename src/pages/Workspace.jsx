import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function Workspace() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login', { replace: true });
        return;
      }
      setUser(session.user);

      // Check if user already has a workspace
      const { data: workspaces, error } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', session.user.id)
        .limit(1);

      if (error) {
        console.error('Error checking workspace:', error);
      } else if (workspaces && workspaces.length > 0) {
        navigate('/dashboard', { replace: true });
        return;
      }

      if (!slugEdited) {
        setSlug(slugify(session.user.email || 'workspace'));
      }
    };

    loadSession();
  }, [navigate, slugEdited]);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(workspaceName || user?.email || 'workspace'));
    }
  }, [workspaceName, slugEdited, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!workspaceName.trim()) {
      setError('Workspace name is required.');
      return;
    }

    if (!slug.trim()) {
      setError('Workspace slug is required.');
      return;
    }

    // Double-check user is authenticated
    if (!user) {
      setError('User not authenticated. Please sign in again.');
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);

    try {
      // Check again if user already has a workspace (race condition protection)
      const { data: existingWorkspaces, error: checkError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (checkError) {
        setError('Unable to verify workspace status. Please try again.');
        setLoading(false);
        return;
      }

      if (existingWorkspaces && existingWorkspaces.length > 0) {
        // User already has a workspace, redirect to dashboard
        navigate('/dashboard', { replace: true });
        return;
      }

      // Check if slug is already taken
      const { data: slugCheck, error: slugError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('slug', slug.trim())
        .limit(1);

      if (slugError) {
        setError('Unable to verify workspace slug availability.');
        setLoading(false);
        return;
      }

      if (slugCheck && slugCheck.length > 0) {
        setError('This workspace slug is already taken. Please choose a different one.');
        setLoading(false);
        return;
      }

      // Create the workspace
      const { error: insertError } = await supabase
        .from('workspaces')
        .insert([{
          name: workspaceName.trim(),
          slug: slug.trim(),
          owner_id: user.id
        }]);

      if (insertError) {
        console.error('Workspace creation error:', insertError);
        setError(insertError.message || 'Failed to create workspace. Please try again.');
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl p-10 glass border border-gray-200 rounded-3xl shadow-2xl bg-white">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Workspace</p>
          <h1 className="text-4xl font-bold tracking-tight mt-3">Create your first workspace</h1>
          <p className="mt-3 text-gray-600 max-w-xl">
            Configure a workspace for your AI operations team. Your owner ID is linked to the signed-in account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Workspace Name</label>
            <input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="e.g. OpsAI Growth Team"
              className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Workspace Slug</label>
            <input
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugEdited(true);
              }}
              placeholder="opsai-growth-team"
              className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-sm text-gray-500">A clean, shareable identifier for your workspace URL.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Owner ID</label>
            <input
              value={user?.id ?? ''}
              readOnly
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-500 outline-none"
            />
          </div>

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-white text-black px-6 py-4 font-semibold uppercase tracking-[0.08em] shadow-xl shadow-white/10 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating workspace...' : 'Create workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
