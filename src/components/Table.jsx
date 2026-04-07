export default function Table({ title, subtitle, topRight, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-medium">{title}</p>
          {subtitle && <p className="mt-2 text-xs text-gray-600">{subtitle}</p>}
        </div>
        {topRight && <div>{topRight}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
