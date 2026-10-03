import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import {
  Transaction,
  CustomerKhata,
  ShopSettings,
  PaymentMethod,
  PaymentStatus,
  UserProfile,
} from '../types';
import { initAuth, googleSignIn, logout as googleLogout } from '../services/firebaseAuth';
import { announcePaymentSoundbox } from '../services/soundboxAudio';

interface ShopContextType {
  currentUser: UserProfile;
  transactions: Transaction[];
  customers: CustomerKhata[];
  settings: ShopSettings;
  user: User | null;
  accessToken: string | null;
  isAuthLoading: boolean;
  soundboxPlaying: boolean;
  activeTab: 'dashboard' | 'qr' | 'khata' | 'analytics' | 'history' | 'drive';
  setActiveTab: (tab: 'dashboard' | 'qr' | 'khata' | 'analytics' | 'history' | 'drive') => void;
  loginWithCredentials: (phoneOrEmail: string, pass?: string) => boolean;
  registerUser: (details: {
    name: string;
    phone: string;
    email?: string;
    shopName?: string;
    upiId?: string;
    role: 'merchant' | 'customer';
  }) => void;
  logoutApp: () => void;
  addTransaction: (data: {
    customerName: string;
    customerPhone?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    note?: string;
    customerId?: string;
  }) => Promise<Transaction>;
  deleteTransaction: (id: string) => void;
  addCustomer: (name: string, phone: string, address?: string) => string;
  addKhataEntry: (
    customerId: string,
    type: 'GIVEN' | 'RECEIVED',
    amount: number,
    note?: string
  ) => void;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  triggerSoundbox: (amount: number) => void;
  loginWithGoogle: () => Promise<boolean>;
  logoutGoogle: () => Promise<void>;
  clearAllLocalData: () => void;
  restoreFromBackup: (data: {
    transactions?: Transaction[];
    customers?: CustomerKhata[];
    settings?: Partial<ShopSettings>;
    userProfile?: UserProfile;
  }) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'USER-1',
  name: 'व्यापारी (Merchant)',
  phone: '9800000000',
  shopName: 'व्यापार सहायक स्टोर (Vyapar Sahayak)',
  upiId: 'merchant@upi',
  role: 'merchant',
  isLoggedIn: true,
};

const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'व्यापार सहायक स्टोर',
  ownerName: 'व्यापारी',
  upiId: 'merchant@upi',
  upiNumber: '9800000000',
  phone: '9800000000',
  address: 'मेन मार्केट, भारत',
  gstNumber: '',
  soundboxEnabled: true,
  soundboxLanguage: 'hi-IN',
  soundboxVoiceRate: 0.95,
  soundboxVolume: 1.0,
  currencySymbol: '₹',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('DUKAAN_PAY_USER');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('DUKAAN_PAY_SETTINGS');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('DUKAAN_PAY_TRANSACTIONS');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<CustomerKhata[]>(() => {
    const saved = localStorage.getItem('DUKAAN_PAY_KHATA');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [soundboxPlaying, setSoundboxPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'qr' | 'khata' | 'analytics' | 'history' | 'drive'>('dashboard');

  // Persistence
  useEffect(() => {
    localStorage.setItem('DUKAAN_PAY_USER', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('DUKAAN_PAY_SETTINGS', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('DUKAAN_PAY_TRANSACTIONS', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('DUKAAN_PAY_KHATA', JSON.stringify(customers));
  }, [customers]);

  // Init Firebase Auth for Google Drive
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUserAuth, token) => {
        setUser(currentUserAuth);
        if (token) setAccessToken(token);
        if (currentUserAuth) {
          // If signed in with Google, update user profile
          setCurrentUser((prev) => ({
            ...prev,
            name: currentUserAuth.displayName || prev.name,
            email: currentUserAuth.email || prev.email,
            isLoggedIn: true,
          }));
        }
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsAuthLoading(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loginWithCredentials = (phoneOrEmail: string, pass?: string): boolean => {
    const isEmail = phoneOrEmail.includes('@');
    const updated: UserProfile = {
      ...currentUser,
      phone: !isEmail ? phoneOrEmail : currentUser.phone,
      email: isEmail ? phoneOrEmail : currentUser.email,
      isLoggedIn: true,
    };
    setCurrentUser(updated);
    return true;
  };

  const registerUser = (details: {
    name: string;
    phone: string;
    email?: string;
    shopName?: string;
    upiId?: string;
    role: 'merchant' | 'customer';
  }) => {
    const newUser: UserProfile = {
      id: `USER-${Date.now()}`,
      name: details.name,
      phone: details.phone,
      email: details.email,
      shopName: details.shopName || `${details.name} स्टोर`,
      upiId: details.upiId || `${details.phone}@upi`,
      role: details.role,
      isLoggedIn: true,
    };
    setCurrentUser(newUser);

    if (details.role === 'merchant') {
      setSettings((prev) => ({
        ...prev,
        shopName: details.shopName || prev.shopName,
        ownerName: details.name || prev.ownerName,
        upiId: details.upiId || prev.upiId,
        phone: details.phone || prev.phone,
      }));
    }
  };

  const logoutApp = () => {
    setCurrentUser((prev) => ({ ...prev, isLoggedIn: false }));
    logoutGoogle();
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setCurrentUser((prev) => ({
          ...prev,
          name: res.user.displayName || prev.name,
          email: res.user.email || prev.email,
          isLoggedIn: true,
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Google login error:', err);
      return false;
    }
  };

  const logoutGoogle = async () => {
    await googleLogout();
    setUser(null);
    setAccessToken(null);
  };

  const triggerSoundbox = async (amount: number) => {
    if (!settings.soundboxEnabled) return;
    setSoundboxPlaying(true);
    try {
      await announcePaymentSoundbox(
        amount,
        settings.soundboxLanguage,
        settings.soundboxVolume,
        settings.soundboxVoiceRate
      );
    } catch (e) {
      console.error('Soundbox alert error:', e);
    } finally {
      setTimeout(() => setSoundboxPlaying(false), 2200);
    }
  };

  const addTransaction = async (data: {
    customerName: string;
    customerPhone?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    note?: string;
    customerId?: string;
  }): Promise<Transaction> => {
    const status = data.status || 'सफल';
    const now = new Date();
    const dateStr = now.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptNumber: `REC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: data.customerName || 'ग्राहक',
      customerPhone: data.customerPhone,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: status,
      time: dateStr,
      timestamp: Date.now(),
      note: data.note,
      upiRef:
        data.paymentMethod === 'UPI'
          ? `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`
          : undefined,
    };

    setTransactions((prev) => [newTxn, ...prev]);

    if (data.customerId) {
      if (data.paymentMethod === 'Khata') {
        addKhataEntry(data.customerId, 'GIVEN', data.amount, data.note || 'उधार सामान लिया');
      } else {
        addKhataEntry(data.customerId, 'RECEIVED', data.amount, `भुगतान (${data.paymentMethod})`);
      }
    }

    if (status === 'सफल') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#06b6d4'],
        });
      } catch (e) {}

      triggerSoundbox(data.amount);
    }

    return newTxn;
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCustomer = (name: string, phone: string, address?: string): string => {
    const newId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const newCust: CustomerKhata = {
      id: newId,
      name,
      phone,
      address,
      balance: 0,
      entries: [],
      lastUpdated: Date.now(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newId;
  };

  const addKhataEntry = (
    customerId: string,
    type: 'GIVEN' | 'RECEIVED',
    amount: number,
    note?: string
  ) => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newEntry = {
      id: `ENT-${Date.now()}`,
      type,
      amount,
      date: dateStr,
      timestamp: Date.now(),
      note,
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const balanceDelta = type === 'GIVEN' ? amount : -amount;
        return {
          ...c,
          balance: c.balance + balanceDelta,
          lastUpdated: Date.now(),
          entries: [newEntry, ...c.entries],
        };
      })
    );
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.shopName || newSettings.ownerName || newSettings.upiId) {
      setCurrentUser((prev) => ({
        ...prev,
        shopName: newSettings.shopName || prev.shopName,
        name: newSettings.ownerName || prev.name,
        upiId: newSettings.upiId || prev.upiId,
      }));
    }
  };

  const clearAllLocalData = () => {
    setTransactions([]);
    setCustomers([]);
    localStorage.removeItem('DUKAAN_PAY_TRANSACTIONS');
    localStorage.removeItem('DUKAAN_PAY_KHATA');
  };

  const restoreFromBackup = (data: {
    transactions?: Transaction[];
    customers?: CustomerKhata[];
    settings?: Partial<ShopSettings>;
    userProfile?: UserProfile;
  }) => {
    if (data.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    }
    if (data.customers && Array.isArray(data.customers)) {
      setCustomers(data.customers);
    }
    if (data.settings) {
      setSettings((prev) => ({ ...prev, ...data.settings }));
    }
    if (data.userProfile) {
      setCurrentUser(data.userProfile);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentUser,
        transactions,
        customers,
        settings,
        user,
        accessToken,
        isAuthLoading,
        soundboxPlaying,
        activeTab,
        setActiveTab,
        loginWithCredentials,
        registerUser,
        logoutApp,
        addTransaction,
        deleteTransaction,
        addCustomer,
        addKhataEntry,
        updateSettings,
        triggerSoundbox,
        loginWithGoogle,
        logoutGoogle,
        clearAllLocalData,
        restoreFromBackup,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
