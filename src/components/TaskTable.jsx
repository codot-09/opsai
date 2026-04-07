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
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          placeholder="Filter by agent"
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No tasks found</div>
      ) : (
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
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