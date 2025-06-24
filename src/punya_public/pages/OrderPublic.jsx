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
                <input type="text" value={form.nama} disabled className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
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
      <Footer />
    </>
  );
}
