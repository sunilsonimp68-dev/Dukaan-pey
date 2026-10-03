import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QRStandeeView: React.FC = () => {
  const { settings } = useShop();
  const [amount, setAmount] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const standeeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate UPI URI
  const numericAmount = parseFloat(amount);
  const upiUrl = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(
    settings.shopName
  )}&cu=INR${numericAmount > 0 ? `&am=${numericAmount.toFixed(2)}` : ''}${
    customNote ? `&tn=${encodeURIComponent(customNote)}` : ''
  }`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        upiUrl,
        {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }

    if (standeeCanvasRef.current) {
      QRCode.toCanvas(
        standeeCanvasRef.current,
        upiUrl,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('Standee QR error:', error);
        }
      );
    }
  }, [upiUrl]);

  const copyUpiLink = () => {
    navigator.clipboard.writeText(upiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQrImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${settings.shopName.replace(/\s+/g, '_')}_UPI_QR.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  return (
    <div className={`space-y-6 max-w-6xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto flex flex-col items-center justify-center' : ''}`}>
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-400" />
            दुकान का लाइव UPI QR स्टैंडी
          </h2>
          <p className="text-sm text-slate-400">
            ग्राहक किसी भी UPI ऐप (GPay, PhonePe, Paytm, BHIM) से स्कैन कर तुरंत भुगतान कर सकते हैं।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? 'बाहर निकलें' : 'काउंटर डिस्प्ले मोड'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span>स्टैंडी प्रिंट करें</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Amount Configuration & Quick Chips */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-800/90 border border-slate-700/70 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              फिक्स राशि का QR बनाएँ (वैकल्पिक)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                राशि (₹) <span className="text-slate-500 font-normal">(खाली रखने पर ग्राहक खुद राशि भरेगा)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="राशि दर्ज करें (उदा. 500)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-bold text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">त्वरित राशि चुनें:</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      amount === q.toString()
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    + ₹{q}
                  </button>
                ))}
              </div>
              {amount && (
                <button
                  onClick={() => setAmount('')}
                  className="mt-2 text-xs text-slate-400 hover:text-red-400 underline"
                >
                  राशि साफ़ करें (Any Amount)
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                पेमेंट नोट (वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="उदा. बिल भुगतान, टेबल 4"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Merchant Details Info Card */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>दुकान:</span>
                <span className="font-semibold text-slate-200">{settings.shopName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>व्यापारी VPA (UPI ID):</span>
                <span className="font-mono font-semibold text-blue-400">{settings.upiId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>मोबाइल:</span>
                <span className="font-semibold text-slate-200">{settings.phone}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={copyUpiLink}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'लिंक कॉपी हुआ' : 'UPI लिंक कॉपी'}</span>
              </button>

              <button
                onClick={downloadQrImage}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>QR सेव करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: The Authentic Indian Merchant Standee */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="print-standee"
            className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-blue-600 flex flex-col items-center relative overflow-hidden transition-all hover:shadow-blue-500/20"
          >
            {/* Standee Top Header */}
            <div className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 -mx-6 -mt-6 p-4 rounded-b-2xl text-center text-white shadow-md">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                  ⚡ All UPI Accepted Here
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight leading-snug">
                {settings.shopName}
              </h1>
              <p className="text-xs text-blue-100 font-medium">
                {settings.ownerName} • {settings.address}
              </p>
            </div>

            {/* Dynamic Amount Banner if specified */}
            {numericAmount > 0 ? (
              <div className="mt-4 px-4 py-1.5 bg-emerald-50 border border-emerald-300 rounded-full flex items-center gap-1 text-emerald-800 font-extrabold text-sm animate-pulse">
                <span>भुगतान राशि:</span>
                <span className="text-base text-emerald-900">₹{numericAmount.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <div className="mt-3 text-xs font-semibold text-slate-500">
                Scan & Pay with Any UPI App
              </div>
            )}

            {/* QR Code Canvas */}
            <div className="relative my-3 p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex items-center justify-center">
              <canvas ref={canvasRef} className="rounded-xl" />
              {/* Center UPI Logo Overlay */}
              <div className="absolute w-10 h-10 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center shadow-md">
                <span className="font-extrabold text-[10px] text-blue-700 tracking-tighter">
                  UPI
                </span>
              </div>
            </div>

            {/* UPI ID */}
            <div className="w-full text-center px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 mb-3">
              <p className="text-[11px] text-slate-500 font-medium">व्यापारी UPI ID</p>
              <p className="font-mono font-bold text-xs text-slate-800 select-all">
                {settings.upiId}
              </p>
            </div>

            {/* Accepted UPI Apps Logos / Badges */}
            <div className="w-full pt-3 border-t border-slate-200 text-center">
              <p className="text-[11px] font-bold text-slate-600 mb-2">स्वीकार्य डिजिटल भुगतान</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-extrabold border border-slate-300">
                  Google Pay
                </span>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-extrabold border border-purple-300">
                  PhonePe
                </span>
                <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-lg text-xs font-extrabold border border-cyan-300">
                  Paytm
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-extrabold border border-emerald-300">
                  BHIM UPI
                </span>
              </div>
            </div>

            {/* Standee Footer */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% सुरक्षित • Vyapar Sahayak Verified Merchant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
