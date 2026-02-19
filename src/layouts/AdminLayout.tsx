/**
 * Admin Layout — Dark indigo sidebar (280px) + white topbar + scrollable content.
 * Checks localStorage 'kc_session' for admin role; redirects to /admin/login if not found.
 */
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  UserCog,
  Package,
  BarChart3,
  LogOut,
  Bell,
  ShieldCheck,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/stores', label: 'Stores', icon: Store },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/owners', label: 'Owners / Kirana', icon: UserCog },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const currentLabel = sidebarLinks.find(l => l.path === location.pathname)?.label || 'Admin';

  return (
    <div className="admin-theme min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-[280px] shrink-0 h-screen flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'hsl(224, 71%, 10%)' }}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-white">KiranaConnect</span>
            <span className="block text-[11px] text-indigo-300 font-medium -mt-0.5">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-bold text-gray-900 text-lg">{currentLabel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:block text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
