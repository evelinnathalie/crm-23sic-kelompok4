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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kelola Menu
              </h1>
              <p className="text-gray-600 text-lg">
                Tambah, edit, dan kelola item menu restoran
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-olive-500 rounded-full"></div>
              <span className="text-sm text-gray-500 font-medium">
                {menus.length} Menu Items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-olive-50 to-olive-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">{editingId ? "✏️" : "➕"}</span>
              {editingId ? "Edit Menu Item" : "Tambah Menu Baru"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
              {/* Nama Menu */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nama Menu
                </label>
                <input 
                  name="nama" 
                  value={form.nama} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Masukkan nama menu"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Kategori
                </label>
                <select 
                  name="kategori" 
                  value={form.kategori} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  {categories.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Harga */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Harga (Rp)
                </label>
                <input 
                  name="harga" 
                  type="number" 
                  value={form.harga} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="0"
                />
              </div>

              {/* URL Gambar */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  URL Gambar
                </label>
                <input 
                  name="image_url" 
                  value={form.image_url} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 opacity-0">
                  Action
                </label>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors duration-200 font-medium shadow-sm"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-olive-50 to-olive-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🍽️</span>
              Daftar Menu
              <span className="ml-auto text-sm font-normal text-gray-600">
                Total: {menus.length} items
              </span>
            </h2>
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
                    <tr key={menu.id} className={`hover:bg-gray-50 transition-colors duration-200 ${editingId === menu.id ? 'bg-olive-50' : ''}`}>
                      {/* Image Preview */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img 
                            src={menu.image_url} 
                            alt={menu.nama}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4IDI4TDM2IDM2TDQwIDMyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                      </td>
                      
                      {/* Menu Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {menu.nama}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              ID: {menu.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CategoryBadge category={menu.kategori} />
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-olive-700">
                          Rp {menu.harga.toLocaleString()}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(menu)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            <span className="mr-1">✏️</span>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(menu.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                          >
                            <span className="mr-1">🗑️</span>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Belum ada menu tersedia</p>
                        <p className="text-gray-400 text-sm">Tambahkan menu pertama menggunakan form di atas</p>
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
};

/* ---------- Category Badge Component ---------- */
function CategoryBadge({ category }) {
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Espresso Based':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Kopi Susu':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Non-Coffee':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Tea':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Makanan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Snack':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Espresso Based':
        return '☕';
      case 'Kopi Susu':
        return '🥛';
      case 'Non-Coffee':
        return '🥤';
      case 'Tea':
        return '🍵';
      case 'Makanan':
        return '🍽️';
      case 'Snack':
        return '🍪';
      default:
        return '📋';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryStyle(category)}`}>
      <span className="mr-1">{getCategoryIcon(category)}</span>
      {category}
    </span>
  );
}

export default Menu;