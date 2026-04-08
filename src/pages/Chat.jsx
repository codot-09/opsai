import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import { getCurrentWorkspaceId } from '../lib/workspace.js';
import CommandInput from '../components/CommandInput.jsx';
import CommandThread from '../components/CommandThread.jsx';

export default function Chat() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommands = async () => {
    try {
      setError(null);

      // Get current workspace
      const { workspaceId, error: workspaceError } = await getCurrentWorkspaceId();
      if (workspaceError || !workspaceId) {
        setError(workspaceError || 'Unable to load workspace');
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error: fetchError } = await supabase
        .from('commands')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching commands:', fetchError);
        setError(fetchError.message);
      } else {
        setCommands(data || []);
      }
    } catch (err) {
      console.error('Error fetching commands:', err);
      setError('Failed to load commands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();

    const setupSubscription = async () => {
      const { workspaceId, error: workspaceError } = await getCurrentWorkspaceId();
      if (workspaceError || !workspaceId) {
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const commandsChannel = supabase
        .channel('commands_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'commands',
            filter: `workspace_id=eq.${workspaceId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setCommands((prev) => [...prev, payload.new]);
            } else if (payload.eventType === 'UPDATE') {
              setCommands((prev) =>
                prev.map((cmd) => (cmd.id === payload.new.id ? payload.new : cmd))
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(commandsChannel);
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup?.then?.(fn => fn?.());
    };
  }, []);

  const handleCommandSubmit = async (commandText) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user');
        return;
      }

      // Get current workspace
      const { workspaceId, error: workspaceError } = await getCurrentWorkspaceId();
      if (workspaceError || !workspaceId) {
        console.error('Unable to get workspace:', workspaceError);
        return;
      }

      const response = await fetch('http://localhost:8000/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          user_input: commandText,
        }),
      });
      if (!response.ok) {
        console.error('Failed to submit command');
      }
    } catch (error) {
      console.error('Error submitting command:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-full flex flex-col bg-white text-gray-900"
    >
      <div className="flex-1 flex flex-col max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Chat</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">AI command stream</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">Type a command below and tap AI responses to inspect task progress.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-6">
          {loading ? (
            <div className="text-center text-gray-600 py-10">Loading today's commands...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">
              <p className="text-lg font-medium">Something went wrong</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : commands.length === 0 ? (
            <div className="text-center text-gray-600 py-10">No commands yet. Enter your first command below.</div>
          ) : (
            commands.map((command) => (
              <CommandThread key={command.id} command={command} />
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <CommandInput onSubmit={handleCommandSubmit} />
        </div>
      </div>
    </motion.div>
  );
}
