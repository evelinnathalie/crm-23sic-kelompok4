import React, { useState } from "react";

const initialEvents = [
  { id: 1, name: "Melati Daeva", email: "melati@mail.com", phone: "081234568392", lomba: "Mobile Legend", active: true },
  { id: 2, name: "Kevin Sanjaya", email: "kevin@mail.com", phone: "089749339294", lomba: "Mobile Legend", active: false },
  { id: 3, name: "Praven Jordan", email: "praven@mail.com", phone: "081523828928", lomba: "Mobile Legend", active: true },
];

export default function EventManagement() {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", lomba: "", active: true });
  const [editingId, setEditingId] = useState(null); // NEW

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.lomba) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId ? { ...ev, ...formData } : ev
        )
      );
      setEditingId(null);
    } else {
      const newEvent = {
        id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
        ...formData,
      };
      setEvents([...events, newEvent]);
    }

    setFormData({ name: "", email: "", phone: "", lomba: "", active: true });
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name,
      email: event.email,
      phone: event.phone,
      lomba: event.lomba,
      active: event.active,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setEvents(events.filter((e) => e.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: "", email: "", phone: "", lomba: "", active: true });
        setShowForm(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Peserta Lomba</h1>

      <button
        onClick={() => {
          if (editingId) {
            setEditingId(null);
            setFormData({ name: "", email: "", phone: "", lomba: "", active: true });
          }
          setShowForm((prev) => !prev);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showForm ? "Batal" : "Tambah Peserta"}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
          <div className="mb-2">
            <label className="block font-medium mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nama peserta"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email peserta"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Telepon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nomor telepon"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Lomba</label>
            <input
              type="text"
              name="lomba"
              value={formData.lomba}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nama Perlombaan"
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              id="activeCheckbox"
              className="mr-2"
            />
            <label htmlFor="activeCheckbox" className="font-medium">Aktif</label>
          </div>
          <button
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {editingId ? "Update Peserta" : "Simpan"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lomba</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((cust) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{cust.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cust.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cust.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cust.lomba}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {cust.active ? (
                    <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      On Going
                    </span>
                  ) : (
                    <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Done
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                    onClick={() => handleEdit(cust)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 font-semibold"
                    onClick={() => handleDelete(cust.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data peserta
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
