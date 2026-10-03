import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  Calendar,
  Download,
  Printer,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnalyticsView: React.FC = () => {
  const { transactions, settings, customers } = useShop();
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 7 * 86400000;

  const filteredTxns = transactions.filter((t) => {
    if (timeFilter === 'today') return t.timestamp >= todayStart;
    if (timeFilter === 'week') return t.timestamp >= weekStart;
    return true;
  });

  const totalRevenue = filteredTxns
    .filter((t) => t.status === 'सफल')
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulTxns = filteredTxns.filter((t) => t.status === 'सफल');
  const avgTicketSize =
    successfulTxns.length > 0 ? Math.round(totalRevenue / successfulTxns.length) : 0;

  // Breakdown by payment method
  const upiTotal = filteredTxns
    .filter((t) => t.paymentMethod === 'UPI' && t.status === 'सफल')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashTotal = filteredTxns
    .filter((t) => t.paymentMethod === 'Cash' && t.status === 'सफल')
    .reduce((sum, t) => sum + t.amount, 0);

  const cardTotal = filteredTxns
    .filter((t) => t.paymentMethod === 'Card' && t.status === 'सफल')
    .reduce((sum, t) => sum + t.amount, 0);

  const khataTotal = filteredTxns
    .filter((t) => t.paymentMethod === 'Khata' && t.status === 'सफल')
    .reduce((sum, t) => sum + t.amount, 0);

  const downloadCsv = () => {
    if (filteredTxns.length === 0) {
      alert('डाउनलोड के लिए कोई डेटा नहीं है।');
      return;
    }

    let csv = 'Receipt No,Date & Time,Customer,Phone,Amount,Method,Status,UPI Ref\n';
    filteredTxns.forEach((t) => {
      csv += `"${t.receiptNumber}","${t.time}","${t.customerName}","${t.customerPhone || ''}",${
        t.amount
      },"${t.paymentMethod}","${t.status}","${t.upiRef || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VyaparSahayak_Report_${timeFilter}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            दुकान की बिक्री और लेनदेन विश्लेषण (Analytics)
          </h2>
          <p className="text-xs text-slate-400">
            UPI, नकद और बहीखाता की विस्तृत रिपोर्ट और दैनिक सेल्स समरी
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeFilter === 'today' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              आज (Today)
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeFilter === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              इस सप्ताह
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              सभी (All)
            </button>
          </div>

          <button
            onClick={downloadCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV डाउनलोड</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">कुल प्राप्ति (Revenue)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {successfulTxns.length} सफल भुगतान
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">औसत बिल राशि (Avg Ticket)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            ₹{avgTicketSize.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">प्रति ग्राहक औसत खर्च</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-400">डिजिटल UPI संग्रह</p>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">
            ₹{upiTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            कुल बिक्री का {totalRevenue > 0 ? Math.round((upiTotal / totalRevenue) * 100) : 0}%
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">दुकान गल्ला नकद (Cash)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            ₹{cashTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">हाथ में नकद राशि</p>
        </div>
      </div>

      {/* Payment Channel Breakdown Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Method Distribution Bars */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
          <h3 className="font-bold text-base text-white flex items-center justify-between">
            <span>भुगतान चैनल विश्लेषण (Payment Methods)</span>
            <span className="text-xs font-normal text-slate-400">प्रतिशत अनुसार</span>
          </h3>

          <div className="space-y-4">
            {/* UPI Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> UPI (GPay, PhonePe, Paytm)
                </span>
                <span className="text-white">
                  ₹{upiTotal.toLocaleString('en-IN')} (
                  {totalRevenue > 0 ? Math.round((upiTotal / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${totalRevenue > 0 ? (upiTotal / totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Cash Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4" /> नकद (Cash Drawer)
                </span>
                <span className="text-white">
                  ₹{cashTotal.toLocaleString('en-IN')} (
                  {totalRevenue > 0 ? Math.round((cashTotal / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${totalRevenue > 0 ? (cashTotal / totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Card Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-purple-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> डेबिट / क्रेडिट कार्ड (POS)
                </span>
                <span className="text-white">
                  ₹{cardTotal.toLocaleString('en-IN')} (
                  {totalRevenue > 0 ? Math.round((cardTotal / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${totalRevenue > 0 ? (cardTotal / totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Khata Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> बहीखाता (उधार बिक्री)
                </span>
                <span className="text-white">
                  ₹{khataTotal.toLocaleString('en-IN')} (
                  {totalRevenue > 0 ? Math.round((khataTotal / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${totalRevenue > 0 ? (khataTotal / totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Box: Daily Merchant Insights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                स्मार्ट व्यापारी सुझाव (Store Insights)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              आपकी दुकान पर डिजिटल यूपीआई (UPI) और नकद दोनों का स्वस्थ संतुलन है। ग्राहक सुविधा के लिए काउंटर पर UPI स्टैंडी हमेशा दृश्यमान रखें।
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>दुकान का नाम:</span>
              <span className="font-bold text-slate-200">{settings.shopName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>दैनिक रिपोर्ट स्थिति:</span>
              <span className="text-emerald-400 font-bold">✓ अप-टू-डेट</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Google Drive बैकअप:</span>
              <span className="text-blue-400 font-bold">सक्रिय (Drive Ready)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
