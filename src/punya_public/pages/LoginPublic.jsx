import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", nomor: "", role: "member" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
    navigate(form.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex justify-center items-center px-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <input name="nama" placeholder="Nama" className="w-full border px-4 py-2 rounded" value={form.nama} onChange={handleChange} />
          <input name="nomor" placeholder="Nomor WhatsApp" className="w-full border px-4 py-2 rounded" value={form.nomor} onChange={handleChange} />
          <select name="role" className="w-full border px-4 py-2 rounded" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full py-2 bg-[#5A6B3E] text-white rounded hover:bg-[#4c5a35]">Login</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
