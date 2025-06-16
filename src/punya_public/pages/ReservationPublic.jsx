import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Reservation() {
  const [form, setForm] = useState({
    nama: "",
    nomor: "",
    tanggal: "",
    waktu: "",
    jumlah: 1,
    catatan: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nomor.match(/^08\d{8,12}$/)) {
      alert("Nomor WhatsApp tidak valid. Gunakan format 08xxxx");
      return;
    }
    setSubmitted(true);
  };

  const waLink = `https://wa.me/62${form.nomor.slice(1)}?text=${encodeURIComponent(
    `Halo, saya ingin reservasi:\n\nNama: ${form.nama}\nTanggal: ${form.tanggal}\nWaktu: ${form.waktu}\nJumlah: ${form.jumlah} orang\nCatatan: ${form.catatan}`
  )}`;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto p-6 min-h-[80vh] text-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6">Reservasi Meja</h1>

        {submitted ? (
          <div className="text-center bg-green-100 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Reservasi Berhasil!</h2>
            <p className="mb-4">Silakan konfirmasi via WhatsApp.</p>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Chat Admin WhatsApp
            </a>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="nama" label="Nama Lengkap" value={form.nama} onChange={handleChange} />
            <Input name="nomor" label="Nomor WhatsApp" value={form.nomor} onChange={handleChange} />
            <Input name="tanggal" label="Tanggal" type="date" value={form.tanggal} onChange={handleChange} />
            <Input name="waktu" label="Waktu" type="time" value={form.waktu} onChange={handleChange} />
            <Input name="jumlah" label="Jumlah Orang" type="number" min="1" max="20" value={form.jumlah} onChange={handleChange} />
            <div>
              <label className="block font-medium mb-1">Catatan (opsional)</label>
              <textarea
                name="catatan"
                rows="3"
                value={form.catatan}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <button className="bg-black text-white w-full py-3 rounded hover:bg-gray-800">
              Kirim Reservasi
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

function Input({ label, name, type = "text", ...rest }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full border px-4 py-2 rounded"
        {...rest}
      />
    </div>
  );
}
