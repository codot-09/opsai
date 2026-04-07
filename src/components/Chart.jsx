export default function Chart({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">{title}</p>
          {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
        </div>
      </div>
      <div className="min-h-[280px]">{children}</div>
    </div>
  );
}
