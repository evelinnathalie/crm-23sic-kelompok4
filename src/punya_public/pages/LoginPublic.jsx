import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPublic() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);

    if (success) {
      if (form.nama === "admin" && form.password === "123") {
        navigate("/dashboard");
      } else {
        navigate("/"); // atau "/homewithloyalty" sesuai logic kamu
      }
    } else {
      setError("Nama atau password salah.");
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
            Login Akun
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
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button className="w-full py-2 bg-[#5A6B3E] text-white rounded hover:bg-[#4c5a35]">
            Login
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
