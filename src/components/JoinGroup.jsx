import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const JoinGroup = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    console.log('Joining group with code:', inviteCode);
    navigate('/community');
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
                onClick={() => navigate('/community')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Join Group</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </div>
              <div onClick={() => navigate('/community')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </div>
              <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            <div className="text-center mb-10 pt-8">
              <div className="w-24 h-24 bg-[#E9F0E1] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#58761B] text-5xl">diversity_3</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1A3F22] mb-2">Join a Community</h2>
              <p className="text-gray-500">Enter the invite code to join an existing group</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-6 max-w-sm mx-auto">

              {/* Invite Code Input */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] mb-2 text-center">Invite Code</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KNG-1234"
                  className="w-full p-4 text-center text-2xl font-mono tracking-widest rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-[#6f9c16] outline-none transition-colors uppercase"
                  maxLength={8}
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start text-sm text-blue-800">
                <span className="material-symbols-outlined text-blue-600 mr-3 mt-0.5">info</span>
                <p>Ask the group admin for the invite code. It's usually found in the group settings.</p>
              </div>

              <button
                type="submit"
                disabled={!inviteCode}
                className="w-full py-4 rounded-xl bg-[#6f9c16] text-white font-bold text-lg shadow-lg hover:bg-[#5a8012] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
              >
                Join Group
              </button>

            </form>

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

export default JoinGroup;
