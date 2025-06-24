// src/pages/Pesanan.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Pesanan() {
  /* --------------------- state --------------------- */
  const [pesanan, setPesanan] = useState([]);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [totalSemua, setTotalSemua] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------- ambil data sekali ----------------- */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data pesanan:", error.message);
    } else {
      setPesanan(data);

      const today = new Date().toISOString().slice(0, 10);
      const totalToday = data
        .filter((x) => x.created_at.startsWith(today))
        .reduce((sum, x) => sum + x.total, 0);

      setTotalHariIni(totalToday);
      setTotalSemua(data.reduce((s, x) => s + x.total, 0));
    }
    setIsLoading(false);
  };

  /* ---------------- update status ---------------- */
  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Gagal memperbarui status pesanan.");
    } else {
      fetchData();
    }
  };

  /* --------------------- render -------------------- */
  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#444]">Kelola Pesanan</h1>

      {/* Ringkasan */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <SummaryCard label="Total Hari Ini" value={totalHariIni} />
        <SummaryCard label="Total Keseluruhan" value={totalSemua} />
      </div>

      {/* Tabel dengan scroll */}
      <div className="bg-white rounded border shadow overflow-x-auto">
        {/* Header tabel tetap, body di-scroll */}
        <table className="min-w-full bg-white rounded-lg border border-[#E4E6DC]">
          <thead className="bg-[#E8ECE5] text-[#444]">
            <tr>
              <Th>ID</Th>
              <Th>Nomor</Th>
              <Th>Tipe</Th>
              <Th>Pesanan</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Waktu</Th>
            </tr>
          </thead>
        </table>

        {/* Body di sini agar scroll hanya untuk data */}
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="min-w-full">
            <tbody>
              {isLoading ? (
                <RowMessage colSpan={7} text="Memuat data..." />
              ) : pesanan.length === 0 ? (
                <RowMessage colSpan={7} text="Belum ada pesanan." />
              ) : (
                pesanan.map((item) => (
                  <tr key={item.id} className="border-t text-sm">
                    <Td>{item.id.slice(0, 8)}…</Td>
                    <Td>{item.phone}</Td>
                    <Td>{item.type}</Td>

                    {/* Pesanan bullet list + scroll internal jika item banyak */}
                    <Td>
                      <div className="max-h-24 overflow-y-auto pr-1">
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {item.items.split(",").map((menu, i) => (
                            <li key={i}>{menu.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    </Td>

                    <Td>Rp&nbsp;{item.total.toLocaleString()}</Td>
                    <Td>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateStatus(item.id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Diproses">Diproses</option>
                        <option value="Diterima">Diterima</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Batal">Batal</option>
                      </select>
                    </Td>
                    <Td>
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- komponen kecil pendukung ---------- */
function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded border p-4 shadow">
      <h2 className="text-lg font-medium mb-1 text-gray-600">{label}</h2>
      <p className="text-2xl font-bold text-green-700">
        Rp {value.toLocaleString()}
      </p>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="p-3 text-left text-sm font-semibold">{children}</th>
);
const Td = ({ children }) => <td className="p-3">{children}</td>;
const RowMessage = ({ colSpan, text }) => (
  <tr>
    <td colSpan={colSpan} className="p-4 text-center text-gray-500">
      {text}
    </td>
  </tr>
);
