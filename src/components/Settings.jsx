import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useCurrency } from '../contexts/CurrencyContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: true,
    autoLock: true,
    language: 'English'
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Calculate limits based on verification status - check both kyc_status and verificationStatus
  const isVerified = user?.kyc_status === 'approved' || user?.verificationStatus === 'verified' || user?.verificationStatus === 'approved';
  const dailyLimit = isVerified ? 250000 : 50000;
  const monthlyLimit = isVerified ? null : 1500000; // null = unlimited for verified
  const verificationLabel = isVerified ? 'Verified' : 'Unverified';


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
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Settings</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/security" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">shield</span> Security
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">

            {/* Look & Feel */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Look & Feel</h2>
              <div className="space-y-3">
                {/* Dark Mode Toggle */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">dark_mode</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Dark Theme</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Enable dark green appearance</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${isDarkMode ? 'bg-[#4CAF50]' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${isDarkMode ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                  </button>
                </div>
              </div>
            </section>

            {/* Account Limits */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Account Limits</h2>
              <div className="p-5 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                {/* Verification Status Banner */}
                <div className="mb-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">info</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">Verification Status</h3>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Your account limits are based on your verification status. Upload documents to increase your limits.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Limits Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2D4A32]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">today</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">Daily Limit</h3>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Maximum per day</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">{currency} {dailyLimit.toLocaleString()}</p>
                      <p className={`text-xs m-0 ${isVerified ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{verificationLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">calendar_month</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">Monthly Limit</h3>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Maximum per month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                        {monthlyLimit ? `${currency} ${monthlyLimit.toLocaleString()}` : 'Unlimited'}
                      </p>
                      <p className={`text-xs m-0 ${isVerified ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{verificationLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#2D4A32]">
                  <Link
                    to="/verification-upload"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] transition-all no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white">verified_user</span>
                      <span className="font-medium text-white text-sm">Verify Your Identity</span>
                    </div>
                    <span className="material-symbols-outlined text-white">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Preferences</h2>
              <div className="space-y-3">
                {/* Notifications */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">notifications</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Enable push notifications</p>
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
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">fingerprint</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Biometric Login</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Use fingerprint or face ID</p>
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
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">lock</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Auto Lock</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Lock app when inactive</p>
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
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Regional</h2>
              <div className="space-y-3">
                {/* Language */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">language</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Language</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">App display language</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-[#E8F5E8]">{settings.language}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </div>
                </div>

                {/* Currency */}
                <div
                  onClick={() => setShowCurrencyModal(true)}
                  className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">attach_money</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Currency</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Default currency</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-[#E8F5E8]">{currency}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </div>
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">About</h2>
              <div className="space-y-3">
                {/* Version */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">info</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">App Version</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Current version information</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-[#E8F5E8]">v1.0.0</span>
                </div>

                {/* Terms & Privacy */}
                <div onClick={() => navigate('/privacy')} className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">policy</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Terms & Privacy</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Legal information</p>
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
          <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Select Currency</h2>
              <button onClick={() => setShowCurrencyModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCurrencySelect('USD')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${currency === 'USD' ? 'bg-[#E9F0E1] dark:bg-[#243B28] border-[#58761B] dark:border-[#81C784]' : 'bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:bg-gray-50 dark:hover:bg-[#243B28]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">USD</div>
                  <span className="font-medium text-[#1A3F22] dark:text-[#E8F5E8]">US Dollar</span>
                </div>
                {currency === 'USD' && <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">check_circle</span>}
              </button>

              <button
                onClick={() => handleCurrencySelect('KES')}
                className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${currency === 'KES' ? 'bg-[#E9F0E1] dark:bg-[#243B28] border-[#58761B] dark:border-[#81C784]' : 'bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:bg-gray-50 dark:hover:bg-[#243B28]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">KES</div>
                  <span className="font-medium text-[#1A3F22] dark:text-[#E8F5E8]">Kenyan Shilling</span>
                </div>
                {currency === 'KES' && <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">check_circle</span>}
              </button>
            </div>

            <div className="mt-6 p-3 bg-[#E5EBE3] dark:bg-[#0a150c] rounded-lg text-center">
              <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Current Rate: 1 USD ≈ {exchangeRate.toFixed(2)} KES</p>
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


