/**
 * Customer Layout — Top navbar for customer pages.
 */
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, ShoppingCart, Bell, Store, ArrowLeft, LogOut } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
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

          {/* Cart */}
          <Link to="/customer/cart" className="relative p-2 rounded-lg hover:bg-accent transition-colors text-foreground">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <span className="kc-badge">{cartCount}</span>}
          </Link>

          {/* Exit */}
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-accent transition-colors text-foreground">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
