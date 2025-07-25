import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Ambil cart dari localStorage saat pertama kali load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Simpan cart ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const tambahItem = (item) => {
    setCart((prev) => {
      const ada = prev.find((i) => i.id === item.id);
      if (ada) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, jumlah: i.jumlah + 1 } : i
        );
      }
      return [...prev, { ...item, jumlah: 1 }];
    });
  };

  const kurangiItem = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      if (item.jumlah === 1) {
        return prev.filter((i) => i.id !== id);
      }

      return prev.map((i) =>
        i.id === id ? { ...i, jumlah: i.jumlah - 1 } : i
      );
    });
  };

  const getJumlahTotal = () => {
    return cart.reduce((total, item) => total + item.jumlah, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        tambahItem,
        kurangiItem,
        setCart,
        getJumlahTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
