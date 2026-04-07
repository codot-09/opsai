import { motion } from 'framer-motion';

const statusStyles = {
  pending: 'bg-white/10 text-white/80',
  in_progress: 'bg-yellow-500/15 text-yellow-300',
  done: 'bg-green-500/15 text-green-300',
  failed: 'bg-red-500/15 text-red-300',
};

export default function TaskCard({ task, onClick }) {
  if (!task) return null;

  const statusLabel = task.status ? task.status.replace('_', ' ') : 'pending';
  const detail = task.description || 'No description available.';

  return (
    <motion.div
      onClick={onClick}
      className="group rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-white mb-1">{task.name}</h4>
          <p className="text-sm text-white/60">{task.agent || 'AI agent'}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${statusStyles[task.status] || 'bg-white/10 text-white/70'}`}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-4 text-xs leading-6 text-white/50 line-clamp-2">{detail}</p>
      <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/40">
        <span>{task.priority ? `${task.priority} priority` : 'Smart task'}</span>
        <span>{task.eta ? new Date(task.eta).toLocaleDateString() : 'Today'}</span>
      </div>
    </motion.div>
  );
}