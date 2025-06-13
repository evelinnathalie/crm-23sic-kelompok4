import React, { useState } from "react";

const dummyCustomers = [
  { id: 1, name: "Budi Santoso" },
  { id: 2, name: "Siti Aminah" },
  { id: 3, name: "Andi Wijaya" },
];

const initialSales = [
  {
    id: 1,
    invoice: "INV-001",
    customerId: 1,
    date: "2025-05-10",
    total: 1500000,
    status: "Lunas",
  },
  {
    id: 2,
    invoice: "INV-002",
    customerId: 2,
    date: "2025-05-11",
    total: 250000,
    status: "Belum Lunas",
  },
];

function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
}

export default function SalesManagement() {
  const [sales, setSales] = useState(initialSales);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    invoice: "",
    customerId: "",
    date: "",
    total: "",
    status: "Belum Lunas",
  });

  const resetForm = () => {
    setFormData({
      invoice: "",
      customerId: "",
      date: "",
      total: "",
      status: "Belum Lunas",
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.invoice || !formData.customerId || !formData.date || !formData.total) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      // update
      setSales((prev) =>
        prev.map((sale) =>
          sale.id === editingId ? { ...sale, ...formData, customerId: Number(formData.customerId), total: Number(formData.total) } : sale
        )
      );
    } else {
      // tambah
      const newSale = {
        id: sales.length ? Math.max(...sales.map((s) => s.id)) + 1 : 1,
        ...formData,
        customerId: Number(formData.customerId),
        total: Number(formData.total),
      };
      setSales([...sales, newSale]);
    }
    resetForm();
  };

  const handleEdit = (sale) => {
    setFormData({
      invoice: sale.invoice,
      customerId: String(sale.customerId),
      date: sale.date,
      total: String(sale.total),
      status: sale.status,
    });
    setEditingId(sale.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus penjualan ini?")) {
      setSales(sales.filter((s) => s.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const getCustomerName = (id) => {
    const cust = dummyCustomers.find((c) => c.id === id);
    return cust ? cust.name : "-";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Penjualan</h1>

      <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Nomor Invoice</label>
            <input
              type="text"
              name="invoice"
              value={formData.invoice}
              onChange={handleInputChange}
              placeholder="Misal: INV-003"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Pelanggan</label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Pilih Pelanggan --</option>
              {dummyCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Total (Rp)</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleInputChange}
              placeholder="Jumlah total penjualan"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              min="0"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {editingId ? "Update Penjualan" : "Tambah Penjualan"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Invoice</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Pelanggan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tanggal</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{sale.invoice}</td>
                <td className="px-4 py-3">{getCustomerName(sale.customerId)}</td>
                <td className="px-4 py-3">{sale.date}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(sale.total)}</td>
                <td className="px-4 py-3 text-center">
                  {sale.status === "Lunas" ? (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">Lunas</span>
                  ) : sale.status === "Belum Lunas" ? (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-600">Belum Lunas</span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">Batal</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => handleEdit(sale)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(sale.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Hapus</button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Tidak ada data penjualan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
