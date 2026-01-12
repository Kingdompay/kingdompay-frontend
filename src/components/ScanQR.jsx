import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRCode from 'react-qr-code';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const ScanQR = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'my-code'

  useEffect(() => {
    let scanner = null;

    if (isScanning && !scanResult && activeTab === 'scan') {
      // Initialize scanner
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
    }

    function onScanSuccess(decodedText, decodedResult) {
      // Handle the scanned code
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setScanResult(decodedText);
      setIsScanning(false);

      // Clear the scanner
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    }

    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // console.warn(`Code scan error = ${error}`);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [isScanning, scanResult, activeTab]);

  const handleReset = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          #reader {
            width: 100%;
            border: none !important;
          }
          #reader__scan_region {
            background: white;
          }
          #reader__dashboard_section_csr span {
            display: none;
          }
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/payments')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Scan QR</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/payments')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 dark:bg-[#1A2E1D] p-1 rounded-xl mb-8">
              <button
                onClick={() => { setActiveTab('scan'); setIsScanning(true); setScanResult(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'scan'
                  ? 'bg-white dark:bg-[#2D4A32] text-[#1A3F22] dark:text-[#E8F5E8] shadow-sm'
                  : 'text-gray-500 dark:text-[#A8C4A8] hover:text-gray-700 dark:hover:text-[#C8DCC8]'}`}
              >
                Scan Code
              </button>
              <button
                onClick={() => setActiveTab('my-code')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'my-code'
                  ? 'bg-white dark:bg-[#2D4A32] text-[#1A3F22] dark:text-[#E8F5E8] shadow-sm'
                  : 'text-gray-500 dark:text-[#A8C4A8] hover:text-gray-700 dark:hover:text-[#C8DCC8]'}`}
              >
                My Code
              </button>
            </div>

            {activeTab === 'scan' ? (
              !scanResult ? (
                <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Scan a QR Code</h2>
                    <p className="text-gray-500 dark:text-[#A8C4A8] text-sm">Position the QR code within the frame to scan</p>
                  </div>

                  <div className="overflow-hidden rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 dark:border-[#2D4A32]">
                    <div id="reader"></div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mr-3 mt-0.5">info</span>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-semibold mb-1">Scanning Tips</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Ensure good lighting</li>
                        <li>Hold device steady</li>
                        <li>Clean your camera lens</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                  <div className="w-16 h-16 bg-green-100 dark:bg-[#243B28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-green-600 dark:text-[#81C784] text-3xl">check_circle</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Scan Successful!</h2>
                  <p className="text-gray-500 dark:text-[#A8C4A8] mb-6">Code detected successfully</p>

                  <div className="bg-gray-50 dark:bg-[#2A3F2E] p-4 rounded-xl mb-6 break-all font-mono text-sm border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-[#E8F5E8]">
                    {scanResult}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 dark:border-[#2D4A32] font-semibold text-gray-600 dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors cursor-pointer"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={() => {
                        try {
                          let data;
                          try {
                            data = JSON.parse(scanResult);
                          } catch (e) {
                            // Not JSON, treat as raw text (recipient)
                            data = { type: 'send', recipient: scanResult };
                          }

                          if (data.type === 'send' || data.recipient) {
                            // Handle simple email/phone or JSON
                            const recipient = data.recipient || data.email;
                            navigate('/send-money', {
                              state: {
                                recipient: recipient,
                                amount: data.amount,
                                message: data.message
                              }
                            });
                          } else if (data.type === 'join') {
                            navigate('/community/join', { state: { code: data.code } });
                          } else {
                            alert('Unknown QR code format: ' + scanResult);
                          }
                        } catch (e) {
                          alert('Error processing QR code');
                        }
                      }}
                      className="flex-1 py-3 px-6 rounded-xl bg-[#6f9c16] text-white font-semibold hover:bg-[#5a8012] transition-colors shadow-lg border-none cursor-pointer"
                    >
                      Process
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-[#6f9c16] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-white dark:border-[#0D1B0F] shadow-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-gray-500 dark:text-[#A8C4A8]">{user?.email}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl inline-block border-2 border-gray-100 dark:border-[#2D4A32]">
                  <QRCode
                    value={JSON.stringify({
                      type: 'send',
                      recipient: user?.email,
                      name: `${user?.firstName} ${user?.lastName}`,
                      amount: null,
                      message: ''
                    })}
                    size={200}
                    level={'H'}
                  />
                </div>

                <p className="mt-8 text-sm text-gray-500 dark:text-[#A8C4A8]">
                  Share this code to receive money instantly
                </p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default ScanQR;


