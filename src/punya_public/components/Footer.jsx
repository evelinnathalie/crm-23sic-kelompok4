import { useState, useEffect } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);

  const whatsappNumber = "6281234567890";
  const whatsappMessage = "Halo! Saya tertarik dengan Monochrome Space.";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  const handleMapsClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=Monochrome%20Space%20Pekanbaru`;
    window.open(url, "_blank");
  };

  const businessHours = [
    { day: 'Senin - Jumat', time: '10:00 - 22:00', isOpen: true },
    { day: 'Sabtu - Minggu', time: '08:00 - 23:00', isOpen: true },
    { day: 'Hari Besar', time: 'Sesuai Jadwal Event', isOpen: false }
  ];

  const services = [
    { name: 'Coffee & Beverage', icon: '☕', desc: 'Kopi premium & minuman berkualitas' },
    { name: 'Homemade Pastry', icon: '🥐', desc: 'Pastry segar buatan rumah' },
    { name: 'Event & Space Rental', icon: '🎪', desc: 'Sewa ruang untuk acara khusus' },
    { name: 'Community Gathering', icon: '👥', desc: 'Tempat berkumpul komunitas' },
    { name: 'Private Reservation', icon: '🔒', desc: 'Reservasi privat & eksklusif' },
    { name: 'Live Music & Open Mic', icon: '🎤', desc: 'Pertunjukan musik live' }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/monochromespace',
      color: 'hover:bg-pink-500'
    },
    {
      name: 'Facebook',
      icon: '👥',
      url: 'https://facebook.com/monochromespace',
      color: 'hover:bg-blue-600'
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://tiktok.com/@monochromespace',
      color: 'hover:bg-gray-800'
    }
  ];

  const getCurrentStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day >= 1 && day <= 5) { // Weekdays
      return hour >= 10 && hour < 22 ? 'Buka Sekarang' : 'Tutup';
    } else { // Weekend
      return hour >= 8 && hour < 23 ? 'Buka Sekarang' : 'Tutup';
    }
  };

  const isCurrentlyOpen = getCurrentStatus() === 'Buka Sekarang';

  return (
    <footer className="relative bg-gradient-to-br from-[#2f3a24] via-[#334029] to-[#2a3520] text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/10 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className={`relative z-10 pt-20 pb-8 px-6 md:px-12 lg:px-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12">

            {/* Enhanced Brand Description */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Monochrome Space
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                Monochrome Space adalah cafe & community space di Pekanbaru yang menyajikan kopi berkualitas tinggi dalam suasana elegan, tenang, dan inspiratif untuk semua kalangan.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 group">
                  <span className="text-white/70 mt-1">📍</span>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition">
                      Jl. Soekarno Hatta No.123, Pekanbaru, Riau
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <span className="text-white/70">✉️</span>
                  <a href="mailto:hello@monochromespace.id" className="text-gray-300 hover:text-white transition">
                    hello@monochromespace.id
                  </a>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <span className="text-white/70">📞</span>
                  <a href="tel:+6281234567890" className="text-gray-300 hover:text-white transition">
                    +62 812-3456-7890
                  </a>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20">
                <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span className="text-xs font-medium">{getCurrentStatus()}</span>
              </div>
            </div>

            {/* Enhanced Services */}
            <div>
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">🛎️</span>
                Layanan Kami
              </h4>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-white/20"
                    onMouseEnter={() => setHoveredService(i)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {service.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white group-hover:text-green-400 transition">
                          {service.name}
                        </p>
                        <p className={`text-xs text-gray-400 mt-1 transition-all duration-300 ${
                          hoveredService === i ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0'
                        }`}>
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Business Hours */}
            <div>
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">🕒</span>
                Jam Operasional
              </h4>
              <div className="space-y-3">
                {businessHours.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">{item.day}</span>
                      <span className={`text-sm font-bold ${item.isOpen ? 'text-green-400' : 'text-yellow-400'}`}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30">
                <p className="text-xs text-green-400 flex items-center gap-2">
                  <span className="text-sm">🎯</span>
                  <span className="font-medium">Tersedia reservasi khusus & event planning</span>
                </p>
              </div>
            </div>

            {/* Enhanced Maps & Social Media */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                Lokasi & Sosial
              </h4>

              {/* Enhanced Maps */}
              <div className="relative group">
                <div className="rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl relative bg-gray-800">
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-800/90 flex flex-col items-center justify-center z-10">
                      <div className="animate-spin h-8 w-8 border-b-2 border-green-400 rounded-full mb-3"></div>
                      <p className="text-xs text-gray-400">Memuat peta...</p>
                    </div>
                  )}
                  <iframe
                    title="Lokasi Monochrome Space"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15945.123456789!2d101.449837!3d0.507068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ae123456789%3A0xabcdef123456789!2sMonochrome%20Space%20Pekanbaru!5e0!3m2!1sid!2sid!4v1718795032181!5m2!1sid!2sid"
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setMapLoaded(true)}
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>

                <button
                  onClick={handleMapsClick}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>🗺️</span>
                  Lihat di Google Maps
                </button>
              </div>

              {/* Enhanced Social Media */}
              <div>
                <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  Ikuti Kami
                </h5>
                <div className="flex gap-4">
                  {socialLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:border-white/40 ${item.color} transition-all duration-300 text-white text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                      title={item.name}
                    >
                      <span className="group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Dapatkan update terbaru tentang event, menu baru, dan promo menarik!
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Footer Bottom */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Monochrome Space</span>. 
                  All rights reserved.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Crafted with ❤️ in Pekanbaru, Indonesia
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                  <span>🔒</span> Kebijakan Privasi
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                  <span>📋</span> Syarat & Ketentuan
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                  <span>❓</span> FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Floating tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-gray-700">
            Chat dengan kami di WhatsApp
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
          </div>
          
          <button
            onClick={handleWhatsAppClick}
            className="group w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
            aria-label="Hubungi WhatsApp"
          >
            {/* WhatsApp icon */}
            <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </button>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        </div>
      </div>
    </footer>
  );
}