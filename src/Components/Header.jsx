import React, { useState } from "react";
import { 
  Search, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown,
  Home,
  ChevronRight,
  Menu
} from "lucide-react";

const Header = () => {
  // Mock data for demonstration
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const user = { username: "Admin User", role: "Super Administrator" }; // Mock user
  const location = { pathname: "/dashboard" }; // Mock location

  // Map path ke nama cantik
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
    menuPublic: "Menu",
    order: "Order",
    events: "Events",
  };

  // Pisah path jadi breadcrumb
  const segments = location.pathname.split("/").filter(Boolean);

  const handleLogout = () => {
    console.log("Logout clicked");
    // localStorage.clear();
    // navigate("/");
    // window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Breadcrumb */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm">
            <div className="flex items-center text-gray-500">
              <Home size={16} className="mr-1" />
              <span>Home</span>
            </div>
            
            {segments.map((segment, index) => {
              const path = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;
              const name = pathNameMap[segment] || segment;

              return (
                <div key={index} className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400 mx-1" />
                  {isLast ? (
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                      {name}
                    </span>
                  ) : (
                    <button className="text-gray-600 hover:text-emerald-600 transition-colors px-2 py-1 rounded hover:bg-gray-50">
                      {name}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari menu, pesanan, pelanggan..."
                className="pl-10 pr-4 py-2.5 w-80 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.username?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={16} className="mr-3 text-gray-400" />
                      Profil Saya
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings size={16} className="mr-3 text-gray-400" />
                      Pengaturan
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <User size={16} />
              <span className="font-medium">Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Dropdown Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;