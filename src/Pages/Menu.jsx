import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

const categories = ['Espresso Based', 'Kopi Susu', 'Non-Coffee', 'Tea', 'Makanan', 'Snack'];

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ nama: '', kategori: categories[0], harga: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data, error } = await supabase.from('menus').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Gagal mengambil data:", error);
    } else {
      setMenus(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.harga || !form.image_url) {
      alert("Nama, harga, dan URL gambar wajib diisi!");
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('menus').update(form).eq('id', editingId);
      if (error) console.error("Gagal update:", error);
      else {
        setEditingId(null);
        setForm({ nama: '', kategori: categories[0], harga: '', image_url: '' });
        fetchMenus();
      }
    } else {
      const { error } = await supabase.from('menus').insert([form]);
      if (error) console.error("Gagal tambah:", error);
      else {
        setForm({ nama: '', kategori: categories[0], harga: '', image_url: '' });
        fetchMenus();
      }
    }
  };

  const handleEdit = (menu) => {
    setEditingId(menu.id);
    setForm({
      nama: menu.nama,
      kategori: menu.kategori,
      harga: menu.harga,
      image_url: menu.image_url,
    });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus menu ini?");
    if (!confirm) return;
    const { error } = await supabase.from('menus').delete().eq('id', id);
    if (error) console.error("Gagal hapus:", error);
    else fetchMenus();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nama: '', kategori: categories[0], harga: '', image_url: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Menu</h1>
          <p className="text-gray-600">Kelola dan pantau semua menu restoran</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? "Edit Menu" : "Tambah Menu Baru"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nama Menu</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Masukkan nama menu"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Kategori</label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  {categories.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Harga (Rp)</label>
                <input
                  name="harga"
                  type="number"
                  value={form.harga}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">URL Gambar</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm"
                  >
                    {editingId ? "Update" : "Tambah"}
                  </button>
                  {editingId && (
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Daftar Menu</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Menu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <tr key={menu.id} className={`hover:bg-gray-50 transition-colors duration-200 ${editingId === menu.id ? 'bg-green-50' : ''}`}>
                      <td className="px-6 py-4">
                        <img
                          src={menu.image_url}
                          alt={menu.nama}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">{menu.nama}</td>
                      <td className="px-6 py-4">{menu.kategori}</td>
                      <td className="px-6 py-4">Rp {menu.harga.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(menu)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(menu.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-xl text-gray-400">Belum ada menu tersedia</div>
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
};

export default Menu;
