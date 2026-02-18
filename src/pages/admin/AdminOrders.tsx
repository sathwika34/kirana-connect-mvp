/**
 * Admin Orders — Table of all orders with status filter and manual status change.
 */
import { useState } from 'react';
import { getOrders, updateOrderStatus, getShop, type Order } from '@/lib/store';

const statuses: Order['status'][] = ['New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];

const statusStyle = (s: string) => {
  switch (s) {
    case 'New': return 'bg-blue-100 text-blue-700';
    case 'Accepted': return 'bg-yellow-100 text-yellow-700';
    case 'Preparing': return 'bg-orange-100 text-orange-700';
    case 'Out for Delivery': return 'bg-purple-100 text-purple-700';
    case 'Delivered': return 'bg-primary/10 text-primary';
    default: return 'bg-muted text-muted-foreground';
  }
};

const AdminOrders = () => {
  const [filter, setFilter] = useState<string>('All');
  const [, setTick] = useState(0);

  const orders = getOrders();
  const shop = getShop();

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Filter:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Order ID</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Shop</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Date</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</td></tr>
            ) : (
              filtered.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">#{o.id}</td>
                  <td className="px-4 py-3 text-foreground">{o.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop?.shopName || '—'}</td>
                  <td className="px-4 py-3 font-medium text-foreground">₹{o.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.status !== 'Delivered' ? (
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value as Order['status'])}
                        className="rounded-lg border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs text-muted-foreground">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
