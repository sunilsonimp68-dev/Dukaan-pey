export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Khata';
export type PaymentStatus = 'सफल' | 'लंबित' | 'विफल' | 'वापस';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  shopName: string;
  upiId: string;
  role: 'merchant' | 'customer';
  isLoggedIn: boolean;
}

export interface Transaction {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  time: string;
  timestamp: number;
  note?: string;
  upiRef?: string;
}

export interface KhataEntry {
  id: string;
  type: 'GIVEN' | 'RECEIVED'; // GIVEN = दिया (उधार), RECEIVED = लिया (जमा)
  amount: number;
  date: string;
  timestamp: number;
  note?: string;
}

export interface CustomerKhata {
  id: string;
  name: string;
  phone: string;
  address?: string;
  balance: number; // positive = लेना है, negative = देना है
  entries: KhataEntry[];
  lastUpdated: number;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  upiId: string;
  upiNumber: string;
  phone: string;
  address: string;
  gstNumber?: string;
  soundboxEnabled: boolean;
  soundboxLanguage: 'hi-IN' | 'en-IN' | 'hinglish';
  soundboxVoiceRate: number;
  soundboxVolume: number;
  currencySymbol: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: string;
  webViewLink?: string;
}
