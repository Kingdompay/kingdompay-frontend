import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useCurrency } from '../contexts/CurrencyContext';

const Settings = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: true,
    autoLock: true,
    language: 'English'
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleCurrencySelect = (newCurrency) => {
    setCurrency(newCurrency);
    setShowCurrencyModal(false);
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
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Settings</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/security" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">shield</span> Security
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">

            {/* Preferences */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] mb-4">Preferences</h2>
              <div className="space-y-3">
                {/* Notifications */}
                <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">notifications</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Notifications</h3>
                      <p className="text-sm text-gray-500 m-0">Enable push notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('notifications')}
                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${settings.notifications ? 'bg-[#6f9c16]' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${settings.notifications ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                  </button>
                </div>

                {/* Biometric */}
                <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">fingerprint</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Biometric Login</h3>
                      <p className="text-sm text-gray-500 m-0">Use fingerprint or face ID</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('biometric')}
                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${settings.biometric ? 'bg-[#6f9c16]' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${settings.biometric ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                  </button>
                </div>

                {/* Auto Lock */}
                <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">lock</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Auto Lock</h3>
                      <p className="text-sm text-gray-500 m-0">Lock app when inactive</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('autoLock')}
                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${settings.autoLock ? 'bg-[#6f9c16]' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${settings.autoLock ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                  </button>
                </div>
              </div>
            </section>

            {/* Regional Settings */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] mb-4">Regional</h2>
              <div className="space-y-3">
                {/* Language */}
                <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">language</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Language</h3>
                      <p className="text-sm text-gray-500 m-0">App display language</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{settings.language}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </div>
                </div>

                {/* Currency */}
                <div
                  onClick={() => setShowCurrencyModal(true)}
                  className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">attach_money</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Currency</h3>
                      <p className="text-sm text-gray-500 m-0">Default currency</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{currency}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </div>
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] mb-4">About</h2>
              <div className="space-y-3">
                {/* Version */}
                <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">info</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">App Version</h3>
                      <p className="text-sm text-gray-500 m-0">Current version information</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">v1.0.0</span>
                </div>

                {/* Terms & Privacy */}
                <div onClick={() => navigate('/privacy')} className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                      <span className="material-symbols-outlined text-[#58761B]">policy</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] m-0">Terms & Privacy</h3>
                      <p className="text-sm text-gray-500 m-0">Legal information</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] m-0">Select Currency</h2>
              <button onClick={() => setShowCurrencyModal(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCurrencySelect('USD')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${currency === 'USD' ? 'bg-[#E9F0E1] border-[#58761B]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">USD</div>
                  <span className="font-medium text-[#1A3F22]">US Dollar</span>
                </div>
                {currency === 'USD' && <span className="material-symbols-outlined text-[#58761B]">check_circle</span>}
              </button>

              <button
                onClick={() => handleCurrencySelect('KES')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${currency === 'KES' ? 'bg-[#E9F0E1] border-[#58761B]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">KES</div>
                  <span className="font-medium text-[#1A3F22]">Kenyan Shilling</span>
                </div>
                {currency === 'KES' && <span className="material-symbols-outlined text-[#58761B]">check_circle</span>}
              </button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 m-0">Current Rate: 1 USD ≈ {exchangeRate.toFixed(2)} KES</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Settings;
