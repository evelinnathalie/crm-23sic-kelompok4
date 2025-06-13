import React, { useState } from "react";

const initialCustomers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@mail.com",
    phone: "081234567890",
    active: true,
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti@mail.com",
    phone: "089876543210",
    active: false,
  },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      active: true,
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingId !== null) {
      setCustomers((prev) =>
        prev.map((cust) =>
          cust.id === editingId ? { ...cust, ...formData } : cust
        )
      );
    } else {
      const newCustomer = {
        id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
        ...formData,
      };
      setCustomers([...customers, newCustomer]);
    }
    resetForm();
  };

  const handleEdit = (cust) => {
    setFormData({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      active: cust.active,
    });
    setEditingId(cust.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pelanggan ini?")) {
      setCustomers(customers.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Form Pelanggan</h1>

      <div className="mb-6 bg-white border p-4 rounded shadow">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    
    <div>
      <label htmlFor="name" className="block mb-1 font-medium">Nama</label>
      <input
        id="name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Nama"
        className="border rounded px-3 py-2 w-full"
      />
    </div>

    <div>
      <label htmlFor="email" className="block mb-1 font-medium">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="border rounded px-3 py-2 w-full"
      />
    </div>

    <div>
      <label htmlFor="phone" className="block mb-1 font-medium">Telepon</label>
      <input
        id="phone"
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Telepon"
        className="border rounded px-3 py-2 w-full"
      />
    </div>

    <div className="pt-1">
      <label htmlFor="activeCheckbox" className="block mb-1 font-medium">Status</label>
      <div className="flex items-center h-full">
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
    </div>
  </div>

  <button
    onClick={handleSubmit}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
  >
    {editingId ? "Update Pelanggan" : "Simpan"}
  </button>
</div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Telepon</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.phone}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    cust.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {cust.active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(cust)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(cust.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data pelanggan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
