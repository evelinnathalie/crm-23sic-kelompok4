import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reservations")) || [];
    setReservations(stored);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter(r => r.tanggal === today);

  const totalToday = todayReservations.length;
  const totalAll = reservations.length;

  const acaraCount = reservations.reduce((acc, curr) => {
    acc[curr.acara] = (acc[curr.acara] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(acaraCount).map(([name, value]) => ({ name, value }));
  const COLORS = ["#10B981", "#22C55E", "#3B82F6", "#8B4513", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📅 Reservasi Hari Ini</h2>
          <p className="text-4xl font-bold text-emerald-600">{totalToday}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📊 Total Reservasi</h2>
          <p className="text-4xl font-bold text-blue-600">{totalAll}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🍽️ Distribusi Jenis Acara</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">Belum ada data reservasi untuk ditampilkan.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Daftar Reservasi</h2>
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2">Nama</th>
                <th className="p-2">Nomor WA</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Waktu</th>
                <th className="p-2">Jumlah Orang</th>
                <th className="p-2">Acara</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.nama}</td>
                  <td className="p-2">{r.nomor}</td>
                  <td className="p-2">{r.tanggal}</td>
                  <td className="p-2">{r.waktu}</td>
                  <td className="p-2">{r.jumlah}</td>
                  <td className="p-2">{r.acara}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
