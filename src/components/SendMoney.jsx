import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const SendMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    message: '',
    paymentMethod: 'wallet'
  });
  const [step, setStep] = useState(1); // 1: Recipient, 2: Amount, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const recentContacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah@example.com',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      email: 'mike@example.com',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      phone: '+1 (555) 456-7890',
      email: 'emily@example.com',
      avatar: 'ED'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleSend = async () => {
    setError('');
    setSuccess('');

    const numericAmount = parseFloat(formData.amount.replace(/[^0-9.]/g, ''));

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.recipient) {
      setError('Please enter recipient email or phone');
      return;
    }

    // Check limits
    const dailyLimit = user?.limits?.daily || 500;
    if (numericAmount > dailyLimit) {
      setError(`Transaction exceeds your daily limit of $${dailyLimit}. Please verify your identity to increase your limits.`);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(`Successfully sent ${formatAmount(numericAmount.toString())}!`);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send money. Please try again.');
    } finally {
      setLoading(false);
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
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/payments')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Send Money</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/payments')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Progress Steps */}
            <div className="mb-8 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= stepNumber
                      ? 'bg-[#6f9c16] text-white'
                      : 'bg-gray-200 text-gray-400'
                      }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step > stepNumber
                        ? 'bg-[#6f9c16]'
                        : 'bg-gray-200'
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

            {/* Step 1: Recipient */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22]">Who do you want to send money to?</h2>

                {/* Search Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Enter phone number, email, or name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-gray-50 border-gray-200 focus:border-[#6f9c16] text-gray-900 outline-none transition-colors"
                  />
                </div>

                {/* Recent Contacts */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-500">Recent Contacts</h3>
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setFormData({ ...formData, recipient: contact.email });
                          setStep(2);
                        }}
                        className="flex items-center p-4 rounded-xl border bg-white border-gray-200 hover:border-[#6f9c16] cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#6f9c16] text-white flex items-center justify-center font-bold mr-3">
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1A3F22]">{contact.name}</h4>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-gray-400">chevron_right</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.recipient}
                  className="w-full py-4 rounded-xl font-bold text-white transition-colors bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22]">How much do you want to send?</h2>

                {/* Amount Input */}
                <div className="p-6 rounded-2xl text-center border-2 bg-gray-50 border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Amount</p>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setFormData({ ...formData, amount: formatted });
                    }}
                    placeholder="$0.00"
                    className="text-4xl font-bold text-center bg-transparent border-none outline-none w-full text-gray-900"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-500">Quick Amounts</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 25, 50, 100, 200, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setFormData({ ...formData, amount: `$${amount}.00` })}
                        className="p-4 rounded-xl border font-semibold transition-all bg-white border-gray-200 hover:bg-[#6f9c16] hover:border-[#6f9c16] hover:text-white text-gray-900"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1A3F22]">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full p-3 rounded-xl border-2 outline-none transition-colors resize-none bg-gray-50 border-gray-200 focus:border-[#6f9c16] text-gray-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.amount}
                    className="flex-1 py-4 rounded-xl font-bold text-white bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22]">Review your payment</h2>

                <div className="p-6 rounded-2xl border bg-gray-50 border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">To</span>
                    <span className="font-semibold text-[#1A3F22]">{formData.recipient}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-2xl font-bold text-[#6f9c16]">{formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  {formData.message && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-gray-500 text-sm">Message</span>
                      <p className="mt-1 text-[#1A3F22]">{formData.message}</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm">
                    <span className="material-symbols-outlined mr-2">error</span>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center text-sm">
                    <span className="material-symbols-outlined mr-2">check_circle</span>
                    {success}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl font-bold text-white bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    {loading ? 'Sending...' : 'Send Money'}
                  </button>
                </div>
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
