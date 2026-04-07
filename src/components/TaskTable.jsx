import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import TaskRow from './TaskRow.jsx';

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [commands, setCommands] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [tasksRes, commandsRes] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('commands').select('*')
      ]);

      if (tasksRes.error) {
        console.error(tasksRes.error);
        setTasks([]);
      } else {
        setTasks(tasksRes.data || []);
      }

      if (commandsRes.error) {
        console.error(commandsRes.error);
      } else {
        const commandsMap = {};
        commandsRes.data.forEach(cmd => {
          commandsMap[cmd.id] = cmd;
        });
        setCommands(commandsMap);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (statusFilter && !task.status.toLowerCase().includes(statusFilter.toLowerCase())) return false;
    if (agentFilter && !task.agent.toLowerCase().includes(agentFilter.toLowerCase())) return false;
    return true;
  });

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filter by status"
          className="rounded-3xl border border-white/10 bg-black/90 px-4 py-3 text-white outline-none transition focus:border-white/20"
        />
        <input
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          placeholder="Filter by agent"
          className="rounded-3xl border border-white/10 bg-black/90 px-4 py-3 text-white outline-none transition focus:border-white/20"
        />
      </div>
      {loading ? (
        <div className="text-center text-white/60 py-8">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-white/60 py-8">No tasks found</div>
      ) : (
        <table className="min-w-full text-left text-sm text-white/70">
          <thead>
            <tr className="border-b border-white/10 text-white/60">
              <th className="px-4 py-4">Task Name</th>
              <th className="px-4 py-4">Agent</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                command={commands[task.command_id]}
                statusColor={statusColor}
                isExpanded={expandedTask === task.id}
                onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}