/**
 * Customer Home Page — Zepto-style premium grocery quick-commerce
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ShoppingBag, Tag, HelpCircle,
  Clock, Package, Store, Heart, Plus, Camera, Mic, MessageCircle,
  Rocket, Leaf, Shield, ChevronRight, Truck, ListChecks, Upload, ChevronDown,
  Bell, User, ChevronLeft, Phone, MessageSquare, BookOpen, Gift, Percent, Sparkles, Star
} from 'lucide-react';
import { getShop, getProducts, getOrders, getCart, saveCart, getCustomerProfile, getCustomerNotifications, type Product } from '@/lib/store';
import { toast } from 'sonner';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
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

/* ── Offers data ── */
const offersData = [
  { title: '50% OFF', subtitle: 'On first order', bg: 'from-yellow-400 to-orange-400', emoji: '🎉' },
  { title: 'FLAT ₹100', subtitle: 'On orders above ₹599', bg: 'from-primary to-emerald-400', emoji: '💚' },
  { title: '30% OFF', subtitle: 'Dairy & Bakery', bg: 'from-teal-400 to-cyan-400', emoji: '🧈' },
  { title: 'BUY 2 GET 1', subtitle: 'On Snacks', bg: 'from-pink-400 to-rose-400', emoji: '🍿' },
  { title: '₹0 Delivery', subtitle: 'Orders above ₹299', bg: 'from-violet-400 to-purple-400', emoji: '🚚' },
];

const CustomerHome = () => {
  const navigate = useNavigate();
  const shop = getShop();
  const stores = shop ? [shop] : [];
  const allProducts = getProducts();
  const availableProducts = allProducts.filter(p => p.available);
  const orders = getOrders();
  const activeOrder = orders.find(o => o.status !== 'Delivered');
  const customer = getCustomerProfile();
  const notifications = getCustomerNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [favourites, setFavourites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kc_fav_shops') || '[]'); } catch { return []; }
  });
  const essentialsRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const [offerIndex, setOfferIndex] = useState(0);

  // Auto-scroll offers
  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex(prev => (prev + 1) % offersData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const scrollHorizontal = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const essentials = availableProducts.slice(0, 6);
  const popular = availableProducts.slice(-6);

  const quickActions = [
    { icon: ListChecks, label: 'Track Order', path: '/customer/orders', color: 'bg-emerald-100 text-emerald-600' },
    { icon: Upload, label: 'Upload List', path: '#', color: 'bg-blue-100 text-blue-600' },
    { icon: MessageCircle, label: 'WhatsApp', path: '#', color: 'bg-green-100 text-green-600' },
    { icon: Heart, label: 'Favourites', path: '#', color: 'bg-rose-100 text-rose-500' },
    { icon: Tag, label: 'Offers', path: '#', color: 'bg-amber-100 text-amber-600' },
    { icon: HelpCircle, label: 'Help', path: '#', color: 'bg-purple-100 text-purple-600' },
  ];

  const statusSteps = ['New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
  const activeProgress = activeOrder
    ? ((statusSteps.indexOf(activeOrder.status) + 1) / statusSteps.length) * 100
    : 0;

  const customerName = customer?.name || 'Guest';

  return (
    <div className="min-h-screen bg-background">

      {/* ═══ STICKY HEADER ═══ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-secondary/60 to-accent/60 border-b border-border/50 shadow-sm -mt-[57px] pt-[57px]"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Welcome, {customerName} 👋
            </h1>
            <button className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="w-3 h-3 text-primary" />
              Hyderabad, Banjara Hills
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/customer/orders')}
              className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition-all"
            >
              <Heart className="w-4.5 h-4.5 text-rose-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition-all"
            >
              <Bell className="w-4.5 h-4.5 text-foreground/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/customer/profile')}
              className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
            >
              <User className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 py-5">

        {/* ═══ 1. HERO PROMO BANNER ═══ */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent via-secondary to-primary/20 p-6 md:p-8 shadow-xl">
            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-4 right-6 text-4xl"
            >🥬</motion.div>
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 0.3 }}
              className="absolute bottom-4 right-16 text-3xl"
            >🍎</motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.6 }}
              className="absolute top-8 right-32 text-2xl hidden md:block"
            >🥛</motion.div>
            <motion.div
              animate={{ y: [0, -7, 0], x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, delay: 1 }}
              className="absolute bottom-6 left-6 text-2xl hidden md:block"
            >🌿</motion.div>

            <div className="relative z-10 max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-3"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Limited Time Offer
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-2">
                The Feel-Good<br />
                <span className="text-primary">Fest 🌿</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80 mb-4">
                <span className="flex items-center gap-1 font-semibold"><Truck className="w-4 h-4 text-primary" />₹0 Delivery</span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 font-semibold"><Shield className="w-4 h-4 text-primary" />₹0 Handling Fee</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/customer/products')}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Shop Now
              </motion.button>
            </div>
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
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <a.icon className="w-5 h-5" />
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
              className="rounded-2xl bg-card border border-border shadow-sm p-5 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden"
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
                <motion.span
                  whileHover={{ x: 4 }}
                  className="text-xs text-primary font-semibold flex items-center gap-1"
                >
                  Track <ChevronRight className="w-3.5 h-3.5" />
                </motion.span>
              </div>
              {/* Progress bar with truck */}
              <div className="relative w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  initial={{ left: '0%' }}
                  animate={{ left: `${Math.max(0, activeProgress - 4)}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <span className="text-sm">🚚</span>
                </motion.div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Order #{activeOrder.id.slice(0, 6)}</p>
              {/* Pulsing glow */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl"
              />
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
                    className="relative rounded-2xl bg-card border border-border shadow-sm p-4 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
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
                    <span className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${storeOpen ? 'bg-primary/10 text-primary shadow-[0_0_8px_hsl(var(--primary)/0.2)]' : 'bg-destructive/10 text-destructive'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${storeOpen ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                      {storeOpen ? 'Open' : 'Closed'}
                    </span>
                    <motion.button
                      whileTap={{ scale: 1.5 }}
                      onClick={e => { e.stopPropagation(); toggleFav(s.shopName); }}
                      className="absolute top-4 right-4"
                    >
                      <Heart className={`w-5 h-5 transition-all duration-300 ${isFav ? 'fill-destructive text-destructive scale-110' : 'text-muted-foreground/40 hover:text-destructive/60'}`} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ═══ 5. DAILY ESSENTIALS ═══ */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Daily Essentials</h2>
            <div className="flex gap-1.5">
              <button onClick={() => scrollHorizontal(essentialsRef, 'left')} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                <ChevronLeft className="w-3.5 h-3.5 text-foreground/60" />
              </button>
              <button onClick={() => scrollHorizontal(essentialsRef, 'right')} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                <ChevronRight className="w-3.5 h-3.5 text-foreground/60" />
              </button>
            </div>
          </div>
          {essentials.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm bg-card rounded-2xl border border-border shadow-sm">
              <Package className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
              No products available.
            </div>
          ) : (
            <div ref={essentialsRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
              {essentials.map(p => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: '0 8px 25px -8px hsl(var(--primary) / 0.15)' }}
                  className="min-w-[160px] md:min-w-[180px] rounded-2xl bg-card border border-border shadow-sm p-3 flex flex-col hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center mb-2">
                    <Package className="w-8 h-8 text-primary/25" />
                  </div>
                  <h3 className="text-xs font-medium text-foreground flex-1 mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-primary text-sm">₹{p.price}</span>
                    <motion.button
                      whileTap={{ scale: 0.7 }}
                      whileHover={{ scale: 1.15 }}
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
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/15 via-accent to-secondary/20 border border-border shadow-lg p-6 text-center">
            {/* Shine effect */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            <div className="relative z-10">
              <div className="flex justify-center gap-5 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.12, 1], y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-12 h-12 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md"
                >
                  <Camera className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.12, 1], y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="w-12 h-12 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md"
                >
                  <Mic className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-bold text-foreground mb-1 text-base">Upload your list 📝</h3>
              <p className="text-xs text-muted-foreground mb-4">Take a photo or speak your items — we'll find them!</p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' }}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Upload Now
              </motion.button>
            </div>
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
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg whitespace-nowrap transition-all duration-200"
            >
              Chat Now
            </motion.button>
          </div>
        </motion.section>

        {/* ═══ 8. POPULAR NEAR YOU ═══ */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Popular Near You</h2>
            <div className="flex gap-1.5">
              <button onClick={() => scrollHorizontal(popularRef, 'left')} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                <ChevronLeft className="w-3.5 h-3.5 text-foreground/60" />
              </button>
              <button onClick={() => scrollHorizontal(popularRef, 'right')} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                <ChevronRight className="w-3.5 h-3.5 text-foreground/60" />
              </button>
            </div>
          </div>
          <div ref={popularRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {popular.map(p => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -4, rotateY: 2 }}
                className="min-w-[155px] rounded-2xl bg-card border border-border shadow-sm p-3 cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/customer/products')}
              >
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center mb-2 relative">
                  <Package className="w-7 h-7 text-primary/25" />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-sm flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" /> Popular
                  </span>
                </div>
                <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1">{p.name}</h3>
                <span className="font-bold text-primary text-sm">₹{p.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ 9. OFFERS SECTION ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-foreground mb-3">🎁 Coupons & Offers</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {offersData.map((offer, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.04, y: -3 }}
                className={`min-w-[160px] md:min-w-[200px] rounded-2xl bg-gradient-to-br ${offer.bg} p-5 text-white shadow-lg cursor-pointer relative overflow-hidden flex-shrink-0`}
              >
                {/* Shimmer */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                />
                <div className="relative z-10">
                  <span className="text-3xl mb-2 block">{offer.emoji}</span>
                  <h3 className="text-xl font-extrabold leading-tight">{offer.title}</h3>
                  <p className="text-xs mt-1 text-white/80 font-medium">{offer.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ 10. HELP & SUPPORT ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="rounded-3xl bg-muted/50 border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Need Help? 💬</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: BookOpen, label: 'FAQs', color: 'bg-blue-100 text-blue-600' },
                { icon: MessageSquare, label: 'Chat Support', color: 'bg-primary/10 text-primary' },
                { icon: Phone, label: 'Call Support', color: 'bg-amber-100 text-amber-600' },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground/80">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══ 11. USP BANNER ═══ */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="rounded-3xl bg-gradient-to-r from-secondary/40 via-accent/30 to-primary/10 border border-border shadow-sm p-6">
            <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
              {[
                { icon: Rocket, text: 'Fast Delivery' },
                { icon: Leaf, text: 'Fresh Products' },
                { icon: Shield, text: 'Trusted Stores' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shadow-[0_0_12px_hsl(var(--primary)/0.15)]">
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
