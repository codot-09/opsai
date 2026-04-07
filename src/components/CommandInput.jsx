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
          placeholder="Type your command..."
          className="w-full min-h-[100px] p-4 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-400 outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          rows={3}
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
        >
          <Send className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </form>
  );
}