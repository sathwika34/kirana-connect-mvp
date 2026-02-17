import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import RoleSelection from "./pages/RoleSelection";
import OwnerLogin from "./pages/owner/OwnerLogin";
import ShopSetup from "./pages/owner/ShopSetup";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProducts from "./pages/owner/OwnerProducts";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerProfile from "./pages/owner/OwnerProfile";
import CustomerLogin from "./pages/customer/CustomerLogin";
import StoreSelection from "./pages/customer/StoreSelection";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CartPage from "./pages/customer/CartPage";
import OrderTracking from "./pages/customer/OrderTracking";
import NotFound from "./pages/NotFound";

// Layouts
import OwnerLayout from "./components/OwnerLayout";
import CustomerLayout from "./components/CustomerLayout";

// Initialize seed data
import "./lib/store";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Role Selection */}
          <Route path="/" element={<RoleSelection />} />

          {/* Owner Flow */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/shop-setup" element={<ShopSetup />} />
          <Route path="/owner" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="products" element={<OwnerProducts />} />
            <Route path="orders" element={<OwnerOrders />} />
            <Route path="profile" element={<OwnerProfile />} />
          </Route>

          {/* Customer Flow */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="stores" element={<StoreSelection />} />
            <Route path="products" element={<CustomerProducts />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="order/:orderId" element={<OrderTracking />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
