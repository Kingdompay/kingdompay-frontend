import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            const result = await register(formData);
            if (result.success) {
                navigate('/home');
            } else {
                setError(result.error || 'Failed to register');
            }
        } catch (err) {
            setError('Failed to create an account');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] transition-colors duration-500 overflow-hidden relative">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#58761B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#D99201] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-6xl bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col md:flex-row z-10 relative"
            >
                {/* Left Side (Brand/Info) */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#1A3F22] to-[#0D1B0F] p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550565118-c9fb585188bf?q=80&w=1978&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <img src="/logo.png" alt="KingdomPay" className="h-32 w-auto mb-8 opacity-90" />
                        <h1 className="text-4xl font-bold font-['Outfit'] mb-6 leading-tight">Join the financial revolution.</h1>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 mt-1">
                                    <span className="material-symbols-outlined text-[#81C784]">rocket_launch</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Instant Setup</h3>
                                    <p className="text-gray-400 text-sm">Get your account running in less than 2 minutes.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 mt-1">
                                    <span className="material-symbols-outlined text-[#FFD54F]">verified_user</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Secure & Private</h3>
                                    <p className="text-gray-400 text-sm">Your data is encrypted and protected 24/7.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 mt-1">
                                    <span className="material-symbols-outlined text-[#64B5F6]">account_balance_wallet</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Easy Transactions</h3>
                                    <p className="text-gray-400 text-sm">Send and receive money quickly and securely.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 text-sm text-gray-400 mt-12">
                        Already have an account? <Link to="/login" className="text-white underline font-medium">Log in here</Link>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] font-['Outfit']">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Fill in your details to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center">
                                <span className="material-symbols-outlined mr-2">error</span>
                                {error}
                            </div>
                        )}

                        {/* Account Type Selector */}
                        <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-[#0A150C] p-1.5 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={`py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer flex items-center justify-center ${formData.role === 'user'
                                    ? 'bg-white dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined mr-2 text-lg">person</span> Personal
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'institution' })}
                                className={`py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer flex items-center justify-center ${formData.role === 'institution'
                                    ? 'bg-white dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined mr-2 text-lg">business</span> Institution
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                    {formData.role === 'institution' ? 'Institution Name' : 'Full Name'}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                    placeholder="+1 234..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center md:hidden">
                        <p className="text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
