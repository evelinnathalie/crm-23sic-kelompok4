import React from "react";
import { Routes, Route } from "react-router-dom";

// 🌐 Contexts
import { AuthProvider } from "./punya_public/context/AuthContext";
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

// 🌐 Public pages (from punya_public)
import HomePublic from "./punya_public/pages/HomePublic";
import MenuPublic from "./punya_public/pages/MenuPublic";
import OrderPublic from "./punya_public/pages/OrderPublic";
import ReservationPublic from "./punya_public/pages/ReservationPublic";
import EventPublic from "./punya_public/pages/EventPublic";
import LoginPublic from "./punya_public/pages/LoginPublic";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ✅ PUBLIC ROUTES (tidak perlu login) */}
          <Route path="/" element={<HomePublic />} />
          <Route path="/menu" element={<MenuPublic />} />
          <Route path="/order" element={<OrderPublic />} />
          <Route path="/reservation" element={<ReservationPublic />} />
          <Route path="/events" element={<EventPublic />} />
          <Route path="/login" element={<LoginPublic />} />

          {/* 🔒 ADMIN ROUTES (butuh login) */}
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
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
