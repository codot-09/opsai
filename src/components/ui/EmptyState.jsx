export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-600">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">✦</div>
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
