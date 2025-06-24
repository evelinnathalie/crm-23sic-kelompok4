// Navbar.jsx - Desain Profesional dengan warna hijau konsisten
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getJumlahTotal } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard"
      : user?.role === "member"
      ? "/member/dashboard"
      : "/";

  const linkClass = "relative text-sm font-medium text-gray-600 hover:text-[#5A6B3E] transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-[#5A6B3E]/5";
  const activeClass = "text-[#5A6B3E] bg-[#5A6B3E]/8 font-semibold";

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const toggleMobileMenu = () => {
    setOpen(!open);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-2xl shadow-xl border-b border-[#5A6B3E]/10' 
          : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo Section - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 text-[#5A6B3E] group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5A6B3E] to-[#4A5A32] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#5A6B3E] to-[#4A5A32] rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-tight">
                Monochrome
              </span>
              <span className="text-xs font-light text-gray-500 -mt-1 tracking-wider">
                SPACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden lg:flex items-center space-x-2">
            {[
              { path: "/", label: "Home", icon: "🏠" },
              { path: "/menu", label: "Menu", icon: "📋" },
              { path: "/order", label: "Order", icon: "🛒" },
              { path: "/reservation", label: "Reservasi", icon: "📅" },
              { path: "/events", label: "Events", icon: "🎉" }
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
              >
                <span className="hidden xl:inline mr-2">{item.icon}</span>
                {item.label}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#5A6B3E] to-[#4A5A32] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </NavLink>
            ))}

            {/* Dashboard Link - Only for Admin */}
            {user?.role === "admin" && (
              <NavLink 
                to={dashboardLink} 
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
              >
                <span className="hidden xl:inline mr-2">⚙️</span>
                Dashboard
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#5A6B3E] to-[#4A5A32] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </NavLink>
            )}
          </nav>

          {/* Right Section - Enhanced */}
          <div className="flex items-center space-x-4">
            
            {/* Cart Icon - Enhanced */}
            <Link 
              to="/order" 
              className="relative p-3 rounded-xl hover:bg-[#5A6B3E]/10 transition-all duration-300 group"
            >
              <div className="w-6 h-6 text-gray-600 group-hover:text-[#5A6B3E] transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              {getJumlahTotal() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-lg animate-bounce">
                  {getJumlahTotal()}
                </span>
              )}
            </Link>

            {/* Authentication Section */}
            {!user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <NavLink 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#5A6B3E] hover:bg-[#5A6B3E]/5 rounded-lg transition-all duration-300 border border-transparent hover:border-[#5A6B3E]/20"
                >
                  Masuk
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-[#5A6B3E] to-[#4A5A32] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Daftar
                </NavLink>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-[#5A6B3E]/5 rounded-xl border border-[#5A6B3E]/10">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#5A6B3E] to-[#4A5A32] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {user.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium text-gray-700">
                      Halo, {user.nama || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role || "Member"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 border border-transparent hover:border-red-200"
                >
                  Keluar
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-[#5A6B3E]/10 transition-colors"
            >
              <div className="w-6 h-6 text-gray-600">
                {open ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-[#5A6B3E]/10 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {[
                  { path: "/", label: "Home", icon: "🏠" },
                  { path: "/menu", label: "Menu", icon: "📋" },
                  { path: "/order", label: "Order", icon: "🛒" },
                  { path: "/reservation", label: "Reservasi", icon: "📅" },
                  { path: "/events", label: "Events", icon: "🎉" }
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#5A6B3E]/10 text-[#5A6B3E] font-medium' 
                          : 'text-gray-600 hover:bg-[#5A6B3E]/5 hover:text-[#5A6B3E]'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                {user?.role === "admin" && (
                  <NavLink
                    to={dashboardLink}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#5A6B3E]/10 text-[#5A6B3E] font-medium' 
                          : 'text-gray-600 hover:bg-[#5A6B3E]/5 hover:text-[#5A6B3E]'
                      }`
                    }
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Dashboard</span>
                  </NavLink>
                )}
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-[#5A6B3E]/10">
                {!user ? (
                  <div className="space-y-3">
                    <NavLink 
                      to="/login" 
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-600 hover:text-[#5A6B3E] border border-[#5A6B3E]/20 rounded-lg transition-all duration-300"
                    >
                      Masuk
                    </NavLink>
                    <NavLink 
                      to="/register" 
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-3 text-center text-sm font-medium bg-gradient-to-r from-[#5A6B3E] to-[#4A5A32] text-white rounded-lg transition-all duration-300"
                    >
                      Daftar
                    </NavLink>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-[#5A6B3E]/5 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#5A6B3E] to-[#4A5A32] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {user.nama || "User"}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {user.role || "Member"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-center text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-300"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}