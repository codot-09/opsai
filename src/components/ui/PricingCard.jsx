import { twMerge } from 'tailwind-merge';
import { CheckCircle2 } from 'lucide-react';

export default function PricingCard({ title, price, priceLabel, description, recommended, features, selected, onSelect }) {
  return (
    <div
      className={twMerge(
        'group relative overflow-hidden rounded-[28px] border p-6 transition-shadow hover:shadow-2xl',
        recommended ? 'border-blue-200 bg-blue-50 shadow-blue-100/75' : 'border-gray-200 bg-white',
        selected ? 'ring-2 ring-blue-500/40' : ''
      )}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(event) => {
        if (onSelect && event.key === 'Enter') onSelect();
      }}
    >
      {recommended && (
        <div className="mb-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white">
          Recommended
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-[0.24em]">{title}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-black">{price}</p>
          <p className="mt-2 text-sm text-gray-600">{priceLabel}</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-600">{description}</p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-gray-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {onSelect && (
        <div className="mt-6">
          <div className="rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            {selected ? 'Selected plan' : 'Click to select this plan.'}
          </div>
        </div>
      )}
    </div>
  );
}
