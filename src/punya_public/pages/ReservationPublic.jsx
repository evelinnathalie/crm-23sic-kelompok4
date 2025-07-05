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
      // Insert reservation data
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

      // Update loyalty points
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

      // Insert to loyalty history
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
                <p className="text-green-100 text-sm">Masuk untuk melanjutkan reservasi</p>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-gray-800 mb-4">Keuntungan Member:</h3>
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>Dapatkan poin loyalty</span>
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
          {submitted ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20 transform transition-all duration-500 hover:scale-105">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                  Reservasi Berhasil!
                </h3>
                <p className="text-gray-600 text-lg mb-4">Kami akan menghubungi Anda untuk konfirmasi</p>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl border border-yellow-300 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span className="text-yellow-800 font-bold text-lg">+{form.jumlah * 3} Poin Loyalty</span>
                  </div>
                </div>
              </div>
              <Link to="/home">
                <button className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4 px-8 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  🏠 Kembali ke Beranda
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                  Formulir Reservasi
                </h2>
                <p className="text-gray-600">Pesan meja untuk acara spesial Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Nama Pemesan
                  </label>
                  <input 
                    type="text" 
                    name="nama" 
                    value={form.nama} 
                    disabled 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 font-medium text-gray-700 focus:outline-none"
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
                    name="nomor" 
                    value={form.nomor} 
                    onChange={handleChange} 
                    required 
                    placeholder="08xxxxxxxxxx" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
                      </svg>
                      Tanggal
                    </label>
                    <input 
                      type="date" 
                      name="tanggal" 
                      value={form.tanggal} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Waktu
                    </label>
                    <input 
                      type="time" 
                      name="waktu" 
                      value={form.waktu} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Jumlah Orang
                  </label>
                  <input 
                    type="number" 
                    name="jumlah" 
                    value={form.jumlah} 
                    onChange={handleChange} 
                    min={1} 
                    required 
                    placeholder="Jumlah Orang" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
                    </svg>
                    Jenis Acara
                  </label>
                  <input 
                    type="text" 
                    name="acara" 
                    value={form.acara} 
                    onChange={handleChange} 
                    placeholder="Ulang tahun, Meeting, Dinner, dll. (Opsional)" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    Catatan Tambahan
                  </label>
                  <textarea 
                    name="catatan" 
                    value={form.catatan} 
                    onChange={handleChange} 
                    placeholder="Permintaan khusus, alergi makanan, dll." 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200 resize-none"
                  />
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    Poin Loyalty
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dapatkan <span className="font-bold text-green-700">{form.jumlah * 3} poin</span> untuk reservasi {form.jumlah} orang
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing} 
                  className={`w-full py-4 rounded-xl font-bold text-white transform transition-all duration-200 ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-700 to-green-800 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    '🎉 Daftar Sekarang'
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
