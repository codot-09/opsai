import { useEffect, useRef, useState } from 'react';

const statuses = ['new', 'contacted', 'enrolled', 'lost'];

const statusColors = {
  new: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-100' },
  contacted: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', hover: 'hover:bg-purple-100' },
  enrolled: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', hover: 'hover:bg-green-100' },
  lost: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', hover: 'hover:bg-red-100' },
};

export default function StatusBadge({ status, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef();
  const currentStatus = status || 'new';
  const colors = statusColors[currentStatus];

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
        className={`inline-flex cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}`}
      >
        {currentStatus}
      </span>
      {isEditing && (
        <div className="absolute top-full mt-2 z-10 bg-white border border-gray-200 rounded-2xl p-2 shadow-lg">
          {statuses.map((s) => {
            const sColors = statusColors[s];
            return (
              <button
                key={s}
                onClick={() => handleChange(s)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition ${sColors.text} ${sColors.hover}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
