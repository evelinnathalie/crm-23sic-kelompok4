import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Order() {
  const { cart, setCart } = useCart();
  const [form, setForm] = useState({ nama: "", nomor: "", tipe: "dine-in" });
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.harga * i.jumlah, 0);
  const waLink = `https://wa.me/62${form.nomor.slice(1)}?text=${encodeURIComponent(
    `Halo Admin, saya ${form.nama} ingin memesan:\n` +
      cart.map((i) => `• ${i.nama} × ${i.jumlah}`).join("\n") +
      `\nTotal: Rp${total.toLocaleString()}\nTipe: ${form.tipe}`
  )}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nomor.match(/^08\d{8,12}$/)) return alert("Nomor WA tidak valid");
    if (!agree) return alert("Wajib centang persetujuan");
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto min-h-[80vh] text-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Pesanan Online</h1>

        {submitted ? (
          <div className="text-center">
            <p className="mb-4">Pesanan kamu berhasil dikirim!</p>
            <a href={waLink} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-4 py-2 rounded">
              Kirim ke WhatsApp
            </a>
          </div>
        ) : (
          <>
            {cart.length === 0 ? (
              <p>Keranjang kosong.</p>
            ) : (
              <>
                <ul className="mb-4">
                  {cart.map((i) => (
                    <li key={i.id}>
                      {i.nama} × {i.jumlah} = Rp{(i.harga * i.jumlah).toLocaleString()}
                    </li>
                  ))}
                </ul>
                <p className="font-bold mb-4">Total: Rp{total.toLocaleString()}</p>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama"
                className="w-full border px-4 py-2 rounded"
              />
              <input
                name="nomor"
                value={form.nomor}
                onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                placeholder="Nomor WhatsApp (08xx...)"
                className="w-full border px-4 py-2 rounded"
              />
              <select
                value={form.tipe}
                onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
              <label className="text-sm flex gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                Saya setuju dengan ketentuan pesanan
              </label>
              <button
                disabled={cart.length === 0 || !agree}
                className="w-full py-2 rounded text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
              >
                Konfirmasi Pesanan
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
