import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  // Belum login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Login tapi bukan role yang sesuai
  if (role && user.role !== role) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-sm">Halaman ini hanya bisa diakses oleh role <strong>{role}</strong>.</p>
        </div>
      </div>
    );
  }

  return children;
}
