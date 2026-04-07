import { motion } from 'framer-motion';
import { User, Bot, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function MessageBubble({ command }) {
  const isUser = command.user_input && !command.ai_response;
  const isAI = command.ai_response;
  const isProcessing = command.status === 'processing';
  const isCompleted = command.status === 'completed';
  const isFailed = command.status === 'failed';

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-4"
      >
        <div className="flex items-end space-x-2 max-w-[70%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
            <p className="text-sm">{command.user_input}</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-2 self-end">
          {formatTime(command.created_at)}
        </div>
      </motion.div>
    );
  }

  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-start mb-4"
      >
        <div className="flex items-end space-x-2 max-w-[70%]">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              {isProcessing && (
                <>
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-700">Processing...</span>
                </>
              )}
              {isCompleted && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Completed</span>
                </>
              )}
              {isFailed && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">Failed</span>
                </>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{command.ai_response}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-2 self-end">
          {formatTime(command.updated_at || command.created_at)}
        </div>
      </motion.div>
    );
  }

  // Fallback for commands without user_input or ai_response
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center mb-4"
    >
      <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3 shadow-md border border-gray-200 max-w-[70%]">
        <p className="text-sm text-center">Command received</p>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {formatTime(command.created_at)}
        </div>
      </div>
    </motion.div>
  );
}