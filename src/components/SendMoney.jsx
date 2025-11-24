import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const SendMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
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

    setLoading(true);

    try {
      const response = await axios.post('/api/transactions/send-money', {
        recipientEmail: formData.recipient,
        amount: numericAmount,
        note: formData.message || 'Money transfer'
      });

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

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const SidebarItem = ({ icon, label, active, onClick, path }) => (
    <div
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
      }}
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active
        ? 'bg-primary-50 text-primary-700'
        : isDarkMode
          ? 'text-gray-300 hover:bg-gray-800'
          : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
            </div>
            <h1 className="text-xl font-bold text-primary-600">KingdomPay</h1>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon="dashboard" label="Home" path="/home" />
            <SidebarItem icon="send" label="Send Money" active={true} path="/send-money" />
            <SidebarItem icon="request_quote" label="Request Money" path="/request-money" />
            <SidebarItem icon="account_balance" label="Savings" path="/savings" />
            <SidebarItem icon="receipt_long" label="Activity" path="/activity" />
            <SidebarItem icon="person" label="Profile" path="/profile" />
          </nav>
        </div>

        <div className={`mt-auto p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/home')}
              className={`md:hidden mr-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold">Send Money</h1>
          </div>
          <div className="w-10 md:w-0"></div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl mx-auto">

            {/* Progress Steps */}
            <div className={`mb-8 p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= stepNumber
                      ? 'bg-primary-600 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
                      }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step > stepNumber
                        ? 'bg-primary-600'
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className={step >= 1 ? 'text-primary-600' : 'text-gray-400'}>Recipient</span>
                <span className={`text-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>Amount</span>
                <span className={`text-right ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>Review</span>
              </div>
            </div>

            {/* Step 1: Recipient */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Who do you want to send money to?</h2>

                {/* Search Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Enter phone number, email, or name"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-primary-500 text-white'
                      : 'bg-gray-50 border-gray-200 focus:border-primary-500 text-gray-900'
                      }`}
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
                          setFormData({ ...formData, recipient: contact.name });
                          setStep(2);
                        }}
                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-primary-500'
                          : 'bg-white border-gray-200 hover:border-primary-500'
                          }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-3">
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-gray-400">chevron_right</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">How much do you want to send?</h2>

                {/* Amount Input */}
                <div className={`p-6 rounded-2xl text-center border-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
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
                    className={`text-4xl font-bold text-center bg-transparent border-none outline-none w-full ${isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
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
                        className={`p-4 rounded-xl border font-semibold transition-all ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 hover:bg-primary-600 hover:border-primary-600 text-white'
                          : 'bg-white border-gray-200 hover:bg-primary-600 hover:border-primary-600 hover:text-white text-gray-900'
                          }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Add a note..."
                    rows={3}
                    className={`w-full p-3 rounded-xl border-2 outline-none transition-colors resize-none ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 focus:border-primary-500 text-white'
                      : 'bg-gray-50 border-gray-200 focus:border-primary-500 text-gray-900'
                      }`}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review your payment</h2>

                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">To</span>
                    <span className="font-semibold">{formData.recipient}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-2xl font-bold text-primary-600">{formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  {formData.message && (
                    <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className="text-gray-500 text-sm">Message</span>
                      <p className="mt-1">{formData.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!formData.recipient || (step === 2 && !formData.amount)}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${(!formData.recipient || (step === 2 && !formData.amount))
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30'
                    }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  className="w-full py-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-colors"
                >
                  Send Money
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
};

export default SendMoney;
