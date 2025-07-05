import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Pesanan() {
  /* --------------------- state --------------------- */
  const [pesanan, setPesanan] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Semua");
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

  const filteredData = pesanan.filter((item) =>
    statusFilter === "Semua" ? true : item.status === statusFilter
  );

  const getStatusStats = () => {
    const stats = {
      total: pesanan.length,
      diproses: pesanan.filter(item => item.status === "Diproses").length,
      selesai: pesanan.filter(item => item.status === "Selesai").length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Pesanan</h1>
          <p className="text-gray-600">Pantau dan kelola semua pesanan masuk</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendapatan Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">Rp {totalHariIni.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Keseluruhan</p>
                <p className="text-2xl font-bold text-gray-900">Rp {totalSemua.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diproses</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.diproses}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">{stats.selesai}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
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
                  <option value="Diproses">⏳ Diproses</option>
                  <option value="Selesai">✅ Selesai</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-gray-900">{filteredData.length}</span> dari <span className="font-semibold text-gray-900">{pesanan.length}</span> pesanan
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Daftar Pesanan</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID Pemesan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    📅 Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🕒 Waktu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    💵 Total Bayar
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    📊 Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🍽️ Jenis Pesanan
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🍴 Detail Pesanan
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ⚡ Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">Memuat data pesanan...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4">🍽️</div>
                        <p className="text-gray-500 text-lg font-medium">
                          {statusFilter === "Semua" ? "Belum ada pesanan" : `Tidak ada pesanan dengan status "${statusFilter}"`}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {statusFilter === "Semua" ? "Pesanan baru akan muncul di sini" : "Coba ubah filter untuk melihat pesanan lainnya"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{item.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{new Date(item.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-semibold text-gray-900">Rp{item.total.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${item.status === "Selesai" ? "bg-green-100 text-green-800" : item.status === "Diproses" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${item.type === "Dine-in" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-h-24 overflow-y-auto pr-2">
                          <div className="space-y-1">
                            {item.items.split(",").map((menu, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <div className="w-1.5 h-1.5 bg-olive-400 rounded-full mr-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{menu.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(item.id, "Selesai")}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                            disabled={item.status === "Selesai"}
                          >
                            ✅ Selesai
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, "Diproses")}
                            className="px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                            disabled={item.status === "Diproses"}
                          >
                            ⏳ Diproses
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
