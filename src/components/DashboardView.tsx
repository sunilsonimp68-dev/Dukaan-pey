import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Users,
  HardDrive,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  Volume2,
  Radio,
  Wifi,
  BatteryCharging,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Smartphone,
  Banknote,
  BookOpen,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Transaction } from '../types';

interface DashboardViewProps {
  onOpenPayment: () => void;
  onSelectTransactionReceipt: (txn: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenPayment,
  onSelectTransactionReceipt,
}) => {
  const {
    transactions,
    settings,
    setActiveTab,
    soundboxPlaying,
    triggerSoundbox,
    deleteTransaction,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Compute daily stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayTxns = transactions.filter((t) => t.timestamp >= todayStart);
  const todaySuccessful = todayTxns.filter((t) => t.status === 'सफल');
  const todayTotal = todaySuccessful.reduce((sum, t) => sum + t.amount, 0);
  const todayAvg = todaySuccessful.length > 0 ? Math.round(todayTotal / todaySuccessful.length) : 0;

  // Filtered transactions for the table
  const filteredList = transactions.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.upiRef && t.upiRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.customerPhone && t.customerPhone.includes(searchQuery));

    const matchesMethod = methodFilter === 'ALL' || t.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome & Quick Action Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>डिजिटल पेमेंट पार्टनर • लाइव सक्रिय</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {settings.shopName}
            </h1>
            <p className="text-sm text-slate-300">
              Payment collection, soundbox voice alerts, Google Drive sync और डिजिटल बहीखाता — सब एक जगह।
            </p>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={onOpenPayment}
              className="flex flex-col items-center justify-center p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span>➕ Payment लें</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className="flex flex-col items-center justify-center p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <QrCode className="w-5 h-5 mb-1" />
              <span>▣ QR स्टैंडी</span>
            </button>

            <button
              onClick={() => setActiveTab('khata')}
              className="flex flex-col items-center justify-center p-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-600/30 transition transform hover:-translate-y-0.5"
            >
              <Users className="w-5 h-5 mb-1" />
              <span>📖 ग्राहक खाता</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className="flex flex-col items-center justify-center p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
            >
              <HardDrive className="w-5 h-5 mb-1" />
              <span>☁️ Drive सिंक</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Total */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              आज की कुल प्राप्ति
            </p>
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ₹{todayTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-400 font-medium">
            ✓ आज {todaySuccessful.length} सफल भुगतान
          </p>
        </div>

        {/* Total Txn Count */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              कुल लेन-देन
            </p>
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {transactions.length}
          </h3>
          <p className="text-[11px] text-slate-400">
            आज: {todayTxns.length} लेन-देन दर्ज
          </p>
        </div>

        {/* Successful Rate */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              सफल भुगतान दर
            </p>
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
            {transactions.length > 0
              ? `${Math.round(
                  (transactions.filter((t) => t.status === 'सफल').length / transactions.length) *
                    100
                )}%`
              : '100%'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {transactions.filter((t) => t.status === 'सफल').length} भुगतान सफल
          </p>
        </div>

        {/* Average Ticket */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              औसत भुगतान (Average)
            </p>
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ₹{todayAvg.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400">प्रति ग्राहक औसत</p>
        </div>
      </div>

      {/* Realistic Animated Soundbox Device & Live Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {/* Hardware Soundbox Mockup */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-900 to-slate-800 border-2 ${
              soundboxPlaying
                ? 'border-amber-400 shadow-xl shadow-amber-500/30 animate-pulse'
                : 'border-slate-700'
            } flex flex-col items-center justify-center relative p-2`}
          >
            {/* Speaker Grill Holes */}
            <div className="grid grid-cols-4 gap-1 mb-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    soundboxPlaying ? 'bg-amber-400 animate-ping' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            {/* LED Indicator */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  soundboxPlaying ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <span className="text-[8px] font-mono text-slate-400 font-bold">DP-BOX</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" />
                Vyapar Sahayak साउंडबॉक्स (Voice Speaker)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ऑनलाइन
              </span>
            </div>
            <p className="text-xs text-slate-400">
              हर सफल QR/UPI पेमेंट पर वास्तविक ध्वनि और हिंदी/अंग्रेजी में बोलकर अलर्ट देता है।
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" /> 4G / Wi-Fi Connected
              </span>
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-400" /> 98% Battery
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => triggerSoundbox(250)}
            disabled={soundboxPlaying}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-bold transition"
          >
            <Volume2 className={`w-4 h-4 ${soundboxPlaying ? 'animate-bounce' : ''}`} />
            <span>{soundboxPlaying ? 'अलर्ट बज रहा है...' : 'साउंडबॉक्स टेस्ट करें (₹250)'}</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions Table Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-400" />
              हाल के लेन-देन (Recent Transactions)
            </h3>
            <p className="text-xs text-slate-400">
              डिजिटल रसीद देखने, प्रिंट करने या WhatsApp पर भेजने के लिए किसी भी लेन-देन पर क्लिक करें।
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="ग्राहक या रसीद खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">सभी माध्यम (All Methods)</option>
              <option value="UPI">UPI</option>
              <option value="Cash">नकद (Cash)</option>
              <option value="Card">कार्ड (Card)</option>
              <option value="Khata">खाता (Khata)</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                <th className="py-3 px-3">रसीद / समय</th>
                <th className="py-3 px-3">ग्राहक का नाम</th>
                <th className="py-3 px-3">माध्यम</th>
                <th className="py-3 px-3 text-right">राशि (₹)</th>
                <th className="py-3 px-3 text-center">स्थिति</th>
                <th className="py-3 px-3 text-right">कार्य (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    कोई लेन-देन नहीं मिला। ऊपर दिए गए "➕ Payment लें" बटन से एंट्री करें।
                  </td>
                </tr>
              ) : (
                filteredList.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => onSelectTransactionReceipt(t)}
                  >
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-white">{t.receiptNumber}</p>
                      <p className="text-[11px] text-slate-400">{t.time}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-200">{t.customerName}</p>
                      {t.customerPhone && (
                        <p className="text-[11px] text-slate-400">📞 {t.customerPhone}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          t.paymentMethod === 'UPI'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : t.paymentMethod === 'Cash'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : t.paymentMethod === 'Card'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {t.paymentMethod === 'UPI' && <Smartphone className="w-3 h-3" />}
                        {t.paymentMethod === 'Cash' && <Banknote className="w-3 h-3" />}
                        {t.paymentMethod === 'Card' && <CreditCard className="w-3 h-3" />}
                        {t.paymentMethod === 'Khata' && <BookOpen className="w-3 h-3" />}
                        {t.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className="font-black text-sm text-white">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'सफल'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        ✓ {t.status}
                      </span>
                    </td>

                    <td
                      className="py-3.5 px-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectTransactionReceipt(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="डिजिटल रसीद देखें"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`क्या आप रसीद ${t.receiptNumber} हटाना चाहते हैं?`)) {
                              deleteTransaction(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
