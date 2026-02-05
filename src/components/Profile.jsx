import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, wallet, kycStatus, kycDocuments, communities, isVerified, getVerificationStatus } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState('');

  // Parse full_name into first and last name
  const nameParts = (user?.full_name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const initials = (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase() || 'U';

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  // getVerificationStatus is now provided by useAuth() hook

  // Verification status display
  const getVerificationBadge = () => {
    const status = getVerificationStatus();
    
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
          <span className="material-symbols-outlined text-sm">verified</span>
          Verified
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
          <span className="material-symbols-outlined text-sm">pending</span>
          Pending Review
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              onClick={() => navigate('/verify-identity')}>
          <span className="material-symbols-outlined text-sm">error</span>
          Rejected - Resubmit
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/verify-identity')}>
          <span className="material-symbols-outlined text-sm">shield</span>
          Not Verified
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-dark-bg font-sans flex justify-center transition-colors duration-300">
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

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-dark-bg md:bg-[#E5EBE3] md:dark:bg-dark-bg md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-white dark:bg-dark-bg md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          {/* Header */}
          <div className="p-6 text-center md:text-left md:flex md:flex-col md:items-center md:justify-center md:flex-grow">
            {/* Profile Avatar */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative inline-block"
            >
              <div className="w-28 h-28 rounded-full border-4 border-[#58761B] bg-gradient-to-br from-[#1A3F22] to-[#58761B] flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl font-bold">
                  {initials}
                </span>
              </div>
              {/* Role Badge */}
              {user?.role?.toUpperCase() === 'ADMIN' && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#D99201] rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-sm">admin_panel_settings</span>
                </div>
              )}
            </motion.div>

            {/* User Info */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-4"
            >
              <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0 transition-colors">
                {user?.full_name || 'User'}
              </h2>
              <p className="text-[#58761B] dark:text-[#81C784] text-sm mt-1 m-0 transition-colors">
                {user?.phone_number || user?.phone || '---'}
              </p>
              {user?.email && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 m-0 transition-colors">
                  {user.email}
                </p>
              )}
              <div className="mt-3">
                {getVerificationBadge()}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs"
            >
              <div className="bg-[#E9F0E1] dark:bg-[#1A2E1D] rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 m-0">Wallet</p>
                <p className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                  {wallet?.wallet_number || user?.wallet_number || '---'}
                </p>
              </div>
              <div className="bg-[#E9F0E1] dark:bg-[#1A2E1D] rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 m-0">Member Since</p>
                <p className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '---'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">savings</span> Savings
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] bg-gray-50 dark:bg-[#1A2E1D] font-medium p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              {user?.role?.toUpperCase() === 'ADMIN' && (
                <Link to="/admin" className="flex items-center text-[#D99201] hover:bg-[#D99201]/10 p-3 rounded-xl transition-colors no-underline">
                  <span className="material-symbols-outlined mr-3">admin_panel_settings</span> Admin Panel
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] md:dark:bg-dark-bg transition-colors duration-300">

          {/* Account Details Card */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-[#1A2E1D] rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-[#2D4A32] mb-6"
          >
            <h3 className="font-bold text-lg mb-4 text-[#1A3F22] dark:text-[#E8F5E8] m-0 flex items-center gap-2">
              <span className="material-symbols-outlined">account_circle</span>
              Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Full Name</span>
                <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">{user?.full_name || '---'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Phone Number</span>
                <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">{user?.phone_number || '---'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Email</span>
                <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Account Type</span>
                <span className={`font-medium ${user?.role?.toUpperCase() === 'ADMIN' ? 'text-[#D99201]' : 'text-[#58761B] dark:text-[#81C784]'}`}>
                  {user?.role || 'USER'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Phone Verified</span>
                <span className={`font-medium ${user?.is_phone_verified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {user?.is_phone_verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#2D4A32]">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Account Status</span>
                <span className={`font-medium ${user?.is_active !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {user?.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Created</span>
                <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : '---'}
                </span>
              </div>
            </div>
          </motion.section>

          {/* Action Buttons Grid */}
          <section className="mt-4 md:mt-0">
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center flex flex-col items-center">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className={`w-16 h-16 rounded-2xl border-2 border-[#905A01] flex items-center justify-center bg-white dark:bg-[#0A150C] cursor-pointer transition-all duration-300 ${hoveredButton === 'edit' ? 'shadow-lg scale-105 -translate-y-1' : 'shadow-sm'}`}
                  onMouseEnter={() => setHoveredButton('edit')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined text-[#905A01] text-xl">edit</span>
                </button>
                <p className="text-xs mt-2 text-[#1A3F22] dark:text-[#E8F5E8] font-medium m-0 transition-colors">
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
                <p className="text-xs mt-2 text-[#1A3F22] dark:text-[#E8F5E8] font-medium m-0 transition-colors">
                  Security
                </p>
              </div>

              <div className="text-center flex flex-col items-center">
                <button
                  onClick={() => navigate('/verify-identity')}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all duration-300 ${hoveredButton === 'verify' ? 'bg-[#C68801] shadow-lg scale-105 -translate-y-1' : 'bg-[#D99201] shadow-sm'}`}
                  onMouseEnter={() => setHoveredButton('verify')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined text-white text-xl">verified_user</span>
                </button>
                <p className="text-xs mt-2 text-[#1A3F22] dark:text-[#E8F5E8] font-medium m-0 transition-colors">
                  Verify ID
                </p>
              </div>
            </div>
          </section>

          {/* Menu Sections Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Account Section */}
            <section className="bg-white dark:bg-[#1A2E1D] rounded-xl shadow-sm p-2 border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] dark:text-[#E8F5E8] m-0">Account</h3>
              <div className="border-t border-gray-100 dark:border-[#2D4A32]">
                <button onClick={() => navigate('/personal-details')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">person</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Personal Details</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/linked-accounts')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">account_balance</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Linked Bank Accounts</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/cards')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">credit_card</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Cards</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-white dark:bg-[#1A2E1D] rounded-xl shadow-sm p-2 border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] dark:text-[#E8F5E8] m-0">Preferences</h3>
              <div className="border-t border-gray-100 dark:border-[#2D4A32]">
                <button onClick={() => navigate('/notifications')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">notifications</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Notifications</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/settings')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">settings</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Settings</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/limits-plans')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">speed</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Limits & Plans</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Security Section */}
            <section className="bg-white dark:bg-[#1A2E1D] rounded-xl shadow-sm p-2 border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] dark:text-[#E8F5E8] m-0">Security</h3>
              <div className="border-t border-gray-100 dark:border-[#2D4A32]">
                <button onClick={() => navigate('/change-pin')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">pin</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Change PIN</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/two-factor-auth')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">password</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Two-Factor Auth</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/biometric')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">fingerprint</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Biometric Login</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-white dark:bg-[#1A2E1D] rounded-xl shadow-sm p-2 border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <h3 className="font-bold text-lg mb-2 px-3 pt-2 text-[#1A3F22] dark:text-[#E8F5E8] m-0">Support</h3>
              <div className="border-t border-gray-100 dark:border-[#2D4A32]">
                <button onClick={() => navigate('/help-support')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">help</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Help Center</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/chat-support')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">chat</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">Chat Support</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>

                <button onClick={() => navigate('/faqs')} className="flex items-center justify-between p-3 w-full bg-transparent border-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-base">quiz</span>
                    </div>
                    <span className="text-[#1A3F22] dark:text-[#E8F5E8] font-medium">FAQs</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-base">chevron_right</span>
                </button>
              </div>
            </section>

            {/* Logout Button */}
            <div className="col-span-1 md:col-span-2 mt-4 mb-8 text-center">
              <button 
                onClick={handleLogout} 
                className="text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 px-8 py-3 rounded-xl transition-colors border-2 border-red-200 dark:border-red-800 cursor-pointer bg-transparent flex items-center justify-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out
              </button>
            </div>

          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Profile;
