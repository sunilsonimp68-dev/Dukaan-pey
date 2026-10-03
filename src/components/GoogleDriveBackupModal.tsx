import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CloudUpload,
  CloudDownload,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Calendar,
  Layers,
  Lock,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  listDriveBackups,
  uploadFileToDrive,
  deleteDriveFile,
  fetchDriveFileContent,
} from '../services/googleDriveService';
import { DriveFileItem } from '../types';

export const GoogleDriveBackupModal: React.FC = () => {
  const {
    transactions,
    customers,
    settings,
    user,
    accessToken,
    loginWithGoogle,
    restoreFromBackup,
  } = useShop();

  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [fileToRestore, setFileToRestore] = useState<DriveFileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFiles = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const files = await listDriveBackups(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setStatusMessage({
        text: 'Google Drive से फ़ाइलें लोड नहीं हो सकीं। कृपया पुनः कनेक्ट करें।',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles();
    }
  }, [accessToken]);

  const handleBackupFullJson = async () => {
    if (!accessToken) {
      alert('कृपया पहले Google Drive से कनेक्ट करें।');
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const now = new Date();
      const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `VyaparSahayak_FullBackup_${dateStr}.json`;

      const payload = {
        app: 'Vyapar Sahayak',
        version: '1.0',
        exportedAt: now.toISOString(),
        shop: settings,
        transactions,
        customers,
      };

      const file = await uploadFileToDrive(
        accessToken,
        fileName,
        JSON.stringify(payload, null, 2),
        'application/json'
      );

      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        text: `सफलतापूर्वक बैकअप Google Drive पर सेव हो गया: ${fileName}`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('Drive backup failed:', err);
      setStatusMessage({
        text: `बैकअप विफल: ${err.message || 'Error'}`,
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportTransactionsCsv = async () => {
    if (!accessToken) {
      alert('कृपया पहले Google Drive से कनेक्ट करें।');
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const fileName = `VyaparSahayak_Transactions_${dateStr}.csv`;

      let csv = 'Receipt ID,Time,Customer Name,Phone,Amount (INR),Payment Method,Status,UPI Ref,Notes\n';
      transactions.forEach((t) => {
        csv += `"${t.receiptNumber}","${t.time}","${t.customerName.replace(/"/g, '""')}","${
          t.customerPhone || ''
        }",${t.amount},"${t.paymentMethod}","${t.status}","${t.upiRef || ''}","${(
          t.note || ''
        ).replace(/"/g, '""')}"\n`;
      });

      const file = await uploadFileToDrive(accessToken, fileName, csv, 'text/csv');
      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        text: `CSV रिपोर्ट Google Drive पर अपलोड हो गई: ${fileName}`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('CSV Export failed:', err);
      setStatusMessage({
        text: `CSV एक्सपोर्ट विफल: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportKhataCsv = async () => {
    if (!accessToken) return;
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const fileName = `VyaparSahayak_Khata_Ledger_${dateStr}.csv`;

      let csv = 'Customer ID,Customer Name,Phone,Address,Net Balance (INR),Status,Last Updated\n';
      customers.forEach((c) => {
        const status = c.balance > 0 ? 'बाकी लेना है' : c.balance < 0 ? 'एडवांस जमा' : 'हिसाब चुकता';
        csv += `"${c.id}","${c.name.replace(/"/g, '""')}","${c.phone}","${(
          c.address || ''
        ).replace(/"/g, '""')}",${c.balance},"${status}","${new Date(
          c.lastUpdated
        ).toLocaleString('hi-IN')}"\n`;
      });

      const file = await uploadFileToDrive(accessToken, fileName, csv, 'text/csv');
      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        text: `ग्राहक खाता रिपोर्ट Google Drive पर सेव हो गई: ${fileName}`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('Khata export failed:', err);
      setStatusMessage({
        text: `खाता एक्सपोर्ट विफल: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Explicit confirmation dialog for deletion as required by Workspace Skill
  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;
    setIsProcessing(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setStatusMessage({
        text: `Google Drive से फ़ाइल '${fileToDelete.name}' हटाई गई।`,
        type: 'info',
      });
      setFileToDelete(null);
    } catch (err: any) {
      console.error('Delete file error:', err);
      setStatusMessage({
        text: `हटाने में त्रुटि: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore backup from Google Drive
  const confirmRestoreFile = async () => {
    if (!fileToRestore || !accessToken) return;
    setIsProcessing(true);
    try {
      const content = await fetchDriveFileContent(accessToken, fileToRestore.id);
      const parsed = JSON.parse(content);
      restoreFromBackup(parsed);
      setStatusMessage({
        text: `Google Drive बैकअप '${fileToRestore.name}' से डेटा सफलतापूर्वक रीस्टोर हो गया!`,
        type: 'success',
      });
      setFileToRestore(null);
    } catch (err: any) {
      console.error('Restore error:', err);
      setStatusMessage({
        text: `रीस्टोर विफल: कृपया सुनिश्चित करें कि यह सही JSON बैकअप फ़ाइल है।`,
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Drive Status Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-blue-950/80 border border-indigo-700/40 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Google Drive क्लाउड बैकअप & ऑटो-सिंक
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              दुकान का पूरा हिसाब, रोजाना की बिक्री की CSV रिपोर्ट्स, और ग्राहक खाता का सुरक्षित बैकअप सीधे आपके निजी Google Drive खाते में रखें।
            </p>
          </div>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google Account'}
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-500"
                />
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[160px]">
                  {user.displayName || user.email}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Drive Connected
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="gsi-material-button flex items-center gap-2 px-5 py-3 bg-white text-slate-800 hover:bg-slate-100 rounded-2xl font-bold text-sm shadow-xl transition active:scale-95"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
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
              <span>Google Drive से कनेक्ट करें</span>
            </button>
          )}
        </div>
      </div>

      {/* Status notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-red-950/50 border-red-500/50 text-red-300'
              : 'bg-blue-950/50 border-blue-500/50 text-blue-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Cloud Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Full JSON Backup */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <FileCode className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">सम्पूर्ण बैकअप (Full JSON)</h3>
            <p className="text-xs text-slate-400">
              सभी लेन-देन, ग्राहक खाता, सेटिंग्स और बहीखाता की संपूर्ण फ़ाइल Drive पर सुरक्षित रखें।
            </p>
          </div>
          <button
            onClick={handleBackupFullJson}
            disabled={isProcessing || !user}
            className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isProcessing ? 'अपलोड हो रहा है...' : 'Drive पर बैकअप लें'}</span>
          </button>
        </div>

        {/* Transactions CSV Export */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">बिक्री CSV रिपोर्ट (Sales Excel)</h3>
            <p className="text-xs text-slate-400">
              दुकान की दैनिक बिक्री सूची को Google Drive में CSV / Excel स्प्रेडशीट के रूप में एक्सपोर्ट करें।
            </p>
          </div>
          <button
            onClick={handleExportTransactionsCsv}
            disabled={isProcessing || !user}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-600/30"
          >
            <CloudUpload className="w-4 h-4" />
            <span>CSV Drive पर भेजें</span>
          </button>
        </div>

        {/* Khata Ledger CSV Export */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ग्राहक खाता बही (Khata Statement)</h3>
            <p className="text-xs text-slate-400">
              सभी ग्राहकों का उधारी और जमा का पूरा बैलेंस शीट Google Drive में एक्सपोर्ट करें।
            </p>
          </div>
          <button
            onClick={handleExportKhataCsv}
            disabled={isProcessing || !user}
            className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-amber-600/30"
          >
            <CloudUpload className="w-4 h-4" />
            <span>खाता CSV Drive पर भेजें</span>
          </button>
        </div>
      </div>

      {/* Google Drive Saved Files List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            Google Drive पर मौजूद Vyapar Sahayak फ़ाइलें ({driveFiles.length})
          </h3>
          {user && (
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </button>
          )}
        </div>

        {!user ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs space-y-3">
            <Lock className="w-8 h-8 mx-auto text-slate-500" />
            <p>Google Drive बैकअप देखने और सेव करने के लिए ऊपर "Google Drive से कनेक्ट करें" बटन दबाएँ।</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Google Drive से फ़ाइलें खोजी जा रही हैं...</span>
          </div>
        ) : driveFiles.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs space-y-2">
            <p>Google Drive में अभी कोई Vyapar Sahayak बैकअप नहीं मिला।</p>
            <p className="text-slate-500">ऊपर दिए गए "Drive पर बैकअप लें" बटन से पहला बैकअप बनाएँ।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
            {driveFiles.map((file) => {
              const isJson = file.name.endsWith('.json') || file.mimeType.includes('json');
              return (
                <div
                  key={file.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isJson
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isJson ? (
                        <FileCode className="w-5 h-5" />
                      ) : (
                        <FileSpreadsheet className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{new Date(file.createdTime).toLocaleString('hi-IN')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View in Drive */}
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        title="Google Drive में खोलें"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Drive में देखें</span>
                      </a>
                    )}

                    {/* Restore if JSON */}
                    {isJson && (
                      <button
                        onClick={() => setFileToRestore(file)}
                        className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        title="डेटा रीस्टोर करें"
                      >
                        <CloudDownload className="w-3.5 h-3.5" />
                        <span>रीस्टोर करें</span>
                      </button>
                    )}

                    {/* Delete File */}
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl text-xs transition"
                      title="Google Drive से हटाएँ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MANDATORY CONFIRMATION DIALOG: Delete File from Google Drive */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-white">Google Drive से फ़ाइल हटाएँ?</h3>
              <p className="text-xs text-slate-300">
                क्या आप वाकई Google Drive से फ़ाइल <span className="font-bold text-white">"{fileToDelete.name}"</span> को हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30 disabled:opacity-50"
              >
                {isProcessing ? 'हटाया जा रहा है...' : 'हाँ, हटाएँ (Confirm Delete)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION DIALOG: Restore Data from Google Drive */}
      {fileToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <CloudDownload className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-white">डेटा रीस्टोर करें?</h3>
              <p className="text-xs text-slate-300">
                फ़ाइल <span className="font-bold text-white">"{fileToRestore.name}"</span> से डेटा रीस्टोर करने पर वर्तमान लेन-देन और खाता डेटा इस बैकअप से बदल जाएगा।
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToRestore(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={confirmRestoreFile}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isProcessing ? 'रीस्टोर हो रहा है...' : 'हाँ, रीस्टोर करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
