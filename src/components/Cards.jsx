import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const Cards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
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
            <SidebarItem icon="send" label="Send Money" path="/send-money" />
            <SidebarItem icon="request_quote" label="Request Money" path="/request-money" />
            <SidebarItem icon="account_balance" label="Savings" path="/savings" />
            <SidebarItem icon="receipt_long" label="Activity" path="/activity" />
            <SidebarItem icon="credit_card" label="Cards" active={true} path="/cards" />
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
              onClick={() => navigate('/profile')}
              className={`md:hidden mr-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold">Cards</h1>
          </div>
          <button
            onClick={() => console.log('Add new card')}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">

            {/* Add New Card Button (Desktop/Prominent) */}
            <div className="mb-8">
              <button
                onClick={() => console.log('Add new card')}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
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
                      <p className="text-xs opacity-80 mb-1">CARDHOLDER</p>
                      <p className="font-medium">{card.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80 mb-1">EXPIRES</p>
                      <p className="font-medium">{card.expiry}</p>
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
              <h2 className="text-lg font-semibold mb-4">Card Settings</h2>

              {/* Freeze Card */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-primary-50'
                    }`}>
                    <span className="material-symbols-outlined text-primary-600">pause</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Freeze Card</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temporarily disable your card</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Freeze
                </button>
              </div>

              {/* Card Limits */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-primary-50'
                    }`}>
                    <span className="material-symbols-outlined text-primary-600">account_balance</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Set Limits</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage spending limits</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Manage
                </button>
              </div>

              {/* Card History */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-primary-50'
                    }`}>
                    <span className="material-symbols-outlined text-primary-600">history</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Transaction History</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View card transactions</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  View
                </button>
              </div>
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

export default Cards;
