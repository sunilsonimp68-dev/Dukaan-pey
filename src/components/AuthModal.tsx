import React, { useState } from 'react';
import {
  X,
  User,
  Store,
  Phone,
  Lock,
  Mail,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { loginWithGoogle, loginWithCredentials, registerUser, isAuthLoading } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<'merchant' | 'customer'>('merchant');

  // Login form
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regShopName, setRegShopName] = useState('');
  const [regUpiId, setRegUpiId] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginPhoneOrEmail.trim()) {
      setError('कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें।');
      return;
    }

    const success = loginWithCredentials(loginPhoneOrEmail.trim(), loginPassword);
    if (success) {
      setSuccessMsg('लॉगिन सफल रहा!');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    } else {
      setError('लॉगिन विफल। कृपया सही विवरण भरें।');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regPhone.trim()) {
      setError('कृपया नाम और मोबाइल नंबर भरें।');
      return;
    }

    registerUser({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || undefined,
      shopName: role === 'merchant' ? regShopName.trim() || `${regName.trim()} स्टोर` : '',
      upiId: regUpiId.trim() || `${regPhone.trim()}@upi`,
      role,
    });

    setSuccessMsg('नया खाता सफलतापूर्वक तैयार हो गया!');
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 800);
  };

  const handleGoogleClick = async () => {
    setError(null);
    const ok = await loginWithGoogle();
    if (ok) {
      setSuccessMsg('Google खाते से सफलतापूर्वक लॉगिन हो गया!');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {mode === 'login' ? 'खाता लॉगिन करें' : 'नया खाता बनाएँ (Sign Up)'}
              </h3>
              <p className="text-xs text-blue-100">
                {mode === 'login'
                  ? 'अपने Vyapar Sahayak खाते में प्रवेश करें'
                  : 'नया व्यापारी या ग्राहक खाता रजिस्टर करें'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 mx-6 mt-4 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            लॉगिन (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            नया खाता (Register)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Notifications */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isAuthLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white text-slate-800 hover:bg-slate-100 rounded-2xl font-bold text-xs shadow-md border border-slate-200 transition active:scale-95"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span>Google से 1-क्लिक लॉगिन / सिंक</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-[1px] bg-slate-800 flex-1" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">या मोबाइल से</span>
            <div className="h-[1px] bg-slate-800 flex-1" />
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  मोबाइल नंबर या ईमेल *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. 9826012345"
                    value={loginPhoneOrEmail}
                    onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  पासवर्ड / पिन (वैकल्पिक)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <span>लॉगिन करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER NEW USER / MERCHANT FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    role === 'merchant'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500'
                      : 'text-slate-400'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>दुकानदार / मर्चेंट</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    role === 'customer'
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500'
                      : 'text-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>ग्राहक (Customer)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  आपका पूरा नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल शर्मा"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="उदा. 9826011223"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {role === 'merchant' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      दुकान का नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. श्री बालाजी किराना स्टोर"
                      value={regShopName}
                      onChange={(e) => setRegShopName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      UPI ID (पैसे प्राप्त करने के लिए)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. myshop@okaxis या 9826011223@paytm"
                      value={regUpiId}
                      onChange={(e) => setRegUpiId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>खाता बनाएँ और शुरू करें</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
