import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("auth_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = ({ nama, password }) => {
    if (nama === "admin" && password === "123") {
      const userData = { nama: "admin", role: "admin" };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return true;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const match = users.find((u) => u.nama === nama && u.password === password);

    if (match) {
      const userData = { nama: match.nama, role: "member" };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user"); // hanya hapus info login, tidak hapus menus
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
