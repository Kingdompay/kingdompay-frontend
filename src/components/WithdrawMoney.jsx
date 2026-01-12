import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import BottomNav from './BottomNav';

const WithdrawMoney = () => {
    const navigate = useNavigate();
    const { user, updateBalance, addTransaction, addNotification } = useAuth();
    const { currency, convertToUSD, formatCurrency } = useCurrency();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('mpesa'); // mpesa, bank
    const [phoneNumber, setPhoneNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const formatAmount = (value) => {
        const number = parseFloat(value.replace(/[^0-9.]/g, ''));
        if (isNaN(number)) return '';
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
    };

    const handleWithdraw = async () => {
        if (!amount || amount === '$0.00') {
            alert('Please enter an amount');
            return;
        }

        const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (method === 'mpesa' && !phoneNumber) {
            alert('Please enter M-Pesa phone number');
            return;
        }

        if (method === 'bank' && !accountNumber) {
            alert('Please enter bank account number');
            return;
        }

        // Convert amount to USD for balance check and update
        const amountInUSD = convertToUSD(numericAmount);
        const currentBalance = Number(user?.balance || 0);

        if (currentBalance < amountInUSD) {
            alert('Insufficient funds');
            return;
        }

        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update balance
            const newBalance = currentBalance - amountInUSD;
            updateBalance(newBalance);

            // Add transaction
            addTransaction({
                type: 'debit',
                description: `Withdrawal to ${method === 'mpesa' ? 'M-Pesa' : 'Bank Account'}`,
                amount: amountInUSD, // Store in USD
                date: new Date().toISOString(),
                status: 'completed'
            });

            // Add notification
            addNotification({
                type: 'payment',
                title: 'Withdrawal Successful',
                message: `Successfully withdrew ${amount} to your ${method === 'mpesa' ? 'M-Pesa' : 'Bank'} account`,
                icon: 'payments',
                color: '#D99201'
            });

            alert(`Successfully withdrew ${amount}!`);
            navigate('/home');
        } catch (error) {
            alert('Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
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
                                onClick={() => navigate('/payments')}
                                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
                            </button>
                            <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Withdraw</h1>
                            <div className="w-10"></div>
                        </div>
                    </header>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:block p-4 mt-auto">
                        <nav className="space-y-2">
                            <div onClick={() => navigate('/home')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                                <span className="material-symbols-outlined mr-3">home</span> Home
                            </div>
                            <div onClick={() => navigate('/payments')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                                <span className="material-symbols-outlined mr-3">qr_code_scanner</span> Payments
                            </div>
                            <div onClick={() => navigate('/profile')} className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors cursor-pointer">
                                <span className="material-symbols-outlined mr-3">person</span> Profile
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
                    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Withdraw Funds</h2>
                            <p className="text-gray-500 dark:text-[#A8C4A8]">Transfer funds to your external account</p>
                        </div>

                        {/* Amount Input */}
                        <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">Amount</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(formatAmount(e.target.value))}
                                    placeholder="$0.00"
                                    className="w-full text-4xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] placeholder-gray-300 border-b-2 border-gray-200 dark:border-[#2D4A32] focus:border-[#D99201] outline-none py-2 bg-transparent transition-colors text-center"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {(currency === 'KES'
                                    ? [100, 250, 500, 1000, 2500, 5000]
                                    : [10, 25, 50, 100, 200, 500]
                                ).map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(formatAmount(val.toString()))}
                                        className="py-2 px-4 rounded-xl border border-gray-200 dark:border-[#2D4A32] text-gray-600 dark:text-[#E8F5E8] font-medium hover:bg-[#D99201] hover:text-white hover:border-[#D99201] transition-all"
                                    >
                                        {currency === 'KES' ? `KSh ${val}` : `$${val}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawal Method */}
                        <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                            <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Withdrawal Method</h3>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setMethod('mpesa')}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'mpesa' ? 'border-[#D99201] bg-yellow-50 dark:bg-[#3E2C0A]' : 'border-gray-100 dark:border-[#2D4A32] hover:border-gray-200 dark:hover:border-[#3D5F3F]'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-4">
                                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">smartphone</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">M-Pesa</p>
                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Instant • Fee: 1%</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'mpesa' ? 'border-[#D99201]' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {method === 'mpesa' && <div className="w-2.5 h-2.5 rounded-full bg-[#D99201]"></div>}
                                    </div>
                                </div>

                                {method === 'mpesa' && (
                                    <div className="mt-4 animate-fade-in-up">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">M-Pesa Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="e.g. 0712345678"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-[#2D4A32] bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D99201] focus:border-transparent transition-colors"
                                        />
                                    </div>
                                )}

                                <div
                                    onClick={() => setMethod('bank')}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'bank' ? 'border-[#D99201] bg-yellow-50 dark:bg-[#3E2C0A]' : 'border-gray-100 dark:border-[#2D4A32] hover:border-gray-200 dark:hover:border-[#3D5F3F]'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-4">
                                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">account_balance</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Bank Transfer</p>
                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">1-3 Days</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'bank' ? 'border-[#D99201]' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {method === 'bank' && <div className="w-2.5 h-2.5 rounded-full bg-[#D99201]"></div>}
                                    </div>
                                </div>

                                {method === 'bank' && (
                                    <div className="mt-4 animate-fade-in-up">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">Account Number</label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="Enter account number"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-[#2D4A32] bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D99201] focus:border-transparent transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={loading || !amount}
                            className="w-full py-4 rounded-xl bg-[#D99201] text-white font-bold text-lg shadow-lg hover:bg-[#b37801] disabled:opacity-50 disabled:cursor-not-allowed transition-all border-none cursor-pointer"
                        >
                            {loading ? 'Processing...' : 'Withdraw Funds'}
                        </button>

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

export default WithdrawMoney;


