// --- Enhanced EventsPublic.jsx ---
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventsPublic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management with better organization
  const [state, setState] = useState({
    showLoginPopup: false,
    selectedEvent: null,
    submitted: false,
    loading: false,
    selectedCategory: "All",
    searchQuery: ""
  });

  const [form, setForm] = useState({ 
    nama: "", 
    nomor: "", 
    komunitas: "" 
  });
  
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);

  // Memoized functions for better performance
  const getEventsFromAdmin = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_events")) || [];
    } catch (error) {
      console.error("Error loading events:", error);
      return [];
    }
  }, []);

  const categories = useMemo(() => 
    ["All", ...new Set(events.map(e => e.kategori))], 
    [events]
  );

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by category
    if (state.selectedCategory !== "All") {
      filtered = filtered.filter(event => event.kategori === state.selectedCategory);
    }
    
    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.eventName.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.kategori.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (upcoming events first)
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, state.selectedCategory, state.searchQuery]);

  // Initialize events and user data
  useEffect(() => {
    setEvents(getEventsFromAdmin());
  }, [getEventsFromAdmin]);

  useEffect(() => {
    if (!user) {
      setState(prev => ({ ...prev, showLoginPopup: true }));
    } else {
      setState(prev => ({ ...prev, showLoginPopup: false }));
      setForm(prev => ({ ...prev, nama: user.nama }));
    }
  }, [user]);

  // Utility functions
  const formatDate = useCallback((tgl) => {
    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",  
      month: "long",
      day: "numeric"
    });
  }, []);

  const formatTime = useCallback((tgl) => {
    const date = new Date(tgl);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }, []);

  const isEventPast = useCallback((tanggal) => 
    new Date(tanggal) < new Date(), 
    []
  );

  const isEventSoon = useCallback((tanggal) => {
    const eventDate = new Date(tanggal);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    } else if (form.nama.length < 2) {
      newErrors.nama = "Nama terlalu pendek";
    }
    
    if (!form.nomor.trim()) {
      newErrors.nomor = "Nomor WhatsApp wajib diisi";
    } else if (!form.nomor.match(/^(\+62|62|0)[0-9]{9,13}$/)) {
      newErrors.nomor = "Format nomor tidak valid (contoh: 08123456789)";
    }
    
    if (form.komunitas && form.komunitas.length > 50) {
      newErrors.komunitas = "Nama komunitas terlalu panjang";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Enhanced form handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setState(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const poin = 5;
      const timestamp = new Date().toISOString();

      // Update loyalty points
      const loyalty = JSON.parse(sessionStorage.getItem("loyalty") || "{}");
      loyalty[user.nama] = (loyalty[user.nama] || 0) + poin;
      sessionStorage.setItem("loyalty", JSON.stringify(loyalty));

      // Update loyalty history
      const history = JSON.parse(sessionStorage.getItem("loyalty_history") || "{}");
      const userHistory = history[user.nama] || [];
      userHistory.push({
        keterangan: `Daftar event: ${state.selectedEvent.eventName}`,
        poin,
        tanggal: new Date().toLocaleDateString("id-ID"),
        timestamp
      });
      history[user.nama] = userHistory;
      sessionStorage.setItem("loyalty_history", JSON.stringify(history));

      // Save participant data
      const peserta = JSON.parse(sessionStorage.getItem("event_participants") || "[]");
      peserta.push({
        id: Date.now(),
        nama: form.nama,
        nomor: form.nomor,
        komunitas: form.komunitas,
        eventId: state.selectedEvent.id,
        eventJudul: state.selectedEvent.eventName,
        tanggal: timestamp
      });
      sessionStorage.setItem("event_participants", JSON.stringify(peserta));

      setState(prev => ({ ...prev, submitted: true }));
    } catch (error) {
      console.error("Registration error:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetForm = useCallback(() => {
    setForm({ nama: user?.nama || "", nomor: "", komunitas: "" });
    setState(prev => ({ 
      ...prev, 
      selectedEvent: null, 
      submitted: false 
    }));
    setErrors({});
  }, [user]);

  const handleCategoryChange = useCallback((category) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setState(prev => ({ ...prev, searchQuery: e.target.value }));
  }, []);

  const handleEventSelect = useCallback((event) => {
    if (!isEventPast(event.date)) {
      setState(prev => ({ ...prev, selectedEvent: event }));
    }
  }, [isEventPast]);

  // Enhanced UI Components
  const renderLoginPopup = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full transform transition-all duration-500 scale-100 animate-slideUp">
        <div className="w-20 h-20 bg-gradient-to-br from-olive-400 to-olive-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Akses Terbatas</h2>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Silakan login terlebih dahulu untuk mendaftar event dan mengumpulkan poin loyalty Anda
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-olive-500 to-olive-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-olive-600 hover:to-olive-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Masuk
          </Link>
          <Link 
            to="/register" 
            className="border-2 border-olive-500 text-olive-600 px-8 py-4 rounded-xl font-semibold hover:bg-olive-50 transform hover:scale-105 transition-all duration-300"
          >
            Daftar Baru
          </Link>
        </div>
      </div>
    </div>
  );

  const renderSearchAndFilter = () => (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari event berdasarkan nama, lokasi, atau kategori..."
            value={state.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent hover:border-olive-300 transition-all duration-300 text-lg"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              state.selectedCategory === cat 
                ? 'bg-gradient-to-r from-olive-500 to-olive-600 text-white shadow-lg shadow-olive-200' 
                : 'bg-white text-olive-700 border-2 border-olive-200 hover:bg-olive-50 hover:border-olive-300'
            }`}
          >
            {cat === "All" ? "Semua Event" : cat}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEventCard = (evt) => (
    <div
      key={evt.id}
      onClick={() => handleEventSelect(evt)}
      className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 ${
        isEventPast(evt.date) 
          ? 'opacity-60 pointer-events-none grayscale' 
          : 'cursor-pointer hover:scale-[1.02]'
      }`}
    >
      <div className="relative overflow-hidden">
        <img 
          src={evt.image || "/api/placeholder/400/250"} 
          alt={evt.eventName} 
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Event Status Badges */}
        <div className="absolute top-4 right-4 space-y-2">
          {isEventPast(evt.date) && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Berakhir
            </div>
          )}
          {isEventSoon(evt.date) && !isEventPast(evt.date) && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
              Segera
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-olive-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {evt.eventName}
        </h2>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-3 text-olive-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-sm font-medium">{formatDate(evt.date)}</span>
              {evt.time && <span className="text-xs text-gray-500 block">{formatTime(evt.date)}</span>}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-3 text-olive-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{evt.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-olive-100 text-olive-700 px-4 py-2 rounded-full text-sm font-medium">
            {evt.kategori}
          </span>
          {!isEventPast(evt.date) && (
            <div className="text-olive-600 group-hover:text-olive-700 transition-colors duration-300 transform group-hover:translate-x-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {!state.submitted ? (
          <>
            {/* Event Header */}
            <div className="bg-gradient-to-r from-olive-500 to-olive-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <button 
                  onClick={resetForm}
                  className="mb-6 flex items-center text-white/90 hover:text-white transition-colors duration-300 group"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Daftar Event
                </button>
                <h2 className="text-3xl font-bold mb-3">Daftar Event</h2>
                <p className="text-xl font-medium text-white/95">{state.selectedEvent.eventName}</p>
                <p className="text-white/80 mt-2">
                  {formatDate(state.selectedEvent.date)} • {state.selectedEvent.location}
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nama Lengkap *
                  </label>
                  <input 
                    type="text" 
                    name="nama" 
                    value={form.nama} 
                    onChange={handleChange} 
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 text-lg ${
                      errors.nama ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-olive-300'
                    }`}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-600 mt-2 flex items-center animate-slideIn">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.nama}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nomor WhatsApp *
                  </label>
                  <input 
                    type="text" 
                    name="nomor" 
                    value={form.nomor} 
                    onChange={handleChange} 
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 text-lg ${
                      errors.nomor ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-olive-300'
                    }`}
                    placeholder="08xxxxxxxxxx atau +62xxxxxxxxxx"
                  />
                  {errors.nomor && (
                    <p className="text-sm text-red-600 mt-2 flex items-center animate-slideIn">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.nomor}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Komunitas <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input 
                    type="text" 
                    name="komunitas" 
                    value={form.komunitas} 
                    onChange={handleChange} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent hover:border-olive-300 transition-all duration-300 text-lg"
                    placeholder="Nama komunitas atau organisasi"
                  />
                  {errors.komunitas && (
                    <p className="text-sm text-red-600 mt-2 flex items-center animate-slideIn">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.komunitas}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-olive-50 to-green-50 p-6 rounded-xl border-2 border-olive-200">
                <div className="flex items-center text-olive-700">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-bold text-lg">Bonus Loyalty Points!</span>
                    <p className="text-sm text-olive-600 mt-1">Dapatkan 5 poin loyalty setelah mendaftar event ini</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={state.loading} 
                type="submit" 
                className="w-full bg-gradient-to-r from-olive-500 to-olive-600 text-white py-5 rounded-xl font-bold text-lg hover:from-olive-600 hover:to-olive-700 focus:outline-none focus:ring-4 focus:ring-olive-200 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {state.loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mendaftarkan...
                  </span>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-green-600 mb-6">Pendaftaran Berhasil!</h2>
            <p className="text-gray-700 text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              Terima kasih telah mendaftar untuk event <strong className="text-olive-600">{state.selectedEvent.eventName}</strong>. 
              <br />
              Anda telah mendapatkan <span className="text-olive-600 font-bold text-2xl">5 poin loyalty</span>!
            </p>
            <div className="space-y-4">
              <button 
                onClick={resetForm} 
                className="bg-gradient-to-r from-olive-500 to-olive-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-olive-600 hover:to-olive-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Daftar Event Lainnya
              </button>
              <p className="text-gray-500 text-sm">
                Tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi lebih lanjut.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      {state.showLoginPopup && renderLoginPopup()}
      {!state.showLoginPopup && (
        <main className="max-w-7xl mx-auto p-4 pt-24 min-h-screen">
          {!state.selectedEvent ? (
            <>
              {/* Header Section */}
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 bg-clip-text text-transparent mb-6 leading-tight">
                  Event Monochrome Space
                </h1>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                  Temukan dan ikuti berbagai event menarik yang menginspirasi. 
                  Dapatkan poin loyalty setiap kali Anda berpartisipasi dan raih keuntungan eksklusif!
                </p>
              </div>

              {/* Search and Filter */}
              {renderSearchAndFilter()}

              {/* Events Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredEvents.map(renderEventCard)}
              </div>

              {/* Empty State */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Tidak Ada Event Ditemukan</h3>
                  <p className="text-gray-500 text-lg">
                    {state.searchQuery ? 
                      `Tidak ada event yang cocok dengan pencarian "${state.searchQuery}"` :
                      "Belum ada event tersedia untuk kategori ini"}
                  </p>
                  {state.searchQuery && (
                    <button 
                      onClick={() => setState(prev => ({ ...prev, searchQuery: "", selectedCategory: "All" }))}
                      className="mt-4 text-olive-600 hover:text-olive-700 font-medium"
                    >
                      Hapus filter pencarian
                    </button>
                  )}
                </div>
              )}

              {/* Event Statistics */}
              {events.length > 0 && (
                <div className="mt-16 bg-gradient-to-r from-olive-50 to-green-50 rounded-3xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-olive-600">{events.length}</div>
                      <div className="text-gray-600">Total Event</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-600">
                        {events.filter(e => !isEventPast(e.date)).length}
                      </div>
                      <div className="text-gray-600">Event Aktif</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-orange-600">{categories.length - 1}</div>
                      <div className="text-gray-600">Kategori</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            renderRegistrationForm()
          )}
        </main>
      )}
      <Footer />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}