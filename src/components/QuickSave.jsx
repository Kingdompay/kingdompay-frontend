import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const QuickSave = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('general');

  const goals = [
    { id: 'general', name: 'General Savings', icon: 'savings' },
    { id: 'vacation', name: 'Summer Vacation', icon: 'flight' },
    { id: 'car', name: 'New Car', icon: 'directions_car' }
  ];

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleSave = () => {
    console.log(`Saving ${amount} to ${selectedGoal}`);
    navigate('/savings');
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
                onClick={() => navigate('/savings')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Quick Save</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/savings')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">savings</span> Savings
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#E9F0E1] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#58761B] text-4xl">bolt</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1A3F22]">Quick Save</h2>
              <p className="text-gray-500">Instantly move money to savings</p>
            </div>

            {/* Amount Input */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Save</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  placeholder="$0.00"
                  className="w-full text-4xl font-bold text-[#1A3F22] placeholder-gray-300 border-b-2 border-gray-200 focus:border-[#6f9c16] outline-none py-2 bg-transparent transition-colors text-center"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[5, 10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(`$${val}.00`)}
                    className="py-2 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-[#6f9c16] hover:text-white hover:border-[#6f9c16] transition-all"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#1A3F22] mb-4">Select Goal</h3>

              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedGoal === goal.id ? 'border-[#6f9c16] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center mr-4">
                      <span className="material-symbols-outlined text-[#58761B]">{goal.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#1A3F22]">{goal.name}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === goal.id ? 'border-[#6f9c16]' : 'border-gray-300'}`}>
                      {selectedGoal === goal.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6f9c16]"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!amount}
              className="w-full py-4 rounded-xl bg-[#6f9c16] text-white font-bold text-lg shadow-lg hover:bg-[#5a8012] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Now
            </button>

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

export default QuickSave;
