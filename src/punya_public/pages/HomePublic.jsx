import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-[#5A6B3E] text-white px-6 py-20 min-h-[80vh] text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Monochrome Space</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10">
          Coffee shop bergaya monokrom minimalis di Pekanbaru.  
          Temukan menu khas, pesan secara online, reservasi tanpa ribet, dan nikmati komunitas yang aktif.
        </p>

        {/* Fitur Highlight */}
        <section className="grid md:grid-cols-3 gap-8 mt-10 max-w-6xl w-full">
          <FeatureCard
            title="🍽️ Layanan Online"
            desc="Pesan makanan & minuman langsung dari website. Lebih cepat, tanpa antre!"
          />
          <FeatureCard
            title="💎 Loyalty Member"
            desc="Setiap transaksi dapat poin. Tukarkan dengan promo & hadiah menarik!"
          />
          <FeatureCard
            title="🎤 Event Komunitas"
            desc="Gabung event menulis, live music, dan workshop branding setiap bulan."
          />
        </section>
      </main>
      <Footer />
    </>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white text-[#5A6B3E] p-6 rounded-xl shadow-lg text-left">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[#3f4f2a]">{desc}</p>
    </div>
  );
}
