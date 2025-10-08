import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState('');

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div style={{ color: '#1A3F22' }}>
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
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-slide-in-left {
            animation: slideInLeft 0.6s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slideInRight 0.6s ease-out forwards;
          }
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      
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
          zIndex: 10,
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/home" style={{ color: '#1A3F22', opacity: 0.8, transition: 'opacity 0.3s', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios</span>
            </Link>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1A3F22',
              margin: 0
            }}>Profile</h1>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#E9F0E1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '20px' }}>settings</span>
            </div>
          </div>
        </header>
        
        <main style={{ padding: '0 16px', paddingBottom: '7rem' }}>
          {/* Profile Section */}
          <section style={{ textAlign: 'center', paddingTop: '32px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                alt="User profile picture" 
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  border: '4px solid #58761B',
                  objectFit: 'cover',
                  transition: 'box-shadow 0.3s ease-in-out'
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTUDwO_1yM452W0B6j691kPeEKdplxoY0YQKiIJQ70sBWUiQhS2Cb9vM7Uuyo2E4KQ-CyRyzW2V3qPqHs1Cu0S-zlxtywlUNIZAtXKHRR4zKCajsvOyC9Yo6hIeW0yDbn0N5xbqRe1tADPI5Qrk8IhtiCSFcpoo8T1iT0oQyGu70uKd7VNydVjQRNDdCFsjtbph_DPIP9__u7J7sJAGLCNNoiXmhJrWNTxdkRksSwNwlzwldTKfBrBDIumjXhXN2eBhdzaTLdKWo3R"
              />
            </div>
            <h2 style={{
              marginTop: '16px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1A3F22',
              margin: '16px 0 0 0'
            }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <p style={{
              color: '#58761B',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>
              @{user?.email?.split('@')[0]} / {user?.phone || '+1 234 567 890'}
            </p>
          </section>
          
          {/* Wallet Balance */}
          <section style={{ marginTop: '24px' }}>
            <div style={{
              background: 'linear-gradient(to right, #1A3F22, #58761B)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <p style={{ fontWeight: '600', margin: 0 }}>
                  Personal Wallet: ${user?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <span className="material-symbols-outlined" style={{ color: '#D99201', fontSize: '24px' }}>
                toll
              </span>
            </div>
          </section>
          
          {/* Action Buttons */}
          <section style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    border: '2px solid #905A01',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: hoveredButton === 'edit' ? '0 8px 16px -4px rgba(144, 90, 1, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transform: hoveredButton === 'edit' ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredButton('edit')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined" style={{ color: '#905A01', fontSize: '20px' }}>edit</span>
                </button>
                <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: '500', margin: '8px 0 0 0' }}>
                  Edit Profile
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => navigate('/security')}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: hoveredButton === 'security' ? '#2d4a33' : '#1A3F22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: hoveredButton === 'security' ? '0 8px 16px -4px rgba(26, 63, 34, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transform: hoveredButton === 'security' ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredButton('security')}
                  onMouseLeave={() => setHoveredButton('')}
                >
                  <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>shield</span>
                </button>
                <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: '500', margin: '8px 0 0 0' }}>
                  Security
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => navigate('/cards')}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#E9F0E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '20px' }}>credit_card</span>
                </button>
                <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: '500', margin: '8px 0 0 0' }}>
                  Cards
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => navigate('/referrals')}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#D99201',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>card_giftcard</span>
                </button>
                <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: '500', margin: '8px 0 0 0' }}>
                  Referrals
                </p>
              </div>
            </div>
          </section>
          
          {/* Menu Sections */}
          <section style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Account Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', padding: '0 12px', paddingTop: '8px', margin: '0 0 8px 0' }}>Account</h3>
              <div style={{ borderTop: '1px solid #f3f4f6' }}>
                <button 
                  onClick={() => navigate('/personal-details')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>person</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Personal Details</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/linked-accounts')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>account_balance</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Linked Bank Accounts & Cards</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/limits-plans')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>speed</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Limits & Plans</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </div>
            
            {/* Preferences Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', padding: '0 12px', paddingTop: '8px', margin: '0 0 8px 0' }}>Preferences</h3>
              <div style={{ borderTop: '1px solid #f3f4f6' }}>
                <button 
                  onClick={() => navigate('/notifications')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>notifications</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Notifications & Alerts</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>settings</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Settings</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </div>
            
            {/* Security Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', padding: '0 12px', paddingTop: '8px', margin: '0 0 8px 0' }}>Security</h3>
              <div style={{ borderTop: '1px solid #f3f4f6' }}>
                <button 
                  onClick={() => navigate('/change-pin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>pin</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Change PIN / Password</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/2fa')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>password</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>2FA</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/biometric')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>fingerprint</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Biometric Login</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </div>
            
            {/* Support Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', padding: '0 12px', paddingTop: '8px', margin: '0 0 8px 0' }}>Support</h3>
              <div style={{ borderTop: '1px solid #f3f4f6' }}>
                <button 
                  onClick={() => navigate('/help-support')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>help</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Help Center</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/chat-support')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>chat</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Chat with Support</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
                
                <button 
                  onClick={() => navigate('/faqs')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>quiz</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>FAQs</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </section>
          
          {/* Privacy Section */}
          <section style={{ marginTop: '24px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', padding: '0 12px', paddingTop: '8px', margin: '0 0 8px 0' }}>Privacy</h3>
              <div style={{ borderTop: '1px solid #f3f4f6' }}>
                <button 
                  onClick={() => navigate('/privacy')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E9F0E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '16px' }}>shield</span>
                    </div>
                    <span style={{ color: '#1A3F22', fontWeight: '500' }}>Privacy & Data</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </section>
          
          {/* Premium Upgrade */}
          <section style={{ marginTop: '32px' }}>
            <div style={{
              background: 'linear-gradient(to right, #905A01, #D99201)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Upgrade to KingdomPay Premium</h3>
              <p style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9, margin: '4px 0 0 0' }}>Unlock exclusive features and benefits.</p>
              <button style={{
                marginTop: '16px',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '50%',
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>Explore</button>
            </div>
          </section>
          
          {/* Logout */}
          <section style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
              <button 
                style={{
                  display: 'block',
                  width: '100%',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  color: '#dc2626',
                  fontWeight: '600',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
            <p style={{ marginTop: '16px', color: '#A0A89B', fontSize: '12px', margin: '16px 0 0 0' }}>Version 1.0.0</p>
          </section>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;