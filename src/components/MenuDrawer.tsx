import React from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Users,
  BarChart3,
  HardDrive,
  Settings,
  User,
  LogOut,
  Volume2,
  ShieldCheck,
  Store,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenPaymentModal,
  onOpenSettingsModal,
  onOpenAuthModal,
}) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    settings,
    logoutApp,
    triggerSoundbox,
    user,
  } = useShop();

  if (!isOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    onClose();
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'डैशबोर्ड (Dashboard)',
      icon: BarChart3,
      desc: 'दैनिक बिक्री, लेन-देन और मुख्य आंकड़े',
      color: 'text-blue-400',
    },
    {
      id: 'qr',
      label: 'UPI QR स्टैंडी (Scan & Pay)',
      icon: QrCode,
      desc: 'डायनामिक क्यूआर, स्टैंडी प्रिंट व काउंटर डिस्प्ले',
      color: 'text-indigo-400',
    },
    {
      id: 'khata',
      label: 'ग्राहक खाता व उधारी बही',
      icon: Users,
      desc: 'कस्टमर लेजर, उधार-जमा और WhatsApp तगादा',
      color: 'text-amber-400',
    },
    {
      id: 'analytics',
      label: 'बिक्री रिपोर्ट्स व विश्लेषण',
      icon: BarChart3,
      desc: 'दैनिक, साप्ताहिक रिपोर्ट व चैनल विश्लेषण',
      color: 'text-emerald-400',
    },
    {
      id: 'drive',
      label: 'Google Drive क्लाउड सिंक',
      icon: HardDrive,
      desc: 'ऑटोमैटिक क्लाउड बैकअप व CSV एक्सपोर्ट',
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base leading-tight truncate">
                {currentUser?.shopName || settings.shopName || 'Vyapar Sahayak'}
              </h3>
              <p className="text-xs text-blue-200 truncate">
                {currentUser?.name || settings.ownerName || 'व्यापारी खाता'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button in Drawer */}
        <div className="p-4 border-b border-slate-800/80 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenPaymentModal();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ नया Payment दर्ज करें</span>
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="p-4 space-y-1.5 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            मुख्य मेन्यू (Navigation Menu)
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition text-left ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 ' + item.color
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Soundbox Quick Trigger */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => triggerSoundbox(100)}
            className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>साउंडबॉक्स आवाज़ टेस्ट करें</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">₹100</span>
          </button>
        </div>

        {/* Drawer Footer Actions: Profile, Settings, Logout */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          {currentUser?.isLoggedIn ? (
            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {currentUser.name[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{currentUser.phone}</p>
                </div>
              </div>
              <button
                onClick={logoutApp}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                title="लॉगआउट"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
            >
              <User className="w-4 h-4" />
              <span>लॉगिन / नया खाता बनाएँ</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenSettingsModal();
            }}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>दुकान व साउंडबॉक्स सेटिंग</span>
          </button>
        </div>
      </div>
    </div>
  );
};
