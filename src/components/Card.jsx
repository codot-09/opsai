import { twMerge } from 'tailwind-merge';

export default function Card({ title, value, icon: Icon, className, children }) {
  return (
    <div className={twMerge('rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm transition hover:border-white/20', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white/80">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {children && <div className="mt-4 text-sm text-white/60">{children}</div>}
    </div>
  );
}
