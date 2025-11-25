import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $50.00 from Sarah Johnson',
      time: '2 minutes ago',
      read: false,
      icon: 'payments',
      color: '#059669'
    },
    {
      id: 2,
      type: 'savings',
      title: 'Goal Milestone',
      message: 'Congratulations! You\'ve reached 50% of your vacation fund goal',
      time: '1 hour ago',
      read: false,
      icon: 'savings',
      color: '#D99201'
    },
    {
      id: 3,
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from iPhone 13',
      time: '3 hours ago',
      read: true,
      icon: 'security',
      color: '#dc2626'
    },
    {
      id: 4,
      type: 'community',
      title: 'Group Payment',
      message: 'The dinner group payment is ready to split',
      time: '1 day ago',
      read: true,
      icon: 'groups',
      color: '#6f9c16'
    },
    {
      id: 5,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 5% cashback on all grocery purchases this week',
      time: '2 days ago',
      read: true,
      icon: 'local_offer',
      color: '#7c3aed'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Bill Reminder',
      message: 'Your electricity bill is due in 3 days',
      time: '3 days ago',
      read: true,
      icon: 'schedule',
      color: '#ea580c'
    }
  ]);

  const [filter, setFilter] = useState('all');

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

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
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

      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <div className="text-center">
                <h1 className="text-lg font-bold text-[#1A3F22] m-0">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-[#6f9c16] m-0">{unreadCount} unread</p>
                )}
              </div>
              <button
                onClick={() => console.log('Mark all as read')}
                className="text-[#6f9c16] text-xs font-medium bg-transparent border-none cursor-pointer hover:underline"
              >
                Mark All
              </button>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
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
                      : 'bg-gray-100 text-[#1A3F22] hover:bg-gray-200'
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
                    className={`rounded-2xl p-4 cursor-pointer transition-all relative ${notification.read
                      ? 'bg-white border border-gray-200'
                      : 'bg-white border-2 border-[#6f9c16] hover:shadow-lg'
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
                          <h3 className={`text-base m-0 flex-1 ${notification.read ? 'font-medium' : 'font-semibold'} text-[#1A3F22]`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 m-0 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 bg-white rounded-2xl border border-gray-200">
                  <div className="w-16 h-16 bg-[#E9F0E1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[#58761B] text-2xl">
                      notifications_none
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1A3F22] mb-2 m-0">No notifications</h3>
                  <p className="text-sm text-gray-500 m-0">You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div className="mt-8">
              <h2 className="text-base font-semibold text-[#1A3F22] mb-4">Notification Settings</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-[#E9F0E1] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[#58761B] text-xl">settings</span>
                </div>
                <h3 className="text-base font-semibold text-[#1A3F22] mb-2 m-0">Manage Notifications</h3>
                <p className="text-sm text-gray-500 mb-4 m-0">Customize which notifications you receive</p>
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
