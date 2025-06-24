import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MenuCard({ image, name, desc, price, isPopular = false }) {
  return (
    <div className={`bg-gradient-to-br from-[#f8f9f6] to-[#f0f2eb] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 ${
      isPopular ? 'border-[#6B7A47] ring-4 ring-[#6B7A47]/20' : 'border-[#e8ebe4]'
    } group relative`}>
      {isPopular && (
        <div className="bg-gradient-to-r from-[#6B7A47] to-[#4A5A32] text-white text-xs font-bold px-4 py-2 absolute top-4 left-4 rounded-full z-10 shadow-lg">
          ⭐ POPULER
        </div>
      )}
      <div className="h-44 bg-gradient-to-br from-[#e8ebe4] to-[#d4d9c7] flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
        {image}
      </div>
      <div className="p-6">
        <h4 className="font-bold text-[#4A5A32] mb-3 text-xl group-hover:text-[#6B7A47] transition-colors">{name}</h4>
        <p className="text-[#5a6b3e] mb-5 leading-relaxed">{desc}</p>
        <div className="flex justify-between items-center">
          <p className="text-[#4A5A32] font-bold text-xl">{price}</p>
          <Link to="/order" className="bg-gradient-to-r from-[#4A5A32] to-[#6B7A47] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            Pesan
          </Link>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, review, rating }) {
  return (
    <div className="bg-gradient-to-br from-[#f8f9f6] to-[#eef2e8] rounded-2xl shadow-lg p-8 border-2 border-[#e8ebe4]">
      <div className="flex mb-6">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-500 text-2xl">⭐</span>
        ))}
      </div>
      <p className="text-[#5a6b3e] mb-6 italic text-lg leading-relaxed">"{review}"</p>
      <p className="font-bold text-[#4A5A32] text-lg">- {name}</p>
    </div>
  );
}

function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    { name: "Sarah M.", review: "Kopi terbaik di Pekanbaru! Suasana yang tenang dan pelayanan yang ramah sekali.", rating: 5 },
    { name: "Ahmad R.", review: "Tempat favorit untuk meeting dan kerja. WiFi cepat dan kopinya mantap banget!", rating: 5 },
    { name: "Lisa K.", review: "Cold brew mereka juara! Selalu jadi pilihan pertama kalau mau ngopi enak.", rating: 5 }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-[#6B7A47] via-[#5A6B3E] to-[#4A5A32] text-white min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">☕</div>
        <div className="absolute top-40 right-20 text-4xl opacity-15 animate-bounce">🌿</div>
        <div className="absolute bottom-32 left-1/4 text-5xl opacity-10 animate-pulse">☕</div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-green-100 to-green-50 bg-clip-text text-transparent leading-tight">
              Monochrome Space
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Ruang kopi minimalis premium di Pekanbaru. 
              Nikmati kopi berkualitas tinggi dalam suasana yang tenang dan inspiratif.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/order" className="bg-white text-[#5A6B3E] px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/20 text-center">
                🛒 Pesan Sekarang
              </Link>
              <Link to="/menu" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105 backdrop-blur-sm text-center">
                📋 Lihat Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-gradient-to-b from-[#f8f9f6] to-[#eef2e8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-[#4A5A32] mb-6">Menu Unggulan</h2>
            <p className="text-xl text-[#5a6b3e] max-w-3xl mx-auto">Signature coffee dan menu terbaik yang dibuat dengan penuh cinta dan keahlian tinggi</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <MenuCard
              image="☕"
              name="Signature Espresso"
              desc="Espresso premium dengan blend khas house yang dipanggang dengan sempurna"
              price="Rp 35.000"
              isPopular={true}
            />
            <MenuCard
              image="🥤"
              name="Cold Brew Special"
              desc="Cold brew ekstraksi 12 jam untuk rasa yang smooth dan kaya aroma"
              price="Rp 42.000"
            />
            <MenuCard
              image="🍰"
              name="Chocolate Cake"
              desc="Kue coklat Belgian lembut dengan cream vanilla house-made terbaik"
              price="Rp 28.000"
            />
            <MenuCard
              image="🥪"
              name="Club Sandwich"
              desc="Sandwich premium dengan isian segar dan roti artisan berkualitas"
              price="Rp 45.000"
              isPopular={true}
            />
          </div>
          <div className="text-center mt-16">
            <Link to="/menu" className="bg-gradient-to-r from-[#4A5A32] to-[#6B7A47] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-block text-center">
              📖 Lihat Menu Lengkap
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#eef2e8] to-[#e6ebe0]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-[#4A5A32] mb-8">Tentang Kami</h2>
              <p className="text-xl text-[#5a6b3e] leading-relaxed max-w-4xl mx-auto">
                Menciptakan ruang yang sempurna untuk penikmat kopi sejati. 
                Biji kopi pilihan terbaik diolah dengan teknik brewing modern dalam atmosfer minimalis yang menenangkan jiwa.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 mb-20">
              <div className="text-center group">
                <div className="text-7xl font-bold text-[#4A5A32] mb-4 group-hover:scale-110 transition-transform duration-300">5+</div>
                <p className="text-[#5a6b3e] text-xl font-semibold">Tahun Pengalaman</p>
              </div>
              <div className="text-center group">
                <div className="text-7xl font-bold text-[#4A5A32] mb-4 group-hover:scale-110 transition-transform duration-300">1000+</div>
                <p className="text-[#5a6b3e] text-xl font-semibold">Member Setia</p>
              </div>
              <div className="text-center group">
                <div className="text-7xl font-bold text-[#4A5A32] mb-4 group-hover:scale-110 transition-transform duration-300">50+</div>
                <p className="text-[#5a6b3e] text-xl font-semibold">Menu Pilihan</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#d4d9c7]/50 to-[#c8d0b8]/50 rounded-3xl p-12 backdrop-blur-sm border-2 border-[#e8ebe4]">
              <h3 className="text-4xl font-bold text-[#4A5A32] text-center mb-12">💬 Kata Mereka</h3>
              <div className="max-w-3xl mx-auto">
                <TestimonialCard {...testimonials[currentTestimonial]} />
              </div>
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-[#4A5A32] scale-125' : 'bg-[#c8d0b8] hover:bg-[#b8c4a8]'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
