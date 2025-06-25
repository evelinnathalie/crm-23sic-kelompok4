import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    organizer: "",
    date: "",
    location: "",
    status: "Akan Datang",
    kategori: "Workshop",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("event").select("*").order("date", { ascending: true });
    if (error) console.error("Gagal ambil event:", error.message);
    else setEvents(data);
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      organizer: "",
      date: "",
      location: "",
      status: "Akan Datang",
      kategori: "Workshop",
      image: "",
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { eventName, organizer, date, location } = formData;
    if (!eventName || !organizer || !date || !location) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("event")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        alert("Gagal update event: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("event").insert([formData]);
      if (error) {
        alert("Gagal menambah event: " + error.message);
        return;
      }
    }

    resetForm();
    fetchEvents();
  };

  const handleEdit = (evt) => {
    setFormData(evt);
    setEditingId(evt.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event ini?")) return;
    const { error } = await supabase.from("event").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus event: " + error.message);
      return;
    }
    fetchEvents();
    if (editingId === id) resetForm();
  };

  // Helper functions for status and category styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Akan Datang':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case 'Workshop':
        return '🎯';
      case 'Music':
        return '🎵';
      case 'Community':
        return '👥';
      default:
        return '📅';
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.status === 'Akan Datang' && event.date >= today).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kelola Event
              </h1>
              <p className="text-gray-600 text-lg">
                Buat dan kelola event komunitas dan acara spesial
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-olive-700">
                {getUpcomingEvents()}
              </div>
              <div className="text-sm text-gray-500">
                Event Mendatang
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Event"
            value={events.length}
            icon="📅"
            color="bg-olive-100 text-olive-800"
          />
          <StatsCard
            title="Event Aktif"
            value={events.filter(e => e.status === 'Akan Datang').length}
            icon="🚀"
            color="bg-blue-100 text-blue-800"
          />
          <StatsCard
            title="Event Selesai"
            value={events.filter(e => e.status === 'Selesai').length}
            icon="✅"
            color="bg-green-100 text-green-800"
          />
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-olive-50 to-olive-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">{editingId ? "✏️" : "➕"}</span>
              {editingId ? "Edit Event" : "Tambah Event Baru"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nama Event *
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama event"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Penyelenggara *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="Nama penyelenggara"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Tanggal Event *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Alamat atau lokasi event"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status Event
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="Akan Datang">🔵 Akan Datang</option>
                    <option value="Selesai">🟢 Selesai</option>
                    <option value="Dibatalkan">🔴 Dibatalkan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Kategori Event
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="Workshop">🎯 Workshop</option>
                    <option value="Music">🎵 Music</option>
                    <option value="Community">👥 Community</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg (opsional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors duration-200 font-medium shadow-sm"
                  >
                    {editingId ? "Update Event" : "Simpan Event"}
                  </button>
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-olive-50 to-olive-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              Daftar Event
              <span className="ml-auto text-sm font-normal text-gray-600">
                Total: {events.length} event
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Penyelenggara
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal & Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr 
                      key={event.id} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        editingId === event.id ? 'bg-olive-50' : ''
                      }`}
                    >
                      {/* Event Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 bg-olive-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-lg">
                              {getCategoryIcon(event.kategori)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {event.eventName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.kategori}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Organizer */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.organizer}
                        </div>
                      </td>

                      {/* Date & Location */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 mb-1">
                            📅 {new Date(event.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-gray-500 flex items-center">
                            <span className="mr-1">📍</span>
                            {event.location}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                          {event.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            <span className="mr-1">✏️</span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                          >
                            <span className="mr-1">🗑️</span>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-2xl">📅</span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Belum ada event terdaftar</p>
                        <p className="text-gray-400 text-sm">Tambahkan event pertama menggunakan form di atas</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats Card Component ---------- */
function StatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}