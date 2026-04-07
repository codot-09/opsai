export default function Chart({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-medium">{title}</p>
          {subtitle && <p className="mt-2 text-xs text-gray-600">{subtitle}</p>}
        </div>
      </div>
      <div className="min-h-[280px]">{children}</div>
    </div>
  );
}
