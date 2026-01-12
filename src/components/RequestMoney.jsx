import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const RequestMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currency, formatCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    requester: '',
    amount: '',
    message: '',
    dueDate: '',
    category: 'general'
  });
  const [step, setStep] = useState(1); // 1: Requester, 2: Amount, 3: Review

  const recentContacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      phone: '+1 (555) 456-7890',
      avatar: 'ED'
    }
  ];

  const categories = [
    { id: 'general', label: 'General', icon: 'money' },
    { id: 'food', label: 'Food & Dining', icon: 'restaurant' },
    { id: 'transport', label: 'Transportation', icon: 'directions_car' },
    { id: 'entertainment', label: 'Entertainment', icon: 'movie' },
    { id: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
    { id: 'bills', label: 'Bills & Utilities', icon: 'receipt' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequest = () => {
    console.log('Money requested:', formData);
    navigate('/home');
  };

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
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
                onClick={() => navigate('/payments')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Request Money</h1>
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
                      {stepNumber}
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
                <span className={step >= 1 ? 'text-[#6f9c16]' : 'text-gray-400'}>From</span>
                <span className={`text-center ${step >= 2 ? 'text-[#6f9c16]' : 'text-gray-400'}`}>Amount</span>
                <span className={`text-right ${step >= 3 ? 'text-[#6f9c16]' : 'text-gray-400'}`}>Review</span>
              </div>
            </div>

            {/* Step 1: From */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Who do you want to request money from?</h2>

                {/* Search Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                  <input
                    type="text"
                    name="requester"
                    value={formData.requester}
                    onChange={handleChange}
                    placeholder="Enter phone number, email, or name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8] outline-none transition-colors"
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
                          setFormData({ ...formData, requester: contact.name });
                          setStep(2);
                        }}
                        className="flex items-center p-4 rounded-xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:border-[#6f9c16] dark:hover:border-[#81C784] cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#6f9c16] text-white flex items-center justify-center font-bold mr-3">
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{contact.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-[#A8C4A8]">{contact.phone}</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-gray-400">chevron_right</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.requester}
                  className="w-full py-4 rounded-xl font-bold text-white transition-colors bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">How much do you want to request?</h2>

                {/* Amount Input */}
                <div className="p-6 rounded-2xl text-center border-2 bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] mb-2">Amount</p>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setFormData({ ...formData, amount: formatted });
                    }}
                    placeholder="$0.00"
                    className="text-4xl font-bold text-center bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-[#A8C4A8]">Quick Amounts</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(currency === 'KES'
                      ? [100, 250, 500, 1000, 2500, 5000]
                      : [10, 25, 50, 100, 200, 500]
                    ).map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setFormData({ ...formData, amount: formatAmount(amount.toString()) })}
                        className="p-4 rounded-xl border font-semibold transition-all bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] hover:bg-[#6f9c16] hover:border-[#6f9c16] hover:text-white dark:hover:bg-[#81C784] text-gray-900 dark:text-[#E8F5E8]"
                      >
                        {currency === 'KES' ? `KSh ${amount}` : `$${amount}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1A3F22] dark:text-[#E8F5E8]">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border-2 outline-none transition-colors bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
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
                    className="w-full p-3 rounded-xl border-2 outline-none transition-colors resize-none bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1A3F22] dark:text-[#E8F5E8]">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border-2 outline-none transition-colors bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] text-gray-900 dark:text-[#E8F5E8]"
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
                <h2 className="text-xl font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">Review your request</h2>

                <div className="p-6 rounded-2xl border bg-gray-50 dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">From</span>
                    <span className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{formData.requester}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">Amount</span>
                    <span className="text-2xl font-bold text-[#6f9c16] dark:text-[#81C784]">{formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 dark:text-[#A8C4A8]">Category</span>
                    <span className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">
                      {categories.find(c => c.id === formData.category)?.label}
                    </span>
                  </div>
                  {formData.dueDate && (
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 dark:text-[#A8C4A8]">Due Date</span>
                      <span className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{formData.dueDate}</span>
                    </div>
                  )}
                  {formData.message && (
                    <div className="pt-4 border-t border-gray-200 dark:border-[#2D4A32]">
                      <span className="text-gray-500 dark:text-[#A8C4A8] text-sm">Message</span>
                      <p className="mt-1 text-[#1A3F22] dark:text-[#E8F5E8]">{formData.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-300 dark:border-[#2D4A32] text-gray-700 dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRequest}
                    className="flex-1 py-4 rounded-xl font-bold text-white bg-[#6f9c16] hover:bg-[#5a8012] shadow-lg border-none cursor-pointer"
                  >
                    Request Money
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

export default RequestMoney;


