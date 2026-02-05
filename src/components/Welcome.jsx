import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B0F] via-[#1A3F22] to-[#0D1B0F] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#58761B] rounded-full mix-blend-overlay filter blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#D99201] rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#1A3F22] rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo and branding */}
        <div className="text-center mb-12">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src="/logo.png"
            alt="KingdomPay"
            className="h-24 w-auto mx-auto mb-6"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Outfit']"
          >
            KingdomPay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Banking for the future generation
          </motion.p>
        </div>

        {/* Main action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <h2 className="text-white text-xl font-semibold text-center mb-6">Get Started</h2>
          
          <div className="space-y-4">
            {/* User Login Button */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              <span className="material-symbols-outlined text-2xl">person</span>
              User Login
            </Link>

            {/* User Registration Button -> New OTP + Password flow */}
            <Link
              to="/login"
              state={{ mode: 'otp' }}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg transform hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              <span className="material-symbols-outlined text-2xl">person_add</span>
              Create Account
            </Link>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-gray-400 text-sm">or continue as</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Admin Login Button */}
            <Link
              to="/admin-login"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#D99201]/20 hover:bg-[#D99201]/30 border border-[#D99201]/50 text-[#D99201] font-semibold text-lg transform hover:-translate-y-1 transition-all duration-200 no-underline"
            >
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              Admin Login
            </Link>

            {/* Community Admin Link */}
            <Link
              to="/community-login"
              className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-gray-400 hover:text-white font-medium text-sm transition-colors no-underline"
            >
              <span className="material-symbols-outlined text-xl">groups</span>
              Community Administrator
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Secure, fast, and inspired by nature
          </p>
          <p className="text-gray-600 text-xs mt-2">
            © 2026 KingdomPay Inc. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
