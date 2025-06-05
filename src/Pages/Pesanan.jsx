import React, { useState } from 'react';

const initialOrders = [
  { id: 1, customer: 'Evelin', type: 'On-site', items: 'Latte, Croissant', status: 'Diproses' },
  { id: 2, customer: 'Budi', type: 'Online', items: 'Espresso', status: 'Selesai' },
  { id: 3, customer: 'Sari', type: 'On-site', items: 'Americano', status: 'Diproses' },
];

const statuses = ['Diproses', 'Selesai', 'Dibatalkan'];
const types = ['On-site', 'Online'];

const Pesanan = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [form, setForm] = useState({ customer: '', type: types[0], items: '', status: statuses[0] });
  const [editingId, setEditingId] = useState(null);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new order
  const addOrder = () => {
    if (!form.customer || !form.items) {
      alert('Nama customer dan pesanan harus diisi!');
      return;
    }
    const newOrder = {
      id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...form,
    };
    setOrders([...orders, newOrder]);
    setForm({ customer: '', type: types[0], items: '', status: statuses[0] });
  };

  // Start editing an order
  const startEdit = (order) => {
    setEditingId(order.id);
    setForm({ customer: order.customer, type: order.type, items: order.items, status: order.status });
  };

  // Save edited order
  const saveEdit = () => {
    setOrders(
      orders.map(o => (o.id === editingId ? { ...o, ...form } : o))
    );
    setEditingId(null);
    setForm({ customer: '', type: types[0], items: '', status: statuses[0] });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ customer: '', type: types[0], items: '', status: statuses[0] });
  };

  // Delete order
  const deleteOrder = (id) => {
    if(window.confirm('Yakin ingin menghapus pesanan ini?')){
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold text-[#444444] mb-6">Kelola Pesanan</h1>

      {/* Form Add/Edit */}
      <div className="mb-6 bg-white p-4 rounded shadow border border-[#E4E6DC]">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Pesanan' : 'Tambah Pesanan'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block mb-1 text-sm font-medium">Customer</label>
            <input
              type="text"
              name="customer"
              value={form.customer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nama customer"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Tipe</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Pesanan</label>
            <input
              type="text"
              name="items"
              value={form.items}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Contoh: Latte, Croissant"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
                onClick={addOrder}
                className="px-4 py-2 bg-[#98BF64] hover:bg-[#7a9e4f] text-white rounded"
              >
                Tambah
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden border border-[#E4E6DC]">
        <thead className="bg-[#E8ECE5] text-[#444444]">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Tipe</th>
            <th className="p-4 text-left">Pesanan</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, customer, type, items, status }) => (
            <tr key={id} className="border-t border-[#DADADA]">
              <td className="p-4">{id}</td>
              <td className="p-4">{customer}</td>
              <td className="p-4">{type}</td>
              <td className="p-4">{items}</td>
              <td className="p-4 font-semibold text-[#98BF64]">{status}</td>
              <td className="p-4 space-x-2">
                <button
                  onClick={() => startEdit({ id, customer, type, items, status })}
                  className="px-3 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOrder(id)}
                  className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                Belum ada pesanan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pesanan;