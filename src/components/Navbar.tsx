import React from 'react';
import {
  Menu,
  CreditCard,
  QrCode,
  Users,
  BarChart3,
  HardDrive,
  Settings,
  Volume2,
  Radio,
  CheckCircle2,
  LogOut,
  User,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenSettings: () => void;
  onOpenPaymentModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenSettings,
  onOpenPaymentModal,
  onOpenAuthModal,
}) => {
  const {
    settings,
    currentUser,
    user,
    soundboxPlaying,
    activeTab,
    setActiveTab,
    triggerSoundbox,
    logoutGoogle,
    isAuthLoading,
  } = useShop();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Menu Button & Logo */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Prominent Menu Button */}
            <button
              onClick={onOpenMenu}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="मुख्य मेन्यू खोलें (Open Menu)"
            >
              <Menu className="w-5 h-5 text-blue-400" />
              <span className="hidden sm:inline text-xs font-bold">मेन्यू</span>
            </button>

            {/* Logo */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer min-w-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Vyapar Sahayak
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[220px]">
                  {currentUser?.shopName || settings.shopName}
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Soundbox button */}
            <button
              onClick={() => triggerSoundbox(100)}
              title="साउंडबॉक्स टेस्ट करें"
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                soundboxPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${soundboxPlaying ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            </button>

            {/* + Collect Payment Button */}
            <button
              onClick={onOpenPaymentModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">पेमेंट लें</span>
              <span className="sm:hidden">पेमेंट</span>
            </button>

            {/* Login / Register / Profile Button */}
            {currentUser?.isLoggedIn ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold transition"
                title="खाता विवरण व लॉगिन"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline max-w-[90px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold transition"
              >
                <User className="w-4 h-4" />
                <span>लॉगिन</span>
              </button>
            )}

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
              title="दुकान सेटिंग"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>डैशबोर्ड</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'qr'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI QR स्टैंडी</span>
          </button>

          <button
            onClick={() => setActiveTab('khata')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'khata'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ग्राहक खाता (उधारी)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>रिपोर्ट्स</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'drive'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Google Drive सिंक</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
