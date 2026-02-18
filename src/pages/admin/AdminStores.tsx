/**
 * Admin Stores — searchable table of shops with suspend/activate toggle.
 * Reads shop data from existing localStorage. Adds a 'status' field if missing.
 */
import { useState } from 'react';
import { Search } from 'lucide-react';
import { getShop, getOwnerProfile, saveShop, type Shop } from '@/lib/store';

interface ShopWithStatus extends Shop {
  status?: 'active' | 'suspended';
}

const AdminStores = () => {
  const [search, setSearch] = useState('');
  const [, setTick] = useState(0); // force re-render

  const shop = getShop() as ShopWithStatus | null;
  const owner = getOwnerProfile();

  // Build list (currently single-shop system)
  const stores: { shop: ShopWithStatus; ownerName: string }[] = [];
  if (shop) {
    if (!shop.status) shop.status = 'active';
    stores.push({ shop, ownerName: owner?.fullName || 'Unknown' });
  }

  const filtered = stores.filter(s =>
    s.shop.shopName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (s: ShopWithStatus) => {
    s.status = s.status === 'active' ? 'suspended' : 'active';
    saveShop(s);
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search stores…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Shop Name</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Owner</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Area</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No stores found</td></tr>
            ) : (
              filtered.map((item, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{item.shop.shopName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.ownerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.shop.address.area}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.shop.status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {item.shop.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(item.shop)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        item.shop.status === 'active'
                          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {item.shop.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
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

export default AdminStores;
