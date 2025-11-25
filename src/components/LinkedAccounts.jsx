import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const LinkedAccounts = () => {
  const navigate = useNavigate();
  const [accounts] = useState([
    {
      id: 1,
      type: 'Bank Account',
      name: 'Chase Checking',
      accountNumber: '****1234',
      status: 'verified',
      balance: '$2,456.78'
    },
    {
      id: 2,
      type: 'Credit Card',
      name: 'Visa Platinum',
      accountNumber: '****5678',
      status: 'verified',
      balance: '$1,234.56'
    },
    {
      id: 3,
      type: 'Savings Account',
      name: 'Wells Fargo Savings',
      accountNumber: '****9012',
      status: 'pending',
      balance: '$5,678.90'
    }
  ]);

  const [cards] = useState([
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1234',
      name: 'John Doe',
      expiry: '12/25',
      gradient: 'linear-gradient(135deg, #1A3F22, #58761B)'
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '**** **** **** 5678',
      name: 'John Doe',
      expiry: '08/26',
      gradient: 'linear-gradient(135deg, #D99201, #905A01)'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#059669';
      case 'pending': return '#d97706';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
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
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Linked Accounts</h1>
              <button
                onClick={() => console.log('Add new account')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">add</span>
              </button>
            </div>
          </header>

          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/cards" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">credit_card</span> Cards
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">

            {/* Add New Account Button */}
            <button
              onClick={() => console.log('Add new account')}
              className="w-full bg-[#6f9c16] text-white border-none rounded-2xl py-4 px-6 text-base font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#5a8012] transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Add New Account
            </button>

            {/* Bank Accounts */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Bank Accounts</h2>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#58761B] text-xl">account_balance</span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#1A3F22] m-0">{account.name}</h3>
                          <p className="text-sm text-gray-500 m-0">{account.accountNumber}</p>
                        </div>
                      </div>
                      <span
                        className="text-xs font-medium capitalize px-2 py-1 rounded-lg"
                        style={{
                          color: getStatusColor(account.status),
                          backgroundColor: `${getStatusColor(account.status)}20`
                        }}
                      >
                        {account.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 m-0">{account.type}</p>
                      <p className="text-base font-semibold text-[#1A3F22] m-0">{account.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cards */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Cards</h2>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
                    style={{ background: card.gradient }}
                  >
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-lg font-bold">{card.type}</span>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">credit_card</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-xl font-medium tracking-wider">{card.number}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs m-0 mb-1 opacity-80">CARDHOLDER</p>
                        <p className="text-sm font-medium m-0">{card.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs m-0 mb-1 opacity-80">EXPIRES</p>
                        <p className="text-sm font-medium m-0">{card.expiry}</p>
                      </div>
                    </div>
                    <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10 opacity-50"></div>
                    <div className="absolute -bottom-7 -left-7 w-24 h-24 rounded-full bg-white/5 opacity-70"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Quick Actions</h2>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-xl">account_balance</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1A3F22] m-0">Link Bank Account</h3>
                      <p className="text-sm text-gray-500 m-0">Connect your bank account</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-xl">chevron_right</span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#58761B] text-xl">credit_card</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1A3F22] m-0">Add Credit Card</h3>
                      <p className="text-sm text-gray-500 m-0">Add a new credit card</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-xl">chevron_right</span>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default LinkedAccounts;
