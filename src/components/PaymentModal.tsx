import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  CheckCircle2,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod, PaymentStatus } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (txnId: string) => void;
  initialCustomerId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialCustomerId,
}) => {
  const { addTransaction, customers, settings } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [status, setStatus] = useState<PaymentStatus>('सफल');
  const [note, setNote] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('कृपया सही राशि दर्ज करें। (Please enter a valid amount)');
      return;
    }

    setIsSubmitting(true);
    try {
      const txn = await addTransaction({
        customerName: customerName.trim() || 'ग्राहक (Walk-in)',
        customerPhone: customerPhone.trim() || undefined,
        amount: numAmount,
        paymentMethod,
        status,
        note: note.trim() || undefined,
        customerId: selectedCustomerId || undefined,
      });

      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setAmount('');
      setNote('');
      setSelectedCustomerId('');
      onClose();

      if (onPaymentSuccess) {
        onPaymentSuccess(txn.id);
      }
    } catch (err) {
      console.error('Payment saving failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId);
    if (custId) {
      const found = customers.find((c) => c.id === custId);
      if (found) {
        setCustomerName(found.name);
        setCustomerPhone(found.phone);
      }
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">नया Payment दर्ज करें</h3>
              <p className="text-xs text-blue-100">UPI, नकद, कार्ड या ग्राहक खाता में एंट्री</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Amount field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              राशि (Amount in ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-400">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border-2 border-blue-500/50 rounded-2xl text-2xl font-black text-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              भुगतान का प्रकार (Payment Method)
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition ${
                  paymentMethod === 'UPI'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1 text-blue-400" />
                <span>UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition ${
                  paymentMethod === 'Cash'
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-400" />
                <span>नकद (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition ${
                  paymentMethod === 'Card'
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500 shadow-md shadow-purple-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-purple-400" />
                <span>कार्ड (Card)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Khata')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition ${
                  paymentMethod === 'Khata'
                    ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-5 h-5 mb-1 text-amber-400" />
                <span>खाता (उधार)</span>
              </button>
            </div>
          </div>

          {/* Customer Selection or Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ग्राहक का विवरण (Customer Details)
              </label>
              {customers.length > 0 && (
                <span className="text-[11px] text-blue-400 font-medium">खाते से चुनें</span>
              )}
            </div>

            {customers.length > 0 && (
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- पंजीकृत ग्राहक सूची से चुनें (वैकल्पिक) --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.balance > 0 ? `बाकी ₹${c.balance}` : 'हिसाब चुकता'}
                  </option>
                ))}
              </select>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="ग्राहक का नाम (उदा. राहुल)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="मोबाइल नंबर (उदा. 9826012345)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Note / Bill Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              सामान विवरण / नोट (वैकल्पिक)
            </label>
            <input
              type="text"
              placeholder="उदा. 2kg चीनी, 1L तेल"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Soundbox announcement prompt note */}
          {settings.soundboxEnabled && (
            <div className="flex items-center gap-2 p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-300">
              <Volume2 className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-bounce" />
              <span>
                पेमेंट सेव होते ही साउंडबॉक्स आवाज़ अलर्ट बोलेगा: "व्यापार सहायक पर ₹{amount || '0'} प्राप्त हुए"
              </span>
            </div>
          )}

          {/* Submit buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-sm transition"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'सेव हो रहा है...' : 'Payment दर्ज करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
