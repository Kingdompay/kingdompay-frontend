import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { createGroup, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'savings', // savings, expense, trip
    targetAmount: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGroup = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
      balance: 0,
      members: [user?.id],
      createdAt: new Date().toISOString()
    };

    createGroup(newGroup);
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
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Create Group</h1>
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

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#E9F0E1] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#58761B] text-4xl">group_add</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1A3F22]">Create New Group</h2>
              <p className="text-gray-500">Start a community for savings or expenses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] mb-2">Group Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Family Vacation"
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#6f9c16] outline-none transition-colors"
                  required
                />
              </div>

              {/* Group Type */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] mb-2">Group Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['savings', 'expense', 'trip'].map((type) => (
                    <div
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer capitalize transition-all ${formData.type === type
                        ? 'border-[#6f9c16] bg-green-50 text-[#1A3F22] font-bold'
                        : 'border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this group for?"
                  rows={3}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#6f9c16] outline-none transition-colors resize-none"
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium text-[#1A3F22] mb-2">Target Amount (Optional)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#6f9c16] outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#6f9c16] text-white font-bold text-lg shadow-lg hover:bg-[#5a8012] transition-all mt-8"
              >
                Create Group
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

export default CreateGroup;
