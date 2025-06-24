import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchRedeemedVouchers } from "../../services/supabaseLoyaltyService";

export default function VoucherList() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    if (user?.nama) {
      fetchRedeemedVouchers(user.nama).then(setVouchers);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Voucher List</h1>
          {vouchers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎫</div>
              <p className="text-lg text-gray-700 mb-3">Kamu belum punya voucher</p>
              <p className="text-gray-500 mb-6">Tukar poinmu di halaman Loyalty untuk dapatkan reward</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher, idx) => (
                <VoucherCard key={idx} voucher={voucher} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

function VoucherCard({ voucher }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "used": return "bg-gray-500";
      case "expired": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <div className="text-3xl">🎁</div>
        <span className={`px-3 py-1 text-xs text-white rounded-full ${getStatusColor(voucher?.status)}`}>
          {voucher?.status || "Aktif"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{voucher?.nama || "Unnamed Voucher"}</h3>
      <p className="text-sm text-gray-500 mb-2">Berlaku hingga: {voucher?.expired || "Tidak diketahui"}</p>
      <p className="text-sm text-gray-600">{voucher?.deskripsi || "Gunakan voucher ini untuk manfaat eksklusif."}</p>
    </div>
  );
}
