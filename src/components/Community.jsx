import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import BottomNav from './BottomNav';
import api, { generateInviteLink, getCommunityMembers } from '../services/api';

const Community = () => {
  const navigate = useNavigate();
  const { user, communities, refreshCommunities, kycStatus, isVerified } = useAuth();
  const { formatCurrency, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  // Form state for creating community
  const [formData, setFormData] = useState({
    name: '',
    type: 'OTHER',
    slug: '',
    description: ''
  });

  // Modal states
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributing, setContributing] = useState(false);
  const [lastInviteCode, setLastInviteCode] = useState('');

  const communityTypes = [
    { value: 'CHURCH', label: 'Church', icon: 'church' },
    { value: 'CLAN', label: 'Clan/Family', icon: 'diversity_3' },
    { value: 'SACCO', label: 'SACCO', icon: 'account_balance' },
    { value: 'NGO', label: 'NGO/Charity', icon: 'volunteer_activism' },
    { value: 'OTHER', label: 'Other', icon: 'groups' },
  ];

  // isVerified is now provided by useAuth hook

  useEffect(() => {
    const loadCommunities = async () => {
      if (refreshCommunities) {
        setLoading(true);
        try {
          await refreshCommunities();
        } catch (err) {
          console.error('Failed to load communities:', err);
          setError('Failed to load communities');
        } finally {
          setLoading(false);
        }
      }
    };
    loadCommunities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setError('');
    setCreateLoading(true);

    try {
      const response = await api.post('/communities', {
        name: formData.name,
        type: formData.type,
        slug: formData.slug || undefined,
        settings_json: formData.description ? { description: formData.description } : undefined
      });

      if (response.data.success) {
        const communityId = response.data.community?.id;
        let inviteCode = '';

        // Generate an invite token for this new community
        if (communityId) {
          try {
            const inviteRes = await generateInviteLink(communityId);
            inviteCode = inviteRes.invite?.token || '';
            setLastInviteCode(inviteCode);
          } catch (inviteErr) {
            console.error('Failed to generate invite link:', inviteErr);
          }
        }

        setShowCreateModal(false);
        setFormData({ name: '', type: 'OTHER', slug: '', description: '' });
        setSuccess(
          inviteCode
            ? `Community created! Share this invite code so others can join: ${inviteCode}`
            : 'Community created successfully!'
        );
        if (refreshCommunities) {
          await refreshCommunities();
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to create community');
      }
    } catch (err) {
      console.error('Failed to create community:', err);
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinCommunity = async (e) => {
    e.preventDefault();
    setError('');
    setCreateLoading(true);

    try {
      const response = await api.post('/communities/join', { token: joinCode });

      if (response.data.success) {
        setShowJoinModal(false);
        setJoinCode('');
        setSuccess('Successfully joined the community!');
        if (refreshCommunities) {
          await refreshCommunities();
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Invalid or expired invite code');
      }
    } catch (err) {
      console.error('Failed to join community:', err);
      setError(err.response?.data?.message || 'Invalid or expired invite code');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setContributing(true);
    setError('');

    try {
      const response = await api.post(`/communities/${selectedCommunity.id}/contributions`, {
        amount: parseFloat(contributionAmount),
        description: `Contribution to ${selectedCommunity.name}`
      });

      if (response.data.success) {
        setSuccess(`Successfully contributed ${formatCurrency(parseFloat(contributionAmount))}!`);
        setContributionAmount('');
        setShowContributeModal(false);
        if (refreshCommunities) {
          await refreshCommunities();
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Contribution failed');
      }
    } catch (err) {
      console.error('Contribution failed:', err);
      setError(err.response?.data?.message || 'Contribution failed. Please try again.');
    } finally {
      setContributing(false);
    }
  };

  const openCommunityDetails = (community) => {
    setSelectedCommunity(community);
    setShowCommunityModal(true);
    setError('');
    setSuccess('');
  };

  const getTypeIcon = (type) => {
    const found = communityTypes.find(t => t.value === type);
    return found ? found.icon : 'groups';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'CHURCH': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'CLAN': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'SACCO': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'NGO': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const filteredCommunities = communities?.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <Link to="/home" className="text-[#1A3F22] dark:text-[#E8F5E8] opacity-80 hover:opacity-100 transition-opacity no-underline">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
              </Link>
              <h1 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Community</h1>
              <div className="w-10"></div>
            </div>
          </header>

          <div className="p-4">
            <div className="flex md:flex-col bg-gray-100 dark:bg-[#1A2E1D] p-1 rounded-xl transition-colors duration-300">
              {['groups', 'feed', 'events'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 capitalize border-none cursor-pointer ${activeTab === tab ? 'bg-white dark:bg-[#243B28] text-[#1A3F22] dark:text-[#E8F5E8] shadow-sm' : 'text-gray-500 dark:text-[#A8C4A8] hover:text-[#1A3F22] dark:hover:text-[#E8F5E8]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] bg-gray-50 dark:bg-[#1A2E1D] font-medium p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">savings</span> Savings
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-4 text-center"
            >
              <div className="flex flex-col gap-1 items-center">
                <span>{success}</span>
                {lastInviteCode && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(lastInviteCode)}
                    className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-mono tracking-wider border-none cursor-pointer hover:bg-green-700"
                  >
                    <span>{lastInviteCode}</span>
                    <span className="material-symbols-outlined text-xs">content_copy</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up">

              {/* Search Bar */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A2E1D] border border-gray-100 dark:border-[#2D4A32] focus:outline-none focus:ring-2 focus:ring-[#1A3F22] dark:focus:ring-[#58761B] focus:border-transparent shadow-sm text-gray-900 dark:text-[#E8F5E8] transition-colors duration-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="flex-1 bg-gray-200 dark:bg-[#1A2E1D] text-gray-700 dark:text-[#E8F5E8] py-3 rounded-xl font-medium border-none cursor-pointer hover:bg-gray-300 dark:hover:bg-[#243B28] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Join
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 bg-[#1A3F22] text-white py-3 rounded-xl font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create
                </button>
              </div>

              {/* Communities List */}
              {loading ? (
                <div className="bg-white dark:bg-[#1A2E1D] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                  <div className="w-12 h-12 border-4 border-[#1A3F22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-[#A8C4A8]">Loading communities...</p>
                </div>
              ) : filteredCommunities.length === 0 ? (
                <div className="bg-white dark:bg-[#1A2E1D] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-[#243B28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-gray-400 dark:text-[#6b7280] text-4xl">groups</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">
                    {searchQuery ? 'No communities found' : 'No communities yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-[#A8C4A8] mb-4">
                    {searchQuery ? 'Try a different search term' : 'Create or join a community to get started'}
                  </p>
                </div>
              ) : (
                filteredCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openCommunityDetails(community)}
                    className="bg-white dark:bg-[#1A2E1D] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] cursor-pointer hover:shadow-md transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#243B28]"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getTypeColor(community.type)}`}>
                        <span className="material-symbols-outlined text-2xl">{getTypeIcon(community.type)}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-lg m-0">{community.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0 capitalize">{community.type?.toLowerCase()}</p>
                          </div>
                          {community.owner_user_id === user?.id && (
                            <span className="bg-[#D99201]/20 text-[#D99201] text-xs px-2 py-1 rounded-full font-medium">Owner</span>
                          )}
                        </div>
                        {community.settings_json?.description && (
                          <p className="text-sm text-gray-600 dark:text-[#A8C4A8] line-clamp-2">{community.settings_json.description}</p>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-gray-400 dark:text-[#6b7280]">chevron_right</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-white dark:bg-[#1A2E1D] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                <span className="material-symbols-outlined text-gray-400 dark:text-[#6b7280] text-5xl mb-4">feed</span>
                <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Community Feed</h3>
                <p className="text-gray-500 dark:text-[#A8C4A8]">Coming soon...</p>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-white dark:bg-[#1A2E1D] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] text-center transition-colors duration-300">
                <span className="material-symbols-outlined text-gray-400 dark:text-[#6b7280] text-5xl mb-4">event</span>
                <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Community Events</h3>
                <p className="text-gray-500 dark:text-[#A8C4A8]">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#0D1B0F] rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1A3F22] to-[#58761B] p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Create Community</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateCommunity} className="p-6 space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B]"
                    placeholder="e.g., St. Mary's Church"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {communityTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${formData.type === type.value
                          ? 'border-[#1A3F22] bg-[#E9F0E1] dark:bg-[#1A3F22]/30'
                          : 'border-gray-200 dark:border-[#2D4A32] hover:border-gray-300 dark:hover:border-[#3D5A42]'
                          }`}
                      >
                        <span className={`material-symbols-outlined text-xl ${formData.type === type.value ? 'text-[#1A3F22] dark:text-[#81C784]' : 'text-gray-500 dark:text-gray-400'}`}>
                          {type.icon}
                        </span>
                        <span className={`text-xs font-medium ${formData.type === type.value ? 'text-[#1A3F22] dark:text-[#81C784]' : 'text-gray-600 dark:text-gray-400'}`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] resize-none"
                    rows={3}
                    placeholder="Brief description of your community..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading || !formData.name}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>Create Community</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Community Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#0D1B0F] rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#D99201] to-[#905A01] p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Join Community</h3>
                  <button onClick={() => setShowJoinModal(false)} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleJoinCommunity} className="p-6 space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-[#D99201]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[#D99201] text-3xl">qr_code_scanner</span>
                  </div>
                  <p className="text-gray-500 dark:text-[#A8C4A8] text-sm">
                    Enter the invite code shared by the community admin
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Invite Code</label>
                  <input
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D99201] text-center text-lg font-mono tracking-wider"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading || !joinCode}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D99201] to-[#905A01] hover:from-[#b37801] hover:to-[#6d4401] text-white font-bold transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>Join Community</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Details Modal */}
      <AnimatePresence>
        {showCommunityModal && selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCommunityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Community Details</h2>
                <button onClick={() => setShowCommunityModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getTypeColor(selectedCommunity.type)}`}>
                  <span className="material-symbols-outlined text-4xl">{getTypeIcon(selectedCommunity.type)}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-1">{selectedCommunity.name}</h3>
                <p className="text-gray-500 dark:text-[#A8C4A8] capitalize">{selectedCommunity.type?.toLowerCase()}</p>
              </div>

              {selectedCommunity.settings_json?.description && (
                <div className="bg-[#E5EBE3] dark:bg-[#0a150c] p-4 rounded-xl mb-6 transition-colors duration-300">
                  <h4 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2 text-sm">About</h4>
                  <p className="text-gray-600 dark:text-[#A8C4A8] text-sm leading-relaxed m-0">{selectedCommunity.settings_json.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCommunityModal(false);
                    setShowContributeModal(true);
                  }}
                  className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-[#14301a] transition-colors shadow-md border-none flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">volunteer_activism</span>
                  Contribute
                </button>

                {selectedCommunity.owner_user_id === user?.id && (
                  <button
                    onClick={() => navigate(`/community/${selectedCommunity.id}/settings`)}
                    className="w-full bg-gray-200 dark:bg-[#243B28] text-gray-700 dark:text-[#E8F5E8] py-3 rounded-xl font-bold cursor-pointer hover:bg-gray-300 dark:hover:bg-[#2D4A32] transition-colors border-none flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">settings</span>
                    Manage Community
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contribute Modal */}
      <AnimatePresence>
        {showContributeModal && selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowContributeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Contribute to {selectedCommunity.name}</h2>
                <button onClick={() => { setShowContributeModal(false); setContributionAmount(''); setError(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {error && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">{error}</div>)}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-2">Amount ({currency})</label>
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#2D4A32] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] dark:focus:ring-[#58761B] focus:border-transparent bg-[#E5EBE3] dark:bg-[#0D1B0F] text-gray-900 dark:text-[#E8F5E8]"
                  disabled={contributing}
                />
              </div>

              <button
                onClick={handleContribute}
                disabled={contributing || !contributionAmount || parseFloat(contributionAmount) <= 0}
                className="w-full bg-[#1A3F22] text-white px-6 py-3 rounded-xl font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {contributing ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  'Contribute'
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav for mobile */}
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default Community;
