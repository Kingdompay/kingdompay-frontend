import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState('');

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
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
          <div className="p-4 text-center md:text-left md:flex md:flex-col md:items-center md:justify-center md:flex-grow">
            <div className="relative inline-block">
              <img
                alt="User profile picture"
                className="w-24 h-24 rounded-full border-4 border-[#58761B] object-cover shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTUDwO_1yM452W0B6j691kPeEKdplxoY0YQKiIJQ70sBWUiQhS2Cb9vM7Uuyo2E4KQ-CyRyzW2V3qPqHs1Cu0S-zlxtywlUNIZAtXKHRR4zKCajsvOyC9Yo6hIeW0yDbn0N5xbqRe1tADPI5Qrk8IhtiCSFcpoo8T1iT0oQyGu70uKd7VNydVjQRNDdCFsjtbph_DPIP9__u7J7sJAGLCNNoiXmhJrWNTxdkRksSwNwlzwldTKfBrBDIumjXhXN2eBhdzaTLdKWo3R"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#1A3F22] m-0">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-[#58761B] text-sm mt-1 m-0">
              @{user?.email?.split('@')[0]} / {user?.phone || '+1 234 567 890'}
            </p>

            {/* Wallet Balance in Sidebar */}
            <div className="mt-6 w-full md:max-w-xs">
              <div className="bg-gradient-to-r from-[#1A3F22] to-[#58761B] rounded-xl p-4 flex justify-between items-center text-white shadow-md">
                <div>
                  <p className="font-semibold m-0">
                    Personal Wallet: ${user?.balance?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#D99201] text-2xl">
                  toll
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">savings</span> Savings
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] bg-gray-50 font-medium p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">

          {/* Action Buttons Grid - Removed Referrals */}
          <section className="mt-4 md:mt-0">
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center flex flex-col items-center">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className={`w-16 h-16 rounded-2xl border-2 border-[#905A01] flex items-center justify-center bg-white cursor-pointer transition-all duration-300 ${hoveredButton === 'edit' ? 'shadow-lg scale-105 -translate-y-1' : 'shadow-sm'}`}
                  onMouseEnter={() => setHoveredButton('edit')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined text-[#905A01] text-xl">edit</span>
                </button>
                <p className="text-xs mt-2 text-[#1A3F22] font-medium m-0">
                  Edit Profile
                </p>
              </div>

              <div className="text-center flex flex-col items-center">
                <button
                  onClick={() => navigate('/security')}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all duration-300 ${hoveredButton === 'security' ? 'bg-[#2d4a33] shadow-lg scale-105 -translate-y-1' : 'bg-[#1A3F22] shadow-sm'}`}
                  onMouseEnter={() => setHoveredButton('security')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined text-white text-xl">shield</span>
                </button>
                <p className="text-xs mt-2 text-[#1A3F22] font-medium m-0">
                  Security
                </p>
              </div>

              <div className="text-center flex flex-col items-center">
                <button
                  onClick={() => navigate('/cards')}
                  className="w-16 h-16 rounded-2xl bg-[#E9F0E1] flex items-center justify-center shadow-sm border-none cursor-pointer hover:bg-[#dce8d0] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#58761B] text-xl">credit_card</span>
                </button>
                <p className="text-xs mt-2 text-[#1A3F22] font-medium m-0">
                  Cards
                </p>
              </div>
            </div>
          </section>

          {/* Menu Sections Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Account Section */}
            <section className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] m-0">Account</h3>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate('/personal-details')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">person</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Personal Details</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/linked-accounts')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">account_balance</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Linked Bank Accounts & Cards</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/limits-plans')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">speed</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Limits & Plans</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] m-0">Preferences</h3>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate('/notifications')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">notifications</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Notifications & Alerts</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/settings')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">settings</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Settings</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Security Section */}
            <section className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] m-0">Security</h3>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate('/change-pin')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">pin</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Change PIN / Password</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/2fa')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">password</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">2FA</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/biometric')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">fingerprint</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Biometric Login</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] m-0">Support</h3>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate('/help-support')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">help</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Help Center</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/chat-support')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">chat</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">Chat with Support</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/faqs')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-base">quiz</span>
                    </div>
                    <span className="text-[#1A3F22] font-medium">FAQs</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                </button>
              </div>
            </section>
          </div>

          {/* Logout */}
          <section className="mt-8 text-center max-w-xs mx-auto">
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <button
                className="block w-full py-3 text-red-600 font-semibold bg-transparent border-none cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
            <p className="mt-4 text-[#A0A89B] text-xs m-0">Version 1.0.0</p>
          </section>
        </main>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;