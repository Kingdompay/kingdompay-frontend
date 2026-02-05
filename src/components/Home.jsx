import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';

const Home = () => {
  const { user, wallet, transactions, notifications, refreshWallet, refreshTransactions, loading, kycStatus } = useAuth();
  const { formatCurrency } = useCurrency();
  const { theme } = useDarkMode();
  const navigate = useNavigate();

  const [buttonStates, setButtonStates] = useState({});
  const [showBalance, setShowBalance] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  
  // Determine verification status - use standardized helper from AuthContext
  const { isVerified: isUserVerified, getVerificationStatus } = useAuth();
  const verificationStatus = getVerificationStatus();
  const isVerified = isUserVerified;
  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';

  // Get balance and wallet details from wallet or user object
  const userBalance = wallet?.balance ?? user?.balance ?? 0;
  const savingsBalance = user?.savingsBalance || 0;
  const totalBalance = Number(userBalance) + Number(savingsBalance || 0);
  const rawWalletNumber = wallet?.wallet_number || wallet?.display_number || user?.wallet_number || '**********';
  const visibleWalletNumber = showBalance ? rawWalletNumber : '************';
  
  // Get unread notifications count
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  // Refresh data on mount
  useEffect(() => {
    const loadData = async () => {
      if (user && !loading) {
        try {
          await Promise.all([
            refreshWallet(),
            refreshTransactions()
          ]);
        } catch (err) {
          console.warn('Failed to refresh data:', err);
        }
      }
    };
    loadData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshWallet(),
        refreshTransactions()
      ]);
    } catch (err) {
      console.warn('Failed to refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

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
      case 'Withdraw':
        navigate('/withdraw-money');
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

  // Format transaction for display
  const formatTransaction = (tx) => {
    return {
      ...tx,
      type: tx.transaction_type === 'CREDIT' || tx.type === 'credit' ? 'credit' : 'debit',
      description: tx.description || `${tx.transaction_type} Transaction`,
      amount: tx.amount || 0,
      date: tx.created_at || tx.date || new Date().toISOString(),
    };
  };

  // Get formatted transactions
  const displayTransactions = transactions.slice(0, 10).map(formatTransaction);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5EBE3] dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-[#1A3F22] dark:text-[#81C784] animate-spin">progress_activity</span>
          <p className="mt-4 text-[#1A3F22] dark:text-[#E8F5E8]">Loading...</p>
        </div>
      </div>
    );
  }

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
                  <div className="flex items-center gap-3">
                  <img
                    onClick={() => navigate('/profile')}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md transition-transform duration-300 cursor-pointer hover:scale-105"
                      src={user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.full_name || 'User') + "&background=1A3F22&color=fff"}
                  />
                    <div>
                      <p className="text-white/80 text-xs">Welcome back</p>
                      <p className="text-white font-bold text-sm">{user?.full_name || 'User'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="bg-white/20 p-2 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {showBalance ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                    {/* Refresh Button */}
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-white/20 p-2 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center"
                    >
                      <span className={`material-symbols-outlined text-white text-xl ${refreshing ? 'animate-spin' : ''}`}>
                        refresh
                          </span>
                    </button>
                    {/* Notification Bell */}
                    <button
                      onClick={() => navigate('/notifications')}
                      className="bg-white/20 p-2 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center relative"
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        notifications
                      </span>
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
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
                    KSh {totalBalance.toLocaleString()}
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

          {/* Action Buttons (Mobile) */}
          <div className="px-6 -mt-16 relative z-20 md:hidden">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/25">
              <div className="flex justify-around items-center text-center">
                {['Add', 'Send', 'Withdraw', 'More'].map((action) => (
                  <div key={action} className="flex flex-col items-center">
                    <button
                      onClick={(e) => {
                        handleButtonClick(action);
                        createRippleEffect(e);
                      }}
                      className={`w-12 h-12 ${action === 'Withdraw' ? 'bg-[#D99201]' : 'bg-[#1A3F22]'} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-none cursor-pointer relative overflow-hidden hover:scale-110 hover:shadow-xl ${buttonStates[action] ? 'scale-95' : 'scale-100'}`}
                    >
                      <span className="material-symbols-outlined text-white text-xl">
                        {action === 'Add' ? 'add' : action === 'Send' ? 'arrow_upward' : action === 'Withdraw' ? 'arrow_downward' : 'more_horiz'}
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
          
          {/* Verification Status Banner (Mobile) */}
          {showVerificationBanner && !isVerified && (
            <div className="px-6 mt-4 md:hidden">
              {isPending ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex items-start gap-3 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-yellow-600 dark:text-yellow-400"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">hourglass_top</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 m-0 text-sm">Verification Pending</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1 m-0">Your documents are being reviewed. This usually takes 1-2 business days.</p>
                  </div>
                </div>
              ) : isRejected ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-red-800 dark:text-red-200 m-0 text-sm">Verification Rejected</h4>
                    <p className="text-red-700 dark:text-red-300 text-xs mt-1 m-0">Please re-upload your documents to continue.</p>
                    <button
                      onClick={() => navigate('/verify-identity')}
                      className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg border-none cursor-pointer hover:bg-red-700 transition-colors"
                    >
                      Re-upload Documents
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">verified_user</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 m-0 text-sm">Verify Your Identity</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-1 m-0">Complete verification to unlock all features like withdrawals and community creation.</p>
                    <button
                      onClick={() => navigate('/verify-identity')}
                      className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg border-none cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      Verify Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Desktop) / Main Content (Mobile) */}
        <div className="flex-grow bg-white dark:bg-dark-bg md:bg-transparent rounded-t-3xl md:rounded-none pt-6 md:pt-8 overflow-y-auto mt-6 md:mt-0 md:p-8 transition-colors duration-300">

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Dashboard</h1>
            <div className="flex gap-4">
              <button onClick={() => handleButtonClick('Add')} className="bg-[#1A3F22] text-white px-6 py-2 rounded-full font-medium hover:bg-[#14301a] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Add Money
              </button>
              <button onClick={() => handleButtonClick('Send')} className="bg-[#58761B] text-white px-6 py-2 rounded-full font-medium hover:bg-[#4a6316] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> Send
              </button>
              <button onClick={() => handleButtonClick('Withdraw')} className="bg-[#D99201] text-white px-6 py-2 rounded-full font-medium hover:bg-[#b37801] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_downward</span> Withdraw
              </button>
            </div>
          </div>
          
          {/* Verification Status Banner (Desktop) */}
          {showVerificationBanner && !isVerified && (
            <div className="hidden md:block mb-6">
              {isPending ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 flex items-center gap-4 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-yellow-600 dark:text-yellow-400"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl text-yellow-600 dark:text-yellow-400">hourglass_top</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 m-0">Verification In Progress</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1 m-0">Your documents are being reviewed. You'll receive a notification once approved. This usually takes 1-2 business days.</p>
                  </div>
                </div>
              ) : isRejected ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 flex items-center gap-4 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400">error</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-red-800 dark:text-red-200 m-0">Verification Rejected</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1 m-0">Your documents were not accepted. Please re-upload to continue using all features.</p>
                  </div>
                  <button
                    onClick={() => navigate('/verify-identity')}
                    className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl border-none cursor-pointer hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    Re-upload Documents
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex items-center gap-4 relative">
                  <button
                    onClick={() => setShowVerificationBanner(false)}
                    className="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">verified_user</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 m-0">Complete Your Verification</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1 m-0">Verify your identity to unlock all features including withdrawals, community creation, and higher transaction limits.</p>
                  </div>
                  <button
                    onClick={() => navigate('/verify-identity')}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl border-none cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-colors flex-shrink-0 shadow-md"
                  >
                    Verify Now
                  </button>
                </div>
              )}
            </div>
          )}

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
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-white/60 text-xs">
                    Wallet Number:
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showBalance) {
                        navigator.clipboard.writeText(rawWalletNumber);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[11px] text-white font-mono tracking-wider cursor-pointer"
                  >
                    <span>{visibleWalletNumber}</span>
                    <span className="material-symbols-outlined text-xs">content_copy</span>
                  </button>
                </div>
              </div>
              <div className="bg-black/10 backdrop-blur-md rounded-full p-3 border border-white/10">
                <span className="material-symbols-outlined text-white text-2xl">
                  account_balance_wallet
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="px-6 md:px-0 pb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-[#E8F5E8] mb-4 m-0 transition-colors">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Community - Available to all */}
              <Link
                to="/community"
                className="bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20 dark:border-[#2D4A32] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center gap-2 no-underline group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A3F22] to-[#58761B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">groups</span>
                </div>
                <span className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8]">Community</span>
              </Link>
              
              {/* Savings - Available to all */}
              <Link
                to="/savings"
                className="bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20 dark:border-[#2D4A32] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center gap-2 no-underline group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D99201] to-[#905A01] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">savings</span>
                </div>
                <span className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8]">Savings</span>
              </Link>
              
              {/* Campaigns - Requires verification indicator */}
              <Link
                to={isVerified ? "/campaigns" : "/verify-identity"}
                className={`bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20 dark:border-[#2D4A32] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center gap-2 no-underline group relative ${!isVerified ? 'opacity-75' : ''}`}
              >
                {!isVerified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs">lock</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform ${!isVerified ? 'grayscale' : ''}`}>
                  <span className="material-symbols-outlined text-white text-xl">campaign</span>
                </div>
                <span className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8]">Campaigns</span>
                {!isVerified && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">Verify to unlock</span>
                )}
              </Link>
              
              {/* Payments - Available to all */}
              <Link
                to="/payments"
                className="bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20 dark:border-[#2D4A32] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center gap-2 no-underline group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">qr_code_scanner</span>
                </div>
                <span className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8]">Payments</span>
              </Link>
            </div>
            
            {/* Verified User Feature Section */}
            {isVerified && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">verified</span>
                  <h4 className="font-bold text-green-800 dark:text-green-200 m-0 text-sm">Verified User Benefits</h4>
                </div>
                <p className="text-green-700 dark:text-green-300 text-xs m-0">You have full access to all features including unlimited transactions, community creation, and campaign management.</p>
              </div>
            )}
          </div>

          {/* Transactions Section */}
          <div className="px-6 md:px-0 pb-24 md:pb-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0 transition-colors">
                Recent Transactions
            </h2>
              {displayTransactions.length > 0 && (
                <button 
                  onClick={() => navigate('/transactions')}
                  className="text-sm text-[#58761B] dark:text-[#81C784] font-medium hover:underline bg-transparent border-none cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {displayTransactions.length > 0 ? (
                displayTransactions.map((tx, i) => (
                  <div key={tx.id || i} className="bg-white/60 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-xl`}>
                          {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-[#1A3F22] dark:text-[#E8F5E8] m-0">{tx.description}</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold m-0 ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}KSh {tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white/60 dark:bg-[#1A2E1D]/80 backdrop-blur-md p-12 rounded-2xl text-center border border-white/20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#243B28] flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-4xl">receipt_long</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">No Transactions Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] mb-6">Start by adding money to your wallet</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigate('/add-money')}
                      className="px-6 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

              <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl p-4 shadow-lg mb  -6 text-center transition-colors">
                <p className="text-gray-500 dark:text-[#A8C4A8] text-xs uppercase tracking-wider mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">KSh {totalBalance.toLocaleString()}</h3>
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
                  <span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">KSh {userBalance.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#E5EBE3] dark:bg-[#0a150c] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#1A3F22] flex items-center justify-center text-[#1A3F22] dark:text-[#E8F5E8]">
                      <span className="material-symbols-outlined">savings</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">Savings</p>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Reserved</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">KSh {savingsBalance.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-[#2D4A32] pt-4 mt-4 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-[#A8C4A8] mb-2 text-center">Your Wallet Number</p>
                  <div 
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1A2E1D] p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors" 
                    onClick={() => {
                      if (showBalance) {
                        navigator.clipboard.writeText(rawWalletNumber);
                      }
                    }}
                  >
                    <span className="font-mono text-[#1A3F22] dark:text-[#E8F5E8] font-medium tracking-wider">
                      {visibleWalletNumber}
                    </span>
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
                  { name: 'TV', icon: 'tv', color: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300' },
                  { name: 'School', icon: 'school', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' },
                  { name: 'More', icon: 'apps', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' },
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
