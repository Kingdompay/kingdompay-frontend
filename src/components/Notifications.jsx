import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const Notifications = () => {
  const navigate = useNavigate();
  const { user, markAsRead, markAllAsRead } = useAuth();
  const [filter, setFilter] = useState('all');

  const notifications = user?.notifications || [];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationTypes = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { key: 'savings', label: 'Savings', count: notifications.filter(n => n.type === 'savings').length },
    { key: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
    { key: 'community', label: 'Community', count: notifications.filter(n => n.type === 'community').length },
    { key: 'promotion', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length }
  ];

  const handleNotificationClick = (id) => {
    markAsRead(id);
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
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <div className="text-center">
                <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-[#6f9c16] m-0">{unreadCount} unread</p>
                )}
              </div>
              <button
                onClick={markAllAsRead}
                className="text-[#6f9c16] text-xs font-medium bg-transparent border-none cursor-pointer hover:underline"
              >
                Mark All
              </button>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up">

            {/* Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setFilter(type.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all border-none cursor-pointer ${filter === type.key
                      ? 'bg-[#6f9c16] text-white'
                      : 'bg-gray-100 dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-200 dark:hover:bg-[#243B28]'
                      }`}
                  >
                    <span>{type.label}</span>
                    {type.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${filter === type.key
                        ? 'bg-white/20 text-white'
                        : 'bg-[#6f9c16] text-white'
                        }`}>
                        {type.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`rounded-2xl p-4 cursor-pointer transition-all relative ${notification.read
                      ? 'bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32]'
                      : 'bg-white dark:bg-[#1A2E1D] border-2 border-[#6f9c16] hover:shadow-lg'
                      }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#6f9c16]"></div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${notification.color}20` }}
                      >
                        <span className="material-symbols-outlined text-xl" style={{ color: notification.color }}>
                          {notification.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`text-base m-0 flex-1 ${notification.read ? 'font-medium' : 'font-semibold'} text-[#1A3F22] dark:text-[#E8F5E8]`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-[#A8C4A8] ml-2 flex-shrink-0">
                            {new Date(notification.time).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#A8C4A8] m-0 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 bg-white dark:bg-[#1A2E1D] rounded-2xl border border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                  <div className="w-16 h-16 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-2xl">
                      notifications_none
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2 m-0">No notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div className="mt-8">
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Notification Settings</h2>
              <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl p-6 border border-gray-200 dark:border-[#2D4A32] text-center transition-colors duration-300">
                <div className="w-12 h-12 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784] text-xl">settings</span>
                </div>
                <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2 m-0">Manage Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-[#A8C4A8] mb-4 m-0">Customize which notifications you receive</p>
                <button className="bg-[#6f9c16] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer">
                  Open Settings
                </button>
              </div>
            </div>

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

export default Notifications;


