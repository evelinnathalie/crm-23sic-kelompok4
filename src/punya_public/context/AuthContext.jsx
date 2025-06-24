import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "../../supabase";

const COOKIE_KEY = "mc_user";            // nama cookie

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  /* 1️⃣  baca cookie saat inisialisasi */
  const [user, setUser] = useState(() => {
    try {
      const raw = Cookies.get(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /* 2️⃣  login */
  const login = async ({ nama, password }) => {
    // — ADMIN hard-code —
    if (nama === "admin" && password === "123") {
      const admin = { nama: "admin", role: "admin" };
      setUser(admin);
      Cookies.set(COOKIE_KEY, JSON.stringify(admin));   // ⚠️ tanpa expires → cookie sesi
      return true;
    }

    // — Cek tabel users —
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("nama", nama)
      .eq("password", password)
      .single();

    if (data && !error) {
      const member = { id: data.id, nama: data.nama, role: "member" };
      setUser(member);
      Cookies.set(COOKIE_KEY, JSON.stringify(member));  // ← simpan
      return true;
    }
    return false;
  };

  /* 3️⃣  logout */
  const logout = async () => {
    setUser(null);
    Cookies.remove(COOKIE_KEY);
    await supabase.auth.signOut();  // tak mengapa walau session tidak ada
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
