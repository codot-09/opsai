export default function Topbar({ user, workspaceName, onLogout }) {
  const initials = user?.email?.charAt(0).toUpperCase() || 'O';

  return (
    <div className="flex flex-col gap-4 border-b border-white/10 bg-black/80 px-6 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-white/40">{workspaceName}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">{initials}</div>
          <div>
            <p className="text-sm font-medium text-white">{user?.email ?? 'user@example.com'}</p>
            <p className="text-xs text-white/50">Owner</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-3xl border border-white/10 bg-white text-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-white/90"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
