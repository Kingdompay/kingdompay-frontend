import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const { login } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleDemoLogin = () => {
    // Just navigate directly - auth is bypassed
    navigate('/home');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

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

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 ml-1">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email or phone number"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-primary-500 text-white'
                      : 'bg-gray-50 border-gray-200 focus:border-primary-500 text-gray-900'
                    }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-primary-500 text-white'
                      : 'bg-gray-50 border-gray-200 focus:border-primary-500 text-gray-900'
                    }`}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30'
                }`}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Social Login & Demo */}
          <div className="px-6 pb-6 space-y-3">
            <div className="relative flex items-center py-2">
              <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
              <span className={`flex-shrink-0 mx-4 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Or continue with</span>
              <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>

            <button
              onClick={handleDemoLogin}
              className={`w-full py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span className="material-symbols-outlined">terminal</span>
              Demo Login
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className={`py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button className={`py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}>
                <span className="material-symbols-outlined">apple</span>
                Apple
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className={`p-4 text-center text-xs border-t ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <p className="mb-2">
              Don't have an account? <span className="text-primary-600 font-bold cursor-pointer hover:underline">Sign up</span>
            </p>
            <div className="flex justify-center space-x-4">
              <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
              <span>|</span>
              <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Login;