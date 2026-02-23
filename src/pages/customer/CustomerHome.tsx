/**
 * Customer Home Page — Premium grocery quick-commerce with hero banner
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Search, ShoppingBag, Tag, HelpCircle,
  Clock, Package, Store, Heart, Plus, Camera, Mic, MessageCircle,
  Rocket, Leaf, Shield, ChevronRight, Truck, ListChecks, Upload, ChevronDown
} from 'lucide-react';
import { getShop, getProducts, getOrders, getCart, saveCart, type Product } from '@/lib/store';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-grocery.jpg';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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
  const orders = getOrders();
  const activeOrder = orders.find(o => o.status !== 'Delivered');
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kc_fav_shops') || '[]'); } catch { return []; }
  });
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (existing) existing.quantity += 1;
    else cart.push({ product, quantity: 1 });
    saveCart(cart);
    toast.success(`${product.name} added to cart`);
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const essentials = availableProducts.slice(0, 6);
  const popular = availableProducts.slice(-6);

  const quickActions = [
    { icon: ListChecks, label: 'Track Order', path: '/customer/orders' },
    { icon: Upload, label: 'Upload List', path: '#' },
    { icon: MessageCircle, label: 'WhatsApp Order', path: '#' },
    { icon: Heart, label: 'Favourites', path: '#' },
    { icon: Tag, label: 'Offers', path: '#' },
    { icon: HelpCircle, label: 'Help', path: '#' },
  ];

  const statusSteps = ['New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
  const activeProgress = activeOrder
    ? ((statusSteps.indexOf(activeOrder.status) + 1) / statusSteps.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative w-full h-[70vh] min-h-[420px] max-h-[600px] overflow-hidden -mt-[57px]">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Fresh groceries" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6"
          >
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Welcome to <span className="text-primary">KiranaConnect</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mb-8">
            Explore fresh groceries from trusted local stores
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContent}
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Stores
          </motion.button>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-8"
          >
            <ChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 py-8">

        {/* ═══ 1. LOCATION + SEARCH ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Delivering to</p>
              <p className="text-[11px] text-muted-foreground">Hyderabad, Banjara Hills</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for atta, dal, snacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border shadow-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.01] transition-all duration-300"
            />
          </div>
        </motion.section>

        {/* ═══ 2. QUICK ACTIONS ═══ */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((a, i) => (
              <motion.button
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => a.path !== '#' && navigate(a.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] font-medium text-foreground/80 whitespace-nowrap">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ═══ 3. ACTIVE ORDER ═══ */}
        {activeOrder && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl bg-card border border-border shadow-sm p-5 cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/customer/order/${activeOrder.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">Your order is on the way!</span>
                    <p className="text-xs text-muted-foreground">{activeOrder.status}</p>
                  </div>
                </div>
                <span className="text-xs text-primary font-semibold">Track →</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Order #{activeOrder.id.slice(0, 6)}</p>
            </motion.div>
          </motion.section>
        )}

        {/* ═══ 4. FAVOURITE SHOPS ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-foreground mb-3">Favourite Shops</h2>
          {stores.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stores available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((s, i) => {
                const storeOpen = isOpen(s.openingTime, s.closingTime);
                const isFav = favourites.includes(s.shopName);
                return (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    whileHover={{ y: -4 }}
                    className="relative rounded-2xl bg-card border border-border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/customer/products')}
                  >
                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center mb-3">
                      <Store className="w-10 h-10 text-primary/30" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground truncate">{s.shopName}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.address.area}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(s.openingTime)} – {formatTime(s.closingTime)}</span>
                    </div>
                    <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${storeOpen ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {storeOpen ? 'Open' : 'Closed'}
                    </span>
                    <motion.button
                      whileTap={{ scale: 1.4 }}
                      onClick={e => { e.stopPropagation(); toggleFav(s.shopName); }}
                      className="absolute top-4 right-4"
                    >
                      <Heart className={`w-5 h-5 transition-colors duration-200 ${isFav ? 'fill-destructive text-destructive' : 'text-muted-foreground/40'}`} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ═══ 5. DAILY ESSENTIALS ═══ */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-foreground mb-3">Daily Essentials</h2>
          {essentials.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm bg-card rounded-2xl border border-border shadow-sm">
              <Package className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
              No products available.
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {essentials.map(p => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="min-w-[160px] md:min-w-[180px] rounded-2xl bg-card border border-border shadow-sm p-3 flex flex-col hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center mb-2">
                    <Package className="w-8 h-8 text-primary/25" />
                  </div>
                  <h3 className="text-xs font-medium text-foreground flex-1 mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-foreground text-sm">₹{p.price}</span>
                    <motion.button
                      whileTap={{ scale: 0.75 }}
                      onClick={() => addToCart(p)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
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
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border shadow-sm p-6 text-center">
            <div className="flex justify-center gap-5 mb-3">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                <Camera className="w-6 h-6 text-secondary" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
            <h3 className="font-bold text-foreground mb-1">Upload your list 📝</h3>
            <p className="text-xs text-muted-foreground mb-4">Take a photo or speak your items — we'll find them!</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Upload Now
            </motion.button>
          </div>
        </motion.section>

        {/* ═══ 7. WHATSAPP ORDER ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="rounded-2xl bg-card border border-border shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-sm">Order via WhatsApp</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Send your list — super fast & easy!</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg whitespace-nowrap transition-all duration-200"
            >
              Chat Now
            </motion.button>
          </div>
        </motion.section>

        {/* ═══ 8. POPULAR NEAR YOU ═══ */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-foreground mb-3">Popular Near You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {popular.map(p => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="min-w-[155px] rounded-2xl bg-card border border-border shadow-sm p-3 cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/customer/products')}
              >
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center mb-2 relative">
                  <Package className="w-7 h-7 text-primary/25" />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-sm">Popular</span>
                </div>
                <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1">{p.name}</h3>
                <span className="font-bold text-foreground text-sm">₹{p.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ 9. USP BANNER ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border shadow-sm p-6">
            <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
              {[
                { icon: Rocket, text: 'Fast Delivery' },
                { icon: Leaf, text: 'Fresh Products' },
                { icon: Shield, text: 'Trusted Stores' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default CustomerHome;
