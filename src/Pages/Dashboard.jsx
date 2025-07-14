import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Instagram, Facebook, Music, TrendingUp, DollarSign, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedReservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setReservations(storedReservations);
    setEvents(storedEvents);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter(r => r.tanggal === today);
  const todayEvents = events.filter(e => e.date === today);

  const totalToday = todayReservations.length;
  const totalAll = reservations.length;

  const eventCount = events.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(eventCount).map(([name, value]) => ({ name, value }));
  const COLORS = ["#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#F3F4F6"];

  const revenueData = [
    { name: 'January', revenue: 4000 },
    { name: 'February', revenue: 3000 },
    { name: 'March', revenue: 5000 },
    { name: 'April', revenue: 7000 },
    { name: 'May', revenue: 6000 },
    { name: 'June', revenue: 8000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 mt-1">Kelola dan pantau aktivitas restoran serta event lainnya</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Hari ini</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Reservations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Reservasi Hari Ini</h2>
                  <p className="text-sm text-gray-600">Total booking untuk hari ini</p>
                  <p className="text-4xl font-bold text-green-700">{totalToday}</p>
                </div>
                <div className="text-green-600 bg-green-50 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Hari Ini</h2>
                  <p className="text-sm text-gray-600">Total acara yang terjadi hari ini</p>
                  <p className="text-4xl font-bold text-blue-700">{todayEvents.length}</p>
                </div>
                <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Pelanggan Baru</h2>
                  <p className="text-sm text-gray-600">Total pelanggan yang baru datang</p>
                  <p className="text-4xl font-bold text-purple-700">{Math.floor(Math.random() * 50) + 10}</p>
                </div>
                <div className="text-purple-600 bg-purple-50 p-3 rounded-xl">
                  <UserPlus className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900">Pendapatan Bulanan</h2>
          </div>
          <div className="p-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
