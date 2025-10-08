import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import BottomNav from './BottomNav';

const Savings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredGoal, setHoveredGoal] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('/api/savings/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const getIconComponent = (iconName) => {
    const iconMap = {
      home: 'home',
      directions_car: 'directions_car',
      flight: 'flight',
    };
    
    return iconMap[iconName] || 'savings';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '384px',
      margin: '0 auto',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
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
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '12px 16px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/home" style={{ color: '#1A3F22', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
          </Link>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1A3F22',
            margin: 0
          }}>Savings</h1>
          <span style={{ width: '24px' }}></span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '96px'
      }}>
        {/* Balance Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1A3F22, #58761B, #D99201, #905A01)',
          height: '160px',
          borderRadius: '0 0 24px 24px',
          padding: '16px 24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>settings</span>
          </div>
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: '300', margin: 0 }}>Savings Balance</p>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>${user?.savingsBalance?.toFixed(2) || '0.00'}</h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '0 16px', marginTop: '-32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => navigate('/create-goal')}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1A3F22',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>add</span>
              </button>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>Add</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => navigate('/send-money')}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1A3F22',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>arrow_upward</span>
              </button>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>Withdraw</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => navigate('/add-money')}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1A3F22',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>swap_horiz</span>
              </button>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>Transfer</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => navigate('/quick-save')}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1A3F22',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>more_horiz</span>
              </button>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>More</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{
          padding: '0 16px',
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Interest today</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A3F22', margin: 0 }}>+0.05%</p>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#D99201', fontSize: '20px' }}>show_chart</span>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Saved this month</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A3F22', margin: 0 }}>$1,250</p>
              </div>
              <a href="#" style={{ fontSize: '12px', color: '#D99201', textDecoration: 'none' }}>See all</a>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div style={{ padding: '0 16px', marginTop: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1A3F22',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>Goals / Vaults</h2>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          paddingBottom: '16px',
          padding: '0 16px',
          flexWrap: 'nowrap',
          overflowX: 'auto'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', width: '100%' }}>
              <div style={{
                animation: 'spin 1s linear infinite',
                borderRadius: '50%',
                height: '32px',
                width: '32px',
                borderBottom: '2px solid #1A3F22',
                margin: '0 auto'
              }}></div>
              <p style={{ color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>Loading goals...</p>
            </div>
          ) : goals.length > 0 ? (
            goals.map((goal, index) => (
              <div 
                key={index} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                  width: '160px',
                  flexShrink: 0,
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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
                      {getIconComponent(goal.icon)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A3F22',
                    margin: 0
                  }}>{goal.name}</p>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '8px'
                }}>
                  <div 
                    style={{
                      height: '8px',
                      background: 'linear-gradient(to right, #58761B, #D99201)',
                      width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                      transition: 'width 0.8s ease-in-out',
                      borderRadius: '4px',
                      position: 'relative'
                    }}
                  ></div>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'left',
                  margin: 0
                }}>
                  ${goal.currentAmount.toFixed(0)} / ${goal.targetAmount.toFixed(0)}
                </p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', width: '100%' }}>
              <p style={{ color: '#6b7280', margin: 0 }}>No savings goals yet</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{ padding: '0 16px', marginTop: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1A3F22',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>Recent Activity</h2>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #f3f4f6' }}>
              <li style={{
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(88, 118, 27, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '14px' }}>arrow_downward</span>
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A3F22', margin: 0 }}>Transfer from Checking</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Deposit</p>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', color: '#58761B', fontSize: '14px', margin: 0 }}>+$500.00</p>
              </li>
              
              <li style={{
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '14px' }}>arrow_upward</span>
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A3F22', margin: 0 }}>Car Payment</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Withdrawal</p>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '14px', margin: 0 }}>-$200.00</p>
              </li>
              
              <li style={{
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217, 146, 1, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#D99201', fontSize: '14px' }}>trending_up</span>
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A3F22', margin: 0 }}>Monthly Interest</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Interest</p>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', color: '#D99201', fontSize: '14px', margin: 0 }}>+$12.50</p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Savings;