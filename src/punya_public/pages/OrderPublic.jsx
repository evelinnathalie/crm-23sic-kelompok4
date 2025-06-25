import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase";

// Constants
const ORDER_TYPES = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway'
};

const ORDER_STATUS = {
  PROCESSING: 'Diproses'
};

const LOYALTY_POINTS_PER_ITEM = 2;

const PHONE_REGEX = /^08\d{8,12}$/;

// Validation utilities
const validatePhoneNumber = (phone) => {
  return PHONE_REGEX.test(phone);
};

const validateForm = (form, agree) => {
  const errors = [];
  
  if (!form.nama?.trim()) {
    errors.push('Nama pemesan harus diisi');
  }
  
  if (!form.nomor?.trim()) {
    errors.push('Nomor WhatsApp harus diisi');
  } else if (!validatePhoneNumber(form.nomor)) {
    errors.push('Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx');
  }
  
  if (!agree) {
    errors.push('Harap centang persetujuan ketentuan pesanan');
  }
  
  return errors;
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
  </div>
);

// Auth required modal
const AuthRequiredModal = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
          <p className="text-green-100 text-sm">Masuk untuk melanjutkan pemesanan dan nikmati keuntungan eksklusif</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Keuntungan Member:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Dapatkan poin loyalty setiap pemesanan
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Tukar poin dengan voucher menarik
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Akses fitur reservasi dan event eksklusif
            </li>
          </ul>
        </div>
        
        <div className="flex gap-3">
          <Link to="/login" className="flex-1">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition-colors duration-200">
              Masuk
            </button>
          </Link>
          <Link to="/register" className="flex-1">
            <button className="w-full border border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-xl font-semibold transition-colors duration-200">
              Daftar
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Success modal
const OrderSuccessModal = ({ order, onClose }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <h2 className="text-2xl font-bold text-green-700 mb-4">Pesanan Berhasil!</h2>
    <p className="text-gray-600 mb-6">Terima kasih! Pesanan Anda sedang diproses dan akan segera disiapkan.</p>
    
    <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
      <h3 className="font-semibold text-gray-800 mb-4">Detail Pesanan:</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">ID Pesanan:</span>
          <span className="font-mono font-semibold">#{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tipe Pesanan:</span>
          <span className="font-semibold">{order.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Pembayaran:</span>
          <span className="font-semibold text-green-700">Rp {order.total?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Poin Loyalty:</span>
          <span className="font-semibold text-amber-600">+{order.poin} poin</span>
        </div>
      </div>
    </div>
    
    <div className="flex gap-4">
      <Link to="/menu" className="flex-1">
        <button className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition-colors duration-200">
          Pesan Lagi
        </button>
      </Link>
      <Link to="/home" className="flex-1">
        <button className="w-full py-3 border border-green-700 text-green-700 hover:bg-green-50 rounded-xl font-semibold transition-colors duration-200">
          Ke Beranda
        </button>
      </Link>
    </div>
  </div>
);

// Main component
export default function OrderPublic() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();

  // State management
  const [form, setForm] = useState({
    nama: "",
    nomor: "",
    tipe: ORDER_TYPES.DINE_IN
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nama: user.nama || "",
        nomor: user.nomor || "",
      }));
    }
  }, [user]);

  // Calculate totals
  const cartSummary = React.useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.jumlah, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const loyaltyPoints = totalItems * LOYALTY_POINTS_PER_ITEM;
    
    return { totalItems, totalPrice, loyaltyPoints };
  }, [cart]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  // Create order in database
  const createOrder = async (orderData) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return data;
  };

  // Update loyalty points
  const updateLoyaltyPoints = async (userId, customerName, points) => {
    try {
      // Check existing loyalty record
      const { data: existing, error: fetchError } = await supabase
        .from("loyalty")
        .select("id, poin")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Update or create loyalty record
      if (existing) {
        const { error: updateError } = await supabase
          .from("loyalty")
          .update({ 
            poin: existing.poin + points, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", existing.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("loyalty")
          .insert([{
            customer: customerName,
            poin: points,
            user_id: userId,
            updated_at: new Date().toISOString(),
          }]);
        
        if (insertError) throw insertError;
      }

      // Add to loyalty history
      const { error: historyError } = await supabase
        .from("loyalty_history")
        .insert([{
          nama: customerName,
          keterangan: `Order ${cartSummary.totalItems} item`,
          poin: points,
          tanggal: new Date().toISOString().slice(0, 10),
          user_id: userId,
        }]);

      if (historyError) {
        console.error("Failed to record loyalty history:", historyError);
        // Don't throw here as the main order was successful
      }
    } catch (error) {
      console.error("Loyalty update failed:", error);
      throw new Error("Failed to update loyalty points");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    
    // Validate form
    const validationErrors = validateForm(form, agree);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      setErrors(['Keranjang belanja kosong. Silakan tambahkan item terlebih dahulu.']);
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        nama: form.nama.trim(),
        phone: form.nomor.trim(),
        type: form.tipe === ORDER_TYPES.DINE_IN ? "Dine In" : "Takeaway",
        items: cart.map(item => `${item.nama} × ${item.jumlah}`).join(", "),
        total: cartSummary.totalPrice,
        status: ORDER_STATUS.PROCESSING,
        created_at: new Date().toISOString(),
        user_id: user.id,
      };

      // Create order
      const order = await createOrder(orderData);

      // Update loyalty points
      await updateLoyaltyPoints(user.id, user.nama, cartSummary.loyaltyPoints);

      // Success - clear cart and show success
      setCart([]);
      setLastOrder({ ...order, poin: cartSummary.loyaltyPoints });
      setSubmitted(true);

    } catch (error) {
      console.error("Order submission failed:", error);
      setErrors([error.message || "Gagal memproses pesanan. Silakan coba lagi."]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render auth required modal if user not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <AuthRequiredModal />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {submitted && lastOrder ? (
            <OrderSuccessModal 
              order={lastOrder} 
              onClose={() => setSubmitted(false)} 
            />
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Form Pemesanan
                </h1>
                <p className="text-green-100 text-sm mt-1">Lengkapi data pemesanan Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-red-800 text-sm">Terdapat kesalahan:</h3>
                        <ul className="mt-1 text-sm text-red-700 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Pemesan *
                    </label>
                    <input 
                      type="text" 
                      value={form.nama} 
                      disabled 
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nama diambil dari profil akun Anda</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-3 rounded-xl transition-colors duration-200"
                      value={form.nomor}
                      onChange={(e) => handleInputChange('nomor', e.target.value)}
                      placeholder="08123456789"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 08xxxxxxxxxx</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Pesanan *
                  </label>
                  <select
                    value={form.tipe}
                    onChange={(e) => handleInputChange('tipe', e.target.value)}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-3 rounded-xl transition-colors duration-200"
                  >
                    <option value={ORDER_TYPES.DINE_IN}>🍽️ Dine In - Makan di tempat</option>
                    <option value={ORDER_TYPES.TAKEAWAY}>📦 Takeaway - Bawa pulang</option>
                  </select>
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agree} 
                      onChange={() => setAgree(!agree)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Saya menyetujui</span> ketentuan pemesanan dan konfirmasi pesanan via WhatsApp. 
                      Saya memahami bahwa pesanan akan diproses setelah konfirmasi ini.
                    </div>
                  </label>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ringkasan Pesanan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Total Item</p>
                      <p className="font-bold text-lg text-gray-800">{cartSummary.totalItems}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Total Harga</p>
                      <p className="font-bold text-lg text-green-700">Rp {cartSummary.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Poin Loyalty</p>
                      <p className="font-bold text-lg text-amber-600">+{cartSummary.loyaltyPoints}</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !agree || cart.length === 0}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                    isProcessing || !agree || cart.length === 0
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-green-700 hover:bg-green-800 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      Memproses Pesanan...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Konfirmasi Pesanan
                    </div>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}