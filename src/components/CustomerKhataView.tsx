import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  MessageCircle,
  Clock,
  PlusCircle,
  MinusCircle,
  FileText,
  X,
  Check,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CustomerKhata } from '../types';

export const CustomerKhataView: React.FC = () => {
  const { customers, addCustomer, addKhataEntry, settings } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    customers[0]?.id || null
  );
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState<'GIVEN' | 'RECEIVED' | null>(null);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // New Entry Form State
  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  const totalMarketUdhar = customers
    .filter((c) => c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const totalAdvanceReceived = customers
    .filter((c) => c.balance < 0)
    .reduce((sum, c) => sum + Math.abs(c.balance), 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const newId = addCustomer(newCustName.trim(), newCustPhone.trim(), newCustAddress.trim());
    setSelectedCustomerId(newId);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setIsAddCustomerOpen(false);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !isAddEntryOpen) return;
    const num = parseFloat(entryAmount);
    if (isNaN(num) || num <= 0) return;

    addKhataEntry(selectedCustomerId, isAddEntryOpen, num, entryNote.trim() || undefined);
    setEntryAmount('');
    setEntryNote('');
    setIsAddEntryOpen(null);
  };

  const sendWhatsAppReminder = (customer: CustomerKhata) => {
    const upiPayLink = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(
      settings.shopName
    )}&am=${customer.balance}&cu=INR`;

    const text = `नमस्ते ${customer.name} जी, ${settings.shopName} पर आपका कुल बकाया हिसाब ₹${customer.balance} है। कृपया समय पर भुगतान करें।\n\nUPI ID: ${settings.upiId}\n\nधन्यवाद!`;

    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Market Udhar Card */}
        <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border border-red-800/40 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              कुल उधारी (बाकी लेना है)
            </p>
            <h3 className="text-3xl font-black text-white mt-1">
              ₹{totalMarketUdhar.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {customers.filter((c) => c.balance > 0).length} ग्राहकों पर बकाया
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
            <ArrowUpRight className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Total Advance */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              एडवांस जमा (देना है)
            </p>
            <h3 className="text-3xl font-black text-white mt-1">
              ₹{totalAdvanceReceived.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {customers.filter((c) => c.balance < 0).length} ग्राहकों का एडवांस
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Total Registered Customers */}
        <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              कुल खाता ग्राहक
            </p>
            <h3 className="text-3xl font-black text-white mt-1">{customers.length}</h3>
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 mt-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> + नया ग्राहक जोड़ें
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Main Ledger Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col h-[650px]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              ग्राहक सूची ({filteredCustomers.length})
            </h3>
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>नया ग्राहक</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="नाम या मोबाइल नंबर खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Customer Scroll List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                कोई ग्राहक नहीं मिला। नया ग्राहक जोड़ने के लिए ऊपर बटन दबाएँ।
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomerId;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          cust.balance > 0
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : cust.balance < 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cust.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">{cust.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {cust.phone || 'नंबर नहीं'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-extrabold text-sm ${
                          cust.balance > 0
                            ? 'text-red-400'
                            : cust.balance < 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        ₹{Math.abs(cust.balance).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {cust.balance > 0
                          ? 'बाकी लेना है'
                          : cust.balance < 0
                          ? 'एडवांस जमा'
                          : 'हिसाब बराबर'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Customer Ledger Statement & Entry Manager */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[650px]">
          {selectedCustomer ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Customer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white">
                    {selectedCustomer.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-400">
                      📞 {selectedCustomer.phone} {selectedCustomer.address ? `• 📍 ${selectedCustomer.address}` : ''}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Reminder Button */}
                {selectedCustomer.balance > 0 && selectedCustomer.phone && (
                  <button
                    onClick={() => sendWhatsAppReminder(selectedCustomer)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp तगादा / रिमाइंडर</span>
                  </button>
                )}
              </div>

              {/* Current Net Balance Box */}
              <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 font-medium">वर्तमान कुल बाकी (Net Balance)</p>
                  <p
                    className={`text-2xl font-black mt-0.5 ${
                      selectedCustomer.balance > 0
                        ? 'text-red-400'
                        : selectedCustomer.balance < 0
                        ? 'text-emerald-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    ₹{Math.abs(selectedCustomer.balance).toLocaleString('en-IN')}
                    <span className="text-xs font-normal ml-2 text-slate-400">
                      ({selectedCustomer.balance > 0 ? 'आप मांगते हैं' : selectedCustomer.balance < 0 ? 'एडवांस जमा' : 'हिसाब चुकता'})
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddEntryOpen('GIVEN')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition"
                  >
                    <MinusCircle className="w-4 h-4 text-red-400" />
                    <span>उधार दिया (-)</span>
                  </button>

                  <button
                    onClick={() => setIsAddEntryOpen('RECEIVED')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>रुपये मिले (+)</span>
                  </button>
                </div>
              </div>

              {/* Entries History Table */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  लेनदेन इतिहास (Transaction History)
                </p>

                {selectedCustomer.entries.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    अभी कोई लेनदेन प्रविष्टि नहीं है। उधार दिया या रुपये मिले बटन दबाकर एंट्री करें।
                  </div>
                ) : (
                  selectedCustomer.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                            entry.type === 'GIVEN'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {entry.type === 'GIVEN' ? '-' : '+'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">
                            {entry.type === 'GIVEN' ? 'सामान / उधार दिया' : 'भुगतान प्राप्त हुआ'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {entry.note ? `${entry.note} • ` : ''}
                            {entry.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-black text-sm ${
                            entry.type === 'GIVEN' ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {entry.type === 'GIVEN' ? '-' : '+'}₹
                          {entry.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
              <Users className="w-12 h-12 mb-3 text-slate-600" />
              <p>खाता देखने के लिए बाईं तरफ से कोई ग्राहक चुनें।</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Add New Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                नया खाता ग्राहक जोड़ें
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ग्राहक का नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश कुमार"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500"
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
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  पता / वार्ड (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. स्टेशन रोड, वार्ड नं 5"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  ग्राहक सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Khata Entry (Given / Received) */}
      {isAddEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {isAddEntryOpen === 'GIVEN' ? '🔴 उधार दिया (माल दिया)' : '🟢 रुपये प्राप्त हुए (जमा)'}
              </h3>
              <button
                onClick={() => setIsAddEntryOpen(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">राशि (₹) *</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xl font-black text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  विवरण / नोट (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder={
                    isAddEntryOpen === 'GIVEN'
                      ? 'उदा. 1 बैग आटा, तेल पैकेट'
                      : 'उदा. UPI द्वारा भुगतान, नकद जमा'
                  }
                  value={entryNote}
                  onChange={(e) => setEntryNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEntryOpen(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold shadow-lg ${
                    isAddEntryOpen === 'GIVEN'
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  एंट्री सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
