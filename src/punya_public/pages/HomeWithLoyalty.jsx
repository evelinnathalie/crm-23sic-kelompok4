// HomeWithLoyalty.jsx
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeWithLoyalty() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [membershipTier, setMembershipTier] = useState("Bronze");
  const [nextTierProgress, setNextTierProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);

  const tiers = {
    Bronze: { 
      min: 0, 
      max: 99, 
      color: "from-amber-600 to-amber-700", 
      bgAccent: "bg-amber-50",
      borderAccent: "border-amber-200",
      benefits: ["5% diskon minuman"] 
    },
    Silver: { 
      min: 100, 
      max: 299, 
      color: "from-gray-400 to-gray-500", 
      bgAccent: "bg-gray-50",
      borderAccent: "border-gray-200",
      benefits: ["10% diskon minuman"] 
    },
    Gold: { 
      min: 300, 
      max: 599, 
      color: "from-yellow-400 to-yellow-500", 
      bgAccent: "bg-yellow-50",
      borderAccent: "border-yellow-200",
      benefits: ["15% diskon semua item"] 
    },
    Platinum: { 
      min: 600, 
      max: Infinity, 
      color: "from-purple-500 to-purple-600", 
      bgAccent: "bg-purple-50",
      borderAccent: "border-purple-200",
      benefits: ["20% diskon semua item"] 
    },
  };

  const availableVouchers = [
    { nama: "Gratis Kopi", poin: 100, expiredDays: 7, icon: "☕" },
    { nama: "Diskon 20%", poin: 150, expiredDays: 5, icon: "💰" },
    { nama: "Voucher Rp 20.000", poin: 200, expiredDays: 10, icon: "🎟️" },
    { nama: "Paket Kopi + Roti", poin: 250, expiredDays: 3, icon: "🥐" },
    { nama: "Prioritas Reservasi", poin: 300, expiredDays: 7, icon: "⭐" },
  ];

  useEffect(() => {
    if (user?.nama) {
      const pointsData = JSON.parse(sessionStorage.getItem("loyalty") || "{}");
      const point = pointsData[user.nama] || 0;
      setPoints(point);

      const h = JSON.parse(sessionStorage.getItem("loyalty_history") || "{}");
      const sorted = (h[user.nama] || []).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setHistory(sorted);

      const r = JSON.parse(sessionStorage.getItem("redeemed") || "{}");
      setVouchers(r[user.nama] || []);

      for (let t in tiers) {
        if (point >= tiers[t].min && point <= tiers[t].max) {
          setMembershipTier(t);
          setNextTierProgress(tiers[t].max === Infinity ? 100 : ((point - tiers[t].min) / (tiers[t].max - tiers[t].min)) * 100);
          break;
        }
      }
    }
  }, [user]);

  const nextTier = Object.keys(tiers).find((t, i, arr) => arr[i - 1] === membershipTier);
  const nextTierPoints = nextTier ? tiers[nextTier].min - points : null;

  function handleRedeem(voucher) {
    if (points < voucher.poin) return alert("Poin kamu belum cukup!");

    const expired = new Date();
    expired.setDate(expired.getDate() + voucher.expiredDays);

    const r = JSON.parse(sessionStorage.getItem("redeemed") || "{}");
    const userVoucher = r[user.nama] || [];
    userVoucher.push({ nama: voucher.nama, expired: expired.toLocaleDateString(), status: "Aktif" });
    r[user.nama] = userVoucher;
    sessionStorage.setItem("redeemed", JSON.stringify(r));
    setVouchers(userVoucher);

    const p = JSON.parse(sessionStorage.getItem("loyalty") || "{}");
    p[user.nama] -= voucher.poin;
    sessionStorage.setItem("loyalty", JSON.stringify(p));
    setPoints(p[user.nama]);

    const h = JSON.parse(sessionStorage.getItem("loyalty_history") || "{}");
    const userHist = h[user.nama] || [];
    userHist.push({ keterangan: `Tukar Poin: ${voucher.nama}`, poin: -voucher.poin, tanggal: new Date().toLocaleDateString() });
    h[user.nama] = userHist;
    sessionStorage.setItem("loyalty_history", JSON.stringify(h));
    setHistory(userHist);

    setShowRedeemPopup(false);
  }

  return (
    <>
      <Navbar />
      <section className="py-8 bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Selamat datang kembali, <span className="text-green-700">{user?.nama}</span>
            </h1>
            <p className="text-gray-600">Kelola poin loyalty dan nikmati benefit eksklusif</p>
          </div>

          {/* Membership Card */}
          <div className={`bg-gradient-to-r ${tiers[membershipTier].color} text-white p-6 lg:p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold">{membershipTier} Member</h2>
                  <p className="text-white/90">Status Keanggotaan</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl lg:text-4xl font-bold">{points}</div>
                  <div className="text-white/90 text-sm">Poin Tersedia</div>
                </div>
              </div>
              
              {nextTier && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/90">Progress ke {nextTier}</span>
                    <span className="text-sm text-white/90">{nextTierPoints} poin lagi</span>
                  </div>
                  <div className="w-full bg-white/30 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${nextTierProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                {tiers[membershipTier].benefits.map((benefit, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowRedeemPopup(true)} 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-3"
            >
              <span className="text-xl">🎁</span>
              Tukar Poin Reward
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <CardLink 
              to="/reservation" 
              icon="📅" 
              title="Reservasi Meja" 
              desc="Pesan meja untuk pengalaman terbaik" 
              color="from-green-600 to-green-700" 
            />
            <CardLink 
              to="/menu" 
              icon="☕" 
              title="Order Menu" 
              desc="Jelajahi menu kopi dan makanan" 
              color="from-green-500 to-green-600" 
            />
            <CardLink 
              to="/events" 
              icon="🎉" 
              title="Join Events" 
              desc="Ikuti acara komunitas menarik" 
              color="from-green-700 to-green-800" 
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Points Activity Panel */}
            <Panel 
              title="Aktivitas Poin" 
              icon="📈" 
              header={
                history.length > 5 && (
                  <button 
                    onClick={() => setShowAll(!showAll)} 
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    {showAll ? "Sembunyikan" : `Lihat Semua (${history.length})`}
                  </button>
                )
              }
            >
              {history.length === 0 ? (
                <EmptyState icon="📊" title="Belum ada aktivitas" desc="Mulai berbelanja untuk mendapatkan poin!" />
              ) : (
                <div className="space-y-4">
                  {(showAll ? history : history.slice(0, 5)).map((h, i) => (
                    <div key={i} className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500 hover:bg-green-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{h.keterangan}</p>
                          <p className="text-sm text-gray-500 mt-1">{h.tanggal}</p>
                        </div>
                        <div className={`text-right ${h.poin > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          <span className="font-bold text-lg">
                            {h.poin > 0 ? '+' : ''}{h.poin}
                          </span>
                          <div className="text-xs text-gray-500">poin</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Vouchers Panel */}
            <Panel title="Voucher Saya" icon="🎟️">
              {vouchers.length === 0 ? (
                <EmptyState icon="🎫" title="Belum ada voucher" desc="Tukar poin untuk mendapatkan voucher menarik!" />
              ) : (
                <div className="space-y-4">
                  {vouchers.map((v, i) => (
                    <div key={i} className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg">{v.nama}</h4>
                          <p className="text-sm text-gray-500 mt-1">Berlaku hingga: {v.expired}</p>
                        </div>
                        <span className={`text-xs px-3 py-2 rounded-full font-medium ${
                          v.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>
      </section>

      {/* Redeem Popup */}
      {showRedeemPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <h2 className="text-2xl font-bold text-center">Pilih Voucher Reward</h2>
              <p className="text-center text-green-100 mt-1">Poin Anda: {points}</p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {availableVouchers.map((v, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border-2 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{v.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">{v.nama}</h4>
                          <p className="text-sm text-gray-500">Butuh {v.poin} poin • Berlaku {v.expiredDays} hari</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeem(v)}
                        disabled={points < v.poin}
                        className={`px-6 py-3 text-sm rounded-xl font-semibold transition-all ${
                          points >= v.poin 
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {points >= v.poin ? 'Tukar' : 'Poin Kurang'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t">
              <button
                onClick={() => setShowRedeemPopup(false)}
                className="w-full py-3 bg-gray-300 hover:bg-gray-400 rounded-xl text-gray-700 font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

function CardLink({ to, icon, title, desc, color }) {
  return (
    <Link 
      to={to} 
      className="block p-6 bg-white rounded-xl border shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
    >
      <div className={`w-12 h-12 flex items-center justify-center text-white text-2xl rounded-xl mb-4 bg-gradient-to-r ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </Link>
  );
}

function Panel({ title, icon, children, header }) {
  return (
    <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-green-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
        </div>
        {header}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      {desc && <p className="text-gray-500">{desc}</p>}
    </div>
  );
}