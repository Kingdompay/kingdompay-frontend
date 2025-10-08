import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Privacy = () => {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    transactionHistory: 'private',
    locationSharing: false,
    dataAnalytics: true,
    marketingEmails: false,
    pushNotifications: true
  });

  const toggleSetting = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const privacyOptions = [
    {
      key: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Who can see your profile information',
      type: 'select',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'friends', label: 'Friends Only' },
        { value: 'private', label: 'Private' }
      ]
    },
    {
      key: 'transactionHistory',
      title: 'Transaction History',
      description: 'Who can see your transaction history',
      type: 'select',
      options: [
        { value: 'private', label: 'Private' },
        { value: 'friends', label: 'Friends Only' }
      ]
    },
    {
      key: 'locationSharing',
      title: 'Location Sharing',
      description: 'Allow location-based features',
      type: 'toggle'
    },
    {
      key: 'dataAnalytics',
      title: 'Data Analytics',
      description: 'Help improve our app with anonymous data',
      type: 'toggle'
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive promotional emails and offers',
      type: 'toggle'
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      type: 'toggle'
    }
  ];

  const dataTypes = [
    {
      icon: 'person',
      title: 'Personal Information',
      description: 'Name, email, phone number',
      items: ['Name', 'Email Address', 'Phone Number', 'Profile Picture']
    },
    {
      icon: 'account_balance',
      title: 'Financial Data',
      description: 'Transaction and account information',
      items: ['Transaction History', 'Account Balance', 'Payment Methods', 'Savings Goals']
    },
    {
      icon: 'location_on',
      title: 'Location Data',
      description: 'GPS and location information',
      items: ['Current Location', 'Transaction Locations', 'Merchant Locations']
    },
    {
      icon: 'devices',
      title: 'Device Information',
      description: 'Device and app usage data',
      items: ['Device Model', 'App Version', 'Usage Statistics', 'Crash Reports']
    }
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
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1A3F22',
            margin: 0
          }}>
            Privacy
          </h1>
          <div style={{ width: '40px' }}></div>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          {/* Privacy Settings */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Privacy Settings
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {privacyOptions.map((option) => (
                <div
                  key={option.key}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 4px 0' }}>
                      {option.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {option.description}
                    </p>
                  </div>
                  
                  {option.type === 'toggle' ? (
                    <button
                      onClick={() => toggleSetting(option.key)}
                      style={{
                        width: '48px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: privacySettings[option.key] ? '#6f9c16' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: privacySettings[option.key] ? '26px' : '2px',
                        transition: 'left 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}></div>
                    </button>
                  ) : (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {option.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setPrivacySettings(prev => ({
                            ...prev,
                            [option.key]: opt.value
                          }))}
                          style={{
                            backgroundColor: privacySettings[option.key] === opt.value ? '#6f9c16' : '#e5e7eb',
                            color: privacySettings[option.key] === opt.value ? 'white' : '#1A3F22',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data We Collect */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Data We Collect
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dataTypes.map((dataType, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '20px' }}>
                        {dataType.icon}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                        {dataType.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        {dataType.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {dataType.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        style={{
                          backgroundColor: '#e5e7eb',
                          color: '#1A3F22',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Rights */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Your Data Rights
            </h2>
            <div style={{
              backgroundColor: '#f0f9ff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#0369a1', fontSize: '20px', marginRight: '12px' }}>
                    download
                  </span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      Download Your Data
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      Get a copy of all your data
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#0369a1', fontSize: '20px', marginRight: '12px' }}>
                    delete
                  </span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      Delete Your Data
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      Permanently delete your account
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#0369a1', fontSize: '20px', marginRight: '12px' }}>
                    edit
                  </span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      Update Your Data
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      Correct or update information
                    </p>
                  </div>
                </div>
              </div>
              <button style={{
                width: '100%',
                backgroundColor: '#0369a1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px'
              }}>
                Manage Data Rights
              </button>
            </div>
          </div>

          {/* Privacy Policy */}
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
                description
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
              Privacy Policy
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
              Read our full privacy policy and terms of service
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
              View Privacy Policy
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Privacy;
