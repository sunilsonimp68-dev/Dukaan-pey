import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Store,
  Calendar,
  CreditCard,
  Download,
} from 'lucide-react';
import { Transaction } from '../types';
import { useShop } from '../context/ShopContext';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { settings } = useShop();
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (transaction && qrRef.current) {
      const receiptVerifyUrl = `https://vyaparsahayak.in/verify?rec=${transaction.receiptNumber}&amt=${transaction.amount}&upi=${settings.upiId}`;
      QRCode.toCanvas(qrRef.current, receiptVerifyUrl, {
        width: 110,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
    }
  }, [transaction, settings.upiId]);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!transaction) return;
    const text = `🧾 *${settings.shopName}* - डिजिटल रसीद\n\nरसीद क्र.: ${transaction.receiptNumber}\nदिनांक: ${transaction.time}\nग्राहक: ${transaction.customerName}\nराशि: ₹${transaction.amount}\nभुगतान माध्यम: ${transaction.paymentMethod}\nस्थिति: ${transaction.status}\n${transaction.upiRef ? `UPI Ref: ${transaction.upiRef}\n` : ''}${transaction.note ? `नोट: ${transaction.note}\n` : ''}\nधन्यवाद! पुनः पधारें!`;

    const cleanPhone = transaction.customerPhone?.replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone && cleanPhone.length === 10 ? `91${cleanPhone}` : '';
    const url = phoneParam
      ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Top Action Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-300">डिजिटल पेमेंट रसीद (Receipt)</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt Slip */}
        <div id="thermal-receipt" className="p-6 bg-white text-slate-900 font-mono text-xs space-y-3">
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-slate-400">
            <h2 className="text-base font-black tracking-tight uppercase text-slate-900 font-sans">
              {settings.shopName}
            </h2>
            <p className="text-[10px] text-slate-600 font-sans">{settings.address}</p>
            <p className="text-[10px] text-slate-600 font-sans">मो.: {settings.phone}</p>
            {settings.gstNumber && (
              <p className="text-[10px] text-slate-600 font-sans">GSTIN: {settings.gstNumber}</p>
            )}
          </div>

          {/* Bill Info */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">रसीद सं. (Receipt):</span>
              <span className="font-bold">{transaction.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">दिनांक / समय:</span>
              <span>{transaction.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ग्राहक (Customer):</span>
              <span className="font-bold">{transaction.customerName}</span>
            </div>
            {transaction.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">मोबाइल:</span>
                <span>{transaction.customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">भुगतान माध्यम:</span>
              <span className="font-bold">{transaction.paymentMethod}</span>
            </div>
            {transaction.upiRef && (
              <div className="flex justify-between">
                <span className="text-slate-500">UPI Ref / Txn ID:</span>
                <span className="font-bold text-[10px]">{transaction.upiRef}</span>
              </div>
            )}
            {transaction.note && (
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">विवरण / नोट:</span>
                <span>{transaction.note}</span>
              </div>
            )}
          </div>

          {/* Amount Box */}
          <div className="py-2.5 bg-slate-100 rounded-xl px-3 flex justify-between items-center font-sans">
            <span className="font-extrabold text-sm text-slate-700">कुल भुगतान राशि:</span>
            <span className="font-black text-xl text-slate-900">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-1.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold font-sans border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>भुगतान सफल (PAID & VERIFIED)</span>
          </div>

          {/* QR Code Verification & Footer */}
          <div className="pt-2 text-center space-y-2 flex flex-col items-center">
            <canvas ref={qrRef} className="rounded" />
            <p className="text-[9px] text-slate-500 font-sans">
              डिजिटल सत्यापन के लिए स्कैन करें • Vyapar Sahayak
            </p>
            <p className="text-[10px] font-bold text-slate-700 font-sans">*** धन्यवाद, फिर पधारें! ***</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Print & Share) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट रसीद (Print)</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp शेयर</span>
          </button>
        </div>
      </div>
    </div>
  );
};
