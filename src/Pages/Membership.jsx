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

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Gold": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Silver": return "bg-gray-50 text-gray-700 border-gray-200";
      case "Bronze": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "Platinum": return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      );
      case "Gold": return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
      case "Silver": return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getTierStats = () => {
    const stats = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
    members.forEach(m => {
      const tier = determineTier(loyaltyData[m.id] || 0);
      stats[tier]++;
    });
    return stats;
  };

  const tierStats = getTierStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Keanggotaan Member</h1>
              <p className="text-gray-600 mt-1">Kelola poin dan tier member loyalty program</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Member</p>
                <p className="text-2xl font-bold text-green-700">{members.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Bronze</p>
                <p className="text-2xl font-bold text-gray-900">{tierStats.Bronze}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Silver</p>
                <p className="text-2xl font-bold text-gray-900">{tierStats.Silver}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Gold</p>
                <p className="text-2xl font-bold text-gray-900">{tierStats.Gold}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Platinum</p>
                <p className="text-2xl font-bold text-gray-900">{tierStats.Platinum}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Filter Member</h2>
                  <p className="text-sm text-gray-600">Pilih tier untuk memfilter data member</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm font-medium"
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
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Daftar Member</h2>
                  <p className="text-sm text-gray-600">Kelola poin dan tier member loyalty</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {filteredMembers.length} member ditampilkan
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Daftar</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Poin</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.length > 0 ? filteredMembers.map((u) => {
                    const tier = determineTier(loyaltyData[u.id] || 0);
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white text-sm font-medium">{u.nama.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{u.nama}</div>
                              <div className="text-sm text-gray-500">Member ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(u.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={poinInput[u.id] ?? ""}
                            onChange={(e) => handleChangePoin(u.id, e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierColor(tier)}`}>
                            {getTierIcon(tier)}
                            {tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => savePoints(u)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Simpan
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <p className="text-gray-500 font-medium">Tidak ada member ditemukan</p>
                          <p className="text-gray-400 text-sm">Coba ubah filter atau periksa kembali data member</p>
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
    </div>
  );
}