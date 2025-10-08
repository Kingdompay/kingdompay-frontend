import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  const [backupCodes] = useState([
    '1234-5678-9012',
    '2345-6789-0123',
    '3456-7890-1234',
    '4567-8901-2345',
    '5678-9012-3456'
  ]);

  const toggle2FA = () => {
    setIsEnabled(!isEnabled);
  };

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
            Two-Factor Authentication
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
          
          {/* 2FA Status */}
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
                  {isEnabled ? 'security' : 'security_update_warning'}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    {isEnabled ? '2FA Enabled' : '2FA Disabled'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {isEnabled ? 'Your account is protected' : 'Add an extra layer of security'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggle2FA}
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

          {/* Setup Instructions */}
          {!isEnabled && (
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
                      Download an authenticator app (Google Authenticator, Authy, etc.)
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
                      Scan the QR code with your authenticator app
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
                      Enter the 6-digit code from your app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              QR Code
            </h2>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#6b7280', fontSize: '48px' }}>
                  qr_code
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Scan this code with your authenticator app
              </p>
            </div>
          </div>

          {/* Backup Codes */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Backup Codes
            </h2>
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: '20px', marginRight: '8px' }}>
                  warning
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#d97706', margin: 0 }}>
                  Important
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#92400e', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      color: '#1A3F22',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    {code}
                  </div>
                ))}
              </div>
              <button style={{
                marginTop: '16px',
                backgroundColor: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Generate New Codes
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Security Tips
            </h2>
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <ul style={{ fontSize: '14px', color: '#6b7280', margin: 0, paddingLeft: '16px', lineHeight: '1.5' }}>
                <li>Never share your backup codes with anyone</li>
                <li>Store backup codes in a secure location</li>
                <li>Use a reliable authenticator app</li>
                <li>Keep your phone secure and updated</li>
                <li>Contact support if you lose access to your device</li>
              </ul>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default TwoFactorAuth;
