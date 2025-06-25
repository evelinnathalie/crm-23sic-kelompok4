import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export default function ProfessionalFooter() {
  const [isVisible, setIsVisible] = useState(false);

  const whatsappNumber = "6285365739557";
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
    { day: 'Senin - Jumat', time: '10:00 - 22:00' },
    { day: 'Sabtu - Minggu', time: '08:00 - 23:00' },
    { day: 'Hari Besar', time: 'Sesuai Jadwal Event' }
  ];

  const services = [
    { name: 'Coffee & Beverage', desc: 'Kopi premium & minuman berkualitas' },
    { name: 'Homemade Pastry', desc: 'Pastry segar buatan rumah' },
    { name: 'Event & Space Rental', desc: 'Sewa ruang untuk acara khusus' },
    { name: 'Community Gathering', desc: 'Tempat berkumpul komunitas' }
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/monochromespace' },
    { name: 'Facebook', url: 'https://facebook.com/monochromespace' },
    { name: 'TikTok', url: 'https://tiktok.com/@monochromespace' }
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
    <footer className="bg-[#556B2F] text-white">
      <div className={`max-w-7xl mx-auto px-6 py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Monochrome Space
              </h3>
              <div className="w-12 h-1 bg-green-400 rounded-full"></div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Cafe & community space di Pekanbaru yang menyajikan kopi berkualitas tinggi dalam suasana elegan dan inspiratif.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Jl. Cemara No.17c, Suka Maju, Kec. Sail, Kota Pekanbaru, Riau 28127
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                <a href="mailto:hello@monochromespace.id" 
                   className="text-gray-300 hover:text-white text-sm transition-colors">
                  hello@monochromespace.id
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <button onClick={handleWhatsAppClick}
                        className="text-gray-300 hover:text-green-400 text-sm transition-colors">
                  +62 853-6573-9557
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-700 border border-gray-600">
              <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span className="text-xs font-medium text-gray-300">{getCurrentStatus()}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Layanan Kami</h4>
            <div className="space-y-4">
              {services.map((service, i) => (
                <div key={i} className="group">
                  <h5 className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                    {service.name}
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              Jam Operasional
            </h4>
            <div className="space-y-3">
              {businessHours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-b-0">
                  <span className="text-sm text-slate-300">{item.day}</span>
                  <span className="text-sm font-medium text-emerald-400">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Social */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Lokasi & Sosial</h4>

            {/* Maps Button */}
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Lihat Lokasi</span>
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <button
                  onClick={handleMapsClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Google Maps
                </button>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-white">Ikuti Kami</h5>
                <div className="flex gap-3">
                  {socialLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 border border-slate-700 rounded-lg flex items-center justify-center transition-colors text-xs font-medium"
                      title={item.name}
                    >
                      {item.name.charAt(0)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Monochrome Space. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-slate-700">
            Chat dengan kami di WhatsApp
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            aria-label="Hubungi WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}