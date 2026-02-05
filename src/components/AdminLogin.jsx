import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { requestOTP, verifyOTP } from '../services/api';

const AdminLogin = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOTP, setDevOTP] = useState('');

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // Admin phone numbers (these get ADMIN role)
  const ADMIN_PHONES = ['0700000000', '0712345678', '+254700000000', '+254712345678'];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('254')) {
      return '+' + digits;
    } else if (digits.startsWith('0')) {
      return digits;
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return '0' + digits;
    }
    return digits;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '+254' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const response = await requestOTP(formattedPhone);
      setIsNewUser(response.is_new_user || false);
      if (response.otp_code) {
        setDevOTP(response.otp_code);
      }
      setCountdown(60);
      setStep('otp');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtpCode(pastedData.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (isNewUser) {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!password.trim()) {
        setError('Please set an admin password');
        return;
      }
    }

    setLoading(true);

    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '+254' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const response = await verifyOTP(
        formattedPhone,
        code,
        isNewUser ? fullName : null,
        isNewUser ? email.trim() : null,
        isNewUser ? password.trim() : null
      );
      await loginWithToken(response.access_token, response.user);

      // Check if admin and redirect
      const userRole = response.user?.role;
      if (userRole?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        setError('Access denied. This login is for administrators only.');
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtpCode(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);

    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '+254' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const response = await requestOTP(formattedPhone);
      if (response.otp_code) {
        setDevOTP(response.otp_code);
      }
      setCountdown(60);
      setOtpCode(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const isAdminPhone = ADMIN_PHONES.some(p => 
    phoneNumber === p || 
    phoneNumber.replace(/\D/g, '') === p.replace(/\D/g, '')
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0D1B0F] via-[#1A2E1D] to-[#0D1B0F] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D99201] rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#D99201] rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D99201] to-[#B07A01] p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/80 text-sm mt-1">KingdomPay Administration</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-400 text-sm mb-6 text-center">
                  Enter your administrator phone number
                </p>

                {/* Admin phone hint */}
                <div className="mb-6 p-4 rounded-xl bg-[#D99201]/10 border border-[#D99201]/30">
                  <p className="text-[#D99201] text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Admin numbers: 0700000000 or 0712345678
                  </p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🇰🇪</span>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D99201] transition-all text-lg"
                        placeholder="0700 000 000"
                      />
                    </div>
                    {isAdminPhone && (
                      <p className="text-[#D99201] text-xs ml-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Admin phone number detected
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.replace(/\D/g, '').length < 9}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D99201] to-[#B07A01] hover:from-[#C68801] hover:to-[#9A6B01] text-white font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <>Continue <span className="material-symbols-outlined">arrow_forward</span></>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    ← Back to Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => { setStep('phone'); setError(''); setOtpCode(['', '', '', '', '', '']); }}
                  className="flex items-center text-gray-400 hover:text-white mb-4 bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-1">arrow_back</span> Back
                </button>

                <h2 className="text-xl font-bold text-white mb-2">Verify Phone</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enter the 6-digit code sent to <span className="text-[#D99201]">{phoneNumber}</span>
                </p>

                {devOTP && (
                  <div className="mb-6 p-4 rounded-xl bg-[#D99201]/10 border border-[#D99201]/30">
                    <p className="text-sm text-[#D99201] flex items-center">
                      <span className="material-symbols-outlined mr-2">developer_mode</span>
                      Dev Mode OTP: <strong className="text-lg ml-2 font-mono">{devOTP}</strong>
                    </p>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center gap-3">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#D99201] transition-all"
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {isNewUser && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {/* Full Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D99201]"
                            placeholder="Enter your full name"
                          />
                        </div>
                        {/* Email */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D99201]"
                            placeholder="Enter your admin email"
                          />
                        </div>
                        {/* Password */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Admin Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D99201]"
                            placeholder="Set a secure password or PIN"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      otpCode.join('').length !== 6 ||
                      (isNewUser && (!fullName.trim() || !email.trim() || !password.trim()))
                    }
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D99201] to-[#B07A01] text-white font-bold text-lg shadow-lg transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      'Sign In as Admin'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      Didn't receive code?{' '}
                      {countdown > 0 ? (
                        <span>Resend in {countdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="text-[#D99201] hover:underline bg-transparent border-none cursor-pointer"
                        >
                          Resend
                        </button>
                      )}
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
