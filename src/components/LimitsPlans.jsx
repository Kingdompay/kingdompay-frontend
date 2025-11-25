import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const LimitsPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use limits from user object or fallback to defaults
  const limits = user?.limits || {
    dailySpending: 1000,
    monthlySpending: 5000,
    transferLimit: 2500,
    atmWithdrawal: 500
  };

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

  const getStatusBadge = () => {
    const status = user?.verificationStatus || 'unverified';
    switch (status) {
      case 'verified':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">verified</span> Verified</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">hourglass_empty</span> Pending</span>;
      default:
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">error</span> Unverified</span>;
    }
  };

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

            {/* Verification Status Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#1A3F22] m-0">Account Status</h2>
                {getStatusBadge()}
              </div>
              <p className="text-gray-500 mb-4">
                {user?.verificationStatus === 'verified'
                  ? 'Your account is fully verified. You enjoy higher transaction limits.'
                  : 'Verify your identity to unlock higher transaction limits and premium features.'}
              </p>
              {user?.verificationStatus === 'unverified' && (
                <button
                  onClick={() => navigate('/verify-identity')}
                  className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold hover:bg-[#14301a] transition-colors border-none cursor-pointer"
                >
                  Verify Identity Now
                </button>
              )}
            </div>

            {/* Current Limits */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4">Current Limits</h2>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">Daily Spending</span>
                  <span className="text-[#6f9c16] font-bold">${(limits.daily || limits.dailySpending).toLocaleString()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <span className="font-medium">Monthly Spending</span>
                  <span className="text-[#6f9c16] font-bold">${(limits.monthly || limits.monthlySpending).toLocaleString()}</span>
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
