import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(formData.email === 'admin@kingdompay.com' ? '/admin' : '/home');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] transition-colors duration-500 overflow-hidden relative">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#58761B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D99201] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-[#1A3F22] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col md:flex-row z-10 relative"
      >
        {/* Left Side (Brand/Image) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1A3F22] to-[#0D1B0F] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620714223084-87d899416c28?q=80&w=1965&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <img src="/logo.png" alt="KingdomPay" className="h-32 w-auto mb-8 opacity-90" />
            <h1 className="text-4xl font-bold font-['Outfit'] mb-4 leading-tight">Banking for the future generation.</h1>
            <p className="text-gray-300 text-lg">Secure, fast, and inspired by nature.</p>
          </div>
          <div className="relative z-10 text-sm text-gray-400">
            © 2026 KingdomPay Inc.
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <img src="/logo.png" alt="KingdomPay" className="h-24 w-auto mb-6 mx-auto md:mx-0 md:hidden" />
            <h2 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] font-['Outfit']">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center"
              >
                <span className="material-symbols-outlined mr-2 text-lg">error</span>
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-[#58761B] hover:text-[#1A3F22] dark:hover:text-[#81C784] transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#1A3F22] dark:text-[#E8F5E8] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
