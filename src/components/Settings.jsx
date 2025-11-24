import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: true,
    autoLock: true,
    language: 'English',
    currency: 'USD'
  });

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const SidebarItem = ({ icon, label, active, onClick, path }) => (
    <div
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
      }}
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active
        ? 'bg-primary-50 text-primary-700'
        : isDarkMode
          ? 'text-gray-300 hover:bg-gray-800'
          : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );

  const SettingItem = ({ icon, title, subtitle, action, type = 'toggle', value }) => (
    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-primary-50'
          }`}>
          <span className="material-symbols-outlined text-primary-600">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
      </div>

      {type === 'toggle' && (
        <button
          onClick={action}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${value ? 'bg-primary-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-sm ${value ? 'left-[26px]' : 'left-0.5'
            }`}></div>
        </button>
      )}

      {type === 'arrow' && (
        <div className="flex items-center gap-2">
          {value && <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>}
          <span className="material-symbols-outlined text-gray-400">chevron_right</span>
        </div>
      )}

      {type === 'button' && (
        <button
          onClick={action}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {value}
        </button>
      )}

      {type === 'info' && (
        <span className="material-symbols-outlined text-gray-400">info</span>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
            </div>
            <h1 className="text-xl font-bold text-primary-600">KingdomPay</h1>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon="dashboard" label="Home" path="/home" />
            <SidebarItem icon="send" label="Send Money" path="/send-money" />
            <SidebarItem icon="request_quote" label="Request Money" path="/request-money" />
            <SidebarItem icon="account_balance" label="Savings" path="/savings" />
            <SidebarItem icon="receipt_long" label="Activity" path="/activity" />
            <SidebarItem icon="settings" label="Settings" active={true} path="/settings" />
            <SidebarItem icon="person" label="Profile" path="/profile" />
          </nav>
        </div>

        <div className={`mt-auto p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/profile')}
              className={`md:hidden mr-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold">Settings</h1>
          </div>
          <div className="w-10 md:w-0"></div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Preferences */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <div className="space-y-3">
                <SettingItem
                  icon="notifications"
                  title="Notifications"
                  subtitle="Push notifications and alerts"
                  type="toggle"
                  value={settings.notifications}
                  action={() => toggleSetting('notifications')}
                />
                <SettingItem
                  icon="dark_mode"
                  title="Dark Mode"
                  subtitle="Switch to dark theme"
                  type="toggle"
                  value={isDarkMode}
                  action={toggleDarkMode}
                />
                <SettingItem
                  icon="language"
                  title="Language"
                  subtitle="App language and region"
                  type="arrow"
                  value={settings.language}
                />
                <SettingItem
                  icon="attach_money"
                  title="Currency"
                  subtitle="Default currency for transactions"
                  type="arrow"
                  value={settings.currency}
                />
              </div>
            </section>

            {/* App Settings */}
            <section>
              <h2 className="text-lg font-semibold mb-4">App Settings</h2>
              <div className="space-y-3">
                <SettingItem
                  icon="lock"
                  title="Auto Lock"
                  subtitle="Lock app after inactivity"
                  type="toggle"
                  value={settings.autoLock}
                  action={() => toggleSetting('autoLock')}
                />
                <SettingItem
                  icon="storage"
                  title="Clear Cache"
                  subtitle="Free up storage space"
                  type="button"
                  value="Clear"
                  action={() => console.log('Clear cache')}
                />
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <div className="space-y-3">
                <SettingItem
                  icon="info"
                  title="KingdomPay"
                  subtitle="Version 1.0.0"
                  type="info"
                />
                <SettingItem
                  icon="description"
                  title="Terms & Privacy"
                  subtitle="Legal information"
                  type="arrow"
                />
              </div>
            </section>

          </div>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
};

export default Settings;
