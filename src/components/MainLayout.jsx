import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function MainLayout({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWorkspaceInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        navigate('/login', { replace: true });
        return;
      }

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        navigate('/login', { replace: true });
        return;
      }

      setAuthUser(userData.user);

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Unable to load user profile:', profileError.message);
      }
      setProfile(profileData ?? null);

      const ownerId = profileData?.id ?? userData.user.id;
      const {
        data: workspaceData,
        error: workspaceError,
      } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (workspaceError && workspaceError.code !== 'PGRST116') {
        console.warn('Unable to load workspace:', workspaceError.message);
      }
      setWorkspace(workspaceData ?? null);
      setLoading(false);
    };

    loadWorkspaceInfo();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-sm text-gray-600">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar
            user={profile ?? authUser}
            workspaceName={workspace?.name ?? 'OpsAI Workspace'}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-hidden px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
