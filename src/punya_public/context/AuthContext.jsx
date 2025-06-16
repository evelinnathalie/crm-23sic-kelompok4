import { createContext, useContext, useState } from "react";

// 1. Buat context
const AuthContext = createContext();

// 2. Hook untuk akses
export const useAuth = () => useContext(AuthContext);

// 3. Provider (membungkus <App />)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user = { nama, nomor, role }

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
