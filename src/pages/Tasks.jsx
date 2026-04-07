import { motion } from 'framer-motion';
import KanbanBoard from '../components/KanbanBoard.jsx';

export default function Tasks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-white/40">Tasks</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Today's AI Workflow Board</h2>
            <p className="max-w-2xl text-white/60">Monitor and manage active tasks from the AI command center.</p>
          </div>
        </div>
      </div>
      <KanbanBoard />
    </motion.div>
  );
}
