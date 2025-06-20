import React, { useState, useEffect } from 'react';

const statuses = ['Diproses', 'Selesai', 'Dibatalkan'];
const types = ['Dine In', 'Takeaway'];
const ITEMS_PER_PAGE = 10;

const Pesanan = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    const loadOrders = () => {
      const saved = JSON.parse(localStorage.getItem("order_data") || "[]");
      const filtered = saved.filter(order => types.includes(order.type));
      const sorted = filtered.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      setOrders(sorted);
    };
    loadOrders();
    const handleStorage = (e) => {
      if (e.key === "order_data") loadOrders();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("order_data", JSON.stringify(data));
  };

  const updateStatus = (id, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    saveToStorage(updatedOrders);
  };

  const filteredOrders = filterStatus === 'Semua'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-[#FAFAF8] min-h-screen">
      <h1 className="text-3xl font-semibold text-[#444444] mb-6">Kelola Pesanan</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="Semua">Semua</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

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
          {paginatedOrders.map(({ id, customer, type, items, status }) => (
            <tr key={id} className="border-t border-[#DADADA]">
              <td className="p-4">{id}</td>
              <td className="p-4">{customer}</td>
              <td className="p-4">{type}</td>
              <td className="p-4">{items}</td>
              <td className="p-4">
                <select
                  value={status}
                  onChange={(e) => updateStatus(id, e.target.value)}
                  className="p-1 border border-gray-300 rounded"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="p-4">
                {status !== 'Dibatalkan' && (
                  <button
                    onClick={() => updateStatus(id, 'Dibatalkan')}
                    className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    Batalkan
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                Belum ada pesanan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                page === p ? 'bg-[#98BF64] text-white' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pesanan;
