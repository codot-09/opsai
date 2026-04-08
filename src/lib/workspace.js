import { supabase } from './supabase.js';

/**
 * Get the current user's workspace
 * @returns {Promise<{workspace: object|null, error: string|null}>}
 */
export const getCurrentWorkspace = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return { workspace: null, error: sessionError.message };
    }

    if (!session?.user) {
      return { workspace: null, error: 'No authenticated user' };
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', session.user.id)
      .single();

    if (workspaceError) {
      return { workspace: null, error: workspaceError.message };
    }

    return { workspace, error: null };
  } catch (err) {
    return { workspace: null, error: err.message };
  }
};

/**
 * Get the current workspace ID
 * @returns {Promise<{workspaceId: string|null, error: string|null}>}
 */
export const getCurrentWorkspaceId = async () => {
  const { workspace, error } = await getCurrentWorkspace();
  return { workspaceId: workspace?.id || null, error };
};