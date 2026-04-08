import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { getCurrentWorkspaceId } from '../lib/workspace.js';
import MessageBubble from './MessageBubble.jsx';

export default function ChatPanel({ lead }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!lead) return;
    setLoading(true);
    
    const workspaceId = await getCurrentWorkspaceId();
    if (!workspaceId) {
      console.error('No workspace found');
      setMessages([]);
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', lead.id)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error(error);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [lead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        Select a lead to view conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div>
          <h3 className="text-lg font-semibold text-black">{lead.name}</h3>
          <span className="text-sm text-gray-600">{lead.status}</span>
        </div>
        <button
          onClick={fetchMessages}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-600">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-600">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}