import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";


export default function Menu() {
  const { tambahItem, kurangiItem, cart } = useCart();
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [daftarMenu, setDaftarMenu] = useState([]);


  useEffect(() => {
    fetchMenus();
  }, []);


  const fetchMenus = async () => {
    const { data, error } = await supabase.from("menus").select("*");
    if (error) {
      console.error("Gagal ambil menu:", error);
    } else {
      setDaftarMenu(data);
    }
  };


  const kategoriList = [
    "Semua",
    ...new Set(daftarMenu.map((item) => item.kategori)),
  ];


  const getJumlah = (id) => {
    const item = cart.find((i) => i.id === id);
    return item?.jumlah || 0;
  };


  const handleTambah = (item) => {
    tambahItem({
      id: item.id,
      nama: item.nama,
      harga: item.harga,
      jumlah: 1,
    });
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
      <main
        style={{
          display: "flex",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* Sidebar Kategori */}
        <aside
          style={{
            width: "220px",
            background: "#f9f9f9",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              fontSize: "1rem",
              color: "#333",
            }}
          >
            Kategori
          </h3>


          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {kategoriList.map((kat) => (
              <li key={kat}>
                <button
                  onClick={() => setKategoriAktif(kat)}
                  style={{
                    backgroundColor:
                      kat === kategoriAktif ? "#e8f0dc" : "transparent",
                    color: kat === kategoriAktif ? "#5A6B3E" : "#333",
                    fontWeight: kat === kategoriAktif ? "bold" : "normal",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "4px",
                    transition: "all 0.2s ease",
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
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: "2rem",
              color: "#333",
            }}
          >
            ☕ Menu Monochrome Space
          </h1>


          {menuDitampilkan.length === 0 ? (
            <p style={{ color: "#666" }}>Menu belum tersedia dalam kategori ini.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
                alignItems: "stretch",
              }}
            >
              {menuDitampilkan.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/300x200"}
                    alt={item.nama}
                    style={{
                      height: "160px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "1rem", flex: 1 }}>
                    <h3 style={{ fontWeight: "bold" }}>{item.nama}</h3>
                    <p style={{ color: "#666", marginBottom: "1rem" }}>
                      Rp{item.harga.toLocaleString("id-ID")}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleKurang(item)}
                        disabled={getJumlah(item.id) === 0}
                        style={{
                          backgroundColor: "#ccc",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: "none",
                          color: "#333",
                          cursor:
                            getJumlah(item.id) === 0 ? "not-allowed" : "pointer",
                          opacity: getJumlah(item.id) === 0 ? 0.4 : 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center" }}>
                        {getJumlah(item.id)}
                      </span>
                      <button
                        onClick={() => handleTambah(item)}
                        style={{
                          backgroundColor: "#5A6B3E",
                          color: "#fff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
