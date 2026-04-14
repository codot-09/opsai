export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
