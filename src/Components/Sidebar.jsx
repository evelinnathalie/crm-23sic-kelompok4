import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  LogOut,
  User2,
  UserPlus,
  Bell,
  Calendar,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard', description: 'Ringkasan bisnis' },
    { name: 'Kelola Pesanan', icon: <ShoppingCart size={18} />, path: '/pesanan', description: 'Pesanan masuk & riwayat', badge: '12' },
    { name: 'Kelola Menu', icon: <Box size={18} />, path: '/menu/monochrome', description: 'Menu & kategori' },
    { name: 'Event', icon: <Calendar size={18} />, path: '/event', description: 'Event dan jadwal' },
    { name: 'Promosi', icon: <UserPlus size={18} />, path: '/promosi', description: 'Voucher & promo aktif' },
    { name: 'Membership', icon: <UserPlus size={18} />, path: '/member', description: 'Program loyalitas' },
    { name: 'Reservasi', icon: <Bell size={18} />, path: '/reservasi', description: 'Booking meja', badge: '3' },
  ];

  const handleLogout = () => {
    navigate('/'); // Redirect ke halaman publik
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-[#646F44] shadow-2xl flex flex-col z-50">
      <div className="flex flex-col justify-between h-full">

        {/* Header Logo */}
        <div>
          <div className="px-6 py-6 border-b border-[#505B36]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-[#646F44] font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Monochrome Space</h1>
                <p className="text-gray-300 text-xs">Restaurant Management</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-[#505B36]">
            <div className="flex items-center gap-3 p-3 bg-[#505B36] rounded-xl">
              <div className="w-8 h-8 bg-[#B5C47B] rounded-full flex items-center justify-center">
                <User2 size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Admin User</p>
                <p className="text-gray-300 text-xs">Super Administrator</p>
              </div>
              <div className="w-2 h-2 bg-green-300 rounded-full" />
            </div>
          </div>

          {/* Menu */}
          <nav className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`group relative rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive(item.path)
                      ? 'bg-white shadow-md transform translate-x-1'
                      : 'hover:bg-[#505B36] hover:translate-x-1'
                  }`}
                >
                  <div className={`flex items-center gap-3 px-4 py-3 ${
                    isActive(item.path) ? 'text-[#646F44]' : 'text-white'
                  }`}>
                    <div className={`flex-shrink-0 ${
                      isActive(item.path) ? 'text-[#99AA66]' : 'text-gray-300'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        isActive(item.path) ? 'text-[#646F44]' : 'text-white'
                      }`}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p className={`text-xs mt-0.5 ${
                          isActive(item.path) ? 'text-[#99AA66]' : 'text-gray-300'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.badge && (
                      <div className="flex-shrink-0">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {item.badge}
                        </span>
                      </div>
                    )}
                    {isActive(item.path) && (
                      <ChevronRight size={16} className="text-[#99AA66] flex-shrink-0" />
                    )}
                  </div>
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#99AA66] rounded-r-full" />
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Logout + Footer */}
        <div>
          <div className="px-4 py-4 border-t border-[#505B36]">
            <div className="space-y-1">
              <div
                onClick={handleLogout}
                className="group relative rounded-xl transition-all duration-200 cursor-pointer hover:bg-red-500/20"
              >
                <div className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200">
                  <LogOut size={18} />
                  <span className="font-medium text-sm">Keluar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#505B36]">
            <div className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Monochrome Space
              <br />
              v2.1.0
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
