// src/components/Header.jsx
import React, { useState } from "react";
import {
  Search,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Home as HomeIcon,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function Header() {
  /* ========================================================================= */
  /* 🔖  MOCK data (ganti dengan state/selector asli pada app-mu)              */
  /* ========================================================================= */
  const user = { username: "Admin User", role: "Super Administrator" };
  const [notifications] = useState(3);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ========================================================================= */
  /* 📍  ROUTE info dari react-router-dom                                      */
  /* ========================================================================= */
  const location = useLocation();           // ex: /menu/monochrome
  const navigate = useNavigate();

  /* ========================================================================= */
  /* 🗺️  Peta segmen → label cantik                                           */
  /* ========================================================================= */
  const pathNameMap = {
    dashboard: "Dashboard",
    pesanan: "Kelola Pesanan",
    menu: "Kelola Menu",
    pelanggan: "Pelanggan",
    event: "Event",
    produk: "Produk",
    penjualan: "Penjualan",
    reservasi: "Reservasi",
    promosi: "Promosi",
    member: "Membership",
    stock: "Stock",
    login: "Login",
    register: "Daftar Akun",
    menupublic: "Menu",
    order: "Order",
    events: "Events",
    // tambahkan jika ada route baru
  };

  /* ========================================================================= */
  /* 🔗  Ambil hanya SEGMENT PERTAMA setelah “/”                               */
  /* ========================================================================= */
  const segments = location.pathname.split("/").filter(Boolean); // ["menu","monochrome"]
  const mainSegment = segments[0] || "dashboard";                // default
  const mainLabel = pathNameMap[mainSegment.toLowerCase()] || mainSegment;

  /* ========================================================================= */
  /* 🚪  Logout demo                                                           */
  /* ========================================================================= */
  const handleLogout = () => {
    // TODO: jalankan proses logout asli
    navigate("/login");
  };

  /* ========================================================================= */
  /*                                    RENDER                                 */
  /* ========================================================================= */
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT: Breadcrumb + tombol menu mobile                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center space-x-4">
          {/* Hamburger (mobile) */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm">
            {/* Home link */}
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-emerald-600"
            >
              <HomeIcon size={16} className="mr-1" />
              <span>Home</span>
            </Link>

            <ChevronRight size={16} className="text-gray-400 mx-1" />

            {/* Chip halaman aktif */}
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              {mainLabel}
            </span>
          </nav>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT: Search, notif, profile                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center space-x-4">
          {/* Search desktop */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu, pesanan, pelanggan..."
              className="pl-10 pr-4 py-2.5 w-80 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Search mobile */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={16} className="mr-3 text-gray-400" />
                        Profil Saya
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Pengaturan
                      </button>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-3" />
                        Keluar
                      </button>
                    </div>
                  </div>

                  {/* backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-md"
            >
              <User size={16} />
              <span className="font-medium">Masuk</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search mobile bawah */}
      <div className="sm:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </header>
  );
}
