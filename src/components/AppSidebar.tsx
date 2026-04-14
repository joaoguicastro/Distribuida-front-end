import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCog, FileText, AlertTriangle, LogOut, Heart,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import { cn } from '@/lib/utils';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Pacientes' },
  { to: '/records', icon: FileText, label: 'Prontuários' },
  { to: '/triage', icon: AlertTriangle, label: 'Triagem' },
];

const adminLinks = [
  { to: '/users', icon: UserCog, label: 'Usuários' },
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
    );

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-5 flex items-center gap-2">
        <Heart className="h-7 w-7 text-sidebar-primary" />
        <span className="text-xl font-bold text-sidebar-foreground">HealthSys</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
        {isAdmin && adminLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </aside>
  );
}
