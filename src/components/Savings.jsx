import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { contributeToGoal, withdrawFromGoal, getSavingsGoals } from '../services/api';

const Savings = () => {
  const { user, wallet, refreshWallet, addTransaction, addNotification } = useAuth();
  const { formatCurrency, convertToUSD, currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState([]);

  // Fetch savings goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await getSavingsGoals();
        if (response.success) {
          setGoals(response.goals || []);
        }
      } catch (err) {
        console.error('Failed to fetch savings goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // Calculate total goals value
  const totalGoalsValue = goals.reduce((acc, goal) => acc + parseFloat(goal.current_amount || goal.currentAmount || 0), 0);

  // Filter transactions for savings related ones
  const transactions = (user?.transactions || []).filter(t => t.type === 'savings_deposit' || t.type === 'savings_withdrawal' || t.type === 'goal_contribution' || t.type === 'goal_withdrawal').slice(0, 5);

  // Contribution state
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionRaw, setContributionRaw] = useState(''); // Store raw number for logic
  const [contributing, setContributing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contributeType, setContributeType] = useState(''); // 'savings' or 'goal'

  // Withdrawal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalRaw, setWithdrawalRaw] = useState(''); // Store raw number for logic
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawType, setWithdrawType] = useState(''); // 'savings' or 'goal'

  const handleContribute = async () => {
    if (!contributionRaw || parseFloat(contributionRaw) <= 0) return;

    const amount = parseFloat(contributionRaw);

    if (contributeType === 'goal') {
      if (!selectedGoal) {
        setError('Please select a goal');
        return;
      }
      if (selectedGoal.current_amount >= selectedGoal.target_amount) {
        setError('This goal has already been reached!');
        return;
      }
    } else {
      setError('Please select a savings goal to contribute to');
      return;
    }

    setContributing(true);
    setError('');
    setSuccess('');

    try {
      // Deposit from wallet to savings goal
      const response = await contributeToGoal(selectedGoal.id, amount);
      
      if (response.success) {
        setSuccess('Contribution successful!');
        
        // Refresh wallet balance and goals
        if (refreshWallet) {
          await refreshWallet();
        }
        
        // Refresh goals list
        const goalsResponse = await getSavingsGoals();
        if (goalsResponse.success) {
          setGoals(goalsResponse.goals || []);
        }
        
        addNotification({
          type: 'savings',
          title: 'Goal Contribution',
          message: `You deposited ${formatCurrency(amount)} to ${selectedGoal.name}`,
          icon: 'savings',
          color: '#1A3F22'
        });

        setTimeout(() => {
          setShowContributeModal(false);
          setSelectedGoal(null);
          setContributionAmount('');
          setContributionRaw('');
          setSuccess('');
          setContributeType('');
        }, 1500);
      } else {
        setError(response.message || 'Contribution failed');
      }
    } catch (err) {
      console.error('Contribution error:', err);
      setError(err.response?.data?.message || 'Contribution failed. Please try again.');
    } finally {
      setContributing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawalRaw || parseFloat(withdrawalRaw) <= 0) return;

    const amount = parseFloat(withdrawalRaw);

    if (withdrawType === 'goal') {
      if (!selectedGoal) {
        setError('Please select a goal');
        return;
      }
      const currentAmount = selectedGoal.current_amount || selectedGoal.currentAmount || 0;
      if (currentAmount < amount) {
        setError('Insufficient funds in this goal');
        return;
      }
    } else {
      setError('Please select a savings goal to withdraw from');
      return;
    }

    setWithdrawing(true);
    setError('');
    setSuccess('');

    try {
      // Withdraw from savings goal back to wallet
      const response = await withdrawFromGoal(selectedGoal.id, amount);
      
      if (response.success) {
        setSuccess('Withdrawal successful!');
        
        // Refresh wallet balance and goals
        if (refreshWallet) {
          await refreshWallet();
        }
        
        // Refresh goals list
        const goalsResponse = await getSavingsGoals();
        if (goalsResponse.success) {
          setGoals(goalsResponse.goals || []);
        }
        
        addNotification({
          type: 'savings',
          title: 'Goal Withdrawal',
          message: `You withdrew ${formatCurrency(amount)} from ${selectedGoal.name} to your wallet`,
          icon: 'savings',
          color: '#D99201'
        });

        setTimeout(() => {
          setShowWithdrawModal(false);
          setSelectedGoal(null);
          setWithdrawalAmount('');
          setWithdrawalRaw('');
          setSuccess('');
          setWithdrawType('');
        }, 1500);
      } else {
        setError(response.message || 'Withdrawal failed');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleFormatAmount = (value, setFormatted, setRaw) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) {
      setFormatted('');
      setRaw('');
      return;
    }
    setRaw(number.toString());
    setFormatted(number.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }));
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
              <Link to="/home" className="text-[#1A3F22] dark:text-[#E8F5E8] opacity-80 hover:opacity-100 transition-opacity no-underline">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
              </Link>
              <h1 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Savings</h1>
              <Link to="/create-goal" className="w-10 h-10 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] dark:hover:bg-[#1A2E1D] transition-colors no-underline">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">add</span>
              </Link>
            </div>
          </header>

          {/* Total Savings Summary - Sidebar on Desktop */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-[#1A3F22] to-[#58761B] rounded-2xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-80 mb-1 m-0">Savings Wallet</p>
              <h2 className="text-3xl font-bold mb-1 m-0">
                {loading ? '...' : formatCurrency(totalGoalsValue)}
              </h2>
              <p className="text-xs opacity-70 mb-4 m-0">Available to allocate</p>

              <div className="flex gap-2">
                <button
                  onClick={() => { setContributeType('savings'); setShowContributeModal(true); }}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer"
                >
                  Deposit
                </button>
                <button
                  onClick={() => { setWithdrawType('savings'); setShowWithdrawModal(true); }}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer"
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="mt-4 bg-white dark:bg-[#1A2E1D] border border-gray-100 dark:border-[#2D4A32] rounded-xl p-4 shadow-sm transition-colors duration-300">
              <p className="text-xs text-gray-500 dark:text-[#A8C4A8] mb-1 m-0">Total in Goals</p>
              <h3 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">{formatCurrency(totalGoalsValue)}</h3>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] bg-gray-50 dark:bg-[#1A2E1D] font-medium p-3 rounded-xl transition-colors no-underline">
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

          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
            {/* Goals Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-lg m-0">Your Goals</h3>
                <button className="text-[#58761B] dark:text-[#81C784] text-sm font-medium bg-transparent border-none cursor-pointer hover:underline">See All</button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500">Loading goals...</p>
              ) : goals.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-[#1A2E1D] rounded-xl border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                  <p className="text-gray-500 dark:text-[#A8C4A8] mb-4">No savings goals yet.</p>
                  <Link to="/create-goal" className="bg-[#1A3F22] dark:bg-[#E9F0E1] text-white dark:text-[#1A3F22] px-6 py-2 rounded-full text-sm font-medium no-underline inline-block">Create Goal</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <span className="material-symbols-outlined">{goal.icon || 'savings'}</span>
                        </div>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                          {Math.round(((goal.current_amount || goal.currentAmount || 0) / (goal.target_amount || goal.targetAmount || 1)) * 100)}%
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-1 m-0">{goal.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-[#A8C4A8] mb-3 m-0">Target: {formatCurrency(goal.target_amount || goal.targetAmount || 0)}</p>
                      <div className="w-full bg-gray-100 dark:bg-[#243B28] rounded-full h-2 mb-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(((goal.current_amount || goal.currentAmount || 0) / (goal.target_amount || goal.targetAmount || 1)) * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-[#1A3F22] dark:text-[#E8F5E8] font-medium text-right m-0 mb-3">{formatCurrency(goal.current_amount || goal.currentAmount || 0)} saved</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedGoal(goal); setContributeType('goal'); setShowContributeModal(true); }}
                          className="flex-1 bg-[#E9F0E1] dark:bg-[#243B28] text-[#1A3F22] dark:text-[#E8F5E8] py-2 rounded-lg text-sm font-medium hover:bg-[#dce8d0] dark:hover:bg-[#1A2E1D] transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={(goal.current_amount || goal.currentAmount || 0) >= (goal.target_amount || goal.targetAmount || 0)}
                        >
                          {(goal.current_amount || goal.currentAmount || 0) >= (goal.target_amount || goal.targetAmount || 0) ? 'Completed' : 'Add Money'}
                        </button>
                        <button
                          onClick={() => { setSelectedGoal(goal); setWithdrawType('goal'); setShowWithdrawModal(true); }}
                          className="flex-1 bg-gray-100 dark:bg-[#2A3F2E] text-gray-700 dark:text-[#A8C4A8] py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3A5A3F] transition-colors border-none cursor-pointer"
                          disabled={(goal.current_amount || goal.currentAmount || 0) <= 0}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Activity */}
            <section>
              <h3 className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-lg mb-4 m-0">Recent Activity</h3>
              <div className="bg-white dark:bg-[#1A2E1D] rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] overflow-hidden transition-colors duration-300">
                {loading ? (
                  <p className="p-4 text-center text-gray-500">Loading activity...</p>
                ) : transactions.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">No recent activity</p>
                ) : (
                  transactions.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-[#2D4A32] last:border-none hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center text-[#1A3F22] dark:text-[#E8F5E8]">
                          <span className="material-symbols-outlined text-xl">
                            {item.type.includes('deposit') || item.type.includes('withdrawal') && item.type.includes('goal') ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#1A3F22] dark:text-[#E8F5E8] text-sm m-0">{item.description}</p>
                          <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${item.type.includes('deposit') || item.type.includes('withdrawal') && item.type.includes('goal') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type.includes('deposit') || item.type.includes('withdrawal') && item.type.includes('goal') ? '+' : '-'}{formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Contribution Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                {contributeType === 'savings' ? 'Deposit to Savings Wallet' : `Add to ${selectedGoal?.name}`}
              </h2>
              <button onClick={() => { setShowContributeModal(false); setSelectedGoal(null); setContributionAmount(''); setContributionRaw(''); setError(''); setSuccess(''); setContributeType(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {success && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>)}
            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>)}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-2">Amount</label>
              <input
                type="text"
                value={contributionAmount}
                onChange={(e) => handleFormatAmount(e.target.value, setContributionAmount, setContributionRaw)}
                placeholder={`Enter amount in ${currency}`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#2D4A32] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] dark:focus:ring-[#58761B] focus:border-transparent bg-[#E5EBE3] dark:bg-[#0D1B0F] text-gray-900 dark:text-[#E8F5E8]"
                disabled={contributing}
              />
            </div>

            <div className="bg-[#E5EBE3] dark:bg-[#0a150c] p-4 rounded-lg mb-4 text-gray-700 dark:text-[#A8C4A8]">
              {contributeType === 'savings' ? (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Main Wallet Balance:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency(user?.balance || 0)}</span></div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Savings Wallet Balance:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency(savingsBalance)}</span></div>
                  {contributionRaw && parseFloat(contributionRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-[#2D4A32]"><span className="text-gray-600 dark:text-[#A8C4A8]">New Savings Balance:</span><span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency(savingsBalance + convertToUSD(parseFloat(contributionRaw)))}</span></div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Main Wallet Balance:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency(wallet?.balance || user?.balance || 0)}</span></div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Goal Current:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency((selectedGoal?.current_amount || selectedGoal?.currentAmount || 0))}</span></div>
                  {contributionRaw && parseFloat(contributionRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-[#2D4A32]"><span className="text-gray-600 dark:text-[#A8C4A8]">New Goal Total:</span><span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency((selectedGoal?.current_amount || selectedGoal?.currentAmount || 0) + parseFloat(contributionRaw))}</span></div>
                  )}
                </>
              )}
            </div>

            <button onClick={handleContribute} disabled={contributing || !contributionRaw || parseFloat(contributionRaw) <= 0} className="w-full bg-[#1A3F22] text-white px-6 py-3 rounded-full font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
              {contributing ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">
                {withdrawType === 'savings' ? 'Withdraw to Main Wallet' : `Withdraw from ${selectedGoal?.name}`}
              </h2>
              <button onClick={() => { setShowWithdrawModal(false); setSelectedGoal(null); setWithdrawalAmount(''); setWithdrawalRaw(''); setError(''); setSuccess(''); setWithdrawType(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {success && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>)}
            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>)}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-2">Amount</label>
              <input
                type="text"
                value={withdrawalAmount}
                onChange={(e) => handleFormatAmount(e.target.value, setWithdrawalAmount, setWithdrawalRaw)}
                placeholder={`Enter amount in ${currency}`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#2D4A32] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] dark:focus:ring-[#58761B] focus:border-transparent bg-[#E5EBE3] dark:bg-[#0D1B0F] text-gray-900 dark:text-[#E8F5E8]"
                disabled={withdrawing}
              />
            </div>
            <div className="bg-[#E5EBE3] dark:bg-[#0a150c] p-4 rounded-lg mb-4 text-gray-700 dark:text-[#A8C4A8]">
              {withdrawType === 'goal' && selectedGoal ? (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Available in Goal:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency((selectedGoal?.current_amount || selectedGoal?.currentAmount || 0))}</span></div>
                  {withdrawalRaw && parseFloat(withdrawalRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-[#2D4A32]"><span className="text-gray-600 dark:text-[#A8C4A8]">Remaining in Goal:</span><span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency((selectedGoal?.current_amount || selectedGoal?.currentAmount || 0) - parseFloat(withdrawalRaw))}</span></div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-[#A8C4A8]">Main Wallet Balance:</span><span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{formatCurrency(wallet?.balance || user?.balance || 0)}</span></div>
                  {withdrawalRaw && parseFloat(withdrawalRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-[#2D4A32]"><span className="text-gray-600 dark:text-[#A8C4A8]">Remaining in Savings:</span><span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">{formatCurrency(savingsBalance - convertToUSD(parseFloat(withdrawalRaw)))}</span></div>
                  )}
                </>
              )}
            </div>
            <button onClick={handleWithdraw} disabled={withdrawing || !withdrawalRaw || parseFloat(withdrawalRaw) <= 0} className="w-full bg-[#1A3F22] text-white px-6 py-3 rounded-full font-medium border-none cursor-pointer hover:bg-[#14301a] transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
              {withdrawing ? 'Processing...' : 'Withdraw Money'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Savings;

