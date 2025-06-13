import React, { useState } from 'react';

const initialData = [
  { id: 1, name: 'Air mineral', category: 'Air & ES', stock: 20 },
  { id: 2, name: 'Susu Almond', category: 'Alternatif Susu', stock: 5 },
];

const categories = ['Roti & Kue', 'Camilan', 'Topping & Hiasan','Produk Susu','Alternatif Susu', 'Saus & Cokelat', 'Kopi','Teh','Sirup & Perisa Minuman','Air & Es','Bubuk Campuran Minuman',];

const StockManagement = () => {
  const [items, setItems] = useState(initialData);
  const [form, setForm] = useState({ name: '', category: categories[0], stock: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = () => {
    if (!form.name || !form.stock) {
      alert('Nama barang dan stok harus diisi!');
      return;
    }
    const newItem = {
      id: items.length ? Math.max(...items.map(i => i.id)) + 1 : 1,
      ...form,
      stock: parseInt(form.stock),
    };
    setItems([...items, newItem]);
    setForm({ name: '', category: categories[0], stock: '' });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item, stock: item.stock.toString() });
  };

  const saveEdit = () => {
    setItems(items.map(i => (i.id === editingId ? { ...form, stock: parseInt(form.stock), id: editingId } : i)));
    setEditingId(null);
    setForm({ name: '', category: categories[0], stock: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', category: categories[0], stock: '' });
  };

  const deleteItem = (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold text-[#444444] mb-6">Kelola Stok Barang</h1>

      <div className="mb-6 bg-white p-4 rounded shadow border border-[#E4E6DC]">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Barang' : 'Tambah Barang'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block mb-1 text-sm font-medium">Nama Barang</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nama barang"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Kategori</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Jumlah Stok</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Jumlah stok"
            />
          </div>
          <div>
            {editingId ? (
              <div className="space-x-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-[#98BF64] hover:bg-[#7a9e4f] text-white rounded"
                >
                  Simpan
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={addItem}
                className="px-4 py-2 bg-[#98BF64] hover:bg-[#7a9e4f] text-white rounded"
              >
                Tambah
              </button>
            )}
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden border border-[#E4E6DC]">
        <thead className="bg-[#E8ECE5] text-[#444444]">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Nama Barang</th>
            <th className="p-4 text-left">Kategori</th>
            <th className="p-4 text-left">Stok</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, name, category, stock }) => (
            <tr key={id} className="border-t border-[#DADADA]">
              <td className="p-4">{id}</td>
              <td className="p-4">{name}</td>
              <td className="p-4">{category}</td>
              <td className="p-4">{stock}</td>
              <td className="p-4 space-x-2">
                <button
                  onClick={() => startEdit({ id, name, category, stock })}
                  className="px-3 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(id)}
                  className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">Belum ada barang.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;
