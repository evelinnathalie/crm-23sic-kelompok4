import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Instagram, Facebook, Music } from 'lucide-react';

export default function EnhancedProfessionalFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);

  const whatsappNumber = "6285365739557";
  const whatsappMessage = "Halo! Saya tertarik dengan Monochrome Space.";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
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
    { day: 'Senin - Jumat', time: '10:00 - 22:00', isToday: false },
    { day: 'Sabtu - Minggu', time: '08:00 - 23:00', isToday: false },
    { day: 'Hari Besar', time: 'Sesuai Jadwal Event', isToday: false }
  ];

  const services = [
    { name: 'Coffee & Beverage', desc: 'Kopi premium & minuman berkualitas' },
    { name: 'Homemade Pastry', desc: 'Pastry segar buatan rumah' },
    { name: 'Event & Space Rental', desc: 'Sewa ruang untuk acara khusus' },
    { name: 'Community Gathering', desc: 'Tempat berkumpul komunitas' }
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/monochromespace', icon: Instagram, color: 'hover:bg-pink-500' },
    { name: 'Facebook', url: 'https://facebook.com/monochromespace', icon: Facebook, color: 'hover:bg-blue-500' },
    { name: 'TikTok', url: 'https://tiktok.com/@monochromespace', icon: Music, color: 'hover:bg-purple-500' }
  ];

  const getCurrentStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day >= 1 && day <= 5) {
      return hour >= 10 && hour < 22 ? 'Buka Sekarang' : 'Tutup';
    } else {
      return hour >= 8 && hour < 23 ? 'Buka Sekarang' : 'Tutup';
    }
  };

  const isCurrentlyOpen = getCurrentStatus() === 'Buka Sekarang';

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-lime-700 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-olive-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-700 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className={`max-w-7xl mx-auto px-6 py-16 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="group">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-lime-600 bg-clip-text text-transparent mb-3">
                Monochrome Space
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-lime-600 to-green-600 rounded-full transition-all duration-300 group-hover:w-24"></div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Cafe & community space di Pekanbaru yang menyajikan kopi berkualitas tinggi dalam suasana elegan dan inspiratif untuk semua kalangan.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer" onClick={handleMapsClick}>
                <MapPin className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-slate-300 text-sm group-hover:text-white transition-colors">
                  Jl. Cemara No.17c, Suka Maju, Kec. Sail, Kota Pekanbaru, Riau 28127
                </p>
              </div>
              
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-lime-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:hello@monochromespace.id" 
                   className="text-slate-300 hover:text-lime-600 text-sm transition-colors">
                  hello@monochromespace.id
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-lime-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <button onClick={handleWhatsAppClick}
                        className="text-slate-300 hover:text-lime-600 text-sm transition-colors">
                  +62 853-6573-9557
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <span className={`w-3 h-3 rounded-full ${isCurrentlyOpen ? 'bg-lime-600 animate-pulse shadow-lg shadow-lime-600/50' : 'bg-red-400 shadow-lg shadow-red-400/50'}`}></span>
              <span className="text-sm font-medium text-slate-200">{getCurrentStatus()}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-white">Layanan Kami</h4>
            <div className="space-y-4">
              {services.map((service, i) => (
                <div 
                  key={i} 
                  className="group cursor-pointer p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/50 hover:border-lime-600/30 transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-lime-600 group-hover:scale-110 transition-transform duration-300"></div>
                    <h5 className="text-sm font-medium text-white group-hover:text-lime-600 transition-colors">
                      {service.name}
                    </h5>
                  </div>
                  <p className={`text-xs text-slate-400 transition-all duration-300 ${hoveredService === i ? 'text-slate-300' : ''}`}>
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-lime-600" />
              Jam Operasional
            </h4>
            <div className="space-y-3">
              {businessHours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-300">
                  <span className="text-sm text-slate-300 font-medium">{item.day}</span>
                  <span className="text-sm font-semibold text-lime-600 bg-lime-600/10 px-3 py-1 rounded-full">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Social */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Lokasi & Sosial</h4>

            {/* Maps Button */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white">Lihat Lokasi</span>
                  <MapPin className="w-5 h-5 text-lime-600" />
                </div>
                <button
                  onClick={handleMapsClick}
                  className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-105 shadow-lg hover:shadow-lime-600/25"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Google Maps
                </button>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-semibold mb-4 text-white">Ikuti Kami</h5>
                <div className="flex gap-3">
                  {socialLinks.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-12 h-12 bg-slate-800/50 ${item.color} border border-slate-700/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm`}
                        title={item.name}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Monochrome Space. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-slate-400 hover:text-lime-600 transition-colors hover:underline">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-slate-400 hover:text-lime-600 transition-colors hover:underline">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-slate-900/90 text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-slate-700/50 backdrop-blur-sm">
            Chat dengan kami di WhatsApp
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-3 h-3 bg-slate-900/90 rotate-45 border-r border-b border-slate-700/50"></div>
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-lime-600 rounded-full animate-ping opacity-75"></div>
          
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="relative w-16 h-16 bg-gradient-to-br from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 border-2 border-lime-600/30"
            aria-label="Hubungi WhatsApp"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}