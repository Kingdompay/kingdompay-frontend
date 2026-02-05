import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { requestOTP, verifyOTP, passwordLogin } from '../services/api';

const Login = () => {
  const location = useLocation();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordLoginMode, setPasswordLoginMode] = useState(() => {
    // If navigated with state.mode === 'otp', open in Verify Phone / Create Account mode
    return location.state && location.state.mode === 'otp' ? false : true;
  });
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOTP, setDevOTP] = useState(''); // For development mode

  const { loginWithToken } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format phone number for display
  const formatPhoneNumber = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Handle Kenyan format
    if (digits.startsWith('254')) {
      return '+' + digits;
    } else if (digits.startsWith('0')) {
      return digits;
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return '0' + digits;
    }
    return digits;
  };

  // Handle phone submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Format phone number for API
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '+254' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      console.log('Requesting OTP for:', formattedPhone);
      const response = await requestOTP(formattedPhone);
      console.log('OTP Response:', response);
      
      // Check if new user (needs name)
      setIsNewUser(response.is_new_user || false);
      
      // In development, show the OTP code
      if (response.otp_code) {
        setDevOTP(response.otp_code);
      }
      
      setCountdown(60);
      setStep('otp');
    } catch (err) {
      console.error('OTP Request failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      // More specific error messages
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running on port 5001.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtpCode(pastedData.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
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
        setError('Please set a password or PIN');
        return;
      }
    }

    setLoading(true);

    // Format phone number for API
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
        password.trim() ? password.trim() : null
      );
      
      // Login with the received token
      await loginWithToken(response.access_token, response.user);
      
      // Check if user is admin and redirect accordingly
      const userRole = response.user?.role;
      if (userRole?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        // Check KYC status - if approved, go to home; otherwise go to verify-identity
        const kycStatus = response.user?.kyc_status;
        if (kycStatus === 'approved') {
          navigate('/home');
        } else {
          navigate('/verify-identity');
        }
      }
    } catch (err) {
      console.error('OTP Verification failed:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      // Clear OTP inputs on error
      setOtpCode(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
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

  // Password / PIN login handler
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const identifier = loginIdentifier.trim();
    const pwd = loginPassword.trim();
    if (!identifier || !pwd) return;

    setLoading(true);
    try {
      const response = await passwordLogin(identifier, pwd);

      await loginWithToken(response.access_token, response.user);

      const userRole = response.user?.role;
      if (userRole?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        const kycStatus = response.user?.kyc_status;
        if (kycStatus === 'approved') {
          navigate('/home');
        } else {
          navigate('/verify-identity');
        }
      }
    } catch (err) {
      console.error('Password login failed:', err);
      setError(err.response?.data?.message || 'Failed to sign in. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
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
          {/* Mode toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-[#0A150C] rounded-2xl p-1">
            <button
              type="button"
              onClick={() => { setPasswordLoginMode(true); setError(''); }}
              className={`flex-1 py-2 rounded-2xl text-sm font-semibold border-none cursor-pointer transition-all ${
                passwordLoginMode
                  ? 'bg-white dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-[#E8F5E8] shadow-sm'
                  : 'bg-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              Login with Password
            </button>
            <button
              type="button"
              onClick={() => { setPasswordLoginMode(false); setError(''); }}
              className={`flex-1 py-2 rounded-2xl text-sm font-semibold border-none cursor-pointer transition-all ${
                !passwordLoginMode
                  ? 'bg-white dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-[#E8F5E8] shadow-sm'
                  : 'bg-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              Verify Phone / Create Account
            </button>
          </div>

          {passwordLoginMode ? (
            // Password login mode
            <div>
              <div className="text-center md:text-left mb-10">
                <img src="/logo.png" alt="KingdomPay" className="h-24 w-auto mb-6 mx-auto md:mx-0 md:hidden" />
                <h2 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] font-['Outfit']">Welcome back</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in with your email or phone and password</p>
              </div>

              <form onSubmit={handlePasswordLoginSubmit} className="space-y-6">
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                    placeholder="you@example.com or 0712 345 678"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password / PIN</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                    placeholder="Enter your password or PIN"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !loginIdentifier.trim() || !loginPassword.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          ) : (
            // OTP / registration mode
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center md:text-left mb-10">
                    <img src="/logo.png" alt="KingdomPay" className="h-24 w-auto mb-6 mx-auto md:mx-0 md:hidden" />
                    <h2 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] font-['Outfit']">Welcome</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your phone number to get started</p>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
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
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          🇰🇪
                        </span>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                          className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all text-lg"
                          placeholder="0712 345 678"
                        />
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                        We'll send you a verification code
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phoneNumber.replace(/\D/g, '').length < 9}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      ) : (
                        <>Continue <span className="material-symbols-outlined">arrow_forward</span></>
                      )}
                    </button>

                    <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      By continuing, you agree to our{' '}
                      <Link to="/terms" className="text-[#1A3F22] dark:text-[#81C784] hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-[#1A3F22] dark:text-[#81C784] hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center md:text-left mb-8">
                    <button
                      onClick={() => { setStep('phone'); setError(''); setOtpCode(['', '', '', '', '', '']); }}
                      className="flex items-center text-gray-500 hover:text-[#1A3F22] dark:hover:text-[#81C784] mb-4 cursor-pointer bg-transparent border-none"
                    >
                      <span className="material-symbols-outlined mr-1">arrow_back</span> Back
                    </button>
                    <h2 className="text-3xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] font-['Outfit']">Verify Phone</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Enter the 6-digit code sent to{' '}
                      <span className="font-semibold text-[#1A3F22] dark:text-[#81C784]">{phoneNumber}</span>
                    </p>
                  </div>

                  {/* Dev mode OTP display */}
                  {devOTP && (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center">
                        <span className="material-symbols-outlined mr-2 text-lg">developer_mode</span>
                        <span>
                          Dev Mode: Your OTP is{' '}
                          <strong className="text-lg ml-2 font-mono">{devOTP}</strong>
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Admin login hint (dev mode) */}
                  {(phoneNumber === '+254700000000' ||
                    phoneNumber === '0700000000' ||
                    phoneNumber === '+254712345678' ||
                    phoneNumber === '0712345678') && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                        <span className="material-symbols-outlined mr-2 text-lg">admin_panel_settings</span>
                        <span>Admin Mode: This phone number will grant admin access</span>
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
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

                    {/* OTP Input */}
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
                          className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl bg-gray-50 dark:bg-[#0A150C] border-2 border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                        />
                      ))}
                    </div>

                    {/* New user details for account creation */}
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                person
                              </span>
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                              First time? Tell us your name
                            </p>
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                              Email
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                mail
                              </span>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                                placeholder="Enter your email address"
                              />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                              We’ll use this for receipts and security alerts
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Password / PIN for both new and existing users */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                        {isNewUser ? 'Set up PIN' : 'Password / PIN (optional to set/update)'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          lock
                        </span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58761B] focus:border-transparent transition-all"
                          placeholder={
                            isNewUser
                              ? 'Create a PIN you’ll use to log in'
                              : 'Optional: set or update your password/PIN'
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                        {isNewUser
                          ? 'This PIN will be required together with your phone/email when you log in.'
                          : 'If you fill this, we’ll update your password/PIN for future logins.'}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        otpCode.join('').length !== 6 ||
                        (isNewUser && (!fullName.trim() || !email.trim() || !password.trim()))
                      }
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3F22] to-[#58761B] hover:from-[#14301a] hover:to-[#4a6316] text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      ) : (
                        isNewUser ? 'Create Account' : 'Sign In'
                      )}
                    </button>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Didn't receive the code?{' '}
                        {countdown > 0 ? (
                          <span className="text-gray-400">Resend in {countdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="font-semibold text-[#1A3F22] dark:text-[#81C784] hover:underline cursor-pointer bg-transparent border-none"
                          >
                            Resend Code
                          </button>
                        )}
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
