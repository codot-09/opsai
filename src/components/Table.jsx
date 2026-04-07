export default function Table({ title, subtitle, topRight, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">{title}</p>
          {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
        </div>
        {topRight && <div>{topRight}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
