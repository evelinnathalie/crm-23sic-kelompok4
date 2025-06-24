
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

import React, { useState, useEffect } from 'react';

const categories = ['Espresso Based', 'Kopi Susu', 'Non-Coffee', 'Tea', 'Makanan', 'Snack'];

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', category: categories[0], price: '', gambar: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('menus');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMenus(parsed);
      console.log("Loaded menus:", parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
    console.log("Saved menus:", menus);
  }, [menus]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addMenu = () => {
    if (!form.name || !form.price || !form.gambar) {
      alert('Semua field harus diisi!');
      return;
    }
    const newMenu = {
      id: menus.length ? Math.max(...menus.map(m => m.id)) + 1 : 1,
      ...form,
      price: parseInt(form.price),
    };
    setMenus([...menus, newMenu]);
    setForm({ name: '', category: categories[0], price: '', gambar: '' });

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
      // Update
      const { error } = await supabase.from('menus').update(form).eq('id', editingId);
      if (error) console.error("Gagal update:", error);
      else {
        setEditingId(null);
        setForm({ nama: '', kategori: categories[0], harga: '', image_url: '' });
        fetchMenus();
      }
    } else {
      // Insert
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

  const saveEdit = () => {
    setMenus(menus.map(m => (m.id === editingId ? { ...form, price: parseInt(form.price), id: editingId } : m)));
    setEditingId(null);
    setForm({ name: '', category: categories[0], price: '', gambar: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', category: categories[0], price: '', gambar: '' });
  };

  const deleteMenu = (id) => {
    if (window.confirm('Yakin ingin menghapus menu ini?')) {
      setMenus(menus.filter(m => m.id !== id));
    }

  };


  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#444]">Kelola Menu</h1>



      {/* Form */}
      <div className="bg-white rounded border p-4 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Menu" : "Tambah Menu"}</h2>
        <div className="grid md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm font-medium">Nama Menu</label>
            <input name="nama" value={form.nama} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Nama menu" />
          </div>
          <div>
            <label className="text-sm font-medium">Kategori</label>
            <select name="kategori" value={form.kategori} onChange={handleChange}
              className="w-full p-2 border rounded">
              {categories.map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Harga</label>
            <input name="harga" type="number" value={form.harga} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Harga (angka)" />
          </div>
          <div>
            <label className="text-sm font-medium">URL Gambar</label>
            <input name="image_url" value={form.image_url} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="https://..." />
          </div>
          <div>
            <button onClick={handleSubmit}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
              {editingId ? "Update" : "Tambah"}
            </button>

      <div className="mb-6 bg-white p-4 rounded shadow border border-[#E4E6DC]">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Menu' : 'Tambah Menu'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block mb-1 text-sm font-medium">Nama Menu</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded" placeholder="Nama menu" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Kategori</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Harga</label>
            <input type="number" name="price" value={form.price} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded" placeholder="Harga (angka)" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">URL Gambar</label>
            <input type="text" name="gambar" value={form.gambar} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded" placeholder="https://..." />
          </div>
          <div>
            {editingId ? (
              <div className="space-x-2">
                <button onClick={saveEdit}
                  className="px-4 py-2 bg-[#98BF64] hover:bg-[#7a9e4f] text-white rounded">Simpan</button>
                <button onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">Batal</button>
              </div>
            ) : (
              <button onClick={addMenu}
                className="px-4 py-2 bg-[#98BF64] hover:bg-[#7a9e4f] text-white rounded">Tambah</button>
            )}
          </div>
        </div>
      </div>


      {/* Table */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-[#E8ECE5] text-[#444]">
          <tr>

            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Kategori</th>
            <th className="p-3 text-left">Harga</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.length > 0 ? (
            menus.map((menu) => (
              <tr key={menu.id} className="border-t">
                <td className="p-3">{menu.id}</td>
                <td className="p-3">{menu.nama}</td>
                <td className="p-3">{menu.kategori}</td>
                <td className="p-3">Rp {menu.harga.toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(menu)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(menu.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="p-4 text-center text-gray-500">Belum ada menu.</td></tr>

            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Nama</th>
            <th className="p-4 text-left">Kategori</th>
            <th className="p-4 text-left">Harga</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(({ id, name, category, price }) => (
            <tr key={id} className="border-t border-[#DADADA]">
              <td className="p-4">{id}</td>
              <td className="p-4">{name}</td>
              <td className="p-4">{category}</td>
              <td className="p-4">Rp {price.toLocaleString('id-ID')}</td>
              <td className="p-4 space-x-2">
                <button onClick={() => startEdit({ id, name, category, price })}
                  className="px-3 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">Edit</button>
                <button onClick={() => deleteMenu(id)}
                  className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white">Hapus</button>
              </td>
            </tr>
          ))}
          {menus.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">Belum ada menu.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default Menu;
