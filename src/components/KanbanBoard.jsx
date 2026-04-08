import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { getCurrentWorkspaceId } from '../lib/workspace.js';
import TaskCard from './TaskCard.jsx';
import TaskDetailsDrawer from './TaskDetailsDrawer.jsx';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
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
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('created_at', today.toISOString());
      if (fetchError) {
        console.error('Error fetching tasks:', fetchError);
        setError(fetchError.message);
      } else {
        setTasks(data || []);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const setupSubscription = async () => {
      const { workspaceId, error: workspaceError } = await getCurrentWorkspaceId();
      if (workspaceError || !workspaceId) {
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Subscribe to tasks changes
      const tasksChannel = supabase
        .channel('tasks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `workspace_id=eq.${workspaceId}`,
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
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup?.then?.(fn => fn?.());
    };
  }, []);

  const columns = ['pending', 'in_progress', 'done', 'failed'];

  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">Today's Task Board</h2>
      </div>
      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading today's tasks...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-medium">Something went wrong</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((status) => (
            <div key={status} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4 capitalize text-black">{status.replace('_', ' ')}</h3>
              <div className="space-y-2">
                {tasksByStatus[status].length === 0 ? (
                  <div className="text-gray-500 text-sm">No tasks</div>
                ) : (
                  tasksByStatus[status].map((task) => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedTask && (
        <TaskDetailsDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}