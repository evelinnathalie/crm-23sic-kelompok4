import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";

// Constants
const LOYALTY_POINTS_PER_EVENT = 5;
const EVENT_CATEGORIES = [
  { value: "All", label: "Semua Kategori" },
  { value: "Workshop", label: "Workshop" },
  { value: "Music", label: "Musik" },
  { value: "Community", label: "Komunitas" },
  { value: "Seminar", label: "Seminar" },
  { value: "Training", label: "Pelatihan" }
];

export default function EventsPublic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({ nama: "", nomor: "", komunitas: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Effects
  useEffect(() => {
    initializeComponent();
  }, [user]);

  // Initialize component
  const initializeComponent = async () => {
    await fetchEvents();
    
    if (!user) {
      setShowLoginModal(true);
    } else {
      setForm(prev => ({ ...prev, nama: user.nama || "" }));
      setShowLoginModal(false);
    }
  };

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .order("date", { ascending: true });
        
      if (error) throw error;
      
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Gagal memuat daftar event. Silakan coba lagi.");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Handle event registration
  const handleEventRegistration = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Check if user already registered for this event
      const { data: existingRegistration } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", selectedEvent.id)
        .eq("user_id", user.id)
        .single();

      if (existingRegistration) {
        setError("Anda sudah terdaftar untuk event ini.");
        return;
      }

      // Register participant
      const { error: participantError } = await supabase
        .from("event_participants")
        .insert([{
          nama: form.nama.trim(),
          nomor: form.nomor.trim(),
          komunitas: form.komunitas.trim(),
          event_id: selectedEvent.id,
          event_name: selectedEvent.eventName,
          user_id: user.id,
          registered_at: new Date().toISOString()
        }]);

      if (participantError) throw participantError;

      // Update loyalty points
      await updateLoyaltyPoints();
      
      // Add to loyalty history
      await addLoyaltyHistory();

      setIsSubmitted(true);
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("Gagal mendaftar ke event. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate registration form
  const validateForm = () => {
    if (!form.nama.trim()) {
      setError("Nama wajib diisi.");
      return false;
    }
    
    if (!form.nomor.trim()) {
      setError("Nomor WhatsApp wajib diisi.");
      return false;
    }
    
    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(form.nomor.replace(/\s/g, ''))) {
      setError("Format nomor WhatsApp tidak valid.");
      return false;
    }
    
    return true;
  };

  // Update user loyalty points
  const updateLoyaltyPoints = async () => {
    try {
      const { data: existingLoyalty } = await supabase
        .from("loyalty")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingLoyalty) {
        await supabase
          .from("loyalty")
          .update({ 
            poin: existingLoyalty.poin + LOYALTY_POINTS_PER_EVENT,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("loyalty")
          .insert({ 
            user_id: user.id, 
            poin: LOYALTY_POINTS_PER_EVENT,
            created_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error("Error updating loyalty points:", err);
    }
  };

  // Add loyalty history entry
  const addLoyaltyHistory = async () => {
    try {
      await supabase.from("loyalty_history").insert([{
        user_id: user.id,
        nama: user.nama,
        poin: LOYALTY_POINTS_PER_EVENT,
        keterangan: `Daftar event: ${selectedEvent.eventName}`,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("Error adding loyalty history:", err);
    }
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event => 
      selectedCategory === "All" || event.kategori === selectedCategory
    )
    .filter(event =>
      event.eventName.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  // Reset form and selection
  const resetFormAndSelection = () => {
    setSelectedEvent(null);
    setIsSubmitted(false);
    setError(null);
    setForm({ 
      nama: user?.nama || "", 
      nomor: "", 
      komunitas: "" 
    });
  };

  // Login Modal Component
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Terbatas</h2>
          <p className="text-gray-600">
            Silakan login terlebih dahulu untuk melihat dan mendaftar event
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );

  // Error Alert Component
  const ErrorAlert = ({ message, onClose }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  // Event Card Component
  const EventCard = ({ event }) => (
    <div
      onClick={() => setSelectedEvent(event)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative">
        <img
          src={event.image || "/api/placeholder/300/200"}
          alt={event.eventName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/200";
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
            {event.kategori}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.eventName}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.date)}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      
      {showLoginModal && <LoginModal />}

      {!showLoginModal && (
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!selectedEvent ? (
              <>
                {/* Header */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Jelajahi Event Menarik
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Temukan dan ikuti berbagai event seru untuk menambah pengalaman dan networking Anda
                  </p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Cari nama event atau lokasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-48"
                    >
                      {EVENT_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <ErrorAlert 
                    message={error} 
                    onClose={() => setError(null)} 
                  />
                )}

                {/* Events Grid */}
                {isLoadingEvents ? (
                  <LoadingSkeleton />
                ) : filteredEvents.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600">
                        Menampilkan {filteredEvents.length} dari {events.length} event
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      Tidak ada event ditemukan
                    </h3>
                    <p className="text-gray-500">
                      Coba ubah filter pencarian atau periksa lagi nanti.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Event Registration Form */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {!isSubmitted ? (
                    <>
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <button
                          onClick={resetFormAndSelection}
                          className="text-white hover:text-blue-200 mb-4 flex items-center transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Kembali ke Daftar Event
                        </button>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {selectedEvent.eventName}
                        </h2>
                        <p className="text-blue-100 text-lg">
                          {formatDate(selectedEvent.date)}
                        </p>
                      </div>

                      {/* Form */}
                      <div className="p-8">
                        {error && (
                          <ErrorAlert 
                            message={error} 
                            onClose={() => setError(null)} 
                          />
                        )}

                        <div className="mb-6">
                          <div className="flex items-center text-green-600 mb-2">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">
                              Dapatkan {LOYALTY_POINTS_PER_EVENT} poin loyalty!
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Dengan mendaftar event ini, Anda akan mendapatkan poin loyalty yang dapat ditukar dengan berbagai reward menarik.
                          </p>
                        </div>

                        <form onSubmit={handleEventRegistration} className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nama Lengkap *
                            </label>
                            <input
                              type="text"
                              value={form.nama}
                              onChange={(e) => setForm({ ...form, nama: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Masukkan nama lengkap Anda"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nomor WhatsApp *
                            </label>
                            <input
                              type="tel"
                              value={form.nomor}
                              onChange={(e) => setForm({ ...form, nomor: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Contoh: 08123456789"
                              required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Nomor akan digunakan untuk konfirmasi dan informasi event
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Komunitas (Opsional)
                            </label>
                            <input
                              type="text"
                              value={form.komunitas}
                              onChange={(e) => setForm({ ...form, komunitas: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nama komunitas atau organisasi Anda"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mendaftarkan...
                              </>
                            ) : (
                              "Daftar Sekarang"
                            )}
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    /* Success Message */
                    <div className="text-center p-12">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-green-600 mb-4">
                        Pendaftaran Berhasil!
                      </h2>
                      <p className="text-lg text-gray-700 mb-2">
                        Selamat! Anda telah berhasil mendaftar untuk event
                      </p>
                      <p className="text-xl font-semibold text-gray-900 mb-4">
                        "{selectedEvent.eventName}"
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                        <p className="text-green-800 font-medium">
                          🎉 Anda mendapatkan {LOYALTY_POINTS_PER_EVENT} poin loyalty!
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Poin dapat ditukar dengan berbagai reward menarik
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={resetFormAndSelection}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                        >
                          Daftar Event Lainnya
                        </button>
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                        >
                          Lihat Profil & Poin
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}