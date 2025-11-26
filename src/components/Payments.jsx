import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Payments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  // Use transactions from context
  const recentPayments = (user?.transactions || [])
    .filter(t => t.type === 'debit' || t.type === 'payment' || t.type === 'transfer')
    .slice(0, 5);

  const quickActions = [
    {
      icon: 'send',
      title: 'Send',
      description: 'Transfer money',
      color: '#1A3F22',
      path: '/send-money'
    },
    {
      icon: 'request_quote',
      title: 'Request',
      description: 'Ask for money',
      color: '#D99201',
      path: '/request-money'
    },
    {
      icon: 'qr_code_scanner',
      title: 'Scan QR',
      description: 'Scan to pay',
      color: '#58761B',
      path: '/scan-qr'
    },
    {
      icon: 'add_card',
      title: 'Add Money',
      description: 'Top up wallet',
      color: '#905A01',
      path: '/add-money'
    },
    {
      icon: 'payments',
      title: 'Withdraw',
      description: 'Cash out',
      color: '#D99201',
      path: '/withdraw-money'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-100px); }
            100% { transform: translateY(100px); }
          }
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
          .animate-scan {
             animation: scan 2s linear infinite;
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
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Payments</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Quick Actions - Sidebar on Desktop */}
          <div className="p-4">
            <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0 md:hidden">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: action.color }}
                  >
                    <span className="material-symbols-outlined text-white text-2xl">
                      {action.icon}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1A3F22] mb-1 m-0">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 m-0">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] bg-gray-50 font-medium p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">savings</span> Savings
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

            {/* QR Scanner Section */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Scan to Pay</h2>
              <div className="bg-black rounded-2xl p-10 text-center relative overflow-hidden">
                {/* QR Scanner Frame */}
                <div className="w-52 h-52 border-2 border-white rounded-xl mx-auto mb-5 relative bg-white/10">
                  {/* Corner indicators */}
                  <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-4 border-l-4 border-[#6f9c16]"></div>
                  <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-4 border-r-4 border-[#6f9c16]"></div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-4 border-l-4 border-[#6f9c16]"></div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-4 border-r-4 border-[#6f9c16]"></div>

                  {/* Scanning line animation */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#6f9c16] -translate-y-1/2 animate-scan"></div>
                </div>

                <p className="text-white text-sm mb-4 m-0">
                  Position QR code within the frame
                </p>

                <button
                  onClick={() => navigate('/scan-qr')}
                  className="bg-[#6f9c16] text-white border-none rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-[#5a8012] transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Payment Methods</h2>
              <div className="space-y-3">
                {/* Wallet */}
                <div
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center mr-3">
                      <span className="material-symbols-outlined text-[#58761B] text-xl">
                        account_balance_wallet
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1A3F22] m-0">KingdomPay Wallet</h3>
                      <p className="text-sm text-gray-500 m-0">Balance: {formatCurrency(user?.balance || 0)}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 border-[#6f9c16] flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-[#6f9c16]' : 'bg-transparent'}`}>
                    {paymentMethod === 'wallet' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>

                {/* Credit Card */}
                <div
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center mr-3">
                      <span className="material-symbols-outlined text-[#58761B] text-xl">
                        credit_card
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1A3F22] m-0">Visa •••• 1234</h3>
                      <p className="text-sm text-gray-500 m-0">Expires 12/25</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 border-[#6f9c16] flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[#6f9c16]' : 'bg-transparent'}`}>
                    {paymentMethod === 'card' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Payments */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4 m-0">Recent Payments</h2>
              <div className="space-y-3">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="material-symbols-outlined text-gray-500 text-xl">store</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#1A3F22] m-0">{payment.description}</h3>
                          <p className="text-xs text-gray-500 m-0">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold text-[#1A3F22] m-0">-{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-green-600 m-0 capitalize">{payment.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No recent payments</p>
                )}
              </div>
            </section>
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

export default Payments;
