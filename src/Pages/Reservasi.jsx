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

  const getStatusStats = () => {
    const stats = {
      total: data.length,
      menunggu: data.filter(item => item.status === "Menunggu").length,
      diterima: data.filter(item => item.status === "Diterima").length,
      ditolak: data.filter(item => item.status === "Ditolak").length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Reservasi</h1>
          <p className="text-gray-600">Kelola dan pantau semua reservasi pelanggan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservasi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.menunggu}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diterima</p>
                <p className="text-2xl font-bold text-green-600">{stats.diterima}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{stats.ditolak}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Filter & Pencarian</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-gray-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
                >
                  <option value="Semua">📋 Semua Status</option>
                  <option value="Menunggu">⏳ Menunggu</option>
                  <option value="Diterima">✅ Diterima</option>
                  <option value="Ditolak">❌ Ditolak</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-gray-900">{filteredData.length}</span> dari <span className="font-semibold text-gray-900">{data.length}</span> reservasi
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Daftar Reservasi</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    👤 Nama Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    📅 Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🕒 Waktu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    👥 Jumlah Tamu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🎉 Jenis Acara
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    📊 Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ⚡ Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">Memuat data reservasi...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4">🍽️</div>
                        <p className="text-gray-500 text-lg font-medium">
                          {statusFilter === "Semua" ? "Belum ada reservasi" : `Tidak ada reservasi dengan status "${statusFilter}"`}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {statusFilter === "Semua" ? "Reservasi baru akan muncul di sini" : "Coba ubah filter untuk melihat reservasi lainnya"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-semibold text-sm">
                              {item.nama?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{item.nama}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📅</span>
                          <span className="text-sm font-medium text-gray-900">{item.tanggal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">🕒</span>
                          <span className="text-sm text-gray-700">{item.waktu}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">👥</span>
                          <span className="text-sm font-semibold text-gray-900">{item.jumlah} orang</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">🎉</span>
                          <span className="text-sm text-gray-700">{item.acara || "Tidak disebutkan"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                            item.status === "Diterima"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : item.status === "Ditolak"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {item.status === "Diterima" ? "✅ Diterima" : 
                           item.status === "Ditolak" ? "❌ Ditolak" : 
                           "⏳ Menunggu"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(item.id, "Diterima")}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-150 disabled:opacity-50"
                            disabled={item.status === "Diterima"}
                          >
                            ✅ Terima
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(item.id, "Ditolak")}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-150 disabled:opacity-50"
                            disabled={item.status === "Ditolak"}
                          >
                            ❌ Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}