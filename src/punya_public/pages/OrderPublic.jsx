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


  const [form, setForm] = useState({ nomor: "", tipe: "dine-in" });

  const [form, setForm] = useState({ nama: "", nomor: "", tipe: "dine-in" });
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama: user.nama,
        nomor: user.nomor || "",
      }));
    }
  }, [user]);


  const total = cart.reduce((sum, i) => sum + i.harga * i.jumlah, 0);



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
      // ⏳ Insert ke tabel orders
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            nama: user.nama,
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


      // 💎 Hitung poin loyalty
      const totalItem = cart.reduce((sum, item) => sum + item.jumlah, 0);
      const poin = totalItem * 2;


      // ✅ Cek apakah user sudah punya poin di tabel loyalty
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


      // 🕘 Tambahkan ke loyalty_history
      await supabase.from("loyalty_history").insert([
        {
          nama: user.nama,
          keterangan: `Order ${totalItem} item`,
          poin,
          tanggal: new Date().toISOString().slice(0, 10),
          user_id: user.id,
        },
      ]);


      setCart([]);
      setSubmitted(true);
      setLastOrder({ ...order, poin });
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pesanan. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        customer: user.nama,
        type: form.tipe === "dine-in" ? "Dine In" : "Takeaway",
        items: cart.map((i) => `${i.nama} × ${i.jumlah}`).join(", "),
        status: "Diproses",
        total: total,
        phone: form.nomor,
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(localStorage.getItem("order_data") || "[]");
      localStorage.setItem("order_data", JSON.stringify([...existingOrders, newOrder]));

      const totalItem = cart.reduce((sum, item) => sum + item.jumlah, 0);
      const poin = totalItem * 2;

      const loyalty = JSON.parse(sessionStorage.getItem("loyalty") || "{}");
      loyalty[user.nama] = (loyalty[user.nama] || 0) + poin;
      sessionStorage.setItem("loyalty", JSON.stringify(loyalty));

      const history = JSON.parse(sessionStorage.getItem("loyalty_history") || "{}");
      const userHistory = history[user.nama] || [];
      userHistory.push({
        keterangan: `Order ${totalItem} item`,
        poin,
        tanggal: new Date().toLocaleDateString("id-ID"),
      });
      history[user.nama] = userHistory;
      sessionStorage.setItem("loyalty_history", JSON.stringify(history));

      setCart([]);
      setSubmitted(true);
      setIsProcessing(false);
      setLastOrder({ ...newOrder, poin });
    }, 2000);
  };


  if (!user) {
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center relative overflow-hidden">
              <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
              <p className="text-green-100 text-sm">Masuk untuk melanjutkan pemesanan</p>
            </div>
            <div className="p-8">
              <div className="mb-6 text-sm text-gray-600">
                <ul className="space-y-2">
                  <li>Dapatkan poin loyalty setiap pemesanan</li>
                  <li>Tukar poin dengan voucher</li>
                  <li>Akses fitur reservasi dan event</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <button className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold">Masuk</button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="w-full border border-green-600 text-green-700 py-3 rounded-xl font-semibold">Daftar</button>
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
      <main className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {submitted && lastOrder ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Pesanan Berhasil</h2>
              <p className="mb-4">Terima kasih, pesanan Anda sedang diproses</p>
              <div className="text-left text-sm bg-gray-50 p-4 rounded-xl mb-4">
                <p><strong>ID:</strong> {lastOrder.id}</p>
                <p><strong>Tipe:</strong> {lastOrder.type}</p>
                <p><strong>Total:</strong> Rp {lastOrder.total.toLocaleString()}</p>
                <p><strong>Poin Loyalty:</strong> {lastOrder.poin}</p>
              </div>
              <div className="flex gap-4">
                <Link to="/menu" className="flex-1">
                  <button className="w-full py-3 bg-green-700 text-white rounded-xl">Order Lagi</button>
                </Link>
                <Link to="/home" className="flex-1">
                  <button className="w-full py-3 border border-green-700 text-green-700 rounded-xl">Ke Beranda</button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <h1 className="text-xl font-bold text-green-700">Form Pemesanan</h1>


              <div>
                <label className="block text-sm mb-1 font-semibold">Nama Pemesan</label>
                <input type="text" value={user.nama} disabled className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
              </div>


              <div>
                <label className="block text-sm mb-1 font-semibold">Nomor WhatsApp</label>
                <input
                  type="tel"
                  className="w-full border px-4 py-3 rounded-xl"
                  value={form.nomor}
                  onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                  required
                />
              </div>


              <div>
                <label className="block text-sm mb-1 font-semibold">Tipe Pesanan</label>
                <select
                  value={form.tipe}
                  onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                  className="w-full border px-4 py-3 rounded-xl"
                >
                  <option value="dine-in">🍽️ Dine In</option>
                  <option value="takeaway">📦 Takeaway</option>
                </select>
              </div>


              <div className="text-sm text-gray-700">
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                  Saya menyetujui ketentuan pemesanan dan konfirmasi via WhatsApp
                </label>
              </div>


              <div className="bg-gray-100 p-4 rounded-xl text-sm">
                <p><strong>Ringkasan:</strong></p>
                <p>Total Item: {cart.reduce((sum, i) => sum + i.jumlah, 0)}</p>
                <p>Total Harga: Rp {total.toLocaleString()}</p>
              </div>


              <button
                type="submit"
                disabled={isProcessing || !agree}
                className={`w-full py-4 rounded-xl font-bold text-white ${
                  isProcessing ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
                }`}
              >
                {isProcessing ? "Memproses..." : "🚀 Konfirmasi Pesanan"}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Login Required Modal */}
      {!user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-12a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2h12a2 2 0 002-2V9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Akses Terbatas
                </h2>
                <p className="text-green-100 text-sm">
                  Masuk untuk melanjutkan pemesanan
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Manfaat Login:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Dapatkan poin loyalty setiap pemesanan
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Tukar poin dengan voucher menarik
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Akses fitur reservasi dan event
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Masuk
                  </button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-xl font-semibold transition-all duration-200">
                    Daftar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {user && (
        <main className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            {submitted && lastOrder ? (
              /* Success State */
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
                    <p className="text-green-100">Terima kasih telah melakukan pemesanan</p>
                  </div>
                </div>

                {/* Success Content */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pesanan Sedang Diproses</h3>
                    <p className="text-gray-600 mb-6">Kami akan segera menghubungi Anda untuk konfirmasi pesanan</p>
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Detail Pesanan:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Pesanan:</span>
                        <span className="font-medium">#{lastOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipe:</span>
                        <span className="font-medium">{lastOrder.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-green-600">Rp {lastOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty Points */}
                  <div className="bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 text-green-800">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="font-semibold">Selamat! Anda mendapatkan</p>
                        <p className="text-xl font-bold">{lastOrder.poin} Poin Loyalty</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Link to="/menu" className="flex-1">
                      <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200">
                        Order Lagi
                      </button>
                    </Link>
                    <Link to="/home" className="flex-1">
                      <button className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-xl font-semibold transition-all duration-200">
                        Ke Beranda
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Order Form */
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 md:p-8 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold">Form Pemesanan</h1>
                      <p className="text-green-100 text-sm">Lengkapi data untuk melanjutkan pesanan</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Cart Summary */}
                  {cart.length > 0 && (
                    <div className="lg:w-1/3 p-6 bg-green-50 border-b lg:border-b-0 lg:border-r border-green-100">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 0L6 5H3m4 8l-1 8h10l-1-8M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
                        </svg>
                        Ringkasan Pesanan
                      </h3>
                      <div className="space-y-3 mb-6">
                        {cart.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium text-gray-800 leading-snug">{item.nama}</span>
                              <span className="text-xs text-gray-500 ml-2">x{item.jumlah}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-green-600">
                                Rp {(item.harga * item.jumlah).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">Total Pembayaran:</span>
                          <span className="font-bold text-lg text-green-600">Rp {total.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {cart.reduce((sum, item) => sum + item.jumlah, 0)} item
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Content */}
                  <div className={`${cart.length > 0 ? 'lg:w-2/3' : 'w-full'} p-6 md:p-8`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Customer Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Nama Pemesan
                        </label>
                        <input
                          type="text"
                          className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-0 px-4 py-3 rounded-xl bg-gray-50 font-medium text-gray-800 transition-colors"
                          value={form.nama}
                          disabled
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Nomor WhatsApp
                        </label>
                        <input
                          type="tel"
                          className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-0 px-4 py-3 rounded-xl transition-colors"
                          value={form.nomor}
                          placeholder="08xxxxxxxxxx"
                          onChange={e => setForm({ ...form, nomor: e.target.value })}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: 08xxxxxxxxxx (minimal 10 digit)</p>
                      </div>

                      {/* Order Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Tipe Pesanan
                        </label>
                        <select
                          className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-0 px-4 py-3 rounded-xl transition-colors"
                          value={form.tipe}
                          onChange={e => setForm({ ...form, tipe: e.target.value })}
                        >
                          <option value="dine-in">🍽️ Dine In - Makan di tempat</option>
                          <option value="takeaway">📦 Takeaway - Bawa pulang</option>
                        </select>
                      </div>

                      {/* Agreement Checkbox */}
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="agree"
                            className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                          />
                          <label htmlFor="agree" className="text-sm text-gray-600 leading-relaxed">
                            Saya menyetujui <span className="font-semibold text-green-700">ketentuan pemesanan</span> dan memahami bahwa pesanan akan dikonfirmasi melalui WhatsApp.
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${isProcessing
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                        disabled={isProcessing || !agree}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses Pesanan...
                          </div>
                        ) : (
                          "🚀 Konfirmasi Pesanan"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}