import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";


export default function Reservation() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nama: "",
    nomor: "",
    tanggal: "",
    waktu: "",
    jumlah: 1,
    acara: "",
    catatan: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, nama: user.nama || "" }));
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!form.nomor.match(/^08\d{8,12}$/)) {
      alert("Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx");
      return;
    }


    setIsProcessing(true);


    try {
      // ⏳ Insert ke tabel reservation
      const { data: reservation, error: reservationError } = await supabase
        .from("reservation")
        .insert([
          {
            nama: form.nama,
            nomor: form.nomor,
            tanggal: form.tanggal,
            waktu: form.waktu,
            jumlah: parseInt(form.jumlah),
            acara: form.acara,
            catatan: form.catatan,
            status: "Menunggu",
            user_id: user.id,
          },
        ])
        .select()
        .single();


      if (reservationError) throw reservationError;


      const poin = parseInt(form.jumlah) * 3;


      // 🟩 Update atau insert poin loyalty
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


      // 🕘 Catat ke loyalty_history
      await supabase.from("loyalty_history").insert([
        {
          nama: user.nama,
          keterangan: `Reservasi untuk ${form.jumlah} orang`,
          poin,
          tanggal: new Date().toISOString().slice(0, 10),
          user_id: user.id,
        },
      ]);


      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan reservasi.");
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
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
              <p className="text-green-100 text-sm">Masuk untuk melanjutkan reservasi</p>
            </div>
            <div className="p-8">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✅ Dapatkan poin loyalty</li>
                <li>🎁 Tukar poin dengan voucher</li>
                <li>📅 Kelola pesanan dan event</li>
              </ul>
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
      <main className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          {submitted ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Reservasi Berhasil!</h3>
              <p className="text-gray-600 mb-4">Kami akan menghubungi Anda untuk konfirmasi</p>
              <p className="text-green-700 font-semibold mb-6">+{form.jumlah * 3} Poin Loyalty</p>
              <Link to="/home">
                <button className="bg-green-700 text-white py-3 px-6 rounded-xl">Ke Beranda</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Formulir Reservasi</h2>
              <input type="text" name="nama" value={form.nama} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300" />
              <input type="tel" name="nomor" value={form.nomor} onChange={handleChange} required placeholder="08xxxxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-300" />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300" />
                <input type="time" name="waktu" value={form.waktu} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300" />
              </div>
              <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} min={1} required placeholder="Jumlah Orang" className="w-full px-4 py-3 rounded-xl border border-gray-300" />
              <input type="text" name="acara" value={form.acara} onChange={handleChange} placeholder="Jenis Acara (Opsional)" className="w-full px-4 py-3 rounded-xl border border-gray-300" />
              <textarea name="catatan" value={form.catatan} onChange={handleChange} placeholder="Catatan Tambahan" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300"></textarea>
              <button type="submit" disabled={isProcessing} className={`w-full py-3 rounded-xl font-semibold text-white ${isProcessing ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'}`}>
                {isProcessing ? 'Memproses...' : 'Konfirmasi Reservasi'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
