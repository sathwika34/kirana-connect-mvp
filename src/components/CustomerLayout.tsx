/**
 * Customer Layout — Top navbar + bottom navigation for customer pages.
 * Bottom nav: Home, Stores, Cart, Orders, Profile
 */
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, ShoppingCart, Bell, Store, ArrowLeft, Home, Package, User } from 'lucide-react';
import { getCart, getCustomerNotifications, markCustomerNotifsRead } from '@/lib/store';

const CustomerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = getCart();
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifications = getCustomerNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs) markCustomerNotifsRead();
  };

  const showBack = location.pathname !== '/customer/stores';

  const navItems = [
    { path: '/customer/stores', label: 'Home', icon: Home },
    { path: '/customer/stores', label: 'Stores', icon: Store },
    { path: '/customer/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { path: '/customer/orders', label: 'Orders', icon: Package },
    { path: '/customer/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-1 text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-foreground text-sm">KiranaConnect</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button onClick={handleNotifClick} className="relative p-2 rounded-lg hover:bg-accent transition-colors text-foreground">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="kc-badge">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto animate-fade-in">
                <div className="p-3 border-b font-heading font-bold text-sm text-foreground">Notifications</div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div key={n.id} className="p-3 border-b last:border-0 text-sm text-foreground">
                      {n.message}
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto pb-8">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-card border-t flex items-center justify-around py-2 px-1">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path ||
            (item.label === 'Orders' && location.pathname.startsWith('/customer/order'));
          return (
            <Link key={i} to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <item.icon className="w-5 h-5" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                  {item.badge}
                </span>
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;
