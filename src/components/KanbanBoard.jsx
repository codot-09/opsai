import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
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
          filter: `created_at=gte.${today.toISOString()}`,
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
  }, []);

  const columns = ['pending', 'in_progress', 'done', 'failed'];

  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Today's Task Board</h2>
      </div>
      {loading ? (
        <div className="text-center text-white/60 py-8">Loading today's tasks...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">
          <p className="text-lg font-medium">Something went wrong</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((status) => (
            <div key={status} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="text-lg font-medium mb-4 capitalize">{status.replace('_', ' ')}</h3>
              <div className="space-y-2">
                {tasksByStatus[status].length === 0 ? (
                  <div className="text-white/40 text-sm">No tasks</div>
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