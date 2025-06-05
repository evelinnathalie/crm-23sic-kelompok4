import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  BarChart2,
  Settings,
  LogIn,
  UserPlus,
  User2,

  Bell,

  CarTaxiFront,
  Bell,
  Camera,

} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
  { name: 'Kelola Pesanan', icon: <ShoppingCart />, path: '/pesanan' },
  { name: 'Kelola Menu', icon: <Box />, path: '/menu' },
  { name: 'Pelanggan', icon: <User2 />, path: '/pelanggan' },

  { name: 'Event', icon: <Bell />, path: '/event'},

  { name: 'Penjualan', icon: <ShoppingCart />, path: '/penjualan' },
  { name: 'Laporan', icon: <BarChart2 />, path: '/laporan' },
  { name: 'Reservasi', icon: <Bell/>, path: '/reservasi' },

]

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
]

const Sidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="bg-[#697549] w-64 h-screen shadow-lg px-4 py-6 hidden md:block">
      <div className="text-xl font-bold mb-8 text-white">Monochrome Space</div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-white text-[#697549] font-semibold'
                : 'text-white hover:bg-[#5a643d]'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 text-xs font-semibold text-gray-200">AKUN</div>

      <nav className="mt-2 space-y-1">
        {accountItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-white text-[#697549] font-semibold'
                : 'text-white hover:bg-[#5a643d]'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
