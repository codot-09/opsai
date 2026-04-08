import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { getCurrentWorkspaceId } from '../lib/workspace.js';
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
      const workspaceId = await getCurrentWorkspaceId();
      if (!workspaceId) {
        console.error('No workspace found');
        return;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('command_id', command.id)
        .eq('workspace_id', workspaceId);
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
        async (payload) => {
          // Verify the task belongs to current workspace
          const workspaceId = await getCurrentWorkspaceId();
          if (payload.new?.workspace_id !== workspaceId) {
            return; // Ignore tasks from other workspaces
          }
          
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
      className="space-y-3"
    >
      <div className="flex justify-end">
        <div className="rounded-lg bg-blue-100 p-4 text-blue-900 max-w-2xl">
          <div className="flex items-center justify-between gap-4 mb-2 text-xs text-blue-700">
            <span className="font-medium text-blue-900">You</span>
            <span>{new Date(command.created_at).toLocaleTimeString()}</span>
          </div>
          <p className="text-sm leading-6">{command.user_input}</p>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-800 max-w-2xl">
          <div className="flex items-center justify-between gap-4 text-xs text-gray-600 mb-3">
            <span className="font-medium text-black">AI Workflow</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs text-purple-700">
              <Sparkles className="h-3 w-3 text-purple-600" />
              {stageText}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              {tasks.length
                ? `Task stream is active. Tap below to inspect ${tasks.length} item${tasks.length === 1 ? '' : 's'}.`
                : 'No tasks have started yet. The AI will begin processing your command shortly.'}
            </p>
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>Task summary</span>
                {tasks.length > 0 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-gray-600 hover:text-black transition text-xs"
                  >
                    {expanded ? 'Hide' : `Show ${tasks.length}`}
                    {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {tasks.length ? 'Expand to review each active task.' : 'Waiting for tasks...' }
              </div>
            </div>
            {expanded && (
              <div className="mt-2">
                <TaskTimeline tasks={tasks} />
              </div>
            )}
          </div>
        </div>
      </div>

      {command.result_summary && (
        <div className="flex justify-end">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-800 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-medium">Result</p>
            <p className="mt-2 text-xs leading-5">{command.result_summary}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}