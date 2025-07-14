import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Pastikan path ini sesuai

export default function PromoManagement() {
  const [promos, setPromos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_points: 0,
    expired_days: 7,
    active: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setPromos(data);
    else console.error("Error loading promos:", error.message);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdate = async () => {
    const { title, description, required_points, expired_days } = formData;
    if (!title || !description || required_points < 0 || expired_days < 1) {
      alert("Semua field wajib diisi dengan benar!");
      return;
    }

    if (editingId !== null) {
      const { error } = await supabase
        .from("vouchers")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        alert("Gagal update promo.");
        return;
      }
    } else {
      const { error } = await supabase.from("vouchers").insert([formData]);
      if (error) {
        alert("Gagal menambah promo.");
        return;
      }
    }

    setFormData({
      title: "",
      description: "",
      required_points: 0,
      expired_days: 7,
      active: true,
    });
    setEditingId(null);
    fetchPromos();
  };

  const handleEdit = (promo) => {
    setFormData({ ...promo });
    setEditingId(promo.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      const { error } = await supabase.from("vouchers").delete().eq("id", id);
      if (!error) fetchPromos();
      else alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Promo</h1>
          <p className="text-gray-600">Kelola voucher dan promosi untuk customer Anda</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? "Edit Promo" : "Tambah Promo Baru"}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Judul Promo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan judul promo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Deskripsi Promo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Deskripsi detail promo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Poin Dibutuhkan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="required_points"
                    value={formData.required_points}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="0"
                    min="0"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    🏆
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Berlaku (hari) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="expired_days"
                    value={formData.expired_days}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="7"
                    min="1"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    📅
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Status Promo
                </label>
                <select
                  name="active"
                  value={formData.active ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: e.target.value === "true",
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="true">✅ Aktif</option>
                  <option value="false">❌ Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddOrUpdate}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {editingId ? " Update Promo" : "Tambah Promo"}
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Daftar Promo</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Judul Promo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Poin Required
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Masa Berlaku
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promos.map((promo, index) => (
                  <tr key={promo.id} className={`hover:bg-green-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                        {promo.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{promo.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">{promo.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">🏆</span>
                        <span className="text-sm font-semibold text-gray-900">{promo.required_points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">📅</span>
                        <span className="text-sm text-gray-700">{promo.expired_days} hari</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {promo.active ? (
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                          ✅ Aktif
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
                           Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-150"
                          onClick={() => handleEdit(promo)}
                        >
                          
                           Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-150"
                          onClick={() => handleDelete(promo.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {promos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-500 text-lg font-medium">Belum ada data promo</p>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan promo pertama Anda menggunakan form di atas</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}