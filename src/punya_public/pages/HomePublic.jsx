import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [form, setForm] = useState({
    suhu_preferensi: 'dingin',
    jenis_minuman: 'kopi',
    rasa: 'manis',
    kebutuhan_makanan: 'minuman_saja',
    waktu_kunjungan: 'pagi',
    budget: 30000,
    topping: 'boba'
  });
  const [result, setResult] = useState('');
  const [confidence, setConfidence] = useState(null);

  const testimonials = [
    { name: 'Sarah M.', review: 'Kopi terbaik di Pekanbaru! Suasana yang tenang dan pelayanan yang ramah sekali.', rating: 5 },
    { name: 'Ahmad R.', review: 'Tempat favorit untuk meeting dan kerja. WiFi cepat dan kopinya mantap banget!', rating: 5 },
    { name: 'Lisa K.', review: 'Cold brew mereka juara! Selalu jadi pilihan pertama kalau mau ngopi enak.', rating: 5 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://c5b9-35-245-19-67.ngrok-free.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.predicted_menu);
        setConfidence(json.confidence || null);
      } else {
        setResult('Terjadi kesalahan: ' + json.error);
      }
    } catch (err) {
      setResult('Gagal terhubung ke server.');
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-[#6B7A47] via-[#5A6B3E] to-[#4A5A32] text-white min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-green-100 to-green-50 bg-clip-text text-transparent leading-tight">
            Monochrome Space
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto mb-12 leading-relaxed">
            Ruang kopi minimalis premium di Pekanbaru. Nikmati kopi berkualitas tinggi dalam suasana yang tenang dan inspiratif.
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
      </section>

      {/* Predict Section */}
      <section id="predict" className="py-24 bg-gradient-to-b from-[#e6ebe0] to-[#f8f9f6]">
        <div className="container mx-auto px-6 max-w-3xl">
          <h3 className="text-4xl font-bold text-[#4A5A32] text-center mb-10">🔍 Prediksi Menu Favoritmu</h3>
          <form onSubmit={handlePredict} className="space-y-6">
            {[
              { label: 'Suhu Minuman', key: 'suhu_preferensi', options: ['dingin', 'panas'] },
              { label: 'Jenis Minuman', key: 'jenis_minuman', options: ['kopi', 'non-kopi'] },
              { label: 'Rasa', key: 'rasa', options: ['manis', 'pahit', 'creamy', 'asam', 'cokelat'] },
              { label: 'Topping', key: 'topping', options: ['boba', 'whip cream', 'espresso shot', 'keju', 'oreo'] },
              { label: 'Kebutuhan Makanan', key: 'kebutuhan_makanan', options: ['minuman_saja', 'paket_dengan_snack'] },
              { label: 'Waktu Kunjungan', key: 'waktu_kunjungan', options: ['pagi', 'siang', 'malam'] }
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-[#4A5A32] font-semibold mb-1">{label}</label>
                <select className="w-full p-3 rounded-xl" value={form[key]} onChange={(e) => updateForm(key, e.target.value)}>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-[#4A5A32] font-semibold mb-1">Budget (Rp)</label>
              <input type="number" className="w-full p-3 rounded-xl" value={form.budget} onChange={(e) => updateForm('budget', e.target.value)} />
            </div>
            <button type="submit" className="bg-[#4A5A32] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition">
              Prediksi Menu
            </button>
          </form>

          {result && (
            <div className="mt-10 text-center bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-[#4A5A32] font-bold text-xl mb-2">🎯 Menu Favoritmu:</h4>
              <p className="text-2xl font-semibold text-[#6B7A47]">{result}</p>
            </div>
          )}

          {confidence && (
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-[#4A5A32] font-bold text-xl mb-4 text-center">📊 Tingkat Keyakinan Model</h4>
              <Bar data={{
                labels: Object.keys(confidence),
                datasets: [{
                  label: 'Confidence %',
                  data: Object.values(confidence),
                  backgroundColor: '#6B7A47'
                }]
              }} options={{
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 10 } }
                }
              }} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;