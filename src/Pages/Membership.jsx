import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Membership() {
  const [members, setMembers] = useState([]);
  const [loyaltyData, setLoyaltyData] = useState({});
  const [poinInput, setPoinInput] = useState({});
  const [filterTier, setFilterTier] = useState("Semua");

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*");

    if (userError) {
      console.error("Gagal ambil data users:", userError.message);
      return;
    }

    const { data: loyalty, error: loyaltyError } = await supabase
      .from("loyalty")
      .select("user_id, poin");

    if (loyaltyError) {
      console.error("Gagal ambil data loyalty:", loyaltyError.message);
      return;
    }

    // Gabungkan data users + loyalty
    const loyaltyMap = {};
    loyalty.forEach((l) => {
      loyaltyMap[l.user_id] = l.poin;
    });

    setLoyaltyData(loyaltyMap);
    setPoinInput(loyaltyMap); // untuk input value juga
    setMembers(users);
  };

  const handleChangePoin = (userId, value) => {
    setPoinInput((prev) => ({ ...prev, [userId]: value }));
  };

  const savePoints = async (user) => {
    const user_id = user.id;
    const nama = user.nama;
    const poin = parseInt(poinInput[user_id]) || 0;

    const { data: existing, error: checkErr } = await supabase
      .from("loyalty")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (checkErr && checkErr.code !== "PGRST116") {
      console.error("Cek loyalty gagal:", checkErr.message);
      return;
    }

    if (existing) {
      const { error: updateErr } = await supabase
        .from("loyalty")
        .update({ poin, updated_at: new Date().toISOString() })
        .eq("user_id", user_id);

      if (updateErr) {
        console.error("Update gagal:", updateErr.message);
        return;
      }
    } else {
      const { error: insertErr } = await supabase.from("loyalty").insert([
        {
          user_id,
          nama,
          poin,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertErr) {
        console.error("Insert gagal:", insertErr.message);
        return;
      }
    }

    alert("Poin berhasil disimpan!");
    fetchAllMembers(); // refresh data
  };

  const determineTier = (poin) => {
    if (poin >= 600) return "Platinum";
    if (poin >= 300) return "Gold";
    if (poin >= 100) return "Silver";
    return "Bronze";
  };

  const filteredMembers =
    filterTier === "Semua"
      ? members
      : members.filter((m) => determineTier(loyaltyData[m.id] || 0) === filterTier);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Panel Keanggotaan Member</h1>

      <div className="flex gap-3 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
        >
          <option value="Semua">Semua Tier</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
        <button
          onClick={() => setFilterTier("Semua")}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nama</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tanggal Daftar</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Poin</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Tier</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">{u.nama}</td>
                <td className="px-4 py-3">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-20 text-center"
                    value={poinInput[u.id] ?? ""}
                    onChange={(e) => handleChangePoin(u.id, e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {determineTier(loyaltyData[u.id] || 0)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => savePoints(u)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Tidak ada member ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
