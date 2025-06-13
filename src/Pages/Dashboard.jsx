import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { title: "Pendapatan Hari Ini", value: "Rp1.200.000", color: "bg-[#A3B18A]" },
    { title: "Pesanan Hari Ini", value: "58 Pesanan", color: "bg-[#9DA17B]" },
    { title: "Menu Aktif", value: "26 Item", color: "bg-[#E4E6DC]" },
    { title: "Reservasi", value: "12 Meja", color: "bg-[#DADADA]" },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Pendapatan (juta)",
        data: [12, 19, 10, 25, 15, 30],
        backgroundColor: "#A3B18A",
        borderRadius: 6, // bulatkan batang chart
        maxBarThickness: 40,
      },
    ],
  };

  const pieData = {
    labels: ["Minuman", "Makanan Berat", "Pastry", "Snack"],
    datasets: [
      {
        data: [30, 40, 15, 15],
        backgroundColor: ["#A3B18A", "#E4E6DC", "#9DA17B", "#DADADA"],
        borderWidth: 1,
        borderColor: "#FAFAF8",
      },
    ],
  };

  return (
    <div className="p-8 bg-[#FAFAF8] min-h-screen text-[#444444] font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-1 tracking-wide">Selamat Datang, Admin</h1>
        <p className="text-gray-600 text-lg">{today}</p>
      </header>

      {/* Statistik */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map(({ title, value, color }) => (
          <div
            key={title}
            className={`${color} p-6 rounded-2xl shadow-lg text-[#222] flex flex-col justify-center`}
            style={{ minHeight: 120 }}
          >
            <p className="text-md font-medium opacity-90">{title}</p>
            <h2 className="text-3xl font-bold mt-3">{value}</h2>
          </div>
        ))}
      </section>

      {/* Grafik */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col">
          <h3 className="font-semibold text-2xl mb-6 border-b border-gray-200 pb-2">
            Pendapatan Bulanan
          </h3>
          <Bar data={barData} options={{ 
            responsive: true, 
            plugins: { 
              legend: { position: "top", labels: { font: { size: 14 } } },
              tooltip: { enabled: true }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { font: { size: 14 } },
                grid: { color: "#eee" }
              },
              x: {
                ticks: { font: { size: 14 } },
                grid: { display: false }
              }
            }
          }} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col">
          <h3 className="font-semibold text-2xl mb-6 border-b border-gray-200 pb-2">
            Kategori Menu Populer
          </h3>
          <Pie data={pieData} options={{ 
            responsive: true, 
            plugins: { 
              legend: { position: "right", labels: { font: { size: 14 } } },
              tooltip: { enabled: true }
            },
          }} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
