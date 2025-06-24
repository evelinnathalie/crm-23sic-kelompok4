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


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kelola Event</h1>


      <div className="mb-6 p-4 border rounded shadow-sm bg-white space-y-4">
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
          placeholder="Nama Event"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="organizer"
          value={formData.organizer}
          onChange={handleInputChange}
          placeholder="Penyelenggara"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Lokasi"
          className="w-full px-4 py-2 border rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Akan Datang">Akan Datang</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
        <select
          name="kategori"
          value={formData.kategori}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Workshop">Workshop</option>
          <option value="Music">Music</option>
          <option value="Community">Community</option>
        </select>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="URL Gambar (opsional)"
          className="w-full px-4 py-2 border rounded"
        />


        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Event" : "Simpan Event"}
        </button>
      </div>


      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Penyelenggara</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-2">{event.eventName}</td>
                  <td className="px-4 py-2">{event.organizer}</td>
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">{event.location}</td>
                  <td className="px-4 py-2">{event.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(event.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada event
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


