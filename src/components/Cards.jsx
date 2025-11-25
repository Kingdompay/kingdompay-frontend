import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Cards = () => {
  const navigate = useNavigate();
  const [cards] = useState([
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1234',
      name: 'John Doe',
      expiry: '12/25',
      color: '#1A3F22',
      gradient: 'linear-gradient(135deg, #1A3F22, #58761B)'
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '**** **** **** 5678',
      name: 'John Doe',
      expiry: '08/26',
      color: '#D99201',
      gradient: 'linear-gradient(135deg, #D99201, #905A01)'
    }
  ]);

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
                onClick={() => navigate('/profile')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Cards</h1>
              <button
                onClick={() => console.log('Add new card')}
                className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] transition-colors border-none"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">add</span>
              </button>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-4xl mx-auto animate-fade-in-up">

            {/* Add New Card Button */}
            <div className="mb-8">
              <button
                onClick={() => console.log('Add new card')}
                className="w-full md:w-auto px-6 py-3 bg-[#6f9c16] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#5a8012] transition-colors shadow-lg border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
                Add New Card
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {cards.map((card) => (
                <div
                  key={card.id}
                  style={{ background: card.gradient }}
                  className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 shadow-xl"
                >
                  {/* Card Type */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">{card.type}</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined">credit_card</span>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-6">
                    <span className="text-xl font-medium tracking-widest">{card.number}</span>
                  </div>

                  {/* Card Details */}
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-xs opacity-80 mb-1 m-0">CARDHOLDER</p>
                      <p className="font-medium m-0">{card.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80 mb-1 m-0">EXPIRES</p>
                      <p className="font-medium m-0">{card.expiry}</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5"></div>
                </div>
              ))}
            </div>

            {/* Card Management Options */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-[#1A3F22]">Card Settings</h2>

              {/* Freeze Card */}
              <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                    <span className="material-symbols-outlined text-[#58761B]">pause</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3F22] m-0">Freeze Card</h3>
                    <p className="text-sm text-gray-500 m-0">Temporarily disable your card</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                  Freeze
                </button>
              </div>

              {/* Card Limits */}
              <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                    <span className="material-symbols-outlined text-[#58761B]">account_balance</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3F22] m-0">Set Limits</h3>
                    <p className="text-sm text-gray-500 m-0">Manage spending limits</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                  Manage
                </button>
              </div>

              {/* Card History */}
              <div className="p-4 rounded-2xl border bg-white border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1]">
                    <span className="material-symbols-outlined text-[#58761B]">history</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3F22] m-0">Transaction History</h3>
                    <p className="text-sm text-gray-500 m-0">View card transactions</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                  View
                </button>
              </div>
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

export default Cards;
