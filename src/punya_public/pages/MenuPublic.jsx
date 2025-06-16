import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Menu() {
  const { tambahItem, kurangiItem, cart } = useCart();
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarMenu = [
    // Espresso Based
    { id: 1, nama: "Americano", harga: 25000, kategori: "Espresso Based", gambar: "https://source.unsplash.com/300x200/?americano" },
    { id: 2, nama: "Cappuccino", harga: 25000, kategori: "Espresso Based", gambar: "https://source.unsplash.com/300x200/?cappuccino" },
    { id: 3, nama: "Caffe Latte", harga: 25000, kategori: "Espresso Based", gambar: "https://source.unsplash.com/300x200/?latte" },
    { id: 4, nama: "Mochacino", harga: 28000, kategori: "Espresso Based", gambar: "https://source.unsplash.com/300x200/?mocha" },
    { id: 5, nama: "Caramel Macchiato", harga: 35000, kategori: "Espresso Based", gambar: "https://source.unsplash.com/300x200/?caramel+coffee" },

    // Kopi Susu
    { id: 6, nama: "Monocreamy", harga: 28000, kategori: "Kopi Susu", gambar: "https://source.unsplash.com/300x200/?coffee+milk" },
    { id: 7, nama: "Kopi Susu Aren", harga: 28000, kategori: "Kopi Susu", gambar: "https://source.unsplash.com/300x200/?aren+coffee" },
    { id: 8, nama: "Kopi Susu Bold", harga: 32000, kategori: "Kopi Susu", gambar: "https://source.unsplash.com/300x200/?strong+coffee" },
    { id: 9, nama: "Kopi Susu Space", harga: 32000, kategori: "Kopi Susu", gambar: "https://source.unsplash.com/300x200/?unique+coffee" },
    { id: 10, nama: "Kopi Susu Jelly", harga: 30000, kategori: "Kopi Susu", gambar: "https://source.unsplash.com/300x200/?coffee+jelly" },

    // Non-Coffee
    { id: 11, nama: "Matcha", harga: 30000, kategori: "Non-Coffee", gambar: "https://source.unsplash.com/300x200/?matcha" },
    { id: 12, nama: "Taro", harga: 30000, kategori: "Non-Coffee", gambar: "https://source.unsplash.com/300x200/?taro+drink" },

    // Tea
    { id: 13, nama: "Strawberry Tea", harga: 25000, kategori: "Tea", gambar: "https://source.unsplash.com/300x200/?strawberry+tea" },
    { id: 14, nama: "Lemon Tea", harga: 25000, kategori: "Tea", gambar: "https://source.unsplash.com/300x200/?lemon+tea" },

    // Makanan
    { id: 15, nama: "Carbonara", harga: 42000, kategori: "Makanan", gambar: "https://source.unsplash.com/300x200/?carbonara" },
    { id: 16, nama: "Nasi Goreng Slice Beef", harga: 45000, kategori: "Makanan", gambar: "https://source.unsplash.com/300x200/?fried+rice+beef" },

    // Snack
    { id: 17, nama: "Kentang Goreng", harga: 24000, kategori: "Snack", gambar: "https://source.unsplash.com/300x200/?french+fries" },
  ];

  const kategoriList = ["Semua", ...new Set(daftarMenu.map((item) => item.kategori))];

  const getJumlah = (id) => {
    const item = cart.find((i) => i.id === id);
    return item?.jumlah || 0;
  };

  const handleTambah = (item) => {
    tambahItem(item);
  };

  const handleKurang = (item) => {
    if (getJumlah(item.id) > 0) {
      kurangiItem(item.id);
    }
  };

  const menuDitampilkan =
    kategoriAktif === "Semua"
      ? daftarMenu
      : daftarMenu.filter((m) => m.kategori === kategoriAktif);

  return (
    <>
      <Navbar />
      <main style={{ display: "flex", gap: "2rem", padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
        {/* Sidebar Kategori */}
        <aside style={{
          width: "220px",
          background: "#f9f9f9",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          <h3 style={{
            fontWeight: "bold",
            marginBottom: "1rem",
            fontSize: "1rem",
            color: "#333"
          }}>Kategori</h3>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {kategoriList.map((kat) => (
              <li key={kat}>
                <button
                  onClick={() => setKategoriAktif(kat)}
                  style={{
                    backgroundColor: kat === kategoriAktif ? "#e8f0dc" : "transparent",
                    color: kat === kategoriAktif ? "#5A6B3E" : "#333",
                    fontWeight: kat === kategoriAktif ? "bold" : "normal",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {kat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Konten Menu */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#333"
          }}>
            ☕ Menu Monochrome Space
          </h1>

          {kategoriList
            .filter((kat) => kat !== "Semua" && (kategoriAktif === "Semua" || kategoriAktif === kat))
            .map((kategori) => (
              <div key={kategori} style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem", color: "#444" }}>{kategori}</h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem"
                }}>
                  {menuDitampilkan
                    .filter((m) => m.kategori === kategori)
                    .map((item) => (
                      <div key={item.id} style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                      }}>
                        <img src={item.gambar} alt={item.nama} style={{ height: "160px", width: "100%", objectFit: "cover" }} />
                        <div style={{ padding: "1rem", flex: 1 }}>
                          <h3 style={{ fontWeight: "bold" }}>{item.nama}</h3>
                          <p style={{ color: "#666", marginBottom: "1rem" }}>Rp{item.harga.toLocaleString()}</p>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <button
                              onClick={() => handleKurang(item)}
                              disabled={getJumlah(item.id) === 0}
                              style={{
                                backgroundColor: "#ccc",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "6px",
                                border: "none",
                                color: "#333",
                                cursor: getJumlah(item.id) === 0 ? "not-allowed" : "pointer",
                                opacity: getJumlah(item.id) === 0 ? 0.4 : 1,
                              }}
                            >−</button>
                            <span style={{ minWidth: "20px", textAlign: "center" }}>{getJumlah(item.id)}</span>
                            <button
                              onClick={() => handleTambah(item)}
                              style={{
                                backgroundColor: "#5A6B3E",
                                color: "#fff",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer"
                              }}
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
