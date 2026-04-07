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
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-4 xl:flex xl:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-600">
          O
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Workspace</p>
          <p className="text-sm font-semibold text-black">OpsAI HQ</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
