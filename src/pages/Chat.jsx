import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import CommandInput from '../components/CommandInput.jsx';
import CommandThread from '../components/CommandThread.jsx';

export default function Chat() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommands = async () => {
    try {
      setError(null);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error: fetchError } = await supabase
        .from('commands')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Subscribe to commands changes
    const commandsChannel = supabase
      .channel('commands_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commands',
          filter: `created_at=gte.${today.toISOString()}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCommands((prev) => [payload.new, ...prev]);
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
  }, []);

  const handleCommandSubmit = async (commandText) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const workspaceSlug = session?.user
        ? await (async () => {
            const { data, error } = await supabase
              .from('workspaces')
              .select('slug')
              .eq('owner_id', session.user.id)
              .maybeSingle();
            if (error) {
              console.error('Unable to resolve workspace slug:', error);
              return null;
            }
            return data?.slug ?? null;
          })()
        : null;

      const response = await fetch('http://localhost:8000/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_slug: workspaceSlug,
          user_input: commandText,
        }),
      });
      if (!response.ok) {
        console.error('Failed to submit command');
      }
      // Supabase will handle the UI update
    } catch (error) {
      console.error('Error submitting command:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-3 mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Chat</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">OpsAI Command Center</h2>
              <p className="max-w-2xl text-white/60">Control your AI system with natural language commands</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pb-24">
          {loading ? (
            <div className="text-center text-white/60 py-8">Loading today's commands...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              <p className="text-lg font-medium">Something went wrong</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : commands.length === 0 ? (
            <div className="text-center text-white/60 py-8">No commands today. Start by typing a command below.</div>
          ) : (
            commands.map((command) => (
              <CommandThread key={command.id} command={command} />
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-6xl mx-auto">
          <CommandInput onSubmit={handleCommandSubmit} />
        </div>
      </div>
    </motion.div>
  );
}
