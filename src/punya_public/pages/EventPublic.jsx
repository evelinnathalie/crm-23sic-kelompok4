import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";

export default function EventsPublic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({ nama: "", nomor: "", komunitas: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupLogin, setPopupLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("All");

  useEffect(() => {
    fetchEvents();
    if (!user) {
      setPopupLogin(true);
    } else {
      setForm((prev) => ({ ...prev, nama: user.nama }));
      setPopupLogin(false);
    }
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("event").select("*");
    if (error) console.error("Gagal ambil event:", error.message);
    else setEvents(data);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.nomor) return alert("Isi semua data");

    setLoading(true);

    // Simpan peserta event
    await supabase.from("event_participants").insert([
      {
        nama: form.nama,
        nomor: form.nomor,
        komunitas: form.komunitas,
        event_id: selectedEvent.id,
        event_name: selectedEvent.eventName,
      },
    ]);

    // Tambahkan poin ke loyalty
    const poin = 5;
    const { data: existing } = await supabase
      .from("loyalty")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await supabase
        .from("loyalty")
        .update({ poin: existing.poin + poin })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("loyalty")
        .insert({ user_id: user.id, poin });
    }

    // Tambahkan ke histori
    await supabase.from("loyalty_history").insert([
      {
        user_id: user.id,
        nama: user.nama,
        poin,
        keterangan: `Daftar event: ${selectedEvent.eventName}`,
      },
    ]);

    setSubmitted(true);
    setLoading(false);
  };

  const filteredEvents = events
    .filter((evt) =>
      kategori === "All" ? true : evt.kategori === kategori
    )
    .filter((evt) =>
      evt.eventName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (tgl) => {
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      {popupLogin && (
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
                <p className="text-green-100 text-sm">Masuk untuk melihat dan mendaftar event</p>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6 text-sm text-gray-600">
                <h3 className="font-semibold text-gray-800 mb-3">Keuntungan Member:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Daftar event eksklusif dan workshop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Dapatkan poin loyalty setiap pendaftaran</span>
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
      )}

      {!popupLogin && (
        <main className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10">
            {!selectedEvent ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-4">
                    Event & Workshop
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Bergabunglah dengan berbagai event menarik dan dapatkan pengalaman tak terlupakan
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Cari event yang menarik..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="appearance-none bg-white border-2 border-gray-200 px-6 py-3 pr-10 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200 min-w-[150px]"
                      >
                        <option value="All">🎯 Semua</option>
                        <option value="Workshop">🛠️ Workshop</option>
                        <option value="Music">🎵 Music</option>
                        <option value="Community">👥 Community</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 border border-white/20 overflow-hidden"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={evt.image || "/noimg.png"}
                          alt={evt.eventName}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full border border-white/20">
                            {evt.kategori}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
                          {evt.eventName}
                        </h3>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{formatDate(evt.date)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-full">
                            +5 Poin
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada event ditemukan</h3>
                    <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                  {!submitted ? (
                    <div className="space-y-6">

                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                          Daftar Event
                        </h2>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {selectedEvent.eventName}
                        </h3>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                          {formatDate(selectedEvent.date)}
                        </p>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={form.nama}
                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                            placeholder="Masukkan nama lengkap"
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="text"
                            value={form.nomor}
                            onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                            placeholder="08xxxxxxxxxx"
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Komunitas
                            <span className="text-gray-400 text-xs">(opsional)</span>
                          </label>
                          <input
                            type="text"
                            value={form.komunitas}
                            onChange={(e) => setForm({ ...form, komunitas: e.target.value })}
                            placeholder="Nama komunitas atau organisasi"
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-200"
                          />
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-700 mb-1">+5 Poin</div>
                            <div className="text-sm text-gray-600">Bonus loyalty untuk pendaftaran</div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-4 rounded-xl font-bold text-white transform transition-all duration-200 ${loading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-700 to-green-800 hover:scale-105 hover:shadow-lg"
                            }`}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              Mendaftarkan...
                            </span>
                          ) : (
                            "🎉 Daftar Sekarang"
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                        Pendaftaran Berhasil! 🎉
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Selamat! Kamu telah terdaftar dalam event ini
                      </p>
                    </div>
                  )}
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
