import React, { useState } from "react";

const initialOrders = [
  {
    id: 1,
    customer: "Andi",
    type: "On-site",
    item: "Cappuccino",
    quantity: 2,
    status: "Diproses",
  },
  {
    id: 2,
    customer: "Budi",
    type: "Online",
    item: "Donat Coklat",
    quantity: 1,
    status: "Selesai",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    type: "On-site",
    item: "",
    quantity: 1,
    status: "Diproses",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleAddOrder = () => {
    if (!formData.customer || !formData.item || formData.quantity < 1) {
      alert("Semua kolom wajib diisi dengan benar!");
      return;
    }
    const newOrder = {
      ...formData,
      id: orders.length + 1,
    };
    setOrders([...orders, newOrder]);
    setFormData({ customer: "", type: "On-site", item: "", quantity: 1, status: "Diproses" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pesanan ini?")) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    );
    setOrders(updated);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kelola Pesanan Makanan/Minuman</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {showForm ? "Batal Tambah Pesanan" : "Tambah Pesanan"}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-white shadow">
          <div className="mb-2">
            <label className="block mb-1 font-medium">Nama Pelanggan</label>
            <input
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Contoh: Evelin"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Tipe Pesanan</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option>On-site</option>
              <option>Online</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Menu</label>
            <input
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Contoh: Cinnamon Roll"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Jumlah</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              min="1"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            onClick={handleAddOrder}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simpan Pesanan
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Nama</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Tipe</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Menu</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Jumlah</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">{order.type}</td>
                <td className="px-4 py-2">{order.item}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
                <td className="px-4 py-2 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option>Diproses</option>
                    <option>Selesai</option>
                    <option>Dibatalkan</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(order.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
