import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Referrals = () => {
  const navigate = useNavigate();
  const [referralCode] = useState('KINGDOM123');
  const [referrals] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      status: 'completed',
      reward: '$10',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.c@email.com',
      status: 'pending',
      reward: '$10',
      date: '2024-01-20'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      status: 'completed',
      reward: '$10',
      date: '2024-01-25'
    }
  ]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    console.log('Referral code copied to clipboard');
  };

  const shareReferral = () => {
    const shareText = `Join KingdomPay with my referral code: ${referralCode}. Get $10 when you sign up!`;
    if (navigator.share) {
      navigator.share({
        title: 'Join KingdomPay',
        text: shareText,
        url: 'https://kingdompay.com'
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
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
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Referrals</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Referral Stats */}
            <div className="bg-gradient-to-br from-[#1A3F22] via-[#58761B] to-[#D99201] rounded-2xl p-6 text-white text-center mb-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2 m-0">$30 Earned</h2>
              <p className="text-sm opacity-90 mb-4 m-0">Total referral rewards</p>
              <div className="flex justify-around">
                <div>
                  <p className="text-lg font-bold m-0">3</p>
                  <p className="text-xs opacity-80 m-0">Referrals</p>
                </div>
                <div>
                  <p className="text-lg font-bold m-0">$10</p>
                  <p className="text-xs opacity-80 m-0">Per Referral</p>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="bg-gray-50 dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-200 dark:border-[#2D4A32] mb-6 transition-colors duration-300">
              <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-3 m-0">Your Referral Code</h3>
              <div className="flex items-center justify-between bg-white dark:bg-[#243B28] border-2 border-gray-200 dark:border-[#2D4A32] rounded-xl p-3 mb-4">
                <span className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] tracking-widest">{referralCode}</span>
                <button
                  onClick={copyReferralCode}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2E1D] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#2F4D33] transition-colors border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-lg">content_copy</span>
                </button>
              </div>
              <button
                onClick={shareReferral}
                className="w-full bg-[#6f9c16] text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                Share Referral
              </button>
            </div>

            {/* How It Works */}
            <div className="bg-gray-50 dark:bg-[#1A2E1D] rounded-2xl p-5 border border-gray-200 dark:border-[#2D4A32] mb-6 transition-colors duration-300">
              <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4 m-0">How It Works</h3>
              <div className="space-y-3">
                {[
                  { id: 1, text: 'Share your referral code with friends' },
                  { id: 2, text: 'They sign up and complete verification' },
                  { id: 3, text: 'You both earn $10 in rewards!' }
                ].map((step) => (
                  <div key={step.id} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6f9c16] text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                      {step.id}
                    </div>
                    <p className="text-sm text-[#1A3F22] dark:text-[#E8F5E8] m-0">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral History */}
            <div>
              <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4 m-0">Referral History</h3>
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl p-4 flex items-center justify-between transition-colors duration-300"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-1 m-0">{referral.name}</p>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{referral.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold mb-1 m-0 ${referral.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {referral.reward}
                      </p>
                      <p className={`text-xs capitalize m-0 ${referral.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {referral.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Referrals;


