/**
 * Admin Layout — Fixed sidebar (260px) + topbar + scrollable content area.
 * Checks localStorage 'kc_session' for admin role; redirects to /admin/login if not found.
 */
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  BarChart3,
  LogOut,
  Bell,
  ShieldCheck,
} from 'lucide-react';

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/stores', label: 'Stores', icon: Store },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Session check — redirect if no admin session
  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('kc_session') || '{}');
      if (session.role !== 'admin') navigate('/admin/login', { replace: true });
    } catch {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('kc_session');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Fixed Sidebar */}
      <aside className="w-[260px] shrink-0 bg-card border-r flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg text-foreground">KiranaAdmin</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-card border-b px-6 py-3 flex items-center justify-between">
          <h2 className="font-heading font-bold text-foreground">
            {sidebarLinks.find(l => l.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Bell className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-foreground">Admin</span>
            <button
              onClick={handleLogout}
              className="text-sm text-destructive hover:underline font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
