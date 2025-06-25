// src/pages/Pesanan.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Pesanan() {
  /* --------------------- state --------------------- */
  const [pesanan, setPesanan] = useState([]);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [totalSemua, setTotalSemua] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------- ambil data sekali ----------------- */
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
        .filter((x) => x.created_at.startsWith(today))
        .reduce((sum, x) => sum + x.total, 0);

      setTotalHariIni(totalToday);
      setTotalSemua(data.reduce((s, x) => s + x.total, 0));
    }
    setIsLoading(false);
  };

  /* ---------------- update status ---------------- */
  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Gagal memperbarui status pesanan.");
    } else {
      fetchData();
    }
  };

  /* --------------------- render -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kelola Pesanan
              </h1>
              <p className="text-gray-600 text-lg">
                Pantau dan kelola semua pesanan masuk
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 font-medium">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SummaryCard 
            label="Pendapatan Hari Ini" 
            value={totalHariIni}
            icon="📊"
            trend="+12% dari kemarin"
          />
          <SummaryCard 
            label="Total Keseluruhan" 
            value={totalSemua}
            icon="💰"
            trend="Semua waktu"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-olive-50 to-olive-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              Daftar Pesanan
              <span className="ml-auto text-sm font-normal text-gray-600">
                {pesanan.length} pesanan
              </span>
            </h2>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Order ID</Th>
                  <Th>No. Telepon</Th>
                  <Th>Tipe Order</Th>
                  <Th>Detail Pesanan</Th>
                  <Th>Total Bayar</Th>
                  <Th>Status</Th>
                  <Th>Waktu Order</Th>
                </tr>
              </thead>
            </table>

            {/* Scrollable Body */}
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <RowMessage colSpan={7} text="Memuat data pesanan..." />
                  ) : pesanan.length === 0 ? (
                    <RowMessage colSpan={7} text="Belum ada pesanan masuk." />
                  ) : (
                    pesanan.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <Td>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-2 h-2 bg-olive-500 rounded-full mr-3"></div>
                            <span className="font-mono text-sm text-gray-900">
                              {item.id.slice(0, 8)}…
                            </span>
                          </div>
                        </Td>
                        
                        <Td>
                          <div className="flex items-center">
                            <span className="mr-2">📱</span>
                            <span className="font-medium text-gray-900">{item.phone}</span>
                          </div>
                        </Td>
                        
                        <Td>
                          <TypeBadge type={item.type} />
                        </Td>

                        <Td>
                          <div className="max-h-24 overflow-y-auto pr-2">
                            <div className="space-y-1">
                              {item.items.split(",").map((menu, i) => (
                                <div key={i} className="flex items-center text-sm">
                                  <div className="w-1.5 h-1.5 bg-olive-400 rounded-full mr-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{menu.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Td>

                        <Td>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              Rp{item.total.toLocaleString()}
                            </div>
                          </div>
                        </Td>
                        
                        <Td>
                          <StatusSelect 
                            value={item.status}
                            onChange={(newStatus) => handleUpdateStatus(item.id, newStatus)}
                          />
                        </Td>
                        
                        <Td>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })}
                            </div>
                            <div className="text-gray-500">
                              {new Date(item.created_at).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- komponen kecil pendukung ---------- */
function SummaryCard({ label, value, icon, trend }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {trend}
        </div>
      </div>
      <h2 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
        {label}
      </h2>
      <p className="text-3xl font-bold text-olive-700 mb-1">
        Rp {value.toLocaleString()}
      </p>
    </div>
  );
}

function TypeBadge({ type }) {
  const getTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'dine-in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'takeaway':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivery':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeStyle(type)}`}>
      {type}
    </span>
  );
}

function StatusSelect({ value, onChange }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Diproses':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Selesai':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 ${getStatusStyle(value)}`}
    >
      <option value="Diproses">🔄 Diproses</option>
      <option value="Selesai">🎉 Selesai</option>
    </select>
  );
}

const Th = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap">
    {children}
  </td>
);

const RowMessage = ({ colSpan, text }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-12 text-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-gray-500 text-lg font-medium">{text}</p>
      </div>
    </td>
  </tr>
);