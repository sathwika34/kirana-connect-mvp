/**
 * Admin Users — Two tabs: Customers | Owners with block/suspend actions.
 */
import { useState } from 'react';
import { getCustomerProfile, getOwnerProfile, getShop, getOrders } from '@/lib/store';

type Tab = 'customers' | 'owners';

const AdminUsers = () => {
  const [tab, setTab] = useState<Tab>('customers');
  const [, setTick] = useState(0);

  const customer = getCustomerProfile();
  const owner = getOwnerProfile();
  const shop = getShop();
  const orders = getOrders();

  // Simple block/suspend stored in localStorage
  const getFlag = (key: string) => localStorage.getItem(key) === 'true';
  const toggleFlag = (key: string) => {
    localStorage.setItem(key, getFlag(key) ? 'false' : 'true');
    setTick(t => t + 1);
  };

  const customerBlocked = getFlag('kc_customer_blocked');
  const ownerSuspended = getFlag('kc_owner_suspended');
  const customerOrderCount = customer ? orders.filter(o => o.customerId === customer.id).length : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(['customers', 'owners'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {tab === 'customers' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Orders</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!customer ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No customers yet</td></tr>
              ) : (
                <tr className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{customer.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.mobile}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customerOrderCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      customerBlocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                    }`}>
                      {customerBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleFlag('kc_customer_blocked')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        customerBlocked
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      }`}
                    >
                      {customerBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Shop</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!owner ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No owners yet</td></tr>
              ) : (
                <tr className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{owner.fullName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop?.shopName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      ownerSuspended ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                    }`}>
                      {ownerSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleFlag('kc_owner_suspended')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        ownerSuspended
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      }`}
                    >
                      {ownerSuspended ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
