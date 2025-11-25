import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BottomNav from './BottomNav';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Contribution modal state
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributing, setContributing] = useState(false);

  // Fetch groups (used on mount and after contributions)
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/community/groups');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchGroups();
  }, []);

  // Open contribution modal
  const openContributeModal = (group) => {
    setSelectedGroup(group);
    setShowContributeModal(true);
    setError('');
    setSuccess('');
    setContributionAmount('');
  };

  // Handle contribution
  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setContributing(true);
    setError('');
    try {
      const response = await axios.post(`/api/community/groups/${selectedGroup.id}/contribute`, {
        amount: parseFloat(contributionAmount)
      });
      setSuccess(`Successfully contributed $${contributionAmount} to ${selectedGroup.name}!`);
      // Refresh groups to get updated balances
      await fetchGroups();
      // Update selectedGroup balance for modal display
      setSelectedGroup(prev => ({
        ...prev,
        balance: response.data.groupBalance
      }));
      // Close modal after short delay
      setTimeout(() => {
        setShowContributeModal(false);
        setSelectedGroup(null);
        setContributionAmount('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to contribute. Please try again.');
    } finally {
      setContributing(false);
    }
  };

  const getGroupIcon = (type) => {
    switch (type) {
      case 'church': return 'church';
      case 'family': return 'family_restroom';
      case 'sacco': return 'account_balance';
      default: return 'groups';
    }
  };

  const getGroupColor = (type) => {
    switch (type) {
      case 'church': return 'bg-purple-100 text-purple-600';
      case 'family': return 'bg-green-100 text-green-600';
      case 'sacco': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <style>{`\n        @keyframes fadeInUp {\n          from { opacity: 0; transform: translateY(30px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }\n      `}</style>

      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <Link to="/home" className="text-[#1A3F22] opacity-80 hover:opacity-100 transition-opacity no-underline">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
              </Link>
              <h1 className="text-xl font-bold text-[#1A3F22] m-0">Community</h1>
              <div className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] transition-colors">
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">search</span>
              </div>
            </div>
          </header>

          <div className="p-4">
            <div className="flex md:flex-col bg-gray-100 p-1 rounded-xl">
              {['feed', 'groups', 'events'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 capitalize border-none cursor-pointer ${activeTab === tab ? 'bg-white text-[#1A3F22] shadow-sm' : 'text-gray-500 hover:text-[#1A3F22]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] bg-gray-50 font-medium p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
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
          {/* Feed */}
          {activeTab === 'feed' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-center">Community feed coming soon...</p>
              </div>
            </div>
          )}

          {/* Groups */}
          {activeTab === 'groups' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up">
              {loading ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-gray-500">Loading groups...</p></div>
              ) : error && groups.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-red-500">{error}</p></div>
              ) : groups.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-gray-500">No groups found</p></div>
              ) : (
                groups.map((group) => (
                  <div key={group.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getGroupColor(group.type)}`}>
                        <span className="material-symbols-outlined text-2xl">{getGroupIcon(group.type)}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-[#1A3F22] text-lg m-0">{group.name}</h3>
                            <p className="text-xs text-gray-500 m-0 capitalize">{group.type} • {group.members?.length || 0} members</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 m-0">Balance</p>
                            <p className="text-xl font-bold text-[#1A3F22] m-0">${group.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                        <button onClick={() => openContributeModal(group)} className="bg-[#1A3F22] text-white px-6 py-2 rounded-full text-sm font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-sm">Contribute</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Events */}
          {activeTab === 'events' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-center">Events coming soon...</p></div>
            </div>
          )}
        </main>
      </div>

      {/* Contribution Modal */}
      {showContributeModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] m-0">Contribute to {selectedGroup.name}</h2>
              <button onClick={() => { setShowContributeModal(false); setSelectedGroup(null); setContributionAmount(''); setError(''); setSuccess(''); }} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {success && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>)}
            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>)}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent" disabled={contributing} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Current Balance:</span><span className="font-medium text-gray-900">${selectedGroup.balance.toFixed(2)}</span></div>
              {contributionAmount && parseFloat(contributionAmount) > 0 && (
                <div className="flex justify-between text-sm"><span className="text-gray-600">New Balance:</span><span className="font-bold text-[#1A3F22]">${(selectedGroup.balance + parseFloat(contributionAmount)).toFixed(2)}</span></div>
              )}
            </div>
            <button onClick={handleContribute} disabled={contributing || !contributionAmount || parseFloat(contributionAmount) <= 0} className="w-full bg-[#1A3F22] text-white px-6 py-3 rounded-full font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
              {contributing ? 'Contributing...' : 'Contribute'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav for mobile */}
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default Community;