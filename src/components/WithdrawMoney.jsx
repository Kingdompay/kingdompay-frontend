import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { initiateMpesaWithdrawal, calculateFees } from '../services/api';
import BottomNav from './BottomNav';

const WithdrawMoney = () => {
    const navigate = useNavigate();
    const { user, wallet, refreshWallet, addTransaction, addNotification } = useAuth();
    const { currency, formatCurrency } = useCurrency();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('mpesa'); // mpesa, bank
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fees, setFees] = useState(null);
    const [step, setStep] = useState('input'); // input, confirm, processing, success

    // Get current balance
    const currentBalance = wallet?.balance || user?.balance || 0;

    // Pre-fill phone from user profile
    useEffect(() => {
        if (user?.phone_number) {
            let phone = user.phone_number;
            if (phone.startsWith('+254')) {
                phone = '0' + phone.substring(4);
            }
            setPhoneNumber(phone);
        }
    }, [user]);

    const formatAmount = (value) => {
        const number = parseFloat(value.replace(/[^0-9.]/g, ''));
        if (isNaN(number)) return '';
        return `KSh ${number.toLocaleString()}`;
    };

    const getNumericAmount = () => {
        return parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
    };

    // Calculate fees when amount changes
    useEffect(() => {
        const fetchFees = async () => {
            const numericAmount = getNumericAmount();
            if (numericAmount >= 10) {
                try {
                    const feesData = await calculateFees(numericAmount, 'withdrawal');
                    setFees(feesData);
                } catch (err) {
                    console.warn('Failed to calculate fees:', err);
                    // Estimate 1% fee
                    setFees({
                        fee: numericAmount * 0.01,
                        total: numericAmount,
                        net_amount: numericAmount * 0.99
                    });
                }
            } else {
                setFees(null);
            }
        };
        
        const debounce = setTimeout(fetchFees, 300);
        return () => clearTimeout(debounce);
    }, [amount]);

    // Format phone number for API
    const formatPhoneForAPI = (phone) => {
        let formatted = phone.replace(/\D/g, '');
        if (formatted.startsWith('0')) {
            formatted = '+254' + formatted.substring(1);
        } else if (!formatted.startsWith('254')) {
            formatted = '+254' + formatted;
        } else {
            formatted = '+' + formatted;
        }
        return formatted;
    };

    const handleContinue = () => {
        setError('');

        const numericAmount = getNumericAmount();

        if (!numericAmount || numericAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (numericAmount < 10) {
            setError('Minimum withdrawal is KSh 10');
            return;
        }

        if (numericAmount > 150000) {
            setError('Maximum withdrawal is KSh 150,000');
            return;
        }

        if (numericAmount > currentBalance) {
            setError('Insufficient funds');
            return;
        }

        if (method === 'mpesa' && !phoneNumber) {
            setError('Please enter your M-Pesa phone number');
            return;
        }

        setStep('confirm');
    };

    const handleWithdraw = async () => {
        setError('');
        setLoading(true);
        setStep('processing');

        const numericAmount = getNumericAmount();
        const formattedPhone = formatPhoneForAPI(phoneNumber);

        try {
            const response = await initiateMpesaWithdrawal(formattedPhone, numericAmount);

            if (response.success) {
                setSuccess('Your withdrawal has been processed! Funds will be sent to your M-Pesa shortly.');

            // Add transaction
            addTransaction({
                    id: Date.now(),
                type: 'debit',
                    description: 'M-Pesa Withdrawal',
                    amount: numericAmount,
                date: new Date().toISOString(),
                status: 'completed'
            });

            // Add notification
            addNotification({
                type: 'payment',
                title: 'Withdrawal Successful',
                    message: `KSh ${numericAmount.toLocaleString()} has been sent to your M-Pesa`,
                icon: 'payments',
                color: '#D99201'
            });

                // Refresh wallet
                await refreshWallet();

                setStep('success');
            } else {
                setError(response.message || 'Withdrawal failed. Please try again.');
                setStep('input');
            }
        } catch (err) {
            console.error('Withdrawal failed:', err);
            setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
            setStep('input');
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
                                onClick={() => step === 'input' ? navigate('/payments') : setStep('input')}
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
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
                    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">

                        {/* Processing State */}
                        {step === 'processing' && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-6 bg-[#D99201]/20 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#D99201] text-4xl animate-spin">progress_activity</span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Processing Withdrawal</h2>
                                <p className="text-gray-500 dark:text-[#A8C4A8]">Please wait while we process your request...</p>
                            </div>
                        )}

                        {/* Success State */}
                        {step === 'success' && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Withdrawal Successful!</h2>
                                <p className="text-gray-500 dark:text-[#A8C4A8] mb-6">{success}</p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="px-8 py-3 rounded-xl bg-[#D99201] text-white font-bold hover:bg-[#b37801] transition-colors"
                                >
                                    Go to Home
                                </button>
                            </div>
                        )}

                        {/* Confirmation State */}
                        {step === 'confirm' && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Confirm Withdrawal</h2>
                                    <p className="text-gray-500 dark:text-[#A8C4A8]">Review your withdrawal details</p>
                                </div>

                                <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32]">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-[#2D4A32]">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Amount</span>
                                            <span className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] text-xl">{amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-[#2D4A32]">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Fee</span>
                                            <span className="text-gray-600 dark:text-gray-400">KSh {(fees?.fee || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-[#2D4A32]">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">You'll Receive</span>
                                            <span className="font-bold text-[#D99201] text-xl">KSh {((fees?.net_amount || getNumericAmount())).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">To M-Pesa</span>
                                            <span className="font-medium text-[#1A3F22] dark:text-[#E8F5E8]">{phoneNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                                        <span className="material-symbols-outlined mr-2">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('input')}
                                        className="flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-[#2D4A32] text-gray-700 dark:text-[#E8F5E8] font-bold hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleWithdraw}
                                        disabled={loading}
                                        className="flex-1 py-4 rounded-xl bg-[#D99201] text-white font-bold text-lg shadow-lg hover:bg-[#b37801] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        ) : (
                                            'Confirm Withdrawal'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Input State */}
                        {step === 'input' && (
                            <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Withdraw Funds</h2>
                                    <p className="text-gray-500 dark:text-[#A8C4A8]">Transfer funds to your M-Pesa</p>
                                </div>

                                {/* Available Balance */}
                                <div className="bg-gradient-to-r from-[#D99201] to-[#b37801] p-4 rounded-xl text-white">
                                    <p className="text-sm opacity-80">Available Balance</p>
                                    <p className="text-2xl font-bold">KSh {currentBalance.toLocaleString()}</p>
                        </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                                        <span className="material-symbols-outlined mr-2">error</span>
                                        {error}
                                    </div>
                                )}

                        {/* Amount Input */}
                        <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">Amount</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(formatAmount(e.target.value))}
                                            placeholder="KSh 0"
                                    className="w-full text-4xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] placeholder-gray-300 border-b-2 border-gray-200 dark:border-[#2D4A32] focus:border-[#D99201] outline-none py-2 bg-transparent transition-colors text-center"
                                />
                            </div>

                                    {/* Fee Preview */}
                                    {fees && (
                                        <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0D1B0F] rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Fee (~1%)</span>
                                                <span className="text-gray-600 dark:text-gray-400">- KSh {fees.fee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-500 dark:text-gray-400">You'll receive</span>
                                                <span className="font-bold text-[#D99201]">KSh {fees.net_amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}

                            <div className="grid grid-cols-3 gap-3 mt-6">
                                        {[500, 1000, 2500, 5000, 10000, 25000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(formatAmount(val.toString()))}
                                                disabled={val > currentBalance}
                                                className="py-2 px-4 rounded-xl border border-gray-200 dark:border-[#2D4A32] text-gray-600 dark:text-[#E8F5E8] font-medium hover:bg-[#D99201] hover:text-white hover:border-[#D99201] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                                KSh {val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawal Method */}
                        <div className="bg-white dark:bg-[#1A2E1D] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                            <h3 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Withdrawal Method</h3>

                            <div className="space-y-3">
                                        {/* M-Pesa */}
                                <div
                                    onClick={() => setMethod('mpesa')}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${method === 'mpesa' ? 'border-[#D99201] bg-yellow-50 dark:bg-[#3E2C0A]' : 'border-gray-100 dark:border-[#2D4A32] hover:border-gray-200 dark:hover:border-[#3D5F3F]'}`}
                                >
                                            <div className="w-12 h-12 rounded-full bg-[#4CAF50] flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-sm">M</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">M-Pesa</p>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Instant • Fee: ~1%</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'mpesa' ? 'border-[#D99201]' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {method === 'mpesa' && <div className="w-2.5 h-2.5 rounded-full bg-[#D99201]"></div>}
                                    </div>
                                </div>

                                {method === 'mpesa' && (
                                    <div className="mt-4 animate-fade-in-up">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-2">M-Pesa Phone Number</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🇰🇪</span>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                                        placeholder="0712345678"
                                                        maxLength={10}
                                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#2D4A32] bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D99201] focus:border-transparent transition-colors"
                                        />
                                                </div>
                                    </div>
                                )}

                                        {/* Bank - Coming Soon */}
                                        <div className="flex items-center p-4 rounded-xl border-2 border-gray-100 dark:border-[#2D4A32] opacity-50">
                                            <div className="w-12 h-12 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-4">
                                        <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">account_balance</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-[#1A3F22] dark:text-[#E8F5E8]">Bank Transfer</p>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8]">Coming Soon</p>
                                            </div>
                                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">Soon</span>
                                    </div>
                            </div>
                        </div>

                        <button
                                    onClick={handleContinue}
                                    disabled={!amount || method !== 'mpesa'}
                                    className="w-full py-4 rounded-xl bg-[#D99201] text-white font-bold text-lg shadow-lg hover:bg-[#b37801] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                                    <span className="material-symbols-outlined">payments</span>
                                    Continue
                        </button>
                            </>
                        )}

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
