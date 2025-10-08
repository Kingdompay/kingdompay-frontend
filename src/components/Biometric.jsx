import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Biometric = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(true);
  const [biometricType, setBiometricType] = useState('fingerprint');

  const toggleBiometric = () => {
    setIsEnabled(!isEnabled);
  };

  const biometricOptions = [
    { id: 'fingerprint', label: 'Fingerprint', icon: 'fingerprint', available: true },
    { id: 'face', label: 'Face Recognition', icon: 'face', available: true },
    { id: 'voice', label: 'Voice Recognition', icon: 'mic', available: false }
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
            Biometric Login
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
          
          {/* Biometric Status */}
          <div style={{
            backgroundColor: isEnabled ? '#f0fdf4' : '#fef2f2',
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${isEnabled ? '#bbf7d0' : '#fecaca'}`,
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ 
                  color: isEnabled ? '#059669' : '#dc2626', 
                  fontSize: '24px', 
                  marginRight: '12px' 
                }}>
                  {isEnabled ? 'fingerprint' : 'fingerprint_off'}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    {isEnabled ? 'Biometric Login Enabled' : 'Biometric Login Disabled'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {isEnabled ? 'Use biometric authentication to log in' : 'Enable biometric authentication'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleBiometric}
                style={{
                  width: '48px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isEnabled ? '#6f9c16' : '#d1d5db',
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
                  left: isEnabled ? '26px' : '2px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}></div>
              </button>
            </div>
          </div>

          {/* Biometric Types */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Available Methods
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {biometricOptions.map((option) => (
                <div
                  key={option.id}
                  style={{
                    backgroundColor: option.available ? '#f9fafb' : '#f3f4f6',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    opacity: option.available ? 1 : 0.6,
                    cursor: option.available ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => option.available && setBiometricType(option.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: option.available ? '#E9F0E1' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        <span className="material-symbols-outlined" style={{ 
                          color: option.available ? '#58761B' : '#9ca3af', 
                          fontSize: '20px' 
                        }}>
                          {option.icon}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                          {option.label}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          {option.available ? 'Available' : 'Coming Soon'}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #6f9c16',
                      backgroundColor: biometricType === option.id ? '#6f9c16' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {biometricType === option.id && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }}></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Instructions */}
          {isEnabled && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Setup Instructions
              </h2>
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      1
                    </div>
                    <p style={{ fontSize: '14px', color: '#1A3F22', margin: 0 }}>
                      Ensure your device has biometric authentication enabled
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      2
                    </div>
                    <p style={{ fontSize: '14px', color: '#1A3F22', margin: 0 }}>
                      Follow the on-screen prompts to register your biometric
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      3
                    </div>
                    <p style={{ fontSize: '14px', color: '#1A3F22', margin: 0 }}>
                      Use your biometric to log in securely
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div style={{
            backgroundColor: '#fef3c7',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #fbbf24',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: '20px', marginRight: '8px' }}>
                security
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#d97706', margin: 0 }}>
                Security Notice
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.4' }}>
              Biometric data is stored securely on your device and never transmitted to our servers. Your biometric information remains private and secure.
            </p>
          </div>

          {/* Test Biometric */}
          {isEnabled && (
            <div>
              <button style={{
                width: '100%',
                backgroundColor: '#6f9c16',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {biometricType === 'fingerprint' ? 'fingerprint' : 'face'}
                </span>
                Test Biometric Authentication
              </button>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Biometric;
