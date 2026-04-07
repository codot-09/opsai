import { twMerge } from 'tailwind-merge';

export default function Card({ title, value, icon: Icon, className, children }) {
  return (
    <div className={twMerge('rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-medium">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-black">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {children && <div className="mt-4 text-xs text-gray-600">{children}</div>}
    </div>
  );
}
