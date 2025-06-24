import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cek session saat pertama kali load (tanpa localStorage)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session?.user) {
      const { user: supaUser } = data.session;
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", supaUser.id)
        .single();
      if (profile) {
        setUser({ id: profile.id, nama: profile.nama, role: "member" });
      }
    }
  };

  const login = async ({ nama, password }) => {
    // Login Admin (hardcoded)
    if (nama === "admin" && password === "123") {
      const adminUser = { nama: "admin", role: "admin" };
      setUser(adminUser);
      return true;
    }

    // Cek user di tabel Supabase
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("nama", nama)
      .eq("password", password)
      .single();

      if (data && !error) {
        const memberUser = { id: data.id, nama: data.nama, role: "member" }; // Tambahkan id di sini
        setUser(memberUser);
        return true;
      }
      

    return false;
  };

  const logout = () => {
    setUser(null);
    supabase.auth.signOut(); // optional, kalau pakai auth resmi
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
