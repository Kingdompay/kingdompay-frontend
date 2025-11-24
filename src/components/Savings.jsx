import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Savings = () => {
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
              <Link to="/home" className="text-[#1A3F22] opacity-80 hover:opacity-100 transition-opacity no-underline">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
              </Link>
              <h1 className="text-xl font-bold text-[#1A3F22] m-0">Savings</h1>
              <div className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] transition-colors">
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">add</span>
              </div>
            </div>
          </header>

          {/* Total Savings Summary - Sidebar on Desktop */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-[#1A3F22] to-[#58761B] rounded-2xl p-6 text-white shadow-lg text-center">
              <p className="text-sm opacity-80 mb-1 m-0">Total Savings</p>
              <h2 className="text-3xl font-bold mb-4 m-0">$12,450.00</h2>
              <div className="flex justify-center gap-4 text-xs">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <span className="block font-bold">+12%</span>
                  <span className="opacity-70">this month</span>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <span className="block font-bold">$450</span>
                  <span className="opacity-70">interest</span>
                </div>
              </div>
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
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">

          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
            {/* Goals Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1A3F22] text-lg m-0">Your Goals</h3>
                <button className="text-[#58761B] text-sm font-medium bg-transparent border-none cursor-pointer hover:underline">See All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Goal Card 1 */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">directions_car</span>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">75%</span>
                  </div>
                  <h4 className="font-bold text-[#1A3F22] mb-1 m-0">New Car</h4>
                  <p className="text-xs text-gray-500 mb-3 m-0">Target: $20,000</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-[#1A3F22] font-medium text-right m-0">$15,000 saved</p>
                </div>

                {/* Goal Card 2 */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      <span className="material-symbols-outlined">flight_takeoff</span>
                    </div>
                    <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-1 rounded">30%</span>
                  </div>
                  <h4 className="font-bold text-[#1A3F22] mb-1 m-0">Europe Trip</h4>
                  <p className="text-xs text-gray-500 mb-3 m-0">Target: $5,000</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs text-[#1A3F22] font-medium text-right m-0">$1,500 saved</p>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h3 className="font-bold text-[#1A3F22] text-lg mb-4 m-0">Recent Activity</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {[
                  { title: 'Auto-save Deposit', date: 'Today', amount: '+$50.00', icon: 'savings' },
                  { title: 'Round-up from Starbucks', date: 'Yesterday', amount: '+$0.75', icon: 'monetization_on' },
                  { title: 'Goal Reached Bonus', date: 'Oct 24', amount: '+$10.00', icon: 'emoji_events' },
                ].map((item, i) => (
                  <div key={i} className="p-4 flex items-center justify-between border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center text-[#1A3F22]">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1A3F22] text-sm m-0">{item.title}</p>
                        <p className="text-xs text-gray-500 m-0">{item.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#1A3F22] text-sm">{item.amount}</span>
                  </div>
                ))}
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

export default Savings;