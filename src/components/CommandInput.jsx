import { useState } from 'react';
import { Send } from 'lucide-react';

export default function CommandInput({ onSubmit }) {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command.trim());
      setCommand('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your command... (e.g., 'Send message to all leads')"
          className="w-full min-h-[120px] p-4 pr-12 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 outline-none resize-none focus:border-white/20 transition"
          rows={3}
        />
        <button
          type="submit"
          className="absolute bottom-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </form>
  );
}