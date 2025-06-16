import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getJumlahTotal } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "member"
      ? "/member/dashboard"
      : "/";

  const linkClass = "text-sm text-white/90 hover:text-white transition";
  const activeClass = "text-white font-semibold underline";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-[#5A6B3E]/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold tracking-wide text-white">
          Monochrome
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : linkClass}>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? activeClass : linkClass}>Menu</NavLink>
          <NavLink to="/order" className={({ isActive }) => isActive ? activeClass : linkClass}>Order</NavLink>
          <NavLink to="/reservation" className={({ isActive }) => isActive ? activeClass : linkClass}>Reservasi</NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? activeClass : linkClass}>Event</NavLink>

          {user && (
            <NavLink to={dashboardLink} className={({ isActive }) => isActive ? activeClass : linkClass}>
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <NavLink to="/login" className={({ isActive }) => isActive ? activeClass : linkClass}>Login</NavLink>
          ) : (
            <button onClick={handleLogout} className="text-sm text-red-300 hover:underline">
              Logout
            </button>
          )}

          {/* Cart */}
          <Link to="/order" className="relative">
            <span className="text-lg">🛒</span>
            {getJumlahTotal() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getJumlahTotal()}
              </span>
            )}
          </Link>
        </nav>

        {/* Burger Menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-sm text-white bg-[#5A6B3E]">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>Home</NavLink>
          <NavLink to="/menu" onClick={() => setOpen(false)} className={linkClass}>Menu</NavLink>
          <NavLink to="/order" onClick={() => setOpen(false)} className={linkClass}>Order</NavLink>
          <NavLink to="/reservation" onClick={() => setOpen(false)} className={linkClass}>Reservasi</NavLink>
          <NavLink to="/events" onClick={() => setOpen(false)} className={linkClass}>Event</NavLink>
          {user && (
            <NavLink to={dashboardLink} onClick={() => setOpen(false)} className={linkClass}>Dashboard</NavLink>
          )}
          {!user ? (
            <NavLink to="/login" onClick={() => setOpen(false)} className={linkClass}>Login</NavLink>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="text-left text-red-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
