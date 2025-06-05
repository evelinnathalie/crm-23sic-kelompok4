import React, { useState, useEffect } from "react";

// Nama key untuk menyimpan di localStorage
const STORAGE_KEY = "salesData";

export default function Reservasi() {
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    customerName: "",
    date: "",
    status: "Belum Lunas",
  });

  // Load data dari localStorage saat pertama kali komponen dimount
  useEffect(() => {
    const storedSales = localStorage.getItem(STORAGE_KEY);
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

  // Simpan data ke localStorage setiap kali sales berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }, [sales]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSale = () => {
    if (!formData.bookingId || !formData.customerName || !formData.date) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newSale = {
      id: Date.now(), // pakai timestamp agar unik
      bookingId: formData.bookingId,
      customerName: formData.customerName,
      date: formData.date,
      status: formData.status,
    };
    setSales([...sales, newSale]);
    setFormData({
      bookingId: "",
      customerName: "",
      date: "",
      status: "Belum Lunas",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setSales(sales.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Booking</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {showForm ? "Batal Tambah Booking" : "Tambah Booking"}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
          <div className="mb-2">
            <label className="block font-medium mb-1">Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleInputChange}
              placeholder="Misal: BKID-003"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Nama Pemesan</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Masukkan nama pemesan"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
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

          <button
            onClick={handleAddSale}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Simpan
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pemesan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{sale.bookingId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {sale.status === "Lunas" ? (
                    <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Lunas
                    </span>
                  ) : sale.status === "Belum Lunas" ? (
                    <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Belum Lunas
                    </span>
                  ) : (
                    <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Batal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    onClick={() => alert("Fitur Edit belum tersedia")}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 font-semibold"
                    onClick={() => handleDelete(sale.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data booking
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
