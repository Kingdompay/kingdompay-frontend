import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { initiateMpesaDeposit, getMpesaStatus } from '../services/api';
import BottomNav from './BottomNav';

const AddMoney = () => {
  const navigate = useNavigate();
  const { user, refreshWallet, addTransaction, addNotification } = useAuth();
  const { currency, formatCurrency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa'); // mpesa, card, bank
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState(null);
  const [step, setStep] = useState('input'); // input, processing, success

  // Pre-fill phone from user profile
  useEffect(() => {
    if (user?.phone_number) {
      // Format phone for display (07xxx format)
      let phone = user.phone_number;
      if (phone.startsWith('+254')) {
        phone = '0' + phone.substring(4);
      }
      setPhoneNumber(phone);
    }
  }, [user]);

  // Check M-Pesa status on mount
  useEffect(() => {
    const checkMpesaStatus = async () => {
      try {
        const status = await getMpesaStatus();
        setMpesaStatus(status);
      } catch (err) {
        console.warn('Could not check M-Pesa status:', err);
      }
    };
    checkMpesaStatus();
  }, []);

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    if (currency === 'KES') {
      return `KSh ${number.toLocaleString()}`;
    }
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getNumericAmount = () => {
    return parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
  };

  // Format phone number for API
  const formatPhoneForAPI = (phone) => {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '+254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '+254' + formatted;
    } else {
      formatted = '+' + formatted;
    }
    return formatted;
  };

  const handleAddMoney = async () => {
    setError('');
    setSuccess('');

    const numericAmount = getNumericAmount();

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount < 10) {
      setError('Minimum amount is KSh 10');
      return;
    }

    if (numericAmount > 150000) {
      setError('Maximum amount is KSh 150,000');
      return;
    }

    if (method === 'mpesa') {
      if (!phoneNumber) {
        setError('Please enter your M-Pesa phone number');
        return;
      }

      const formattedPhone = formatPhoneForAPI(phoneNumber);
      
      setLoading(true);
      setStep('processing');

      try {
        const response = await initiateMpesaDeposit(formattedPhone, numericAmount);
        
        if (response.success) {
          setSuccess('Check your phone for the M-Pesa prompt. Enter your PIN to complete the payment.');

          // Add optimistic transaction (pending)
    addTransaction({
            id: Date.now(),
      type: 'credit',
            description: 'M-Pesa Deposit (Processing)',
            amount: numericAmount,
      date: new Date().toISOString(),
            status: 'pending'
    });

    // Add notification
    addNotification({
      type: 'payment',
            title: 'Payment Initiated',
            message: `M-Pesa payment of ${formatCurrency(numericAmount)} has been initiated. Please check your phone.`,
            icon: 'smartphone',
            color: '#D99201'
    });

          setStep('success');
          
          // Poll for completion (in production, use webhooks)
          setTimeout(async () => {
            await refreshWallet();
          }, 30000); // Refresh wallet after 30 seconds

        } else {
          setError(response.message || 'Failed to initiate M-Pesa payment');
          setStep('input');
        }
      } catch (err) {
        console.error('M-Pesa deposit failed:', err);
        setError(err.response?.data?.message || 'Failed to initiate M-Pesa payment. Please try again.');
        setStep('input');
      } finally {
        setLoading(false);
      }
    } else {
      // For card/bank - coming soon
      setError('This payment method is coming soon. Please use M-Pesa.');
    }
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
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
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
                onClick={() => navigate('/payments')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Add Money</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/payments')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">

            {step === 'processing' && (
              <div className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#6f9c16] rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-[#6f9c16] rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl">smartphone</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Check Your Phone</h2>
                <p className="text-gray-500 dark:text-[#A8C4A8] mb-4">An M-Pesa prompt has been sent to your phone</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Enter your M-Pesa PIN to complete the payment</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Payment Initiated!</h2>
                <p className="text-gray-500 dark:text-[#A8C4A8] mb-6">{success}</p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-8 py-3 rounded-xl bg-[#6f9c16] text-white font-bold hover:bg-[#5a8012] transition-colors"
                >
                  Go to Home
                </button>
              </div>
            )}

            {step === 'input' && (
              <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Top Up Wallet</h2>
              <p className="text-gray-500 dark:text-[#A8C4A8]">Add funds to your KingdomPay wallet</p>
            </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                    <span className="material-symbols-outlined mr-2">error</span>
                    {error}
                  </div>
                )}

            {/* Amount Input */}
            <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                      placeholder="KSh 0"
                  className="w-full text-4xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] placeholder-gray-300 border-b-2 border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] outline-none py-2 bg-transparent transition-colors text-center"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                    {[100, 500, 1000, 2500, 5000, 10000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(formatAmount(val.toString()))}
                    className="py-2 px-4 rounded-xl border border-gray-200 dark:border-[#2D4A32] text-gray-600 dark:text-[#E8F5E8] font-medium hover:bg-[#6f9c16] hover:text-white hover:border-[#6f9c16] dark:hover:bg-[#81C784] transition-all"
                  >
                        KSh {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Payment Method</h3>

              <div className="space-y-3">
                    {/* M-Pesa */}
                <div
                  onClick={() => setMethod('mpesa')}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'mpesa' ? 'border-[#6f9c16] bg-green-50 dark:bg-[#243B28]' : 'border-gray-100 dark:border-[#2D4A32] hover:border-gray-200 dark:hover:border-[#3D5F3F]'}`}
                >
                      <div className="w-12 h-12 rounded-full bg-[#4CAF50] flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">M-Pesa</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Instant • Recommended</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'mpesa' ? 'border-[#6f9c16]' : 'border-gray-300 dark:border-gray-600'}`}>
                    {method === 'mpesa' && <div className="w-2.5 h-2.5 rounded-full bg-[#6f9c16]"></div>}
                  </div>
                </div>

                    {/* M-Pesa Phone Input */}
                {method === 'mpesa' && (
                  <div className="mt-4 animate-fade-in-up">
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">M-Pesa Phone Number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🇰🇪</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="0712345678"
                            maxLength={10}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#2D4A32] bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-colors"
                    />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You'll receive an STK push on this number</p>
                  </div>
                )}

                    {/* Card - Coming Soon */}
                    <div
                      onClick={() => setMethod('card')}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all opacity-50 ${method === 'card' ? 'border-[#6f9c16] bg-green-50 dark:bg-[#243B28]' : 'border-gray-100 dark:border-[#2D4A32]'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">credit_card</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Debit/Credit Card</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Coming Soon</p>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">Soon</span>
                    </div>

                    {/* Bank - Coming Soon */}
                    <div
                      onClick={() => setMethod('bank')}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all opacity-50 ${method === 'bank' ? 'border-[#6f9c16] bg-green-50 dark:bg-[#243B28]' : 'border-gray-100 dark:border-[#2D4A32]'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">account_balance</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Bank Transfer</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Coming Soon</p>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">Soon</span>
                    </div>
              </div>
            </div>

            <button
              onClick={handleAddMoney}
                  disabled={loading || !amount || method !== 'mpesa'}
                  className="w-full py-4 rounded-xl bg-[#6f9c16] text-white font-bold text-lg shadow-lg hover:bg-[#5a8012] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                      Add Funds via M-Pesa
                    </>
                  )}
            </button>
              </>
            )}

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

export default AddMoney;
