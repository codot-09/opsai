import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, CheckSquare, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', to: '/leads', icon: Users },
  { label: 'Chat', to: '/chat', icon: MessageSquare },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/90 p-6 xl:flex xl:flex-col">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 text-white">
          O
        </div>
        <div>
          <p className="text-sm text-white/50">Workspace</p>
          <p className="text-lg font-semibold">OpsAI HQ</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl border px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? 'border-white/20 bg-white/5 text-white shadow-sm shadow-white/5'
                    : 'border-white/5 text-white/70 hover:border-white/20 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
