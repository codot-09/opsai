export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-9 w-16 items-center rounded-full border transition ${
        checked ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white transition ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
