// Footer.jsx — Enhanced Premium Version
import { useState, useEffect } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const whatsappNumber = "6281234567890";
  const whatsappMessage = "Halo! Saya tertarik dengan layanan Monochrome Space.";
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
    
    // Add click animation
    const button = document.querySelector('[aria-label="Chat WhatsApp"]');
    button?.classList.add('animate-pulse');
    setTimeout(() => button?.classList.remove('animate-pulse'), 1000);
  };

  const handleMapsClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=Monochrome%20Space%20Pekanbaru`;
    window.open(url, "_blank");
  };

  const socialLinks = [
    { 
      name: 'Instagram', 
      handle: '@monochromespace', 
      url: 'https://instagram.com/monochromespace',
      icon: '📸'
    },
    { 
      name: 'Facebook', 
      handle: 'Monochrome Space', 
      url: 'https://facebook.com/monochromespace',
      icon: '👥'
    },
    { 
      name: 'TikTok', 
      handle: '@monochromespace', 
      url: 'https://tiktok.com/@monochromespace',
      icon: '🎵'
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#2f3a24] via-[#334029] to-[#2a3520] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Wave Pattern Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-1"></div>
      </div>

      <div className={`relative z-10 pt-20 pb-12 px-6 md:px-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Location & Maps Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Monochrome Space
                </span>
              </h3>
              <p className="text-gray-300 text-base mb-4 leading-relaxed">
                Jl. Soekarno Hatta No.123, Pekanbaru, Riau
              </p>
            </div>

            {/* Enhanced Map Container */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5">
                <div className="relative">
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <iframe
                    title="Maps Monochrome"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15945.123456789!2d101.449837!3d0.507068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ae123456789%3A0xabcdef123456789!2sMonochrome%20Space%20Pekanbaru!5e0!3m2!1sid!2sid!4v1718795032181!5m2!1sid!2sid"
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    onLoad={() => setMapLoaded(true)}
                    className="transition-opacity duration-500"
                  ></iframe>
                </div>
              </div>
              
              <button
                onClick={handleMapsClick}
                className="mt-4 group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span>🗺️</span>
                <span>Lihat di Google Maps</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Media Sosial
              </span>
            </h3>
            
            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                  <div>
                    <div className="font-medium text-white group-hover:text-green-300 transition-colors">
                      {social.name}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {social.handle}
                    </div>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/20">
              <h4 className="font-semibold mb-2 text-green-300">💬 Hubungi Kami</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Siap melayani kebutuhan fotografi dan videografi Anda dengan hasil yang memukau!
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-white/20 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-1">
                &copy; {new Date().getFullYear()} Monochrome Space. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Crafted with ❤️ in Pekanbaru, Riau
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
              <span>•</span>
              <span>Siap Melayani 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Ripple Effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50"></div>
          
          <button
            onClick={handleWhatsAppClick}
            className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl hover:shadow-green-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
            aria-label="Chat WhatsApp"
          >
            {/* WhatsApp Icon */}
            <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.088"/>
            </svg>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Chat dengan kami!
                <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}