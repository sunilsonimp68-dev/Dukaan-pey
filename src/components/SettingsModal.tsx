import React, { useState } from 'react';
import {
  X,
  Settings,
  Store,
  CreditCard,
  Volume2,
  Trash2,
  CheckCircle2,
  Radio,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShopSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, clearAllLocalData, triggerSoundbox } = useShop();

  const [formData, setFormData] = useState<ShopSettings>({ ...settings });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleTestVoice = () => {
    triggerSoundbox(500);
  };

  const handleConfirmClear = () => {
    clearAllLocalData();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">दुकान & साउंडबॉक्स सेटिंग (Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {savedToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>सेटिंग्स सफलतापूर्वक सुरक्षित कर ली गई हैं!</span>
            </div>
          )}

          {/* Section: Shop Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Store className="w-4 h-4" /> दुकान का विवरण (Shop Profile)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  दुकान / प्रतिष्ठान का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  दुकानदार / प्रोपराइटर का नाम
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  दुकान का पता (Address)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  हेल्पलाइन / फोन नंबर
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                GSTIN नंबर (वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="23AAAAA0000A1Z5"
                value={formData.gstNumber || ''}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section: UPI VPA Configuration */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> UPI पेमेंट आईडी (Merchant VPA)
            </h4>

            <div className="space-y-2">
              <label className="block text-xs text-slate-300 font-semibold">
                UPI ID (Virtual Payment Address) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. sunil@okhdfcbank या 9876543210@paytm"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400">
                इसी UPI आईडी पर दुकान के स्टैंडी और QR कोड से सीधा पैसा आपके बैंक खाते में जाएगा।
              </p>
            </div>
          </div>

          {/* Section: Soundbox Voice Config */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> साउंडबॉक्स आवाज़ अलर्ट (Voice Box)
              </h4>
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>आवाज़ टेस्ट (₹500)</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                पेमेंट पर ऑटोमेटिक साउंडबॉक्स अलर्ट बजाएँ
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soundboxEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, soundboxEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  आवाज़ भाषा (Voice Language)
                </label>
                <select
                  value={formData.soundboxLanguage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soundboxLanguage: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hi-IN">हिंदी (Hindi - "दुकान पे पर ₹500 प्राप्त हुए")</option>
                  <option value="hinglish">Hinglish ("Dukaan Pay par ₹500 prapt hue")</option>
                  <option value="en-IN">English ("Received ₹500 on Dukaan Pay")</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  वॉल्यूम (Volume: {Math.round(formData.soundboxVolume * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={formData.soundboxVolume}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soundboxVolume: parseFloat(e.target.value),
                    })
                  }
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>

          {/* Section: Danger Zone (Clear Data) */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> डेटा प्रबंधन (Data Reset)
            </h4>

            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>सभी लोकल ट्रांजेक्शन और खाता डेटा साफ़ करें</span>
              </button>
            ) : (
              <div className="p-3 bg-red-950/80 border border-red-600 rounded-2xl space-y-2">
                <p className="text-xs text-red-200 font-medium">
                  क्या आप सुनिश्चित हैं? यह आपके ब्राउज़र का सारा स्थानीय डेटा मिटा देगा।
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="py-1.5 px-3 bg-slate-800 text-slate-200 rounded-lg text-xs"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="py-1.5 px-3 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md shadow-red-600/30"
                  >
                    हाँ, सारा डेटा साफ़ करें
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Save Button */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition"
            >
              बंद करें
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-xl shadow-blue-600/30 transition"
            >
              सेटिंग्स सुरक्षित करें (Save)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
