import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { requestOTP, verifyOTP } from '../services/api';

const Register = () => {
  const [step, setStep] = useState('details'); // 'details', 'otp'
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOTP, setDevOTP] = useState('');

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.phoneNumber.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    let formattedPhone = formData.phoneNumber.replace(/\D/g, '');
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
      setStep('otp');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
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

    setLoading(true);

    let formattedPhone = formData.phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '+254' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const response = await verifyOTP(formattedPhone, code, formData.fullName, formData.email);
      await loginWithToken(response.access_token, response.user);
      
      // Redirect based on role
      const userRole = response.user?.role;
      if (userRole?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        // New users need to verify their identity first
        navigate('/verify-identity');
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

    let formattedPhone = formData.phoneNumber.replace(/\D/g, '');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] transition-colors duration-500 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#58761B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#D99201] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 dark:bg-[#1A2E1D]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3F22] to-[#58761B] p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-3xl">person_add</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-white/80 text-sm mt-1">Join KingdomPay today</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.div
                key="details-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">person</span>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🇰🇪</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] transition-all"
                        placeholder="0712 345 678"
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">We'll send a verification code to this number</p>
                  </div>

                  {/* Email (Required) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <>Continue <span className="material-symbols-outlined">arrow_forward</span></>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#1A3F22] dark:text-[#81C784] font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors">
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
                  onClick={() => { setStep('details'); setError(''); setOtpCode(['', '', '', '', '', '']); }}
                  className="flex items-center text-gray-500 hover:text-[#1A3F22] dark:hover:text-[#81C784] mb-4 bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-1">arrow_back</span> Back
                </button>

                <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Verify Phone</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Enter the 6-digit code sent to <span className="font-semibold text-[#1A3F22] dark:text-[#81C784]">{formData.phoneNumber}</span>
                </p>

                {devOTP && (
                  <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center">
                      <span className="material-symbols-outlined mr-2">developer_mode</span>
                      Dev Mode OTP: <strong className="text-lg ml-2 font-mono">{devOTP}</strong>
                    </p>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
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
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-gray-50 dark:bg-[#0A150C] border-2 border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.join('').length !== 6}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Didn't receive code?{' '}
                      {countdown > 0 ? (
                        <span>Resend in {countdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="font-semibold text-[#1A3F22] dark:text-[#81C784] hover:underline bg-transparent border-none cursor-pointer"
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

export default Register;
