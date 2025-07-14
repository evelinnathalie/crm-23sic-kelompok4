import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Instagram, Facebook, Music } from 'lucide-react';

export default function ProfessionalOliveFooter() {
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
    { name: 'Coffee & Beverage', desc: 'Kopi premium & minuman berkualitas tinggi' },
    { name: 'Homemade Pastry', desc: 'Pastry segar buatan rumah setiap hari' },
    { name: 'Event & Space Rental', desc: 'Sewa ruang untuk acara khusus Anda' },
    { name: 'Community Gathering', desc: 'Tempat berkumpul komunitas yang nyaman' }
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/monochromespace', icon: Instagram, color: 'hover:bg-[#4A5A32]' },
    { name: 'Facebook', url: 'https://facebook.com/monochromespace', icon: Facebook, color: 'hover:bg-[#4A5A32]' },
    { name: 'TikTok', url: 'https://tiktok.com/@monochromespace', icon: Music, color: 'hover:bg-[#4A5A32]' }
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
    <footer className="bg-gradient-to-br from-[#6B7A47] via-[#5A6B3E] to-[#4A5A32] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#4A5A32] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#6B7A47] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#5A6B3E] rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className={`max-w-7xl mx-auto px-8 py-20 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="group">
              <h3 className="text-3xl font-bold text-white mb-3">
                Monochrome Space
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#4A5A32] to-[#6B7A47] rounded-full transition-all duration-500 group-hover:w-24"></div>
            </div>

            <p className="text-green-100 text-base leading-relaxed">
              Cafe & community space di Pekanbaru yang menyajikan kopi berkualitas tinggi dalam suasana elegan dan inspiratif untuk semua kalangan.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer transition-all duration-300 hover:translate-x-2" onClick={handleMapsClick}>
                <MapPin className="w-5 h-5 text-[#6B7A47] mt-1 flex-shrink-0" />
                <p className="text-green-100 text-sm group-hover:text-white transition-colors">
                  Jl. Cemara No.17c, Suka Maju, Kec. Sail, Kota Pekanbaru, Riau 28127
                </p>
              </div>
              
              <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-2">
                <Mail className="w-5 h-5 text-[#6B7A47] flex-shrink-0" />
                <a href="mailto:hello@monochromespace.id" 
                   className="text-green-100 hover:text-white text-sm transition-colors">
                  hello@monochromespace.id
                </a>
              </div>

              <div className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-2">
                <Phone className="w-5 h-5 text-[#6B7A47] flex-shrink-0" />
                <button onClick={handleWhatsAppClick}
                        className="text-green-100 hover:text-white text-sm transition-colors">
                  +62 853-6573-9557
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className={`w-3 h-3 rounded-full ${isCurrentlyOpen ? 'bg-[#6B7A47] animate-pulse' : 'bg-red-300'}`}></span>
              <span className="text-sm font-medium text-white">{getCurrentStatus()}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-white">Layanan Kami</h4>
            <div className="space-y-4">
              {services.map((service, i) => (
                <div 
                  key={i} 
                  className="group cursor-pointer p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#6B7A47]"></div>
                    <h5 className="text-sm font-medium text-white">
                      {service.name}
                    </h5>
                  </div>
                  <p className="text-xs text-green-100 pl-5">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#6B7A47]" />
              Jam Operasional
            </h4>
            <div className="space-y-3">
              {businessHours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-sm text-green-100 font-medium">{item.day}</span>
                  <span className="text-sm font-semibold text-white bg-[#6B7A47]/20 px-3 py-1 rounded-full border border-[#6B7A47]/30">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Social */}
          <div className="space-y-8">
            <h4 className="text-xl font-semibold text-white">Lokasi & Sosial</h4>

            {/* Maps Button */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Lihat Lokasi</span>
                <MapPin className="w-5 h-5 text-[#6B7A47]" />
              </div>
              <button
                onClick={handleMapsClick}
                className="w-full bg-[#6B7A47] text-white hover:bg-[#5A6B3E] font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-105"
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
                      className={`w-12 h-12 bg-white/10 ${item.color} backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110`}
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

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-green-100">
              &copy; {new Date().getFullYear()} Monochrome Space. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-green-100 hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-green-100 hover:text-white transition-colors">
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
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-[#4A5A32] text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl">
            Chat dengan kami di WhatsApp
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-3 h-3 bg-[#4A5A32] rotate-45"></div>
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-[#5A6B3E] rounded-full animate-ping opacity-75"></div>
          
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="relative w-16 h-16 bg-gradient-to-br from-[#5A6B3E] to-[#4A5A32] hover:from-[#4A5A32] hover:to-[#3A4928] rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            aria-label="Hubungi WhatsApp"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
