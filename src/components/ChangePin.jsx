import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const ChangePin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPin !== formData.confirmPin) {
      alert('New PINs do not match');
      return;
    }
    if (formData.newPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    console.log('PIN changed successfully');
    navigate('/profile');
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
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Change PIN</h1>
              <div className="w-10"></div>
            </div>
          </header>

          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/security" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">shield</span> Security
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Security Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700/30 mb-6 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl mr-2">security</span>
                <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 m-0">Security Notice</h3>
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-100 m-0 leading-relaxed">
                Your PIN is used to authenticate transactions and access your account. Keep it secure and don't share it with anyone.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Current PIN */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Current PIN</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPin"
                    value={formData.currentPin}
                    onChange={handleChange}
                    placeholder="Enter current PIN"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-[#2D4A32] rounded-xl text-base bg-gray-50 dark:bg-[#1A2E1D] outline-none focus:border-[#6f9c16] transition-colors text-gray-900 dark:text-[#E8F5E8]"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 dark:text-[#A8C4A8]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPasswords.current ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* New PIN */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">New PIN</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPin"
                    value={formData.newPin}
                    onChange={handleChange}
                    placeholder="Enter new PIN"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-[#2D4A32] rounded-xl text-base bg-gray-50 dark:bg-[#1A2E1D] outline-none focus:border-[#6f9c16] transition-colors text-gray-900 dark:text-[#E8F5E8]"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 dark:text-[#A8C4A8]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPasswords.new ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Confirm New PIN</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPin"
                    value={formData.confirmPin}
                    onChange={handleChange}
                    placeholder="Confirm new PIN"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-[#2D4A32] rounded-xl text-base bg-gray-50 dark:bg-[#1A2E1D] outline-none focus:border-[#6f9c16] transition-colors text-gray-900 dark:text-[#E8F5E8]"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 dark:text-[#A8C4A8]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPasswords.confirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* PIN Requirements */}
              <div className="bg-gray-100 dark:bg-[#1A2E1D] rounded-xl p-4 transition-colors duration-300">
                <h4 className="text-sm font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2 m-0">PIN Requirements:</h4>
                <ul className="text-xs text-gray-600 dark:text-[#A8C4A8] m-0 pl-4 space-y-1">
                  <li>Must be at least 4 digits</li>
                  <li>Cannot be the same as your current PIN</li>
                  <li>Should not be easily guessable (e.g., 1234, 0000)</li>
                  <li>Do not use personal information (birthday, phone number)</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#6f9c16] text-white border-none rounded-xl py-4 text-base font-semibold cursor-pointer hover:bg-[#5a8012] transition-colors shadow-md"
              >
                Change PIN
              </button>
            </form>

          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default ChangePin;


