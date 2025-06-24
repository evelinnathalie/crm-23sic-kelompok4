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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Kelola Promo</h1>

      <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block font-medium mb-1">Judul Promo</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Judul Promo"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Deskripsi Promo</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Deskripsi Promo"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Poin Dibutuhkan</label>
            <input
              type="number"
              name="required_points"
              value={formData.required_points}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Expired (hari)</label>
            <input
              type="number"
              name="expired_days"
              value={formData.expired_days}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="7"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="active"
              value={formData.active ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  active: e.target.value === "true",
                }))
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAddOrUpdate}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          {editingId ? "Update Promo" : "Tambah"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promos.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{promo.id}</td>
                <td className="px-6 py-4">{promo.title}</td>
                <td className="px-6 py-4">{promo.description}</td>
                <td className="px-6 py-4">{promo.required_points}</td>
                <td className="px-6 py-4">{promo.expired_days} hari</td>
                <td className="px-6 py-4 text-center">
                  {promo.active ? (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">
                      Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleEdit(promo)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(promo.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data promo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
