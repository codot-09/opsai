import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import TaskTimeline from './TaskTimeline.jsx';

export default function CommandThread({ command }) {
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState(false);

  if (!command) return null;

  const stageLabels = {
    pending: 'Analyzing...',
    running: 'Executing...',
    completed: 'Completed',
  };

  const stageText = stageLabels[command.status] || 'Processing...';

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('command_id', command.id);
      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
    };

    fetchTasks();

    // Subscribe to task changes for this command
    const tasksChannel = supabase
      .channel(`tasks_${command.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `command_id=eq.${command.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((task) => (task.id === payload.new.id ? payload.new : task))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [command.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(255,255,255,0.04)] backdrop-blur"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">{command.user_input}</p>
          <p className="text-xs text-white/50">{new Date(command.created_at).toLocaleString()}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80">
          <Sparkles className="h-4 w-4 text-white/70" />
          {stageText}
        </span>
      </div>

      <div className="rounded-3xl bg-black/50 p-5 text-white/80">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Command workflow</p>
          {tasks.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-white/60 hover:text-white/80 transition"
            >
              {expanded ? 'Hide tasks' : `Show ${tasks.length} tasks`}
              {expanded ? <ChevronUp className="inline-block ml-1 h-4 w-4" /> : <ChevronDown className="inline-block ml-1 h-4 w-4" />}
            </button>
          )}
        </div>
        {expanded ? (
          <div className="mt-4">
            <TaskTimeline tasks={tasks} />
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/50">{tasks.length ? 'Expand to inspect task progress.' : 'Waiting for tasks to appear...'}</div>
        )}
      </div>

      {command.result_summary && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white/80">
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Result</p>
          <p className="mt-3 text-sm leading-6">{command.result_summary}</p>
        </div>
      )}
    </motion.div>
  );
}