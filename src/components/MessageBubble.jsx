export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
          isUser ? 'bg-gray-100 text-gray-900' : 'bg-gray-700 text-white'
        }`}
      >
        <p className="leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-gray-500' : 'text-gray-300'}`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}