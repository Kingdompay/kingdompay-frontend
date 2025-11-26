import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Community = () => {
  const { user, groups, updateBalance, addTransaction, addNotification, updateGroup, hasRole, requestWithdrawal } = useAuth();
  const { formatCurrency, convertToUSD, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionRaw, setContributionRaw] = useState('');
  const [contributing, setContributing] = useState(false);
  const [joining, setJoining] = useState(false);

  // Open contribution modal
  const openContributeModal = (group) => {
    setSelectedGroup(group);
    setShowContributeModal(true);
    setShowGroupDetailsModal(false); // Close details modal if open
    setError('');
    setSuccess('');
    setContributionAmount('');
    setContributionRaw('');
  };

  const openGroupDetails = (group) => {
    setSelectedGroup(group);
    setShowGroupDetailsModal(true);
    setError('');
    setSuccess('');
  };

  const handleJoinGroup = async (group) => {
    setJoining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedMembers = [...(group.members || []), user.email];
      const updatedGroup = { ...group, members: updatedMembers };
      updateGroup(updatedGroup);

      setSelectedGroup(updatedGroup); // Update local selected group
      setSuccess(`You have joined ${group.name}!`);

      addNotification({
        type: 'community',
        title: 'Group Joined',
        message: `You successfully joined ${group.name}`,
        icon: 'groups',
        color: '#1A3F22'
      });
    } catch (err) {
      setError('Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleToggleBalanceVisibility = async (group) => {
    const updatedGroup = { ...group, balanceVisible: !group.balanceVisible };
    updateGroup(updatedGroup);
    setSelectedGroup(updatedGroup);
  };

  // Handle contribution
  const handleContribute = async () => {
    if (!contributionRaw || parseFloat(contributionRaw) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(contributionRaw);
    const amountInUSD = convertToUSD(amount);
    const currentBalance = Number(user?.balance || 0);

    if (currentBalance < amountInUSD) {
      setError('Insufficient funds in your wallet');
      return;
    }

    setContributing(true);
    setError('');

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Deduct from user balance
      updateBalance(currentBalance - amountInUSD);

      // 2. Update group balance
      const updatedGroup = { ...selectedGroup, balance: selectedGroup.balance + amountInUSD };
      updateGroup(updatedGroup);

      // 3. Add transaction
      addTransaction({
        type: 'community_contribution',
        description: `Contribution to ${selectedGroup.name}`,
        amount: amountInUSD,
        date: new Date().toISOString(),
        status: 'completed'
      });

      // 4. Add notification
      addNotification({
        type: 'community',
        title: 'Community Contribution',
        message: `You contributed ${formatCurrency(amountInUSD)} to ${selectedGroup.name}`,
        icon: 'groups',
        color: '#1A3F22'
      });

      setSuccess(`Successfully contributed ${formatCurrency(amountInUSD)} to ${selectedGroup.name}!`);

      // Update selectedGroup balance for modal display
      setSelectedGroup(updatedGroup);

      // Close modal after short delay
      setTimeout(() => {
        setShowContributeModal(false);
        setSelectedGroup(null);
        setContributionAmount('');
        setContributionRaw('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to contribute. Please try again.');
    } finally {
      setContributing(false);
    }
  };

  const handleWithdraw = (group) => {
    if (group.balance <= 0) {
      setError('Group has no funds to withdraw.');
      return;
    }

    // In a real app, we'd open a modal to ask for the amount. 
    // For now, we'll request the full balance.
    if (window.confirm(`Request withdrawal of ${formatCurrency(group.balance)} to your account? This requires Admin approval.`)) {
      requestWithdrawal({
        groupId: group.id,
        groupName: group.name,
        requesterId: user.email,
        amount: group.balance,
        currency: 'USD' // Internal currency
      });

      setSuccess('Withdrawal request submitted. Pending Admin approval.');
      setTimeout(() => setSuccess(''), 3000);
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

  const handleFormatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) {
      setContributionAmount('');
      setContributionRaw('');
      return;
    }
    setContributionRaw(number.toString());
    setContributionAmount(number.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }));
  };

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

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
              {['groups', 'feed', 'events'].map((tab) => (
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

              {/* Search Bar */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search for groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent shadow-sm"
                />
              </div>

              {/* Create Group Button - Only for Institutions */}
              {hasRole('institution') && (
                <div className="mb-6">
                  <Link to="/create-group" className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#14301a] transition-colors no-underline shadow-md">
                    <span className="material-symbols-outlined">add_circle</span>
                    Create New Group
                  </Link>
                </div>
              )}

              {loading ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-gray-500">Loading groups...</p></div>
              ) : error && (!groups || groups.length === 0) ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-red-500">{error}</p></div>
              ) : (!groups || groups.length === 0) ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"><p className="text-gray-500">No groups found</p></div>
              ) : (
                groups
                  .filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((group) => (
                    <div key={group.id} onClick={() => openGroupDetails(group)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
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
                            {/* Institution sees balance, User sees status */}
                            <div className="text-right">
                              {user?.email === group.ownerId ? (
                                <>
                                  <p className="text-xs text-gray-500 m-0">Balance</p>
                                  <p className="text-xl font-bold text-[#1A3F22] m-0">{formatCurrency(group.balance)}</p>
                                </>
                              ) : (
                                <>
                                  {group.balanceVisible ? (
                                    <>
                                      <p className="text-xs text-gray-500 m-0">Balance</p>
                                      <p className="text-xl font-bold text-[#1A3F22] m-0">{formatCurrency(group.balance)}</p>
                                    </>
                                  ) : (
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${group.members?.includes(user?.email) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {group.members?.includes(user?.email) ? 'Member' : 'Not Joined'}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
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

      {/* Group Details Modal */}
      {showGroupDetailsModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A3F22] m-0">Group Overview</h2>
              <button onClick={() => setShowGroupDetailsModal(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getGroupColor(selectedGroup.type)}`}>
                <span className="material-symbols-outlined text-4xl">{getGroupIcon(selectedGroup.type)}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A3F22] mb-1">{selectedGroup.name}</h3>
              <p className="text-gray-500 capitalize">{selectedGroup.type} • {selectedGroup.members?.length || 0} members</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-[#1A3F22] mb-2 text-sm">About</h4>
              <p className="text-gray-600 text-sm leading-relaxed m-0">{selectedGroup.description || 'No description provided.'}</p>
            </div>

            {user?.email === selectedGroup.ownerId ? (
              <div className="space-y-3">
                <div className="bg-[#E9F0E1] p-4 rounded-xl mb-4 text-center">
                  <p className="text-sm text-[#1A3F22] mb-1">Total Contributions</p>
                  <p className="text-2xl font-bold text-[#1A3F22]">{formatCurrency(selectedGroup.balance)}</p>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl mb-2">
                  <span className="text-sm font-medium text-gray-700">Show Balance to Members</span>
                  <button
                    onClick={() => handleToggleBalanceVisibility(selectedGroup)}
                    className={`w-12 h-6 rounded-full transition-colors relative border-none cursor-pointer ${selectedGroup.balanceVisible ? 'bg-[#1A3F22]' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${selectedGroup.balanceVisible ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>

                <button onClick={() => handleWithdraw(selectedGroup)} className="w-full bg-white text-[#1A3F22] border border-[#1A3F22] py-3 rounded-xl font-bold cursor-pointer hover:bg-gray-50 transition-colors">
                  Withdraw Funds
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedGroup.balanceVisible && (
                  <div className="bg-[#E9F0E1] p-4 rounded-xl mb-4 text-center">
                    <p className="text-sm text-[#1A3F22] mb-1">Group Balance</p>
                    <p className="text-2xl font-bold text-[#1A3F22]">{formatCurrency(selectedGroup.balance)}</p>
                  </div>
                )}

                {selectedGroup.members?.includes(user?.email) ? (
                  <button onClick={() => openContributeModal(selectedGroup)} className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-[#14301a] transition-colors shadow-md">
                    Contribute
                  </button>
                ) : (
                  <button onClick={() => handleJoinGroup(selectedGroup)} disabled={joining} className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300">
                    {joining ? 'Joining...' : 'Join Group'}
                  </button>
                )}
              </div>
            )}

            {success && (<div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">{success}</div>)}
          </div>
        </div>
      )}

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
              <input
                type="text"
                value={contributionAmount}
                onChange={(e) => handleFormatAmount(e.target.value)}
                placeholder={`Enter amount in ${currency}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent"
                disabled={contributing}
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Current Balance:</span><span className="font-medium text-gray-900">{formatCurrency(selectedGroup.balance)}</span></div>
              {contributionRaw && parseFloat(contributionRaw) > 0 && (
                <div className="flex justify-between text-sm"><span className="text-gray-600">New Balance:</span><span className="font-bold text-[#1A3F22]">{formatCurrency(selectedGroup.balance + convertToUSD(parseFloat(contributionRaw)))}</span></div>
              )}
            </div>
            <button onClick={handleContribute} disabled={contributing || !contributionRaw || parseFloat(contributionRaw) <= 0} className="w-full bg-[#1A3F22] text-white px-6 py-3 rounded-full font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
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