import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Biometric = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(true);
  const [biometricType, setBiometricType] = useState('fingerprint');

  const toggleBiometric = () => setIsEnabled(!isEnabled);

  const biometricOptions = [
    { id: 'fingerprint', label: 'Fingerprint', icon: 'fingerprint', available: true },
    { id: 'face', label: 'Face Recognition', icon: 'face', available: true },
    { id: 'voice', label: 'Voice Recognition', icon: 'mic', available: false },
  ];

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 dark:bg-[#1A2E1D] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors border-none cursor-pointer">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Biometric Login</h1>
              <div className="w-10 h-10" />
            </div>
          </header>
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>
        {/* Main */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">
            {/* Biometric Status */}
            <section>
              <div className={`bg-white dark:bg-[#1A2E1D] border ${isEnabled ? 'border-[#bbf7d0] dark:border-green-900/50' : 'border-[#fecaca] dark:border-red-900/50'} rounded-2xl p-4 flex justify-between items-center transition-colors duration-300`}>
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-3" style={{ color: isEnabled ? '#059669' : '#dc2626', fontSize: '24px' }}>{isEnabled ? 'fingerprint' : 'fingerprint_off'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{isEnabled ? 'Biometric Login Enabled' : 'Biometric Login Disabled'}</h3>
                    <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8]">{isEnabled ? 'Use biometric authentication to log in' : 'Enable biometric authentication'}</p>
                  </div>
                </div>
                <button onClick={toggleBiometric} className={`w-12 h-6 rounded-full ${isEnabled ? 'bg-[#6f9c16]' : 'bg-[#d1d5db] dark:bg-gray-600'} relative transition-colors border-none cursor-pointer`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-${isEnabled ? '6' : '1'} transition-all shadow`}></div>
                </button>
              </div>
            </section>

            {/* Biometric Types */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Available Methods</h2>
              <div className="space-y-4">
                {biometricOptions.map(option => (
                  <div key={option.id} className={`bg-white dark:bg-[#1A2E1D] border ${option.available ? 'border-gray-200 dark:border-[#2D4A32]' : 'border-gray-300 dark:border-[#2D4A32] opacity-60'} rounded-2xl p-4 flex justify-between items-center cursor-${option.available ? 'pointer' : 'not-allowed'} transition-colors duration-300`} onClick={() => option.available && setBiometricType(option.id)}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-3">
                        <span className="material-symbols-outlined" style={{ color: option.available ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#A8C4A8' : '#58761B') : '#9ca3af', fontSize: '20px' }}>{option.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{option.label}</h3>
                        <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8]">{option.available ? 'Available' : 'Coming Soon'}</p>
                      </div>
                    </div>
                    {option.available && (
                      <div className={`w-5 h-5 rounded-full border-2 ${biometricType === option.id ? 'border-[#6f9c16] bg-[#6f9c16]' : 'border-[#6f9c16] bg-transparent'}`}>
                        {biometricType === option.id && <div className="w-2 h-2 bg-white rounded-full mx-auto my-1" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Setup Instructions */}
            {!isEnabled && (
              <section className="space-y-4">
                <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Setup Instructions</h2>
                <div className="bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] space-y-3 transition-colors duration-300">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">1</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Ensure your device has biometric authentication enabled</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">2</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Follow the on-screen prompts to register your biometric</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">3</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Use your biometric to log in securely</p>
                  </div>
                </div>
              </section>
            )}

            {/* Security Notice */}
            <section className="bg-[#fef3c7] dark:bg-yellow-900/20 rounded-2xl p-4 border border-[#fbbf24] dark:border-yellow-700/50 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <span className="material-symbols-outlined text-[#d97706] dark:text-yellow-500 mr-2">security</span>
                <h3 className="text-sm font-semibold text-[#d97706] dark:text-yellow-500">Security Notice</h3>
              </div>
              <p className="text-xs text-[#92400e] dark:text-yellow-200 leading-relaxed">Biometric data is stored securely on your device and never transmitted to our servers. Your biometric information remains private and secure.</p>
            </section>

            {/* Test Biometric */}
            {isEnabled && (
              <section>
                <button className="w-full bg-[#6f9c16] text-white rounded-md py-2 font-medium hover:bg-[#5a7a12] transition-colors flex items-center justify-center gap-2 border-none cursor-pointer shadow-md">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{biometricType === 'fingerprint' ? 'fingerprint' : 'face'}</span>
                  Test Biometric Authentication
                </button>
              </section>
            )}
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default Biometric;


