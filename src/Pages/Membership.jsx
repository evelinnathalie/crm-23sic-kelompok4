import React, { useState } from "react";

const initialMembers = [
  {
    id: 1,
    name: "Eka Pratama",
    email: "eka@mail.com",
    phone: "081234567890",
    is_active: true,
    loyalty_points: 125,
    membership_level: "Silver",
    joined_at: "2024-12-01",
  },
  {
    id: 2,
    name: "Dewi Lestari",
    email: "dewi@mail.com",
    phone: "082233445566",
    is_active: true,
    loyalty_points: 300,
    membership_level: "Gold",
    joined_at: "2024-11-15",
  },
];

export default function MemberManagement() {
  const [members, setMembers] = useState(initialMembers);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    is_active: true,
    loyalty_points: 0,
    membership_level: "Bronze",
    joined_at: new Date().toISOString().slice(0, 10),
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...formData } : m))
      );
      setEditingId(null);
    } else {
      const newMember = {
        id: members.length ? Math.max(...members.map((m) => m.id)) + 1 : 1,
        ...formData,
      };
      setMembers([...members, newMember]);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      is_active: true,
      loyalty_points: 0,
      membership_level: "Bronze",
      joined_at: new Date().toISOString().slice(0, 10),
    });
  };

  const handleEdit = (member) => {
    setFormData({ ...member });
    setEditingId(member.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus member ini?")) {
      setMembers(members.filter((m) => m.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          is_active: true,
          loyalty_points: 0,
          membership_level: "Bronze",
          joined_at: new Date().toISOString().slice(0, 10),
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Kelola Member</h1>

      <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nama"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Telepon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Telepon"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Level Membership</label>
            <select
              name="membership_level"
              value={formData.membership_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Poin Loyalty</label>
            <input
              type="number"
              name="loyalty_points"
              value={formData.loyalty_points}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Poin Loyalty"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              id="is_active"
              className="mr-2"
            />
            <label htmlFor="is_active">Aktif</label>
          </div>
        </div>

        <button
          onClick={handleAddOrUpdate}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          {editingId ? "Update Member" : "Tambah"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Telepon</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Poin</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Level</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{m.name}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">{m.phone}</td>
                <td className="px-4 py-3 text-center">{m.loyalty_points}</td>
                <td className="px-4 py-3 text-center">{m.membership_level}</td>
                <td className="px-4 py-3 text-center">
                  {m.is_active ? (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">
                      Tidak Aktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data member
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
