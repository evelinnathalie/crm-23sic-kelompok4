
import { useEffect, useState } from "react";
import { supabase } from "../supabase";


export default function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [totalSemua, setTotalSemua] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });


    if (error) {
      console.error("Gagal mengambil data pesanan:", error.message);
    } else {
      setPesanan(data);


      const today = new Date().toISOString().slice(0, 10);
      const totalToday = data
        .filter((item) => item.created_at.startsWith(today))
        .reduce((sum, item) => sum + item.total, 0);


      const totalAll = data.reduce((sum, item) => sum + item.total, 0);


      setTotalHariIni(totalToday);
      setTotalSemua(totalAll);
    }
    setIsLoading(false);
  };


  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);


    if (error) {
      alert("Gagal memperbarui status pesanan.");
    } else {
      fetchData(); // refresh data
    }
  };

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

      <h1 className="text-3xl font-semibold mb-6 text-[#444]">Kelola Pesanan</h1>


      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-lg font-medium mb-1 text-gray-600">Total Hari Ini</h2>
          <p className="text-2xl font-bold text-green-700">Rp {totalHariIni.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-lg font-medium mb-1 text-gray-600">Total Keseluruhan</h2>
          <p className="text-2xl font-bold text-green-700">Rp {totalSemua.toLocaleString()}</p>
        </div>
      </div>


      <div className="bg-white rounded border shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#E8ECE5] text-[#444]">

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
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Customer</th>
              <th className="p-3 text-left text-sm font-semibold">Nomor</th>
              <th className="p-3 text-left text-sm font-semibold">Tipe</th>
              <th className="p-3 text-left text-sm font-semibold">Total</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Waktu</th>
            </tr>

          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">Memuat data...</td>
              </tr>
            ) : pesanan.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              pesanan.map((item) => (
                <tr key={item.id} className="border-t text-sm">
                  <td className="p-3">{item.id.slice(0, 8)}...</td>
                  <td className="p-3">{item.customer}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">Rp {item.total.toLocaleString()}</td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Diproses">Diproses</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

