import React, { useState } from "react";

const initialEvents = [
  {
    id: 1,
    eventName: "Seminar Teknologi 2025",
    organizer: "Universitas ABC",
    date: "2025-07-15",
    location: "Jakarta Convention Center",
    status: "Akan Datang",
  },
  {
    id: 2,
    eventName: "Workshop Desain UI/UX",
    organizer: "Komunitas Desainer Indonesia",
    date: "2025-06-20",
    location: "Bandung Creative Hub",
    status: "Selesai",
  },
];

export default function EventManagement() {
  const [events, setEvents] = useState(initialEvents);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    organizer: "",
    date: "",
    location: "",
    status: "Akan Datang",
  });

  const resetForm = () => {
    setFormData({
      eventName: "",
      organizer: "",
      date: "",
      location: "",
      status: "Akan Datang",
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
    if (!formData.eventName || !formData.organizer || !formData.date || !formData.location) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      // update
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === editingId ? { ...evt, ...formData } : evt
        )
      );
    } else {
      // tambah
      const newEvent = {
        id: events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1,
        ...formData,
      };
      setEvents([...events, newEvent]);
    }
    resetForm();
  };

  const handleEdit = (event) => {
    setFormData({ ...event });
    setEditingId(event.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus event ini?")) {
      setEvents(events.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Kelola Event</h1>

      <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
        <div className="mb-2">
          <label className="block font-medium mb-1">Nama Event</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Contoh: Seminar Nasional"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Penyelenggara</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nama penyelenggara"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Tanggal</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Lokasi</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tempat penyelenggaraan"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Akan Datang">Akan Datang</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {editingId ? "Update Event" : "Simpan Event"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyelenggara</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{event.eventName}</td>
                <td className="px-6 py-4">{event.organizer}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                      event.status === "Akan Datang"
                        ? "bg-yellow-100 text-yellow-800"
                        : event.status === "Selesai"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 font-semibold"
                    onClick={() => handleDelete(event.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data event
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}