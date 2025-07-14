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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Akan Datang":
        return "bg-green-100 text-green-800 border-green-200";
      case "Selesai":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Dibatalkan":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Workshop":
        return "🎯";
      case "Music":
        return "🎵";
      case "Community":
        return "👥";
      default:
        return "📅";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Event</h1>
          <p className="text-gray-600">Kelola dan pantau semua event komunitas</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? "Edit Event" : "Tambah Event Baru"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* First Row */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nama Event</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Penyelenggara</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Nama penyelenggara"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tanggal Event</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Lokasi</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Alamat atau lokasi event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
                />
              </div>

              {/* Second Row */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Status Event</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Kategori Event</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Music">Music</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">URL Gambar</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    {editingId ? "💾 Update Event" : " Tambah Event"}
                  </button>
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Daftar Event</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Preview
                  </th>
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
                    <tr key={event.id} className={`hover:bg-green-50 transition-colors duration-200 ${editingId === event.id ? 'bg-green-50' : ''}`}>
                      <td className="px-6 py-4">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.eventName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{getCategoryIcon(event.kategori)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">{event.eventName}</td>
                      <td className="px-6 py-4">{event.organizer}</td>
                      <td className="px-6 py-4">{event.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-500 text-lg font-medium">Belum ada event tersedia</p>
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
