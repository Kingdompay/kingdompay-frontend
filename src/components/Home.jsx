import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';

const Home = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { theme } = useDarkMode();
  const navigate = useNavigate();

  const [buttonStates, setButtonStates] = useState({});
  const [showBalance, setShowBalance] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Use balance and transactions directly from user context
  const userBalance = user?.balance || 0;
  const savingsBalance = user?.savingsBalance || 0;
  const totalBalance = userBalance + savingsBalance;
  const transactions = user?.transactions || [];
  const unreadNotifications = (user?.notifications || []).filter(n => !n.read).length;

  const handleWalletClick = () => {
    setShowWalletModal(true);
  };

  const handleButtonClick = (action) => {
    setButtonStates(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [action]: false }));
    }, 150);

    switch (action) {
      case 'Add':
        navigate('/add-money');
        break;
      case 'Send':
        navigate('/send-money');
        break;
      case 'Swap':
        navigate('/request-money');
        break;
      case 'More':
        setShowMoreModal(!showMoreModal);
        break;
      default:
        break;
    }
  };

  const createRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-dark-bg font-sans flex justify-center transition-colors duration-300">
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-slide-in-left {
            animation: slideInLeft 0.6s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slideInRight 0.6s ease-out forwards;
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-dark-bg md:bg-[#E5EBE3] md:dark:bg-dark-bg md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Left Column (Desktop) / Top Section (Mobile) */}
        <div className="md:w-1/3 lg:w-1/4 relative flex flex-col">
          {/* Header Section with Gradient */}
          <div className="relative animate-fade-in-up flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A3F22] via-[#58761B] to-[#D99201] rounded-b-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-3xl md:h-full"></div>

            <div className="relative z-10 bg-gradient-to-br from-[#1A3F22] via-[#58761B] to-[#D99201] pb-16 md:pb-8 rounded-b-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-3xl md:h-full shadow-xl md:shadow-none">
              {/* Top Bar */}
              <div className="p-6 animate-slide-in-left">
                <div className="flex justify-between items-center">
                  <img
                    onClick={() => navigate('/profile')}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md transition-transform duration-300 cursor-pointer hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfS87tQQpysb3SZb5EX2azLsLtUChd2UpaGt5D22Tn_Ny7cDwSz2xCl12t4l8mACrP3I0k8dj0_ixIR9rUGVZJjHWYgOy4CP8uMZ0DBkR0fP3CkUAduPLe38Gb86XfLPstMMA9FYtv6ZtKU7jk23KY30EJ6UgPTSaZOfHK7Fxx6rJhLg1e1TNMhHhFKTR7YTL6Z03U-yiGLwhQ9wo9DElyPEPz4JRpH527L3jtyEp_T5-777K8mU6RUowlNtEnkg6d1WptBPUpPPIm"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="bg-white/20 p-2 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {showBalance ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                    {/* Profile Picture */}
                    <Link to="/profile" className="no-underline">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-white/30 object-cover hover:border-white/60 transition-all cursor-pointer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center hover:border-white/60 transition-all cursor-pointer">
                          <span className="text-white text-sm font-bold">
                            {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Notification Bell */}
                    <button
                      onClick={() => navigate('/notifications')}
                      className="bg-white/20 p-2 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center relative"
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        notifications
                      </span>
                      {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1A3F22]"></span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div className="px-6 pb-4 animate-slide-in-right">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-white/70 text-lg">account_balance_wallet</span>
                    <p className="text-sm font-medium text-white/80 m-0 uppercase tracking-wider">
                      Total Balance
                    </p>
                  </div>

                  <p className={`text-3xl md:text-4xl font-bold text-white mt-1 m-0 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm font-['Outfit'] transition-all duration-300 ${showBalance ? '' : 'blur-md select-none'}`}>
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
              </div>

              {/* Desktop Navigation (Hidden on Mobile) */}
              <div className="hidden md:block px-6 mt-8">
                <nav className="space-y-4">
                  <Link to="/home" className="flex items-center text-white font-medium bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <span className="material-symbols-outlined mr-3">home</span> Home
                  </Link>
                  <Link to="/community" className="flex items-center text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
                    <span className="material-symbols-outlined mr-3">groups</span> Community
                  </Link>
                  <Link to="/payments" className="flex items-center text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
                    <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
                  </Link>
                  <Link to="/savings" className="flex items-center text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
                    <span className="material-symbols-outlined mr-3">savings</span> Savings
                  </Link>
                  <Link to="/profile" className="flex items-center text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
                    <span className="material-symbols-outlined mr-3">person</span> Profile
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Action Buttons (Mobile: Overlap Header, Desktop: Below Header or Hidden if in Sidebar) */}
          <div className="px-6 -mt-16 relative z-20 md:hidden">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/25">
              <div className="flex justify-around items-center text-center">
                {['Add', 'Send', 'More'].map((action) => (
                  <div key={action} className="flex flex-col items-center">
                    <button
                      onClick={(e) => {
                        handleButtonClick(action);
                        createRippleEffect(e);
                      }}
                      className={`w-14 h-14 bg-[#1A3F22] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-none cursor-pointer relative overflow-hidden hover:scale-110 hover:shadow-xl ${buttonStates[action] ? 'scale-95' : 'scale-100'}`}
                    >
                      <span className="material-symbols-outlined text-white text-2xl">
                        {action === 'Add' ? 'arrow_downward' : action === 'Send' ? 'arrow_upward' : 'more_horiz'}
                      </span>
                    </button>
                    <p className="text-xs mt-2 text-[#1A3F22] dark:text-[#E8F5E8] font-bold m-0 transition-colors">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop) / Main Content (Mobile) */}
        <div className="flex-grow bg-white dark:bg-dark-bg md:bg-transparent rounded-t-3xl md:rounded-none pt-6 md:pt-8 overflow-y-auto mt-6 md:mt-0 md:p-8 transition-colors duration-300">

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Dashboard</h1>
            <div className="flex gap-4">
              <button onClick={() => handleButtonClick('Add')} className="bg-[#1A3F22] text-white px-6 py-2 rounded-full font-medium hover:bg-[#14301a] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_downward</span> Add Money
              </button>
              <button onClick={() => handleButtonClick('Send')} className="bg-[#D99201] text-white px-6 py-2 rounded-full font-medium hover:bg-[#b37801] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> Send
              </button>
            </div>
          </div>

          {/* Wallet Overview Card */}
          <div className="px-6 md:px-0 pb-6">
            <div
              className="bg-gradient-to-br from-[#D99201] via-[#905A01] to-[#1A3F22] p-5 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
              onClick={handleWalletClick}
            >
              <div>
                <p className="text-white/80 text-sm m-0">
                  Wallet Overview
                </p>
                <p className="text-white text-2xl font-bold mt-1 m-0">
                  My Wallet
                </p>
              </div>
              <div className="bg-black/10 backdrop-blur-md rounded-full p-3 border border-white/10">
                <span className="material-symbols-outlined text-white text-2xl">
                  account_balance_wallet
                </span>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="px-6 md:px-0 pb-24 md:pb-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] mb-4 m-0 transition-colors">
              Transactions
            </h2>
            <div className="flex flex-col gap-4">
              {transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <div key={i} className="bg-white/60 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">
                          {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-[#1A3F22] dark:text-[#E8F5E8] m-0">{tx.description}</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold m-0 ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white/60 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-12 rounded-2xl text-center border border-white/20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#243B28] flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-4xl">receipt_long</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">No Transactions Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] mb-6">Start by adding money to your wallet or sending to friends</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigate('/add-money')}
                      className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => navigate('/send-money')}
                      className="px-4 py-2 bg-gray-200 dark:bg-[#243B28] text-[#1A3F22] dark:text-[#E8F5E8] rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-[#2D4A32] transition-colors border-none cursor-pointer"
                    >
                      Send Money
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals omitted for brevity - assuming default/transparent overlays work or need minimal tweaks */}
      {/* Wallet Details Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#1A2E1D] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden transition-colors">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#1A3F22] to-[#58761B]"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6 text-white">
                <h2 className="text-xl font-bold m-0">Wallet Details</h2>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-1 border-none cursor-pointer text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl p-4 shadow-lg mb-6 text-center transition-colors">
                <p className="text-gray-500 dark:text-[#A8C4A8] text-xs uppercase tracking-wider mb-1">Total Net Worth</p>
                <h3 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">{formatCurrency(totalBalance)}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#E5EBE3] dark:bg-[#0a150c] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#1A3F22] flex items-center justify-center text-[#1A3F22] dark:text-[#E8F5E8]">
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">Main Wallet</p>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Available</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency(userBalance)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#E5EBE3] dark:bg-[#0a150c] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#1A3F22] flex items-center justify-center text-[#1A3F22] dark:text-[#E8F5E8]">
                      <span className="material-symbols-outlined">savings</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">Savings Wallet</p>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Reserved</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency(savingsBalance)}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-[#2D4A32] pt-4 mt-4 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-[#A8C4A8] mb-2 text-center">Your Account Number</p>
                  <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1A2E1D] p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors" onClick={() => navigator.clipboard.writeText('1234 5678 9012')}>
                    <span className="font-mono text-[#1A3F22] dark:text-[#E8F5E8] font-medium">1234 5678 9012</span>
                    <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-sm">content_copy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Options Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-[#1A2E1D] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden transition-colors">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#1A3F22] to-[#58761B]"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6 text-white">
                <h2 className="text-xl font-bold m-0">More Services</h2>
                <button
                  onClick={() => setShowMoreModal(false)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-1 border-none cursor-pointer text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl p-4 shadow-lg grid grid-cols-4 gap-4 transition-colors">
                {[
                  { name: 'Airtime', icon: 'phone_iphone', color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' },
                  { name: 'Data', icon: 'wifi', color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' },
                  { name: 'Bills', icon: 'receipt_long', color: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300' },
                  { name: 'Power', icon: 'bolt', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' },
                  { name: 'Internet', icon: 'router', color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' },
                  { name: 'Betting', icon: 'sports_soccer', color: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' },
                  { name: 'School', icon: 'school', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' },
                  { name: 'TV', icon: 'tv', color: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300' },
                ].map((service) => (
                  <div key={service.name} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                      <span className="material-symbols-outlined">{service.icon}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-[#A8C4A8]">{service.name}</span>
                  </div>
                ))}
              </div>
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

export default Home;
