import React, { useState } from "react";

const initialPromos = [
  { id: 1, title: "Diskon Akhir Tahun", description: "Diskon 20% untuk semua produk", active: true },
  { id: 2, title: "Promo Member Baru", description: "Cashback 10% untuk member baru", active: false },
];

export default function PromoManagement() {
  const [promos, setPromos] = useState(initialPromos);
  const [formData, setFormData] = useState({ title: "", description: "", active: true });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdate = () => {
    if (!formData.title || !formData.description) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      setPromos((prev) =>
        prev.map((promo) =>
          promo.id === editingId ? { ...promo, ...formData } : promo
        )
      );
      setEditingId(null);
    } else {
      const newPromo = {
        id: promos.length ? Math.max(...promos.map(e => e.id)) + 1 : 1,
        ...formData,
      };
      setPromos([...promos, newPromo]);
    }
    setFormData({ title: "", description: "", active: true });
  };

  const handleEdit = (promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      active: promo.active,
    });
    setEditingId(promo.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setPromos(promos.filter((e) => e.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ title: "", description: "", active: true });
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Kelola Promo</h1>

      <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block font-medium mb-1">Status</label>
            <select
              name="active"
              value={formData.active ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.value === "true" }))
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
                <td colSpan={5} className="text-center py-4 text-gray-500">
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
