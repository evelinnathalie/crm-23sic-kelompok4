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
        <div className="fixed inset-0 bg-black/80 text-white flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-xl text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Akses Terbatas</h2>
            <p className="mb-6">
              Silakan login terlebih dahulu untuk melihat dan mendaftar event
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-green-600 text-green-600 px-6 py-2 rounded"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}


      {!popupLogin && (
        <main className="p-6 max-w-5xl mx-auto pt-24">
          {!selectedEvent ? (
            <>
              <h1 className="text-3xl font-bold mb-6">Daftar Event</h1>


              <div className="mb-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                />
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="border px-4 py-2 rounded"
                >
                  <option value="All">Semua</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Music">Music</option>
                  <option value="Community">Community</option>
                </select>
              </div>


              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-4 border rounded shadow hover:shadow-lg cursor-pointer bg-white"
                  >
                    <img
                      src={evt.image || "/noimg.png"}
                      alt={evt.eventName}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <h2 className="text-lg font-bold">{evt.eventName}</h2>
                    <p className="text-sm text-gray-500">{evt.location}</p>
                    <p className="text-sm text-gray-500">{formatDate(evt.date)}</p>
                    <span className="text-sm mt-2 inline-block px-3 py-1 bg-gray-100 rounded-full">
                      {evt.kategori}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
              {!submitted ? (
                <>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-green-600 mb-4"
                  >
                    &larr; Kembali
                  </button>
                  <h2 className="text-2xl font-bold mb-2">
                    Daftar ke Event: {selectedEvent.eventName}
                  </h2>
                  <p className="mb-4 text-gray-600">{formatDate(selectedEvent.date)}</p>


                  <form onSubmit={handleRegister} className="space-y-4">
                    <input
                      type="text"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      placeholder="Nama"
                      className="w-full border px-4 py-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      value={form.nomor}
                      onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                      placeholder="Nomor WhatsApp"
                      className="w-full border px-4 py-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      value={form.komunitas}
                      onChange={(e) => setForm({ ...form, komunitas: e.target.value })}
                      placeholder="Komunitas (opsional)"
                      className="w-full border px-4 py-2 rounded"
                    />


                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-3 rounded w-full"
                      disabled={loading}
                    >
                      {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-green-600 mb-4">Berhasil!</h2>
                  <p className="text-lg mb-6">
                    Kamu telah berhasil mendaftar event ini dan mendapatkan 5 poin!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setSubmitted(false);
                      setForm({ nama: user?.nama || "", nomor: "", komunitas: "" });
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded"
                  >
                    Daftar Event Lainnya
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}


      <Footer />
    </>
  );
}
