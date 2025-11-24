import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import BottomNav from './BottomNav';

const AddMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'account_balance',
      description: 'Transfer from your bank account',
      fee: 'Free'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit_card',
      description: 'Add money using your card',
      fee: '2.9% fee'
    },
    {
      id: 'cash',
      name: 'Cash Deposit',
      icon: 'local_atm',
      description: 'Deposit cash at partner locations',
      fee: '$1.00 fee'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: 'currency_bitcoin',
      description: 'Convert crypto to wallet balance',
      fee: '1% fee'
    }
  ];

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleAddMoney = async () => {
    setError('');
    setSuccess('');

    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
      const response = await axios.post('/api/transactions/add-money', {
        amount: numericAmount,
        paymentMethod: selectedMethod.name
      });

      setSuccess(`Successfully added ${formatAmount(numericAmount.toString())} to your wallet!`);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add money. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans flex justify-center">
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
                onClick={() => navigate('/home')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Add Money</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">

          <div className="max-w-2xl mx-auto animate-fade-in-up space-y-8">

            {/* Amount Section */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">How much do you want to add?</h2>

              {/* Amount Input */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200">
                  <p className="text-sm text-gray-500 mb-2 m-0">Amount</p>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setAmount(formatted);
                    }}
                    placeholder="$0.00"
                    className="text-4xl font-bold text-[#1A3F22] border-none bg-transparent text-center outline-none w-full placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <h3 className="text-sm font-semibold text-[#1A3F22] mb-3 m-0">Quick Amounts</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100, 200, 500, 1000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(`$${quickAmount}.00`)}
                      className="bg-white border border-gray-200 rounded-xl p-4 text-base font-semibold text-[#1A3F22] cursor-pointer transition-all duration-300 hover:bg-[#6f9c16] hover:text-white hover:border-[#6f9c16]"
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Choose Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all duration-300 relative ${paymentMethod === method.id ? 'border-[#6f9c16] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    {paymentMethod === method.id && (
                      <div className="absolute -top-2 right-5 bg-[#6f9c16] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${paymentMethod === method.id ? 'bg-[#E9F0E1]' : 'bg-gray-100'}`}>
                          <span className={`material-symbols-outlined text-2xl ${paymentMethod === method.id ? 'text-[#58761B]' : 'text-gray-500'}`}>
                            {method.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#1A3F22] m-0">{method.name}</h3>
                          <p className="text-sm text-gray-500 m-0">{method.description}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${method.fee === 'Free' ? 'text-green-600' : 'text-amber-600'}`}>
                        {method.fee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            {amount && (
              <section className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <h3 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Transaction Summary</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">Amount to Add</span>
                  <span className="text-lg font-bold text-[#6f9c16]">{amount}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="text-sm font-semibold text-[#1A3F22]">
                    {paymentMethods.find(m => m.id === paymentMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="text-sm font-semibold text-[#1A3F22]">
                    {paymentMethods.find(m => m.id === paymentMethod)?.fee}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-[#1A3F22]">Total</span>
                    <span className="text-lg font-bold text-[#1A3F22]">
                      {amount}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Security Notice */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-center mb-2">
                <span className="material-symbols-outlined text-amber-600 text-xl mr-2">security</span>
                <h3 className="text-sm font-semibold text-amber-600 m-0">Secure Transaction</h3>
              </div>
              <p className="text-xs text-amber-800 m-0 leading-relaxed">
                All transactions are encrypted and protected by bank-level security. Your financial information is safe with us.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-red-600 text-xl mr-2">error</span>
                  <p className="text-sm text-red-800 m-0">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-green-600 text-xl mr-2">check_circle</span>
                  <p className="text-sm text-green-800 m-0">{success}</p>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleAddMoney}
                disabled={!amount || !paymentMethod || loading}
                className={`w-full border-none rounded-xl p-4 text-base font-semibold transition-colors duration-300 ${(!amount || !paymentMethod || loading) ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#6f9c16] text-white cursor-pointer hover:bg-[#5a8012]'}`}
              >
                {loading ? 'Processing...' : 'Add Money'}
              </button>
            </div>
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
