import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const LimitsPlans = () => {
  const navigate = useNavigate();
  const [limits] = useState({
    dailySpending: 1000,
    monthlySpending: 5000,
    transferLimit: 2500,
    atmWithdrawal: 500
  });

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 'Free',
      features: [
        'Up to $1,000 daily spending',
        'Up to $5,000 monthly spending',
        'Basic customer support',
        'Standard transaction fees'
      ],
      current: true
    },
    {
      id: 2,
      name: 'Premium',
      price: '$9.99/month',
      features: [
        'Up to $5,000 daily spending',
        'Up to $25,000 monthly spending',
        'Priority customer support',
        'Reduced transaction fees',
        'Advanced analytics'
      ],
      current: false
    },
    {
      id: 3,
      name: 'Pro',
      price: '$19.99/month',
      features: [
        'Unlimited daily spending',
        'Unlimited monthly spending',
        '24/7 premium support',
        'No transaction fees',
        'Advanced analytics & insights',
        'Priority features'
      ],
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 border-none rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Limits & Plans</h1>
              <div className="w-10 h-10" />
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
            </nav>
          </div>
        </div>
        {/* Main */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">
            {/* Current Limits */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4">Current Limits</h2>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">Daily Spending</span>
                  <span className="text-[#6f9c16] font-bold">${limits.dailySpending.toLocaleString()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">Monthly Spending</span>
                  <span className="text-[#6f9c16] font-bold">${limits.monthlySpending.toLocaleString()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">Transfer Limit</span>
                  <span className="text-[#6f9c16] font-bold">${limits.transferLimit.toLocaleString()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">ATM Withdrawal</span>
                  <span className="text-[#6f9c16] font-bold">${limits.atmWithdrawal.toLocaleString()}</span>
                </div>
              </div>
            </section>
            {/* Plans */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4">Available Plans</h2>
              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className={`border ${plan.current ? 'border-[#6f9c16] bg-[#f0f9ff]' : 'border-gray-200'} rounded-2xl p-4 relative`}>
                    {plan.current && (
                      <div className="absolute top-[-8px] left-5 bg-[#6f9c16] text-white px-3 py-1 rounded-full text-xs font-semibold">Current Plan</div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-[#1A3F22]">{plan.name}</h3>
                      <span className="text-[#6f9c16] font-semibold">{plan.price}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#1A3F22] mb-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center">
                          <span className="material-symbols-outlined text-[#6f9c16] mr-1" style={{ fontSize: '16px' }}>check_circle</span>{f}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <button className="w-full bg-[#6f9c16] text-white rounded-md py-2 font-medium hover:bg-[#5a7a12] transition-colors">
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default LimitsPlans;
