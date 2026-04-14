export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
