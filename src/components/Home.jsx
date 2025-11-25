import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';

const Home = () => {
  const { user } = useAuth();
  const { theme } = useDarkMode();
  const navigate = useNavigate();

  const [buttonStates, setButtonStates] = useState({});
  const [showBalance, setShowBalance] = useState(true);

  // Use balance and transactions directly from user context
  const userBalance = user?.balance || 0;
  const transactions = user?.transactions || [];
  const unreadNotifications = (user?.notifications || []).filter(n => !n.read).length;

  console.log('Home: Rendered with balance:', userBalance);

  const handleWalletClick = () => {
    console.log('Wallet clicked!');
  };

  const handleButtonClick = (action) => {
    console.log(`${action} button clicked!`);
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
        console.log('More options clicked');
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
    <div className="min-h-screen bg-white font-sans flex justify-center">
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

      <div className="w-full max-w-md md:max-w-6xl bg-white md:bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">

        {/* Left Column (Desktop) / Top Section (Mobile) */}
        <div className="md:w-1/3 lg:w-1/4 relative flex flex-col">
          {/* Header Section with Gradient */}
          <div className="relative animate-fade-in-up flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A3F22] via-[#58761B] to-[#D99201] rounded-b-3xl md:rounded-none md:h-full"></div>

            <div className="relative z-10 bg-gradient-to-br from-[#1A3F22] via-[#58761B] to-[#D99201] pb-16 md:pb-8 rounded-b-3xl md:rounded-none md:h-full shadow-xl md:shadow-none">
              {/* Top Bar */}
              <div className="p-6 animate-slide-in-left">
                <div className="flex justify-between items-center">
                  <img
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md transition-transform duration-300"
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
                <p className="text-sm font-light text-white/80 m-0">
                  Total Balance
                </p>
                <p className="text-5xl font-bold text-white mt-1 m-0 tracking-tight">
                  {showBalance
                    ? `$${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '••••••••'
                  }
                </p>
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
                {['Add', 'Send', 'Swap', 'More'].map((action) => (
                  <div key={action} className="flex flex-col items-center">
                    <button
                      onClick={(e) => {
                        handleButtonClick(action);
                        createRippleEffect(e);
                      }}
                      className={`w-14 h-14 bg-[#1A3F22] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-none cursor-pointer relative overflow-hidden hover:scale-110 hover:shadow-xl ${buttonStates[action] ? 'scale-95' : 'scale-100'}`}
                    >
                      <span className="material-symbols-outlined text-white text-2xl">
                        {action === 'Add' ? 'arrow_downward' : action === 'Send' ? 'arrow_upward' : action === 'Swap' ? 'swap_horiz' : 'more_horiz'}
                      </span>
                    </button>
                    <p className="text-xs mt-2 text-[#1A3F22] font-bold m-0">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop) / Main Content (Mobile) */}
        <div className="flex-grow bg-white md:bg-transparent rounded-t-3xl md:rounded-none pt-6 md:pt-8 overflow-y-auto mt-6 md:mt-0 md:p-8">

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1A3F22]">Dashboard</h1>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4 m-0">
              Transactions
            </h2>
            <div className="flex flex-col gap-4">
              {transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#1A3F22] text-xl">
                          {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-[#1A3F22] m-0">{tx.description}</p>
                        <p className="text-xs text-gray-500 m-0">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold m-0 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;