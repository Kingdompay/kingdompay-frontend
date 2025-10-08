import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Referrals = () => {
  const navigate = useNavigate();
  const [referralCode] = useState('KINGDOM123');
  const [referrals] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      status: 'completed',
      reward: '$10',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.c@email.com',
      status: 'pending',
      reward: '$10',
      date: '2024-01-20'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      status: 'completed',
      reward: '$10',
      date: '2024-01-25'
    }
  ]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    // You could add a toast notification here
    console.log('Referral code copied to clipboard');
  };

  const shareReferral = () => {
    const shareText = `Join KingdomPay with my referral code: ${referralCode}. Get $10 when you sign up!`;
    if (navigator.share) {
      navigator.share({
        title: 'Join KingdomPay',
        text: shareText,
        url: 'https://kingdompay.com'
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
    }
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
            Referrals
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
          
          {/* Referral Stats */}
          <div style={{
            background: 'linear-gradient(135deg, #1A3F22, #58761B, #D99201, #905A01)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              $30 Earned
            </h2>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 16px 0' }}>
              Total referral rewards
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>3</p>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>Referrals</p>
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>$10</p>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>Per Referral</p>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 12px 0' }}>
              Your Referral Code
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A3F22', letterSpacing: '2px' }}>
                {referralCode}
              </span>
              <button
                onClick={copyReferralCode}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#f3f4f6'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '18px' }}>
                  content_copy
                </span>
              </button>
            </div>
            <button
              onClick={shareReferral}
              style={{
                width: '100%',
                backgroundColor: '#6f9c16',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                share
              </span>
              Share Referral
            </button>
          </div>

          {/* How It Works */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              How It Works
            </h3>
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
                  Share your referral code with friends
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
                  They sign up and complete verification
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
                  You both earn $10 in rewards!
                </p>
              </div>
            </div>
          </div>

          {/* Referral History */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Referral History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {referrals.map((referral) => (
                <div
                  key={referral.id}
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
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A3F22', margin: '0 0 4px 0' }}>
                      {referral.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {referral.email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: referral.status === 'completed' ? '#059669' : '#d97706',
                      margin: '0 0 4px 0' 
                    }}>
                      {referral.reward}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: referral.status === 'completed' ? '#059669' : '#d97706',
                      margin: 0,
                      textTransform: 'capitalize'
                    }}>
                      {referral.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Referrals;
