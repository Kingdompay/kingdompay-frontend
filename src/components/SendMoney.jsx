import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { transferFunds, calculateFees } from '../services/api';

const SendMoney = () => {
  const navigate = useNavigate();
  const { user, wallet, refreshWallet, addTransaction, addNotification } = useAuth();
  const { currency, formatCurrency } = useCurrency();
  const { state } = useLocation();
  
  const [formData, setFormData] = useState({
    recipient: state?.recipient || '',
    amount: state?.amount || '',
    message: state?.message || '',
  });
  const [step, setStep] = useState(state?.amount && state?.recipient ? 3 : (state?.recipient ? 2 : 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fees, setFees] = useState(null);

  // Get current balance
  const currentBalance = wallet?.balance || user?.balance || 0;

  const recentContacts = [
    {
      id: 1,
      name: 'John Kamau',
      phone: '+254712345678',
      avatar: 'JK'
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      phone: '+254723456789',
      avatar: 'MW'
    },
    {
      id: 3,
      name: 'Peter Ochieng',
      phone: '+254734567890',
      avatar: 'PO'
    }
  ];

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return `KSh ${number.toLocaleString()}`;
  };

  const getNumericAmount = () => {
    return parseFloat(formData.amount.replace(/[^0-9.]/g, '')) || 0;
  };

  // Format phone number for display and API
  const formatPhone = (phone) => {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      return '+254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      return '+254' + formatted;
    }
    return '+' + formatted;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleContinueToAmount = async () => {
    if (!formData.recipient || formData.recipient.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleContinueToReview = async () => {
    const numericAmount = getNumericAmount();

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount < 10) {
      setError('Minimum transfer is KSh 10');
      return;
    }

    if (numericAmount > currentBalance) {
      setError('Insufficient funds');
      return;
    }

    // Calculate fees
    try {
      const feesData = await calculateFees(numericAmount, 'transfer');
      setFees(feesData);
    } catch (err) {
      // Estimate 0.5% fee
      setFees({
        fee: numericAmount * 0.005,
        total: numericAmount * 1.005,
        net_amount: numericAmount
      });
    }

    setError('');
    setStep(3);
  };

  const handleSend = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const numericAmount = getNumericAmount();
    const recipientPhone = formatPhone(formData.recipient);

    try {
      const response = await transferFunds(
        recipientPhone,
        numericAmount,
        formData.message || 'Transfer from KingdomPay'
      );

      if (response.success) {
        setSuccess('Transfer successful!');

      // Add transaction
      addTransaction({
          id: Date.now(),
        type: 'debit',
          description: `Sent to ${recipientPhone}`,
          amount: numericAmount,
        date: new Date().toISOString(),
        status: 'completed'
      });

      // Add notification
      addNotification({
        type: 'payment',
        title: 'Payment Sent',
          message: `You sent KSh ${numericAmount.toLocaleString()} to ${recipientPhone}`,
        icon: 'payments',
        color: '#dc2626'
      });

        // Refresh wallet
        await refreshWallet();

        // Redirect after success
      setTimeout(() => {
        navigate('/home');
      }, 2000);
      } else {
        setError(response.message || 'Transfer failed. Please try again.');
      }
    } catch (err) {
      console.error('Send failed:', err);
      setError(err.response?.data?.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
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
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : navigate('/payments')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Send Money</h1>
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
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Progress Steps */}
            <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-[#1A2E1D] shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= stepNumber
                      ? 'bg-[#6f9c16] text-white'
                      : 'bg-gray-200 dark:bg-[#2A3F2E] text-gray-400 dark:text-[#58761B]'
                      }`}>
                      {step > stepNumber ? (
                        <span className="material-symbols-outlined text-sm">check</span>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step > stepNumber
                        ? 'bg-[#6f9c16]'
                        : 'bg-gray-200 dark:bg-[#2A3F2E]'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className={step >= 1 ? 'text-[#6f9c16]' : 'text-gray-400'}>Recipient</span>
                <span className={`text-center ${step >= 2 ? 'text-[#6f9c16]' : 'text-gray-400'}`}>Amount</span>
                <span className={`text-right ${step >= 3 ? 'text-[#6f9c16]' : 'text-gray-400'}`}>Review</span>
              </div>
            </div>

            {/* Available Balance */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] text-white">
              <p className="text-sm opacity-80">Available Balance</p>
              <p className="text-2xl font-bold">KSh {currentBalance.toLocaleString()}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                <span className="material-symbols-outlined mr-2">error</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-300 text-sm font-medium flex items-center">
                <span className="material-symbols-outlined mr-2">check_circle</span>
                {success}
              </div>
            )}

            {/* Step 1: Recipient */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Who do you want to send money to?</h2>

                {/* Search Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">🇰🇪</span>
                  <input
                    type="tel"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="0712 345 678"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8] outline-none transition-colors text-lg"
                  />
                </div>

                {/* Recent Contacts */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-[#A8C4A8]">Recent Contacts</h3>
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setFormData({ ...formData, recipient: contact.phone });
                          setStep(2);
                        }}
                        className="flex items-center p-4 rounded-xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:border-[#6f9c16] dark:hover:border-[#81C784] cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A3F22] to-[#58761B] text-white flex items-center justify-center font-bold mr-4">
                          {contact.avatar}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{contact.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-[#A8C4A8]">{contact.phone}</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleContinueToAmount}
                  disabled={!formData.recipient}
                  className="w-full py-4 rounded-xl font-bold text-white transition-colors bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">How much do you want to send?</h2>

                {/* Recipient Preview */}
                <div className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A3F22] to-[#58761B] text-white flex items-center justify-center mr-3">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Sending to</p>
                    <p className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{formatPhone(formData.recipient)}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="p-6 rounded-2xl text-center border-2 bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] mb-2">Amount</p>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setFormData({ ...formData, amount: formatted });
                    }}
                    placeholder="KSh 0"
                    className="text-4xl font-bold text-center bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-[#A8C4A8]">Quick Amounts</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[100, 500, 1000, 2500, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setFormData({ ...formData, amount: formatAmount(amount.toString()) })}
                        disabled={amount > currentBalance}
                        className="p-4 rounded-xl border font-semibold transition-all bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:bg-[#6f9c16] hover:border-[#6f9c16] hover:text-white dark:hover:bg-[#81C784] text-gray-900 dark:text-[#E8F5E8] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        KSh {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1A3F22] dark:text-[#E8F5E8]">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full p-4 rounded-xl border-2 outline-none transition-colors resize-none bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                  <button
                  onClick={handleContinueToReview}
                    disabled={!formData.amount}
                  className="w-full py-4 rounded-xl font-bold text-white bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    Continue
                  </button>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Review your payment</h2>

                <div className="p-6 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-[#2D4A32]">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">To</span>
                    <span className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{formatPhone(formData.recipient)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-[#2D4A32]">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">Amount</span>
                    <span className="text-2xl font-bold text-[#6f9c16] dark:text-[#81C784]">{formData.amount}</span>
                  </div>
                  {fees && (
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-[#2D4A32]">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">Fee</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-400">KSh {fees.fee.toFixed(2)}</span>
                  </div>
                  )}
                  {formData.message && (
                    <div className="pt-2">
                      <span className="text-gray-500 dark:text-[#A8C4A8] text-sm">Message</span>
                      <p className="mt-1 text-[#1A3F22] dark:text-[#E8F5E8]">{formData.message}</p>
                    </div>
                  )}
                </div>

                  <button
                    onClick={handleSend}
                  disabled={loading || success}
                  className="w-full py-4 rounded-xl font-bold text-white bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : success ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Send Money
                    </>
                  )}
                  </button>
              </div>
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

export default SendMoney;
