export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-9 w-16 items-center rounded-full border transition ${
        checked ? 'border-blue-300 bg-blue-100' : 'border-gray-300 bg-gray-200'
      }`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white border border-gray-300 transition ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
