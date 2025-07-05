import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";

export default function OrderPublic() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({ nama: "", nomor: "", tipe: "dine-in" });
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama: user.nama || "",
        nomor: user.nomor || "",
      }));
    }
  }, [user]);

  const total = cart.reduce((sum, i) => sum + i.harga * i.jumlah, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomor.match(/^08\d{8,12}$/)) {
      alert("Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx");
      return;
    }
    if (!agree) {
      alert("Harap centang persetujuan ketentuan pesanan");
      return;
    }

    setIsProcessing(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            nama: form.nama,
            phone: form.nomor,
            type: form.tipe === "dine-in" ? "Dine In" : "Takeaway",
            items: cart.map((i) => `${i.nama} × ${i.jumlah}`).join(", "),
            total,
            status: "Diproses",
            created_at: new Date().toISOString(),
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const totalItem = cart.reduce((sum, item) => sum + item.jumlah, 0);
      const poin = totalItem * 2;

      const { data: existing } = await supabase
        .from("loyalty")
        .select("id, poin")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("loyalty")
          .update({ poin: existing.poin + poin, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("loyalty").insert([
          {
            customer: user.nama,
            poin,
            user_id: user.id,
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      const { error: historyError } = await supabase.from("loyalty_history").insert([
        {
          nama: user.nama,
          keterangan: `Order ${totalItem} item`,
          poin,
          tanggal: new Date().toISOString().slice(0, 10),
          user_id: user.id,
        },
      ]);
      
      if (historyError) {
        console.error("Gagal mencatat histori poin:", historyError.message);
        alert("Gagal mencatat histori poin: " + historyError.message);
      } else {
        console.log("Histori poin berhasil disimpan!");
      }
      

      setCart([]);
      setSubmitted(true);
      setLastOrder({ ...order, poin });
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pesanan. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
                <p className="text-green-100 text-sm">Masuk untuk melanjutkan pemesanan</p>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6 text-sm text-gray-600">
                <h3 className="font-semibold text-gray-800 mb-3">Keuntungan Member:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Dapatkan poin loyalty setiap pemesanan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Tukar poin dengan voucher</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <button className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white py-3 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    Masuk
                  </button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="w-full border-2 border-green-600 text-green-700 py-3 rounded-xl font-semibold transform transition-all duration-200 hover:bg-green-50 hover:scale-105">
                    Daftar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen pt-32 pb-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {submitted && lastOrder ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20 transform transition-all duration-500 hover:scale-105">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                  Pesanan Berhasil!
                </h2>
                <p className="text-gray-600 text-lg">Terima kasih, pesanan Anda sedang diproses</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-6 text-left border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Detail Pesanan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID Pesanan</span>
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{lastOrder.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tipe Pesanan</span>
                    <span className="font-semibold">{lastOrder.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="font-bold text-green-700 text-lg">Rp {lastOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Poin Loyalty</span>
                    <span className="font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-sm">
                      +{lastOrder.poin} poin
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link to="/menu" className="flex-1">
                  <button className="w-full py-4 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    🍽️ Order Lagi
                  </button>
                </Link>
                <Link to="/home" className="flex-1">
                  <button className="w-full py-4 border-2 border-green-700 text-green-700 rounded-xl font-semibold transform transition-all duration-200 hover:bg-green-50 hover:scale-105">
                    🏠 Ke Beranda
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Form Pemesanan
                </h1>
                <p className="text-gray-600 mt-2">Lengkapi data untuk menyelesaikan pesanan Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Nama Pemesan
                    </label>
                    <input 
                      type="text" 
                      value={form.nama} 
                      disabled 
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50 font-medium text-gray-700 focus:outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                      value={form.nomor}
                      onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Tipe Pesanan
                  </label>
                  <select
                    value={form.tipe}
                    onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="dine-in">🍽️ Dine In - Makan di tempat</option>
                    <option value="takeaway">📦 Takeaway - Bawa pulang</option>
                  </select>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Ringkasan Pesanan
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-green-700">{cart.reduce((sum, i) => sum + i.jumlah, 0)}</div>
                      <div className="text-sm text-gray-600">Total Item</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-green-700">Rp {total.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Harga</div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agree} 
                      onChange={() => setAgree(!agree)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Saya menyetujui</span> ketentuan pemesanan 
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !agree}
                  className={`w-full py-4 rounded-xl font-bold text-white transform transition-all duration-200 ${
                    isProcessing || !agree 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-green-700 to-green-800 hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses Pesanan...
                    </span>
                  ) : (
                    "🚀 Konfirmasi Pesanan"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}