import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import {
  fetchUserPoints,
  fetchPointHistory,
  fetchRedeemedVouchers,
  fetchAvailableVouchers,
  redeemVoucher,
} from "../../services/supabaseLoyaltyService";

export default function HomeWithLoyalty() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [membershipTier, setMembershipTier] = useState("Bronze");
  const [nextTierProgress, setNextTierProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);

  const tiers = {
    Bronze: { min: 0, max: 99, color: "from-amber-600 to-amber-700", benefits: ["5% diskon minuman"] },
    Silver: { min: 100, max: 299, color: "from-gray-400 to-gray-500", benefits: ["10% diskon minuman"] },
    Gold: { min: 300, max: 599, color: "from-yellow-400 to-yellow-500", benefits: ["15% diskon semua item"] },
    Platinum: { min: 600, max: Infinity, color: "from-purple-500 to-purple-600", benefits: ["20% diskon semua item"] },
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserPoints(user.id).then(setPoints);
      fetchPointHistory(user.id).then(setHistory);
      fetchRedeemedVouchers(user.id).then(setVouchers);
      fetchAvailableVouchers().then(setAvailableVouchers);
    }
  }, [user]);

  useEffect(() => {
    for (let t in tiers) {
      if (points >= tiers[t].min && points <= tiers[t].max) {
        setMembershipTier(t);
        setNextTierProgress(tiers[t].max === Infinity ? 100 : ((points - tiers[t].min) / (tiers[t].max - tiers[t].min)) * 100);
        break;
      }
    }
  }, [points]);

  const nextTier = Object.keys(tiers).find((t, i, arr) => arr[i - 1] === membershipTier);
  const nextTierPoints = nextTier ? tiers[nextTier].min - points : null;

  const handleRedeem = async (voucher) => {
    if (!user?.id) {
      alert("User tidak valid.");
      return;
    }

    if (points < voucher.poin) {
      alert("Poin kamu belum cukup!");
      return;
    }

    const error = await redeemVoucher(user.id, voucher);
    if (error) {
      alert("Gagal menukar voucher.");
      return;
    }

    const [newPoints, newHistory, newVouchers] = await Promise.all([
      fetchUserPoints(user.id),
      fetchPointHistory(user.id),
      fetchRedeemedVouchers(user.id),
    ]);
    setPoints(newPoints);
    setHistory(newHistory);
    setVouchers(newVouchers);
    setShowRedeemPopup(false);
  };

  return (
    <>
      <Navbar />
      <section className="py-8 bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Selamat datang kembali, <span className="text-green-700">{user?.nama}</span>
            </h1>
            <p className="text-gray-600">Kelola poin loyalty dan nikmati benefit eksklusif</p>
          </div>

          <div className={`bg-gradient-to-r ${tiers[membershipTier].color} text-white p-6 lg:p-8 rounded-2xl shadow-xl mb-8`}>
            <div className="flex justify-between mb-4">
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
                <div className="flex justify-between mb-1 text-sm text-white/90">
                  <span>Progress ke {nextTier}</span>
                  <span>{nextTierPoints} poin lagi</span>
                </div>
                <div className="w-full bg-white/30 h-3 rounded-full">
                  <div className="bg-white h-full rounded-full" style={{ width: `${nextTierProgress}%` }}></div>
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {tiers[membershipTier].benefits.map((b, i) => (
                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{b}</span>
              ))}
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setShowRedeemPopup(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:scale-105 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all"
            >
              Tukar Poin Reward
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Panel title="Aktivitas Poin">
              {history.length === 0 ? (
                <EmptyState title="Belum ada aktivitas" desc="Mulai berbelanja untuk mendapatkan poin!" />
              ) : (
                <div className="space-y-4">
                  {(showAll ? history : history.slice(0, 5)).map((h, i) => (
                    <div key={i} className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{h.keterangan}</p>
                          <p className="text-sm text-gray-500 mt-1">{h.tanggal}</p>
                        </div>
                        <div className={`text-right ${h.poin > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          <span className="font-bold text-lg">{h.poin > 0 ? '+' : ''}{h.poin}</span>
                          <div className="text-xs text-gray-500">poin</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {history.length > 5 && (
                    <button onClick={() => setShowAll(!showAll)} className="text-sm text-green-600 font-medium">
                      {showAll ? "Sembunyikan" : `Lihat Semua (${history.length})`}
                    </button>
                  )}
                </div>
              )}
            </Panel>

            <Panel title="Voucher Saya">
              {vouchers.length === 0 ? (
                <EmptyState title="Belum ada voucher" desc="Tukar poin untuk mendapatkan voucher menarik!" />
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {vouchers.map((v, i) => (
                    <div key={i} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">{v.nama_voucher || v.nama}</h4>
                          <p className="text-sm text-gray-500 mt-1">Berlaku hingga: {v.expired}</p>
                        </div>
                        <span className={`text-xs px-3 py-2 rounded-full font-medium ${v.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
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
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border-2 hover:border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{v.nama_voucher || v.nama}</h4>
                        <p className="text-sm text-gray-500">Butuh {v.poin} poin • Berlaku {v.expiredDays} hari</p>
                      </div>
                      <button
                        onClick={() => handleRedeem(v)}
                        disabled={points < v.poin}
                        className={`px-6 py-3 text-sm rounded-xl font-semibold ${points >= v.poin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                      >
                        {points >= v.poin ? 'Tukar' : 'Poin Kurang'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <button onClick={() => setShowRedeemPopup(false)} className="w-full py-3 bg-gray-300 rounded-xl text-gray-700 font-semibold">
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

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-green-50">
        <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      {desc && <p className="text-gray-500">{desc}</p>}
    </div>
  );
}
