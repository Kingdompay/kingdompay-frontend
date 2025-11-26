import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Savings = () => {
  const { user, updateBalance, updateSavingsBalance, addTransaction, addNotification, updateSavingsGoal } = useAuth();
  const { formatCurrency, convertToUSD, currency } = useCurrency();
  const [loading, setLoading] = useState(false);

  // Use data from context
  const savingsBalance = user?.savingsBalance || 0;
  const goals = user?.savingsGoals || [];
  const totalGoalsValue = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);

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
    const amountInUSD = convertToUSD(amount);

    if (contributeType === 'savings') {
      const currentBalance = Number(user?.balance || 0);
      if (currentBalance < amountInUSD) {
        setError('Insufficient funds in your main wallet');
        return;
      }
    } else if (contributeType === 'goal') {
      if (!selectedGoal) {
        setError('Please select a goal');
        return;
      }
      if (savingsBalance < amountInUSD) {
        setError('Insufficient funds in your savings wallet');
        return;
      }
      if (selectedGoal.currentAmount >= selectedGoal.targetAmount) {
        setError('This goal has already been reached!');
        return;
      }
    }

    setContributing(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (contributeType === 'savings') {
        // Main -> Savings Wallet
        updateBalance(Number(user?.balance || 0) - amountInUSD);
        updateSavingsBalance(savingsBalance + amountInUSD);

        addTransaction({
          type: 'savings_deposit',
          description: 'Deposit to Savings Wallet',
          amount: amountInUSD,
          date: new Date().toISOString(),
          status: 'completed'
        });

        addNotification({
          type: 'savings',
          title: 'Savings Deposit',
          message: `You added ${formatCurrency(amountInUSD)} to your Savings Wallet`,
          icon: 'savings',
          color: '#1A3F22'
        });
      } else {
        // Savings Wallet -> Goal
        updateSavingsBalance(savingsBalance - amountInUSD);
        const updatedGoal = { ...selectedGoal, currentAmount: selectedGoal.currentAmount + amountInUSD };
        updateSavingsGoal(updatedGoal);

        addTransaction({
          type: 'goal_contribution',
          description: `Contribution to ${selectedGoal.name}`,
          amount: amountInUSD,
          date: new Date().toISOString(),
          status: 'completed'
        });

        addNotification({
          type: 'savings',
          title: 'Goal Contribution',
          message: `You allocated ${formatCurrency(amountInUSD)} to ${selectedGoal.name}`,
          icon: 'savings',
          color: '#1A3F22'
        });
      }

      setSuccess('Contribution successful!');
      setTimeout(() => {
        setShowContributeModal(false);
        setSelectedGoal(null);
        setContributionAmount('');
        setContributionRaw('');
        setSuccess('');
        setContributeType('');
      }, 1500);
    } catch (err) {
      setError('Contribution failed');
    } finally {
      setContributing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawalRaw || parseFloat(withdrawalRaw) <= 0) return;

    const amount = parseFloat(withdrawalRaw);
    const amountInUSD = convertToUSD(amount);

    if (withdrawType === 'goal') {
      if (!selectedGoal) {
        setError('Please select a goal');
        return;
      }
      if (selectedGoal.currentAmount < amountInUSD) {
        setError('Insufficient funds in this goal');
        return;
      }
    } else if (withdrawType === 'savings') {
      if (savingsBalance < amountInUSD) {
        setError('Insufficient funds in savings wallet');
        return;
      }
    }

    setWithdrawing(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (withdrawType === 'goal') {
        // Goal -> Savings Wallet
        const updatedGoal = { ...selectedGoal, currentAmount: selectedGoal.currentAmount - amountInUSD };
        updateSavingsGoal(updatedGoal);
        updateSavingsBalance(savingsBalance + amountInUSD);

        addTransaction({
          type: 'goal_withdrawal',
          description: `Withdrawal from ${selectedGoal.name}`,
          amount: amountInUSD,
          date: new Date().toISOString(),
          status: 'completed'
        });

        addNotification({
          type: 'savings',
          title: 'Goal Withdrawal',
          message: `You moved ${formatCurrency(amountInUSD)} from ${selectedGoal.name} to Savings Wallet`,
          icon: 'savings',
          color: '#D99201'
        });
      } else {
        // Savings Wallet -> Main
        updateSavingsBalance(savingsBalance - amountInUSD);
        updateBalance(Number(user?.balance || 0) + amountInUSD);

        addTransaction({
          type: 'savings_withdrawal',
          description: 'Withdrawal from Savings Wallet',
          amount: amountInUSD,
          date: new Date().toISOString(),
          status: 'completed'
        });

        addNotification({
          type: 'savings',
          title: 'Savings Withdrawal',
          message: `You withdrew ${formatCurrency(amountInUSD)} to your Main Wallet`,
          icon: 'savings',
          color: '#D99201'
        });
      }

      setSuccess('Withdrawal successful!');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setSelectedGoal(null);
        setWithdrawalAmount('');
        setWithdrawalRaw('');
        setSuccess('');
        setWithdrawType('');
      }, 1500);
    } catch (err) {
      setError('Withdrawal failed');
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
              <Link to="/home" className="text-[#1A3F22] opacity-80 hover:opacity-100 transition-opacity no-underline">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
              </Link>
              <h1 className="text-xl font-bold text-[#1A3F22] m-0">Savings</h1>
              <Link to="/create-goal" className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] transition-colors no-underline">
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">add</span>
              </Link>
            </div>
          </header>

          {/* Total Savings Summary - Sidebar on Desktop */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-[#1A3F22] to-[#58761B] rounded-2xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-80 mb-1 m-0">Savings Wallet</p>
              <h2 className="text-3xl font-bold mb-1 m-0">
                {loading ? '...' : formatCurrency(savingsBalance)}
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

            <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1 m-0">Total in Goals</p>
              <h3 className="text-xl font-bold text-[#1A3F22] m-0">{formatCurrency(totalGoalsValue)}</h3>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/community" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">groups</span> Community
              </Link>
              <Link to="/payments" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
              </Link>
              <Link to="/savings" className="flex items-center text-[#1A3F22] bg-gray-50 font-medium p-3 rounded-xl transition-colors no-underline">
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

          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
            {/* Goals Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1A3F22] text-lg m-0">Your Goals</h3>
                <button className="text-[#58761B] text-sm font-medium bg-transparent border-none cursor-pointer hover:underline">See All</button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500">Loading goals...</p>
              ) : goals.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500 mb-4">No savings goals yet.</p>
                  <Link to="/create-goal" className="bg-[#1A3F22] text-white px-6 py-2 rounded-full text-sm font-medium no-underline inline-block">Create Goal</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <span className="material-symbols-outlined">{goal.icon || 'savings'}</span>
                        </div>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                          {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1A3F22] mb-1 m-0">{goal.name}</h4>
                      <p className="text-xs text-gray-500 mb-3 m-0">Target: {formatCurrency(goal.targetAmount)}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-[#1A3F22] font-medium text-right m-0 mb-3">{formatCurrency(goal.currentAmount)} saved</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedGoal(goal); setContributeType('goal'); setShowContributeModal(true); }}
                          className="flex-1 bg-[#E9F0E1] text-[#1A3F22] py-2 rounded-lg text-sm font-medium hover:bg-[#dce8d0] transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={goal.currentAmount >= goal.targetAmount}
                        >
                          {goal.currentAmount >= goal.targetAmount ? 'Completed' : 'Add Money'}
                        </button>
                        <button
                          onClick={() => { setSelectedGoal(goal); setWithdrawType('goal'); setShowWithdrawModal(true); }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border-none cursor-pointer"
                          disabled={goal.currentAmount <= 0}
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
              <h3 className="font-bold text-[#1A3F22] text-lg mb-4 m-0">Recent Activity</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                  <p className="p-4 text-center text-gray-500">Loading activity...</p>
                ) : transactions.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">No recent activity</p>
                ) : (
                  transactions.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E9F0E1] rounded-full flex items-center justify-center text-[#1A3F22]">
                          <span className="material-symbols-outlined text-xl">
                            {item.type.includes('deposit') || item.type.includes('withdrawal') && item.type.includes('goal') ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#1A3F22] text-sm m-0">{item.description}</p>
                          <p className="text-xs text-gray-500 m-0">{new Date(item.date).toLocaleDateString()}</p>
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] m-0">
                {contributeType === 'savings' ? 'Deposit to Savings Wallet' : `Add to ${selectedGoal?.name}`}
              </h2>
              <button onClick={() => { setShowContributeModal(false); setSelectedGoal(null); setContributionAmount(''); setContributionRaw(''); setError(''); setSuccess(''); setContributeType(''); }} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
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
                onChange={(e) => handleFormatAmount(e.target.value, setContributionAmount, setContributionRaw)}
                placeholder={`Enter amount in ${currency}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent"
                disabled={contributing}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {contributeType === 'savings' ? (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Main Wallet Balance:</span><span className="font-medium text-gray-900">{formatCurrency(user?.balance || 0)}</span></div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Savings Wallet Balance:</span><span className="font-medium text-gray-900">{formatCurrency(savingsBalance)}</span></div>
                  {contributionRaw && parseFloat(contributionRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200"><span className="text-gray-600">New Savings Balance:</span><span className="font-bold text-[#1A3F22]">{formatCurrency(savingsBalance + convertToUSD(parseFloat(contributionRaw)))}</span></div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Savings Wallet Balance:</span><span className="font-medium text-gray-900">{formatCurrency(savingsBalance)}</span></div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Goal Current:</span><span className="font-medium text-gray-900">{formatCurrency(selectedGoal?.currentAmount || 0)}</span></div>
                  {contributionRaw && parseFloat(contributionRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200"><span className="text-gray-600">New Goal Total:</span><span className="font-bold text-[#1A3F22]">{formatCurrency((selectedGoal?.currentAmount || 0) + convertToUSD(parseFloat(contributionRaw)))}</span></div>
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A3F22] m-0">
                {withdrawType === 'savings' ? 'Withdraw to Main Wallet' : `Withdraw from ${selectedGoal?.name}`}
              </h2>
              <button onClick={() => { setShowWithdrawModal(false); setSelectedGoal(null); setWithdrawalAmount(''); setWithdrawalRaw(''); setError(''); setSuccess(''); setWithdrawType(''); }} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {success && (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>)}
            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>)}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="text"
                value={withdrawalAmount}
                onChange={(e) => handleFormatAmount(e.target.value, setWithdrawalAmount, setWithdrawalRaw)}
                placeholder={`Enter amount in ${currency}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent"
                disabled={withdrawing}
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {withdrawType === 'goal' && selectedGoal ? (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Available in Goal:</span><span className="font-medium text-gray-900">{formatCurrency(selectedGoal.currentAmount)}</span></div>
                  {withdrawalRaw && parseFloat(withdrawalRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200"><span className="text-gray-600">Remaining in Goal:</span><span className="font-bold text-[#1A3F22]">{formatCurrency(selectedGoal.currentAmount - convertToUSD(parseFloat(withdrawalRaw)))}</span></div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Savings Wallet Balance:</span><span className="font-medium text-gray-900">{formatCurrency(savingsBalance)}</span></div>
                  {withdrawalRaw && parseFloat(withdrawalRaw) > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200"><span className="text-gray-600">Remaining in Savings:</span><span className="font-bold text-[#1A3F22]">{formatCurrency(savingsBalance - convertToUSD(parseFloat(withdrawalRaw)))}</span></div>
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