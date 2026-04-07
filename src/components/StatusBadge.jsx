import { useEffect, useRef, useState } from 'react';

const statuses = ['new', 'contacted', 'enrolled', 'lost'];

export default function StatusBadge({ status, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (newStatus) => {
    onChange(newStatus);
    setIsEditing(false);
  };

  return (
    <div className="relative" ref={ref}>
      <span
        onClick={() => setIsEditing(true)}
        className={`inline-flex cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
          status === 'new' ? 'bg-gray-500 text-white border-gray-500' :
          status === 'contacted' ? 'bg-blue-500 text-white border-blue-500' :
          status === 'enrolled' ? 'bg-green-500 text-white border-green-500' :
          status === 'lost' ? 'bg-red-500 text-white border-red-500' :
          'bg-gray-500 text-white border-gray-500'
        }`}
      >
        {status || 'new'}
      </span>
      {isEditing && (
        <div className="absolute top-full mt-1 z-10 bg-black border border-white/10 rounded-lg p-2 shadow-lg">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleChange(s)}
              className="block w-full text-left px-3 py-1 text-sm text-white hover:bg-white/5 rounded"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}