import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dummyEvents = [
  {
    id: 1,
    judul: "Workshop Latte Art",
    tanggal: "2025-07-05",
    waktu: "15:00",
    deskripsi: "Belajar teknik dasar latte art bersama barista Monochrome Space.",
    lokasi: "Ruang Barista, Monochrome Space",
  },
  {
    id: 2,
    judul: "Acoustic Night",
    tanggal: "2025-07-12",
    waktu: "19:30",
    deskripsi: "Malam akustik bersama musisi lokal sambil menikmati kopi favoritmu.",
    lokasi: "Main Hall, Monochrome Space",
  },
  {
    id: 3,
    judul: "Diskusi Komunitas Desain Grafis",
    tanggal: "2025-07-20",
    waktu: "14:00",
    deskripsi: "Sharing session untuk desainer, kreator, dan freelancer.",
    lokasi: "Ruang Komunitas, Lantai 2",
  },
];

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({ nama: "", nomor: "", komunitas: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nomor.match(/^08\d{8,12}$/)) {
      alert("Nomor tidak valid");
      return;
    }
    setSubmitted(true);
  };

  const waLink = selectedEvent
    ? `https://wa.me/62${form.nomor.slice(1)}?text=${encodeURIComponent(
        `Halo Admin, saya daftar event:\n\n📌 ${selectedEvent.judul}\n📅 ${selectedEvent.tanggal} ${selectedEvent.waktu}\n📍 ${selectedEvent.lokasi}\n\nNama: ${form.nama}\nWA: ${form.nomor}\nKomunitas: ${form.komunitas || "-"}`
      )}`
    : "#";

  return (
    <>
      <Navbar />
      <main style={{ padding: "3rem 1rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#374532"
        }}>
          📣 Event Komunitas
        </h1>

        {submitted ? (
          <div style={{ background: "#dcfce7", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1rem" }}>
              Pendaftaran Berhasil!
            </h2>
            <p className="mb-4">Silakan konfirmasi ke WhatsApp admin.</p>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: "#22c55e",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Chat WhatsApp
            </a>
          </div>
        ) : selectedEvent ? (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Daftar: {selectedEvent.judul}
            </h2>
            <input
              name="nama"
              placeholder="Nama"
              value={form.nama}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="nomor"
              placeholder="Nomor WhatsApp (08xx...)"
              value={form.nomor}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="komunitas"
              placeholder="Komunitas (opsional)"
              value={form.komunitas}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="submit" style={btnPrimary}>
              Daftar Sekarang
            </button>
          </form>
        ) : (
          <div style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
          }}>
            {dummyEvents.map((event) => (
              <div key={event.id} style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    {event.judul}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#444", marginBottom: "0.5rem" }}>
                    📅 <strong>{event.tanggal}</strong> — {event.waktu}
                  </p>
                  <p style={{ fontSize: "0.95rem", color: "#555", marginBottom: "0.5rem" }}>
                    {event.deskripsi}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#777" }}>📍 {event.lokasi}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#374532",
                    color: "#fff",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Daftar Sekarang
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "1rem",
};

const btnPrimary = {
  width: "100%",
  backgroundColor: "#374532",
  color: "#fff",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};
