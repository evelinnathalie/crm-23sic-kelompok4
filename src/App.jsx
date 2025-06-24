// App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// 🌐 Contexts
import { AuthProvider, useAuth } from "./punya_public/context/AuthContext";
import { CartProvider } from "./punya_public/context/CartContext";

// 🔐 Protected route handler
import ProtectedRoute from "./punya_public/routes/ProtectedRoute";

// 🧑‍💼 Admin layout & pages
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import Pesanan from "./Pages/Pesanan";
import Menu from "./Pages/Menu";
import CustomerManagement from "./Pages/CustomerManagement";
import EventManagement from "./Pages/Event";
import ProductManagement from "./Pages/ProdukManagement";
import SalesManagement from "./Pages/SalesManagement";
import Reservasi from "./Pages/Reservasi";
import PromoManagement from "./Pages/Promosi";
import MemberManagement from "./Pages/Membership";
import Stock from "./Pages/Stock";

// 🌐 Public pages
import HomePublic from "./punya_public/pages/HomePublic";
import MenuPublic from "./punya_public/pages/MenuPublic";
import OrderPublic from "./punya_public/pages/OrderPublic";
import ReservationPublic from "./punya_public/pages/ReservationPublic";
import EventPublic from "./punya_public/pages/EventPublic";
import LoginPublic from "./punya_public/pages/LoginPublic";
import RegisterPublic from "./punya_public/pages/RegisterPublic";
import HomeWithLoyalty from "./punya_public/pages/HomeWithLoyalty";
import VoucherList from "./punya_public/pages/VoucherList";

// 🧠 Main app structure with context
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

// 🌐 Routes with role-aware logic
function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<ConditionalHome />} />
      <Route path="/menu" element={<MenuPublic />} />
      <Route path="/order" element={<OrderPublic />} />
      <Route path="/reservation" element={<ReservationPublic />} />
      <Route path="/events" element={<EventPublic />} />

      {/* 🔐 Auth Logic */}
      <Route
        path="/login"
        element={
          !user ? (
            <LoginPublic />
          ) : user.role === "admin" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <RegisterPublic /> : <Navigate to="/" replace />}
      />

      {/* 🔐 Member-only route */}
      <Route
        path="/voucher"
        element={
          <ProtectedRoute role="member">
            <VoucherList />
          </ProtectedRoute>
        }
      />

      {/* 🔐 Admin-only route (wrap MainLayout) */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/menu/monochrome" element={<Menu />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/event" element={<EventManagement />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/reservasi" element={<Reservasi />} />
        <Route path="/promosi" element={<PromoManagement />} />
        <Route path="/member" element={<MemberManagement />} />
        <Route path="/stock" element={<Stock />} />
      </Route>

      {/* 🔚 Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// 🏠 Home berbeda sesuai role
function ConditionalHome() {
  const { user } = useAuth();
  if (user?.role === "member") return <HomeWithLoyalty />;
  return <HomePublic />;
}

export default App;
