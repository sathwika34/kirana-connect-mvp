/**
 * Admin Dashboard — Summary cards + recent orders with indigo accent.
 */
import { Store, Users, Package, IndianRupee, ShoppingBag, TrendingUp, CheckCircle } from 'lucide-react';
import { getProducts, getOrders, getShop, getCustomerProfile } from '@/lib/store';

const AdminDashboard = () => {
  const shop = getShop();
  const customer = getCustomerProfile();
  const products = getProducts();
  const orders = getOrders();

  const totalStores = shop ? 1 : 0;
  const totalCustomers = customer ? 1 : 0;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
  const activeProducts = products.filter(p => p.available).length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const stats = [
    { label: 'Total Stores', value: totalStores, icon: Store, color: 'bg-indigo-100 text-indigo-600', change: '+2.5%' },
    { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'bg-emerald-100 text-emerald-600', change: '+12%' },
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-amber-100 text-amber-600', change: '+8.1%' },
    { label: 'Platform Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-violet-100 text-violet-600', change: '+15.3%' },
    { label: 'Active Products', value: activeProducts, icon: ShoppingBag, color: 'bg-cyan-100 text-cyan-600', change: '+5%' },
    { label: 'Avg Order Value', value: `₹${avgOrder}`, icon: TrendingUp, color: 'bg-rose-100 text-rose-600', change: '+3.2%' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="admin-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-heading font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="admin-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-gray-900">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No orders yet</td></tr>
              ) : (
                recentOrders.map(o => (
                  <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-gray-700">#{o.id}</td>
                    <td className="px-6 py-3 text-gray-700">{o.customerName}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900">₹{o.totalPrice}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System status */}
      <div className="admin-card p-4 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-500" />
        <span className="text-sm font-medium text-gray-700">All systems operational</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Accepted': 'bg-yellow-100 text-yellow-800',
    'Preparing': 'bg-orange-100 text-orange-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
