export default function Topbar({ user, workspaceName, subscriptionStatus, onLogout }) {
  const initials = user?.email?.charAt(0).toUpperCase() || 'O';
  const statusLabel = subscriptionStatus === true ? 'Active' : 'Billing required';

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-gray-500 font-medium">{workspaceName}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-black">Workspace overview</h1>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${subscriptionStatus === true ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">{initials}</div>
          <div>
            <p className="text-xs font-medium text-black">{user?.email ?? 'user@example.com'}</p>
            <p className="text-[10px] text-gray-500">Owner</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-blue-300 bg-blue-600 text-white px-4 py-2 text-xs font-semibold transition hover:bg-blue-700 active:bg-blue-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
