import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const LimitsPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  const getStatusBadge = () => {
    const status = user?.verificationStatus || 'unverified';
    switch (status) {
      case 'verified':
        return <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">verified</span> Verified</span>;
      case 'pending':
        return <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">hourglass_empty</span> Pending</span>;
      default:
        return <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold flex items-center"><span className="material-symbols-outlined text-sm mr-1">error</span> Unverified</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 dark:bg-[#1A2E1D] border-none rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Account Limits</h1>
              <div className="w-10 h-10" />
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
            </nav>
          </div>
        </div>
        {/* Main */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">

            {/* Verification Status Banner */}
            <div className="bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Account Status</h2>
                {getStatusBadge()}
              </div>
              <p className="text-gray-500 dark:text-[#A8C4A8] mb-4">
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
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Transaction Limits</h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-2xl p-5 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-2xl">today</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Daily Limit</h3>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Maximum per day</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                        KES {user?.verificationStatus === 'verified' ? '250,000' : '50,000'}
                      </p>
                      <p className={`text-xs font-medium m-0 ${user?.verificationStatus === 'verified' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {user?.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-2xl p-5 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-2xl">calendar_month</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Monthly Limit</h3>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Maximum per month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                        {user?.verificationStatus === 'verified' ? 'Unlimited' : 'KES 1,500,000'}
                      </p>
                      <p className={`text-xs font-medium m-0 ${user?.verificationStatus === 'verified' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {user?.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">info</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">About Limits</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {user?.verificationStatus === 'verified'
                        ? 'As a verified user, you enjoy higher daily limits with no monthly cap. You can transact up to KES 250,000 per day.'
                        : 'Verify your identity to unlock higher limits. Verified users get KES 250,000 daily with unlimited monthly transactions.'}
                    </p>
                  </div>
                </div>
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


