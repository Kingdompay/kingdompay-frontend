import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BottomNav from './BottomNav';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let scanner = null;

    if (isScanning && !scanResult) {
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
  }, [isScanning, scanResult]);

  const handleReset = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
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

      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/payments')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Scan QR</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/payments')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {!scanResult ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[#1A3F22] mb-2">Scan a QR Code</h2>
                  <p className="text-gray-500 text-sm">Position the QR code within the frame to scan</p>
                </div>

                <div className="overflow-hidden rounded-xl bg-gray-50 border-2 border-dashed border-gray-200">
                  <div id="reader"></div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start">
                  <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">info</span>
                  <div className="text-sm text-blue-800">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                </div>
                <h2 className="text-xl font-bold text-[#1A3F22] mb-2">Scan Successful!</h2>
                <p className="text-gray-500 mb-6">Code detected successfully</p>

                <div className="bg-gray-50 p-4 rounded-xl mb-6 break-all font-mono text-sm border border-gray-200">
                  {scanResult}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Scan Again
                  </button>
                  <button
                    onClick={() => {
                      // Logic to process payment would go here
                      alert(`Processing payment for: ${scanResult}`);
                      navigate('/payments');
                    }}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#6f9c16] text-white font-semibold hover:bg-[#5a8012] transition-colors shadow-lg"
                  >
                    Process
                  </button>
                </div>
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
