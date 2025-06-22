import { supabase } from "../supabase";

// Ambil poin user berdasarkan user_id
export const fetchUserPoints = async (user_id) => {
  const { data, error } = await supabase
    .from("loyalty")
    .select("poin")
    .eq("user_id", user_id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Gagal ambil poin:", error.message);
    return 0;
  }

  return data?.poin || 0;
};

// Ambil histori poin berdasarkan user_id
export const fetchPointHistory = async (user_id) => {
  const { data, error } = await supabase
    .from("loyalty_history")
    .select("*")
    .eq("user_id", user_id)
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Gagal ambil histori poin:", error.message);
    return [];
  }

  return data;
};

// Ambil voucher yang sudah ditukar oleh user berdasarkan user_id
export const fetchRedeemedVouchers = async (user_id) => {
  const { data, error } = await supabase
    .from("redeemed_voucher")
    .select("*")
    .eq("user_id", user_id)
    .order("expired", { ascending: false });

  if (error) {
    console.error("Gagal ambil voucher user:", error.message);
    return [];
  }

  return data;
};

// Tukar voucher berdasarkan user_id dan voucher (tanpa RPC)
export const redeemVoucher = async (user_id, voucher) => {
  const { poin, nama: voucherName, expiredDays } = voucher;

  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() + expiredDays);
  const expired = expiredDate.toISOString().split("T")[0];

  // Ambil nama user
  const { data: profile, error: namaError } = await supabase
    .from("users")
    .select("nama")
    .eq("id", user_id)
    .single();

  const nama = profile?.nama || "Member";

  // Simpan ke redeemed_voucher
  const { error: insertError } = await supabase.from("redeemed_voucher").insert([
    {
      user_id,
      user_nama: nama,
      nama_voucher: voucherName,
      expired,
      status: "Aktif",
    },
  ]);

  if (insertError) {
    console.error("Gagal menukar voucher:", insertError.message);
    return insertError.message;
  }

  // Ambil poin user sekarang
  const { data: loyaltyData, error: fetchError } = await supabase
    .from("loyalty")
    .select("poin")
    .eq("user_id", user_id)
    .single();

  if (fetchError || !loyaltyData) {
    console.error("Gagal ambil poin user:", fetchError?.message);
    return fetchError?.message || "Data tidak ditemukan";
  }

  const currentPoints = loyaltyData.poin;
  const updatedPoints = currentPoints - poin;

  // Update poin user
  const { error: updateError } = await supabase
    .from("loyalty")
    .update({ poin: updatedPoints })
    .eq("user_id", user_id);

  if (updateError) {
    console.error("Gagal mengurangi poin:", updateError.message);
    return updateError.message;
  }

  // Simpan ke histori
  const { error: historyError } = await supabase.from("loyalty_history").insert([
    {
      user_id,
      nama,
      poin: -poin,
      keterangan: `Tukar voucher: ${voucherName}`,
      tanggal: new Date().toISOString(),
    },
  ]);

  if (historyError) {
    console.error("Gagal mencatat histori poin:", historyError.message);
  }

  return null;
};

// Ambil semua voucher aktif dari admin
export const fetchAvailableVouchers = async () => {
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal ambil data voucher:", error.message);
    return [];
  }

  return data.map((v) => ({
    nama: v.title,
    poin: v.required_points,
    expiredDays: v.expired_days,
  }));
};
