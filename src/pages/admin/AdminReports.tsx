/**
 * Admin Reports — Simple stats page with revenue, orders, average, top stores.
 */
import { IndianRupee, Package, TrendingUp, Store, ShoppingBag } from 'lucide-react';
import { getOrders, getProducts, getShop } from '@/lib/store';

const AdminReports = () => {
  const orders = getOrders();
  const products = getProducts();
  const shop = getShop();

  const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeStores = shop ? 1 : 0;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee },
    { label: 'Total Orders', value: totalOrders, icon: Package },
    { label: 'Avg Order Value', value: `₹${avgOrderValue}`, icon: TrendingUp },
    { label: 'Active Stores', value: activeStores, icon: Store },
    { label: 'Active Products', value: products.filter(p => p.available).length, icon: ShoppingBag },
  ];

  // Top stores by revenue (single-store system, so just show it)
  const topStores = shop
    ? [{ name: shop.shopName, revenue: totalRevenue, orders: totalOrders }]
    : [];

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

      {/* Top stores */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-heading font-bold text-foreground">Top Stores by Revenue</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-foreground">#</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Store</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Orders</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topStores.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No data yet</td></tr>
            ) : (
              topStores.map((s, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.orders}</td>
                  <td className="px-4 py-3 font-medium text-foreground">₹{s.revenue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
