import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ color: '#1A3F22' }}>
      <div style={{
        maxWidth: '384px',
        margin: '0 auto',
        backgroundColor: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '20px' }}>
              arrow_back
            </span>
          </button>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1A3F22',
              margin: 0
            }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p style={{
                fontSize: '12px',
                color: '#6f9c16',
                margin: '2px 0 0 0'
              }}>
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            onClick={() => console.log('Mark all as read')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6f9c16',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Mark All Read
          </button>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          {/* Filter Tabs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '8px',
              paddingBottom: '4px'
            }}>
              {notificationTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setFilter(type.key)}
                  style={{
                    backgroundColor: filter === type.key ? '#6f9c16' : '#f3f4f6',
                    color: filter === type.key ? 'white' : '#1A3F22',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span>{type.label}</span>
                  {type.count > 0 && (
                    <span style={{
                      backgroundColor: filter === type.key ? 'rgba(255,255,255,0.2)' : '#6f9c16',
                      color: filter === type.key ? 'white' : 'white',
                      borderRadius: '10px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {type.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    backgroundColor: notification.read ? '#f9fafb' : 'white',
                    border: notification.read ? '1px solid #e5e7eb' : '2px solid #6f9c16',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!notification.read) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px -5px rgba(111, 156, 22, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notification.read) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#6f9c16'
                    }}></div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${notification.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span 
                        className="material-symbols-outlined" 
                        style={{ 
                          color: notification.color, 
                          fontSize: '20px' 
                        }}
                      >
                        {notification.icon}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: notification.read ? '500' : '600', 
                          color: '#1A3F22', 
                          margin: 0,
                          flex: 1
                        }}>
                          {notification.title}
                        </h3>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          marginLeft: '8px',
                          flexShrink: 0
                        }}>
                          {notification.time}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#E9F0E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '24px' }}>
                    notifications_none
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                  No notifications
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  You're all caught up!
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Notification Settings
            </h2>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#E9F0E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '24px' }}>
                  settings
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                Manage Notifications
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                Customize which notifications you receive
              </p>
              <button style={{
                backgroundColor: '#6f9c16',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Open Settings
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Notifications;
