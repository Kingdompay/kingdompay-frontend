import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import BottomNav from './BottomNav';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [buttonStates, setButtonStates] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleDemoLogin = async (role = 'user') => {
    setLoading(true);
    setError('');

    const email = role === 'admin' ? 'admin@kingdompay.com' : role === 'institution' ? 'institution@kingdompay.com' : 'demo@kingdompay.com';
    const result = await login(email, 'password123', role);

    if (result.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const createRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleButtonClick = (action) => {
    setButtonStates(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [action]: false }));
    }, 150);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>

          {/* Header */}
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-primary-600">KingdomPay</h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back! Please login to continue.</p>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          color: '#151711',
          letterSpacing: 'light',
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: '1.25',
          padding: '0 16px',
          textAlign: 'center',
          paddingBottom: '8px',
          paddingTop: '20px',
          margin: 0
        }}>Welcome back</h3>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: '0 16px',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '12px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            maxWidth: '480px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '16px',
            padding: '0 16px 12px 16px'
          }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              flex: 1
            }}>
              <input
                type="email"
                name="email"
                placeholder="Email or phone number"
                style={{
                  display: 'flex',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  resize: 'none',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  color: '#151711',
                  outline: 'none',
                  border: focusedField === 'email' ? '2px solid #6f9c16' : '2px solid transparent',
                  backgroundColor: focusedField === 'email' ? '#ffffff' : '#f3f4f0',
                  height: '56px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  lineHeight: 'normal',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'email' ? '0 4px 12px rgba(111, 156, 22, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                required
              />
            </label>
          </div>

          <div style={{
            display: 'flex',
            maxWidth: '480px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '16px',
            padding: '0 16px 12px 16px'
          }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              flex: 1
            }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                style={{
                  display: 'flex',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  resize: 'none',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  color: '#151711',
                  outline: 'none',
                  border: focusedField === 'password' ? '2px solid #6f9c16' : '2px solid transparent',
                  backgroundColor: focusedField === 'password' ? '#ffffff' : '#f3f4f0',
                  height: '56px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  lineHeight: 'normal',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'password' ? '0 4px 12px rgba(111, 156, 22, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                required
              />
            </label>
          </div>

          <p style={{
            color: '#7b8764',
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: 'normal',
            paddingBottom: '12px',
            paddingTop: '4px',
            paddingLeft: '16px',
            paddingRight: '16px',
            textDecoration: 'underline',
            cursor: 'pointer',
            margin: 0
          }}>Forgot password?</p>

          <div style={{ display: 'flex', padding: '0 16px 12px 16px' }}>
            <button
              type="submit"
              disabled={loading}
              onClick={createRippleEffect}
              style={{
                display: 'flex',
                minWidth: '84px',
                maxWidth: '480px',
                cursor: loading ? 'not-allowed' : 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '0px',
                height: '48px',
                paddingLeft: '20px',
                paddingRight: '20px',
                flex: 1,
                backgroundColor: loading ? '#9ca3af' : '#6f9c16',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                transition: 'all 0.3s ease',
                border: 'none',
                opacity: loading ? 0.7 : 1,
                transform: buttonStates.login ? 'scale(0.95)' : 'scale(1)',
                boxShadow: '0 4px 12px rgba(111, 156, 22, 0.3)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#5a7a12';
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 6px 16px rgba(111, 156, 22, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#6f9c16';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(111, 156, 22, 0.3)';
                }
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {loading ? 'Logging in...' : 'Log in'}
              </span>
            </button>
          </div>
        </form>

        {/* Social Login & Demo */}
        <div className="px-6 pb-6 space-y-3">
          <div className="relative flex items-center py-2">
            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            <span className={`flex-shrink-0 mx-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Or continue with</span>
            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleDemoLogin('user')}
              className={`w-full py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                ? 'border-gray-600 hover:bg-gray-700 text-white'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span className="material-symbols-outlined">person</span>
              Demo User
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('institution')}
                className={`py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <span className="material-symbols-outlined">account_balance</span>
                Institution
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className={`py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className={`p-4 text-center text-xs border-t ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p className="mb-2">
            Don't have an account? <Link to="/register" className="text-[#1A3F22] font-bold hover:underline">Sign up</Link>
          </p>
          <div className="flex justify-center space-x-4">
            <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>
          </div>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Login;
