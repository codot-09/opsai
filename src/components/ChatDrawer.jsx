import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

export default function ChatDrawer({ lead, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: true });
    if (fetchError) {
      setError(fetchError.message);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (lead) {
      fetchMessages();
    }
  }, [lead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!lead) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-96 bg-black border-l border-white/10 shadow-xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-white">Chat with {lead.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              className="p-2 rounded-full hover:bg-white/5 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 transition"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-white/60 py-8">Loading messages...</div>
          ) : error ? (
            <div className="text-center text-red-200 py-8">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-white/60 py-8">No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-gray-500' : 'text-blue-100'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}