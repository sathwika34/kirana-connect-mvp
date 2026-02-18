/**
 * Admin Dashboard — Summary cards reading from existing localStorage keys.
 */
import { Store, Users, Package, IndianRupee, ShoppingBag, CheckCircle } from 'lucide-react';
import { getProducts, getOrders, getShop, getOwnerProfile, getCustomerProfile } from '@/lib/store';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

const AdminDashboard = () => {
  const shop = getShop();
  const owner = getOwnerProfile();
  const customer = getCustomerProfile();
  const products = getProducts();
  const orders = getOrders();

  const totalStores = shop ? 1 : 0;
  const totalCustomers = customer ? 1 : 0;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
  const activeProducts = products.filter(p => p.available).length;

  const stats: StatCard[] = [
    { label: 'Total Stores', value: totalStores, icon: Store },
    { label: 'Total Customers', value: totalCustomers, icon: Users },
    { label: 'Total Orders', value: totalOrders, icon: Package },
    { label: 'Platform Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee },
    { label: 'Active Products', value: activeProducts, icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* System status */}
      <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-foreground">All systems operational</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
