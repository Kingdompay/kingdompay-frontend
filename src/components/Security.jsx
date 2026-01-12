import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Security = () => {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const toggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
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
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Security</h1>
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
              <Link to="/settings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">

            {/* Change Password */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-100 dark:border-[#2D4A32] shadow-sm transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">lock</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Update your account password</p>
                </div>
              </div>
              <button className="w-full bg-[#6f9c16] text-white py-3 rounded-lg font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                Change Password
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-100 dark:border-[#2D4A32] shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">security</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Add extra security to your account</p>
                  </div>
                </div>
                <button
                  onClick={toggleTwoFactor}
                  className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${twoFactorEnabled ? 'bg-[#6f9c16]' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                </button>
              </div>
            </div>

            {/* Biometric Authentication */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-100 dark:border-[#2D4A32] shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">fingerprint</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Biometric Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Use fingerprint or face recognition</p>
                  </div>
                </div>
                <button
                  onClick={toggleBiometric}
                  className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${biometricEnabled ? 'bg-[#6f9c16]' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-md ${biometricEnabled ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                </button>
              </div>
            </div>

            {/* Login History */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-100 dark:border-[#2D4A32] shadow-sm transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">history</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Login History</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">View recent login activity</p>
                </div>
              </div>
              <button className="w-full bg-[#6f9c16] text-white py-3 rounded-lg font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                View Login History
              </button>
            </div>

            {/* Security Alerts */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-100 dark:border-[#2D4A32] shadow-sm transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">notifications</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Security Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Manage security notifications</p>
                </div>
              </div>
              <button className="w-full bg-[#6f9c16] text-white py-3 rounded-lg font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                Manage Alerts
              </button>
            </div>

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

export default Security;


