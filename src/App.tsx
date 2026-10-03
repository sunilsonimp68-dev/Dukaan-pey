/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { MenuDrawer } from './components/MenuDrawer';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { QRStandeeView } from './components/QRStandeeView';
import { CustomerKhataView } from './components/CustomerKhataView';
import { AnalyticsView } from './components/AnalyticsView';
import { GoogleDriveBackupModal } from './components/GoogleDriveBackupModal';
import { PaymentModal } from './components/PaymentModal';
import { SettingsModal } from './components/SettingsModal';
import { ReceiptModal } from './components/ReceiptModal';
import { Transaction } from './types';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, transactions } = useShop();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);

  const handlePaymentSuccess = (txnId: string) => {
    const txn = transactions.find((t) => t.id === txnId);
    if (txn) {
      setSelectedReceiptTxn(txn);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header with Menu Button */}
      <Navbar
        onOpenMenu={() => setIsMenuDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenPayment={() => setIsPaymentModalOpen(true)}
            onSelectTransactionReceipt={(txn) => setSelectedReceiptTxn(txn)}
          />
        )}

        {activeTab === 'qr' && <QRStandeeView />}

        {activeTab === 'khata' && <CustomerKhataView />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'drive' && <GoogleDriveBackupModal />}
      </main>

      {/* Global Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 text-slate-400 py-6 text-center text-xs mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-200">Vyapar Sahayak</span>
            <span>•</span>
            <span>डिजिटल पेमेंट व ग्राहक खाता पार्टनर</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% सुरक्षित क्लाउड बैकअप
            </span>
            <span>•</span>
            <span>Google Drive Sync</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Login / Register Modal for Merchants & Customers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Payment Entry Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Receipt Bill Modal */}
      <ReceiptModal
        transaction={selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
