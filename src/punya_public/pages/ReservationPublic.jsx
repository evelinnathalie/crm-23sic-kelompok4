import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      setForm((prev) => ({ ...prev, nama: user.nama }));
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

    setTimeout(() => {
      const newReservation = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem("reservation_data") || "[]");
      localStorage.setItem("reservation_data", JSON.stringify([...existing, newReservation]));

      const poin = parseInt(form.jumlah) * 3;

      const loyalty = JSON.parse(sessionStorage.getItem("loyalty") || "{}");
      loyalty[user.nama] = (loyalty[user.nama] || 0) + poin;
      sessionStorage.setItem("loyalty", JSON.stringify(loyalty));

      const history = JSON.parse(sessionStorage.getItem("loyalty_history") || "{}");
      const userHistory = history[user.nama] || [];
      userHistory.push({
        keterangan: `Reservasi untuk ${form.jumlah} orang`,
        poin,
        tanggal: new Date().toLocaleDateString("id-ID")
      });
      history[user.nama] = userHistory;
      sessionStorage.setItem("loyalty_history", JSON.stringify(history));

      setSubmitted(true);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-12a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
                <p className="text-green-100 text-sm">Masuk untuk melanjutkan reservasi</p>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Manfaat Login:</h3>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Dapatkan poin loyalty setiap reservasi
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Tukar poin dengan voucher menarik
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Akses fitur event & order spesial
                </li>
              </ul>
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
      ) : submitted ? (
        <main className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
          <div className="max-w-2xl mx-auto px-4 lg:px-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Reservasi Berhasil!</h3>
              <p className="text-gray-600 mb-4">Kami akan menghubungi Anda untuk konfirmasi</p>
              <p className="text-green-700 font-semibold mb-6">+{form.jumlah * 3} Poin Loyalty</p>
              <Link to="/" className="inline-block">
                <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-200">
                  Ke Beranda
                </button>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
          <div className="max-w-2xl mx-auto px-4 lg:px-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Formulir Reservasi</h2>
              <div className="grid gap-4">
                <input type="text" name="nama" value={form.nama} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-500" />
                <input type="tel" name="nomor" value={form.nomor} onChange={handleChange} required placeholder="08xxxxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                  <input type="time" name="waktu" value={form.waktu} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                </div>
                <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} min={1} required placeholder="Jumlah Orang" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                <input type="text" name="acara" value={form.acara} onChange={handleChange} placeholder="Jenis Acara (Opsional)" className="w-full px-4 py-3 rounded-xl border border-gray-300" />
                <textarea name="catatan" value={form.catatan} onChange={handleChange} placeholder="Catatan Tambahan" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300"></textarea>
              </div>
              <button type="submit" disabled={isProcessing} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'}`}>
                {isProcessing ? 'Memproses Reservasi...' : 'Konfirmasi Reservasi'}
              </button>
            </form>
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}
