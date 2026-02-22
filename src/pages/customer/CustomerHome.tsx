/**
 * Customer Home Page — Premium 2025 Indian quick-commerce style
 * 9 sections: Location+Search, Quick Actions, Active Order, Favourite Shops,
 * Daily Essentials, Upload List, WhatsApp Order, Popular Near You, USP Banner
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Search, ShoppingBag, Wallet, Tag, Users, HelpCircle, RefreshCw,
  Clock, Package, Store, Heart, Plus, Camera, Mic, MessageCircle,
  Rocket, Leaf, Shield, ChevronRight, Truck
} from 'lucide-react';
import { getShop, getProducts, getOrders, getCustomerProfile, getCart, saveCart, type CartItem, type Product } from '@/lib/store';
import { toast } from 'sonner';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: { scale: 1.03, boxShadow: '0 8px 25px rgba(0,0,0,0.12)', transition: { duration: 0.2 } },
};

/* ── helpers ── */
const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};
const isOpen = (open: string, close: string) => {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  return cur >= oh * 60 + om && cur <= ch * 60 + cm;
};

const CustomerHome = () => {
  const navigate = useNavigate();
  const shop = getShop();
  const stores = shop ? [shop] : [];
  const allProducts = getProducts();
  const availableProducts = allProducts.filter(p => p.available);
  const customer = getCustomerProfile();
  const orders = getOrders();
  const activeOrder = orders.find(o => o.status !== 'Delivered');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kc_fav_shops') || '[]'); } catch { return []; }
  });

  const toggleFav = (name: string) => {
    setFavourites(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      localStorage.setItem('kc_fav_shops', JSON.stringify(next));
      return next;
    });
  };

  const addToCart = (product: Product) => {
    const cart = getCart();
    const existing = cart.find(c => c.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    saveCart(cart);
    toast.success(`${product.name} added to cart`);
  };

  /* daily essentials — first 6 available */
  const essentials = availableProducts.slice(0, 6);
  /* popular — last 6 available */
  const popular = availableProducts.slice(-6);

  const quickActions = [
    { icon: ShoppingBag, label: 'My Orders', path: '/customer/orders' },
    { icon: Wallet, label: 'Wallet', path: '#' },
    { icon: Tag, label: 'Offers', path: '#' },
    { icon: Users, label: 'Refer', path: '#' },
    { icon: HelpCircle, label: 'Help', path: '#' },
    { icon: RefreshCw, label: 'Subscribe', path: '#' },
  ];

  /* progress for active order */
  const statusSteps = ['New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
  const activeProgress = activeOrder
    ? ((statusSteps.indexOf(activeOrder.status) + 1) / statusSteps.length) * 100
    : 0;

  return (
    <div className="space-y-5 pb-8">

      {/* ═══ 1. LOCATION + SEARCH (sticky) ═══ */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible" className="sticky top-[57px] z-10 -mx-4 md:-mx-6 px-4 md:px-6 pt-3 pb-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2 mb-2.5">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">Delivering to</p>
            <p className="text-[11px] text-muted-foreground">Hyderabad, Banjara Hills</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
        </div>
        <motion.div
          animate={{ scale: searchFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for atta, dal, snacks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm transition-all"
          />
        </motion.div>
      </motion.section>

      {/* ═══ 2. QUICK ACTIONS ═══ */}
      <motion.section variants={stagger} initial="hidden" animate="visible">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {quickActions.map((a, i) => (
            <motion.button
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => a.path !== '#' && navigate(a.path)}
              className="flex flex-col items-center gap-1.5 min-w-[72px] px-3 py-3 rounded-xl bg-card border border-border shadow-sm hover:bg-accent transition-colors"
            >
              <a.icon className="w-5 h-5 text-primary" />
              <span className="text-[11px] font-medium text-foreground whitespace-nowrap">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ═══ 3. ACTIVE ORDER TRACKING ═══ */}
      {activeOrder && (
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <motion.div
            initial="rest" whileHover="hover" variants={cardHover}
            className="rounded-2xl bg-card border border-border p-4 cursor-pointer"
            onClick={() => navigate(`/customer/order/${activeOrder.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-foreground">Your order is on the way!</span>
              </div>
              <span className="text-xs text-muted-foreground">{activeOrder.status}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${activeProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Order #{activeOrder.id.slice(0, 6)}</span>
              <span className="text-primary font-semibold">Track →</span>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* ═══ 4. FAVOURITE SHOPS ═══ */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-base font-heading font-bold text-foreground mb-2">Favourite Shops</h2>
        {stores.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stores available yet.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {stores.map((s, i) => {
              const open = isOpen(s.openingTime, s.closingTime);
              const isFav = favourites.includes(s.shopName);
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="rest" whileHover="hover"
                  className="relative min-w-[180px] rounded-2xl bg-card border border-border p-3 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/customer/products')}
                >
                  <div className="w-full h-20 rounded-xl bg-accent flex items-center justify-center mb-2">
                    <Store className="w-8 h-8 text-primary/40" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground truncate">{s.shopName}</h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {s.address.area}
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatTime(s.openingTime)} – {formatTime(s.closingTime)}
                  </p>
                  <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${open ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {open ? 'Open' : 'Closed'}
                  </span>
                  {/* Fav heart */}
                  <motion.button
                    whileTap={{ scale: 1.4 }}
                    onClick={e => { e.stopPropagation(); toggleFav(s.shopName); }}
                    className="absolute top-3 right-3"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* ═══ 5. DAILY ESSENTIALS ═══ */}
      <motion.section variants={stagger} initial="hidden" animate="visible">
        <h2 className="text-base font-heading font-bold text-foreground mb-2">Daily Essentials</h2>
        {essentials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm bg-card rounded-2xl border border-border">
            <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {essentials.map(p => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}
                className="rounded-2xl bg-card border border-border p-3 flex flex-col shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-full aspect-square rounded-xl bg-accent flex items-center justify-center mb-2">
                  <Package className="w-8 h-8 text-primary/30" />
                </div>
                <h3 className="text-sm font-medium text-foreground flex-1 mb-0.5 line-clamp-2">{p.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-heading font-bold text-foreground">₹{p.price}</span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => addToCart(p)}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ═══ 6. UPLOAD LIST ═══ */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl bg-accent border border-border p-5 text-center">
          <div className="flex justify-center gap-4 mb-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <Camera className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.4 }}>
              <Mic className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          <h3 className="font-heading font-bold text-foreground mb-1">Upload your list 📝</h3>
          <p className="text-xs text-muted-foreground mb-3">Take a photo or speak your items — we'll find them!</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md"
          >
            Upload Now
          </motion.button>
        </div>
      </motion.section>

      {/* ═══ 7. WHATSAPP ORDER ═══ */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-foreground text-sm">Order via WhatsApp</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Send your list — super fast & easy!</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-md whitespace-nowrap"
          >
            Chat Now
          </motion.button>
        </div>
      </motion.section>

      {/* ═══ 8. POPULAR NEAR YOU ═══ */}
      <motion.section variants={stagger} initial="hidden" animate="visible">
        <h2 className="text-base font-heading font-bold text-foreground mb-2">Popular Near You</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {popular.map(p => (
            <motion.div
              key={p.id}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className="min-w-[150px] rounded-2xl bg-card border border-border p-3 shadow-sm cursor-pointer"
              onClick={() => navigate('/customer/products')}
            >
              <div className="w-full aspect-square rounded-xl bg-accent flex items-center justify-center mb-2 relative">
                <Package className="w-7 h-7 text-primary/30" />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">Popular</span>
              </div>
              <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1">{p.name}</h3>
              <span className="font-heading font-bold text-foreground text-sm">₹{p.price}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 9. USP BANNER ═══ */}
      <motion.section variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-2xl bg-accent p-5">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Rocket, text: '10-min delivery' },
              { icon: Leaf, text: 'Fresh & fair prices' },
              { icon: Shield, text: '100% Hygiene' },
            ].map((item, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <item.icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default CustomerHome;
