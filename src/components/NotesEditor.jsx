import { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

export default function NotesEditor({ lead, onSave, onCancel }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    setValue(lead.notes || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(lead.id, value);
      setEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(lead.notes || '');
    setEditing(false);
    onCancel?.();
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-lg border border-white/20 bg-black/90 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
          rows={2}
          placeholder="Add a note..."
          disabled={saving}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full p-1 hover:bg-green-500/20 transition"
        >
          <Check className="w-4 h-4 text-green-400" />
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="rounded-full p-1 hover:bg-red-500/20 transition"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-sm text-white/70 truncate max-w-32">
        {lead.notes ? lead.notes : 'Add note...'}
      </span>
      <button
        onClick={handleEdit}
        className="opacity-0 group-hover:opacity-100 rounded-full p-1 hover:bg-white/10 transition"
      >
        <Edit3 className="w-4 h-4 text-white/60" />
      </button>
    </div>
  );
}