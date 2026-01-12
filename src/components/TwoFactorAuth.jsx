import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  const backupCodes = [
    '1234-5678-9012',
    '2345-6789-0123',
    '3456-7890-1234',
    '4567-8901-2345',
    '5678-9012-3456',
  ];

  const toggle2FA = () => setIsEnabled(!isEnabled);

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
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Two‑Factor Authentication</h1>
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
            {/* 2FA Status */}
            <section>
              <div className={`bg-white dark:bg-[#1A2E1D] border ${isEnabled ? 'border-[#bbf7d0] dark:border-green-900/50' : 'border-[#fecaca] dark:border-red-900/50'} rounded-2xl p-4 flex justify-between items-center transition-colors duration-300`}>
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-3" style={{ color: isEnabled ? '#059669' : '#dc2626', fontSize: '24px' }}>
                    {isEnabled ? 'security' : 'security_update_warning'}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{isEnabled ? '2FA Enabled' : '2FA Disabled'}</h3>
                    <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8]">{isEnabled ? 'Your account is protected' : 'Add an extra layer of security'}</p>
                  </div>
                </div>
                <button onClick={toggle2FA} className={`w-12 h-6 rounded-full ${isEnabled ? 'bg-[#6f9c16]' : 'bg-[#d1d5db] dark:bg-gray-600'} relative transition-colors border-none cursor-pointer`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-${isEnabled ? '6' : '1'} transition-all shadow`} />
                </button>
              </div>
            </section>

            {/* Setup Instructions */}
            {!isEnabled && (
              <section className="space-y-4">
                <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Setup Instructions</h2>
                <div className="bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] space-y-3 transition-colors duration-300">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">1</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Download an authenticator app (Google Authenticator, Authy, etc.)</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">2</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Scan the QR code with your authenticator app</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center mr-3 text-xs font-bold">3</div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8]">Enter the 6‑digit code from your app</p>
                  </div>
                </div>
              </section>
            )}

            {/* QR Code */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">QR Code</h2>
              <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] text-center transition-colors duration-300">
                <div className="w-48 h-48 bg-[#f9fafb] dark:bg-white border border-[#e5e7eb] dark:border-none rounded-lg mx-auto flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[#6b7280] text-5xl">qr_code</span>
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8]">Scan this code with your authenticator app</p>
              </div>
            </section>

            {/* Backup Codes */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Backup Codes</h2>
              <div className="bg-[#fef3c7] dark:bg-yellow-900/20 rounded-2xl p-4 border border-[#fbbf24] dark:border-yellow-700/50 transition-colors duration-300">
                <div className="flex items-center mb-2">
                  <span className="material-symbols-outlined text-[#d97706] dark:text-yellow-500 mr-2">warning</span>
                  <h3 className="text-sm font-semibold text-[#d97706] dark:text-yellow-500">Important</h3>
                </div>
                <p className="text-xs text-[#92400e] dark:text-yellow-200 mb-3">Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
                <div className="flex flex-col gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-[#E5EBE3] dark:bg-[#0D1B0F] border border-[#e5e7eb] dark:border-[#2D4A32] rounded-md p-2 text-sm font-mono text-[#1A3F22] dark:text-[#E8F5E8]">{code}</div>
                  ))}
                </div>
                <button className="mt-3 w-full bg-[#d97706] text-white rounded-md py-2 text-sm font-medium hover:bg-[#b05c04] transition-colors border-none cursor-pointer">Generate New Codes</button>
              </div>
            </section>

            {/* Security Tips */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Security Tips</h2>
              <div className="bg-[#f3f4f6] dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] transition-colors duration-300">
                <ul className="list-disc list-inside text-sm text-[#6b7280] dark:text-[#A8C4A8] space-y-1">
                  <li>Never share your backup codes with anyone</li>
                  <li>Store backup codes in a secure location</li>
                  <li>Use a reliable authenticator app</li>
                  <li>Keep your phone secure and updated</li>
                  <li>Contact support if you lose access to your device</li>
                </ul>
              </div>
            </section>
          </div>
        </main>
        {/* Bottom Navigation */}
        <div className="md:hidden"><BottomNav /></div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;


