import { useEffect, useState } from "react";
import { supabase } from "../supabase";


export default function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [totalSemua, setTotalSemua] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


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
        .filter((item) => item.created_at.startsWith(today))
        .reduce((sum, item) => sum + item.total, 0);


      const totalAll = data.reduce((sum, item) => sum + item.total, 0);


      setTotalHariIni(totalToday);
      setTotalSemua(totalAll);
    }
    setIsLoading(false);
  };


  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);


    if (error) {
      alert("Gagal memperbarui status pesanan.");
    } else {
      fetchData(); // refresh data
    }
  };


  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#444]">Kelola Pesanan</h1>


      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-lg font-medium mb-1 text-gray-600">Total Hari Ini</h2>
          <p className="text-2xl font-bold text-green-700">Rp {totalHariIni.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-lg font-medium mb-1 text-gray-600">Total Keseluruhan</h2>
          <p className="text-2xl font-bold text-green-700">Rp {totalSemua.toLocaleString()}</p>
        </div>
      </div>


      <div className="bg-white rounded border shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#E8ECE5] text-[#444]">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Customer</th>
              <th className="p-3 text-left text-sm font-semibold">Nomor</th>
              <th className="p-3 text-left text-sm font-semibold">Tipe</th>
              <th className="p-3 text-left text-sm font-semibold">Total</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">Memuat data...</td>
              </tr>
            ) : pesanan.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              pesanan.map((item) => (
                <tr key={item.id} className="border-t text-sm">
                  <td className="p-3">{item.id.slice(0, 8)}...</td>
                  <td className="p-3">{item.customer}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">Rp {item.total.toLocaleString()}</td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Diproses">Diproses</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
