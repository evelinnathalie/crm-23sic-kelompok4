// services/supabasePromoService.js
import { supabase } from "../supabase";

// Ambil semua promo dari tabel vouchers
export async function fetchPromos() {
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .order("id", { ascending: true });
  if (error) console.error("Fetch promo error:", error);
  return data || [];
}

// Tambah promo baru
export async function addPromo(promo) {
  const { data, error } = await supabase.from("vouchers").insert([promo]);
  if (error) console.error("Insert promo error:", error);
  return data;
}

// Update promo
export async function updatePromo(id, promo) {
  const { data, error } = await supabase
    .from("vouchers")
    .update(promo)
    .eq("id", id);
  if (error) console.error("Update promo error:", error);
  return data;
}

// Hapus promo
export async function deletePromo(id) {
  const { error } = await supabase.from("vouchers").delete().eq("id", id);
  if (error) console.error("Delete promo error:", error);
}
