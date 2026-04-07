import { motion } from 'framer-motion';

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  done: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function TaskCard({ task, onClick }) {
  if (!task) return null;

  const statusLabel = task.status ? task.status.replace('_', ' ') : 'pending';
  const detail = task.description || 'No description available.';

  return (
    <motion.div
      onClick={onClick}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-black mb-1">{task.name}</h4>
          <p className="text-sm text-gray-600">{task.agent || 'AI agent'}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide border ${statusStyles[task.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-4 text-xs leading-6 text-gray-600 line-clamp-2">{detail}</p>
      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-gray-500">
        <span>{task.priority ? `${task.priority} priority` : 'Smart task'}</span>
        <span>{task.eta ? new Date(task.eta).toLocaleDateString() : 'Today'}</span>
      </div>
    </motion.div>
  );
}