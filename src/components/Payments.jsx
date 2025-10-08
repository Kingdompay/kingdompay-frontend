import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Payments = () => {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const recentPayments = [
    {
      id: 1,
      name: 'Coffee Shop',
      amount: 4.50,
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Grocery Store',
      amount: 23.75,
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Gas Station',
      amount: 45.00,
      time: '2 days ago',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      icon: 'qr_code_scanner',
      title: 'Scan QR',
      description: 'Scan to pay',
      color: '#1A3F22'
    },
    {
      icon: 'qr_code',
      title: 'My QR',
      description: 'Show QR to receive',
      color: '#D99201'
    },
    {
      icon: 'account_balance',
      title: 'Pay Bills',
      description: 'Utilities & services',
      color: '#58761B'
    },
    {
      icon: 'store',
      title: 'Nearby',
      description: 'Find merchants',
      color: '#905A01'
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
            onClick={() => navigate('/home')}
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
            Payments
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
          
          {/* Quick Actions */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                      {action.icon}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: '0 0 4px 0' }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Scanner Section */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Scan to Pay
            </h2>
            <div style={{
              backgroundColor: '#000',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* QR Scanner Frame */}
              <div style={{
                width: '200px',
                height: '200px',
                border: '2px solid #fff',
                borderRadius: '12px',
                margin: '0 auto 20px auto',
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                {/* Corner indicators */}
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  width: '20px',
                  height: '20px',
                  borderTop: '4px solid #6f9c16',
                  borderLeft: '4px solid #6f9c16'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderTop: '4px solid #6f9c16',
                  borderRight: '4px solid #6f9c16'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '-2px',
                  width: '20px',
                  height: '20px',
                  borderBottom: '4px solid #6f9c16',
                  borderLeft: '4px solid #6f9c16'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderBottom: '4px solid #6f9c16',
                  borderRight: '4px solid #6f9c16'
                }}></div>
                
                {/* Scanning line animation */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: '#6f9c16',
                  transform: 'translateY(-50%)',
                  animation: 'scan 2s linear infinite'
                }}></div>
              </div>
              
              <p style={{ color: '#fff', fontSize: '14px', margin: '0 0 16px 0' }}>
                Position QR code within the frame
              </p>
              
              <button 
                onClick={() => navigate('/scan-qr')}
                style={{
                  backgroundColor: '#6f9c16',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enable Camera
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Payment Methods
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Wallet */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                      account_balance_wallet
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      KingdomPay Wallet
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Balance: $1,234.56
                    </p>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #6f9c16',
                  backgroundColor: paymentMethod === 'wallet' ? '#6f9c16' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {paymentMethod === 'wallet' && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'white'
                    }}></div>
                  )}
                </div>
              </div>

              {/* Credit Card */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                      credit_card
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      Visa •••• 1234
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #6f9c16',
                  backgroundColor: paymentMethod === 'card' ? '#6f9c16' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {paymentMethod === 'card' && (
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
          </div>

          {/* Recent Payments */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Recent Payments
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#6b7280', fontSize: '20px' }}>
                        store
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                        {payment.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {payment.time}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      -${payment.amount.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#059669', margin: 0, textTransform: 'capitalize' }}>
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
        
        {/* Scanning Animation */}
        <style>
          {`
            @keyframes scan {
              0% { transform: translateY(-100px); }
              100% { transform: translateY(100px); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Payments;
