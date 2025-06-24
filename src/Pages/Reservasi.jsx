import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";


export default function Reservasi() {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchReservations();
  }, []);


  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservation")
      .select("*")
      .order("created_at", { ascending: false });


    if (error) {
      console.error("Gagal mengambil data:", error);
    } else {
      setData(data);
    }
    setLoading(false);
  };


  const handleStatusUpdate = async (id, newStatus) => {
    const { error } = await supabase
      .from("reservation")
      .update({ status: newStatus })
      .eq("id", id);


    if (error) {
      alert("Gagal mengubah status");
    } else {
      fetchReservations();
    }
  };


  const filteredData = data.filter((item) =>
    statusFilter === "Semua" ? true : item.status === statusFilter
  );


  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Manajemen Reservasi</h1>


      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-600">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white shadow-sm"
        >
          <option value="Semua">Semua</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Diterima">Diterima</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>


      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#E8ECE5] text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Waktu</th>
              <th className="px-4 py-2 text-left">Jumlah</th>
              <th className="px-4 py-2 text-left">Acara</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Tidak ada data reservasi
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2">{item.waktu}</td>
                  <td className="px-4 py-2">{item.jumlah} orang</td>
                  <td className="px-4 py-2">{item.acara || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Diterima"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-1">
                    <button
                      onClick={() => handleStatusUpdate(item.id, "Diterima")}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(item.id, "Ditolak")}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Tolak
                    </button>
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


