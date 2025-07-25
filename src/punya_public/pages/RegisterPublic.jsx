import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../supabase";

export default function RegisterPublic() {
  const [form, setForm] = useState({ nama: "", password: "", konfirmasi: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 4) {
      setError("❌ Password minimal 4 karakter.");
      return;
    }

    if (form.password !== form.konfirmasi) {
      setError("❌ Konfirmasi password tidak cocok.");
      return;
    }

    // Cek apakah nama sudah ada di Supabase
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("nama", form.nama)
      .single();

    if (existing) {
      setError("❌ Nama sudah terdaftar.");
      return;
    }

    // Simpan ke Supabase
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ nama: form.nama, password: form.password }]);

    if (insertError) {
      setError("❌ Gagal daftar akun.");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex justify-center items-center px-4 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-[#5A6B3E]">
            Daftar Akun Baru
          </h1>
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </p>
          )}
          <input
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="konfirmasi"
            type="password"
            placeholder="Konfirmasi Password"
            value={form.konfirmasi}
            onChange={(e) => setForm({ ...form, konfirmasi: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button className="w-full py-2 bg-[#5A6B3E] text-white rounded hover:bg-[#4c5a35]">
            Daftar Sekarang
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
