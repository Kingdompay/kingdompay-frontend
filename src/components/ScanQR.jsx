import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const ScanQR = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScannedData({
        type: 'payment',
        amount: '$25.00',
        recipient: 'Coffee Shop',
        description: 'Coffee and pastry'
      });
      setIsScanning(false);
    }, 3000);
  };

  const handlePay = () => {
    console.log('Processing payment:', scannedData);
    navigate('/payments');
  };

  const handleCancel = () => {
    setScannedData(null);
    setIsScanning(false);
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
            onClick={() => navigate('/payments')}
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
            Scan QR Code
          </h1>
          <button
            onClick={() => console.log('Flash toggle')}
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
              flash_on
            </span>
          </button>
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          {!scannedData ? (
            <div>
              {/* Scanner Area */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '32px',
                border: '2px dashed #e5e7eb',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {isScanning ? (
                  <div>
                    <div style={{
                      width: '200px',
                      height: '200px',
                      border: '3px solid #6f9c16',
                      borderRadius: '20px',
                      margin: '0 auto 24px auto',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '180px',
                        height: '180px',
                        border: '2px solid #6f9c16',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Scanning animation */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #6f9c16, transparent)',
                          animation: 'scan 2s linear infinite'
                        }}></div>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                      Scanning...
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Point your camera at the QR code
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: '200px',
                      height: '200px',
                      border: '3px solid #e5e7eb',
                      borderRadius: '20px',
                      margin: '0 auto 24px auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '64px' }}>
                        qr_code_scanner
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                      Ready to Scan
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
                      Position the QR code within the frame
                    </p>
                    <button
                      onClick={handleScan}
                      style={{
                        backgroundColor: '#6f9c16',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
                    >
                      Start Scanning
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#0369a1', fontSize: '20px', marginRight: '8px' }}>
                    info
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', margin: 0 }}>
                    How to Scan
                  </h3>
                </div>
                <ul style={{ fontSize: '14px', color: '#0369a1', margin: 0, paddingLeft: '20px', lineHeight: '1.5' }}>
                  <li>Make sure the QR code is clearly visible</li>
                  <li>Hold your phone steady</li>
                  <li>Ensure good lighting</li>
                  <li>Keep the code within the frame</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              {/* Payment Details */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A3F22', margin: '0 0 20px 0', textAlign: 'center' }}>
                  Payment Details
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Recipient</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22' }}>{scannedData.recipient}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6f9c16' }}>{scannedData.amount}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Description</span>
                  <span style={{ fontSize: '14px', color: '#1A3F22' }}>{scannedData.description}</span>
                </div>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22' }}>Total</span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A3F22' }}>{scannedData.amount}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  style={{
                    flex: 1,
                    backgroundColor: '#6f9c16',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
        
        {/* Scanning Animation */}
        <style>
          {`
            @keyframes scan {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(200px); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ScanQR;
