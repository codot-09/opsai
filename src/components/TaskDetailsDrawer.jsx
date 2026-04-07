import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function TaskDetailsDrawer({ task, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{task.name}</h3>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Input</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 overflow-x-auto border">
                {JSON.stringify(task.input, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Output</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 overflow-x-auto border">
                {JSON.stringify(task.output, null, 2)}
              </pre>
            </div>
            {task.error && (
              <div>
                <h4 className="font-medium text-red-700 mb-2">Error</h4>
                <pre className="bg-red-50 p-3 rounded text-sm text-red-800 overflow-x-auto border border-red-200">
                  {task.error}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}