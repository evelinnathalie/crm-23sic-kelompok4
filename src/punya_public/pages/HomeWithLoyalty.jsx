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

    const [newPoints, newHistory, newVouchers] = await Promise.all([fetchUserPoints(user.id), fetchPointHistory(user.id), fetchRedeemedVouchers(user.id)]);
    setPoints(newPoints);
    setHistory(newHistory);
    setVouchers(newVouchers);
    setShowRedeemPopup(false);
  };

  return (
    <>
      <Navbar />
      <section className="py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Welcome Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center "></div>
          </div>

          {/* Membership Card */}
          <div className={`bg-gradient-to-r ${tiers[membershipTier].color} text-white p-6 lg:p-8 rounded-3xl shadow-2xl mb-10 relative overflow-hidden transition-transform transform hover:scale-105`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-white rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold">{membershipTier}</h2>
                  </div>
                  <p className="text-white/90 text-sm">Member Premium</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl lg:text-4xl font-bold mb-1">{points}</div>
                  <div className="text-white/90 text-xs uppercase tracking-wide">Poin Tersedia</div>
                </div>
              </div>

              {nextTier && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/90 font-medium">Progress ke {nextTier}</span>
                    <span className="text-white font-semibold">{nextTierPoints} poin lagi</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                      style={{ width: `${nextTierProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {tiers[membershipTier].benefits.map((b, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                    ✨ {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Redeem Button */}
          <div className="text-center mb-10">
            <button
              onClick={() => setShowRedeemPopup(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Tukar Poin Reward
              </div>
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Aktivitas Poin" icon="chart">
              {history.length === 0 ? (
                <EmptyState
                  title="Belum ada aktivitas"
                  desc="Mulai berbelanja untuk mendapatkan poin!"
                  icon="activity"
                />
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((h, i) => (
                    <div key={i} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-lg mb-1">{h.keterangan}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {h.tanggal}
                          </p>
                        </div>
                        <div className={`text-right ${h.poin > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          <div className="flex items-center gap-1">
                            {h.poin > 0 ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                            )}
                            <span className="font-bold text-xl">{h.poin > 0 ? '+' : ''}{h.poin}</span>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">poin</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Voucher Saya" icon="gift">
              {vouchers.length === 0 ? (
                <EmptyState
                  title="Belum ada voucher"
                  desc="Tukar poin untuk mendapatkan voucher menarik!"
                  icon="voucher"
                />
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {vouchers.map((v, i) => (
                    <div key={i} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-lg">{v.nama_voucher || v.nama}</h4>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Berlaku hingga: {v.expired}
                          </p>
                        </div>
                        <span className={`text-xs px-4 py-2 rounded-full font-medium ${v.status === 'Aktif'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
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
      {showRedeemPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl max-h-[70vh] overflow-hidden">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Pilih Voucher Reward</h2>
                <p className="text-blue-100 text-lg">Poin Anda: <span className="font-semibold">{points}</span></p>
              </div>
            </div>

            <div className="p-6 max-h-60 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {availableVouchers.map((v, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-800 text-lg">{v.nama_voucher || v.nama}</h4>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <span>{v.poin} poin</span>
                          <span className="ml-2">Berlaku {v.expiredDays} hari</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeem(v)}
                        disabled={points < v.poin}
                        className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${points >= v.poin
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {points >= v.poin ? "Tukar Sekarang" : "Poin Kurang"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="p-4 bg-gray-50 border-t flex justify-center">
              <button
                onClick={() => setShowRedeemPopup(false)}
                className="w-full py-3 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 rounded-2xl text-gray-700 font-semibold transition-all duration-200"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

// Panel Component
function Panel({ title, icon, children }) {
  const getIcon = () => {
    switch (icon) {
      case 'chart':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'gift':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="px-8 py-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            {getIcon()}
          </div>
          <h4 className="font-bold text-gray-800 text-xl">{title}</h4>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

// Empty State Component
function EmptyState({ title, desc, icon }) {
  const getIcon = () => {
    switch (icon) {
      case 'activity':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'voucher':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
    }
  };

  return (
    <div className="text-center py-16">
      <div className="mb-6">
        {getIcon()}
      </div>
      <h3 className="text-2xl font-semibold text-gray-600 mb-3">{title}</h3>
      {desc && <p className="text-gray-500 text-lg">{desc}</p>}
    </div>
  );
}
