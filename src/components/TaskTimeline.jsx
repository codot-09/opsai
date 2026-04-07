import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskTimeline({ tasks }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'text-green-700';
      case 'in_progress': return 'text-blue-700';
      case 'failed': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="flex-shrink-0">{getStatusIcon(task.status)}</div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.name} ({task.agent})
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}