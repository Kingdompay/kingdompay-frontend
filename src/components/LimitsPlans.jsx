import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const LimitsPlans = () => {
  const navigate = useNavigate();
  const [limits] = useState({
    dailySpending: 1000,
    monthlySpending: 5000,
    transferLimit: 2500,
    atmWithdrawal: 500
  });

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 'Free',
      features: [
        'Up to $1,000 daily spending',
        'Up to $5,000 monthly spending',
        'Basic customer support',
        'Standard transaction fees'
      ],
      current: true
    },
    {
      id: 2,
      name: 'Premium',
      price: '$9.99/month',
      features: [
        'Up to $5,000 daily spending',
        'Up to $25,000 monthly spending',
        'Priority customer support',
        'Reduced transaction fees',
        'Advanced analytics'
      ],
      current: false
    },
    {
      id: 3,
      name: 'Pro',
      price: '$19.99/month',
      features: [
        'Unlimited daily spending',
        'Unlimited monthly spending',
        '24/7 premium support',
        'No transaction fees',
        'Advanced analytics & insights',
        'Priority features'
      ],
      current: false
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
            Limits & Plans
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
          
          {/* Current Limits */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Current Limits
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Daily Spending */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Daily Spending
                  </h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>
                    ${limits.dailySpending.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Maximum amount you can spend per day
                </p>
              </div>

              {/* Monthly Spending */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Monthly Spending
                  </h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>
                    ${limits.monthlySpending.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Maximum amount you can spend per month
                </p>
              </div>

              {/* Transfer Limit */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Transfer Limit
                  </h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>
                    ${limits.transferLimit.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Maximum amount you can transfer per transaction
                </p>
              </div>

              {/* ATM Withdrawal */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    ATM Withdrawal
                  </h3>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>
                    ${limits.atmWithdrawal.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Maximum amount you can withdraw from ATM per day
                </p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Available Plans
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: plan.current ? '#f0f9ff' : 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: plan.current ? '2px solid #6f9c16' : '1px solid #e5e7eb',
                    position: 'relative'
                  }}
                >
                  {plan.current && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '20px',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Current Plan
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A3F22', margin: 0 }}>
                      {plan.name}
                    </h3>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6f9c16' }}>
                      {plan.price}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '8px',
                          fontSize: '14px',
                          color: '#1A3F22'
                        }}>
                          <span className="material-symbols-outlined" style={{ 
                            color: '#6f9c16', 
                            fontSize: '16px', 
                            marginRight: '8px' 
                          }}>
                            check_circle
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {!plan.current && (
                    <button style={{
                      width: '100%',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
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

export default LimitsPlans;
