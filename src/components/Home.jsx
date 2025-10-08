import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import BottomNav from './BottomNav';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useDarkMode();
  const navigate = useNavigate();
  
  console.log('Home component - user:', user);
  console.log('Home component - isAuthenticated:', isAuthenticated);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonStates, setButtonStates] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const retryFetchTransactions = () => {
    setLoading(true);
    setError(null);
    // Retry logic would go here
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleWalletClick = () => {
    console.log('Wallet clicked!');
  };

  const handleButtonClick = (action) => {
    console.log(`${action} button clicked!`);
    console.log('Navigate function:', navigate);
    // Add button press animation
    setButtonStates(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [action]: false }));
    }, 150);
    
    // Handle different actions
    switch(action) {
      case 'Add':
        console.log('Navigating to /add-money');
        navigate('/add-money');
        break;
      case 'Send':
        console.log('Navigating to /send-money');
        navigate('/send-money');
        break;
      case 'Swap':
        console.log('Navigating to /request-money');
        navigate('/request-money');
        break;
      case 'More':
        console.log('More options clicked');
        break;
      default:
        break;
    }
  };

  const createRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div style={{ 
      backgroundColor: '#F7F7F7', 
      minHeight: '100vh',
      fontFamily: 'Google Sans, sans-serif'
    }}>
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
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
        backgroundColor: '#F7F7F7',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Section with Gradient */}
        <div style={{ position: 'relative' }} className="animate-fade-in-up">
          <div style={{
            background: 'linear-gradient(135deg, #1A3F22, #58761B, #D99201, #905A01)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '0 0 24px 24px'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg, #1A3F22, #58761B, #D99201, #905A01)',
              paddingBottom: '64px',
              borderRadius: '0 0 24px 24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Top Bar */}
              <div style={{ padding: '24px 24px 16px 24px' }} className="animate-slide-in-left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <img 
                    alt="User avatar" 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease'
                    }}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfS87tQQpysb3SZb5EX2azLsLtUChd2UpaGt5D22Tn_Ny7cDwSz2xCl12t4l8mACrP3I0k8dj0_ixIR9rUGVZJjHWYgOy4CP8uMZ0DBkR0fP3CkUAduPLe38Gb86XfLPstMMA9FYtv6ZtKU7jk23KY30EJ6UgPTSaZOfHK7Fxx6rJhLg1e1TNMhHhFKTR7YTL6Z03U-yiGLwhQ9wo9DElyPEPz4JRpH527L3jtyEp_T5-777K8mU6RUowlNtEnkg6d1WptBPUpPPIm"
                  />
                  <div>
                    <span className="material-symbols-outlined animate-pulse" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '32px' }}>
                      notifications
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Balance Section */}
              <div style={{ padding: '0 24px 16px 24px' }} className="animate-slide-in-right">
                <p style={{ fontSize: '14px', fontWeight: '300', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Total Balance
                </p>
                <p style={{ fontSize: '48px', fontWeight: 'bold', marginTop: '4px', color: 'white', margin: '4px 0 0 0' }}>
                  $1,234.56
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ padding: '0 24px', marginTop: '-64px', position: 'relative', zIndex: 20 }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => {
                        handleButtonClick('Add');
                        createRippleEffect(e);
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#1A3F22',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transform: buttonStates.Add ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                        arrow_downward
                      </span>
                    </button>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                      Add
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => {
                        handleButtonClick('Send');
                        createRippleEffect(e);
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#1A3F22',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transform: buttonStates.Send ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                        arrow_upward
                      </span>
                    </button>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                      Send
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => {
                        handleButtonClick('Swap');
                        createRippleEffect(e);
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#1A3F22',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transform: buttonStates.Swap ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                        swap_horiz
                      </span>
                    </button>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                      Swap
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={(e) => {
                        handleButtonClick('More');
                        createRippleEffect(e);
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#1A3F22',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transform: buttonStates.More ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                        more_horiz
                      </span>
                    </button>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#1A3F22', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                      More
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{
          flexGrow: 1,
          backgroundColor: 'white',
          borderRadius: '24px 24px 0 0',
          paddingTop: '24px',
          overflowY: 'auto',
          marginTop: '24px'
        }}>
          {/* Wallet Overview Card */}
          <div style={{ padding: '0 24px 24px 24px' }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #D99201, #905A01, #58761B, #1A3F22)',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleWalletClick}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Wallet Overview
                </p>
                <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginTop: '4px', margin: '4px 0 0 0' }}>
                  My Wallet
                </p>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '50%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>
                  account_balance_wallet
                </span>
              </div>
            </div>
          </div>
          
          {/* Transactions Section */}
          <div style={{ padding: '0 24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Transactions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Starbucks Transaction */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        alt="Starbucks Logo" 
                        style={{ height: '24px', width: '24px' }}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBStM_hz-u8r2KO6IvXg0Kk2nxv0unerH2irRiQ3xqB_E3M8dWVTl7mev2P4XetbO-su4CWT4w_qneL2EChSuW_AfM4e7_m7ZnFTlI98ZxgSFSzJ19yDQ-LcFDWqgtxIqRYMLR1iUnXl8EBPA0hTo_S4HbIeZ6oixukFq04M8QPABAgLD37lZpf-0NVpvcWdQAY8PQuKDo_jhQMnbDV_Hoi3JQUpcBctGtIN-1BPj-pzqMI6dZanREgnF8ckxKzVQk_oAHBJFGAqlge" 
                      />
                    </div>
                    <div style={{ marginLeft: '16px' }}>
                      <p style={{ fontWeight: '500', color: '#1A3F22', margin: 0 }}>
                        Starbucks
                      </p>
                      <p style={{ fontSize: '14px', color: '#58761B', margin: 0 }}>
                        Today, 16:30
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: '500', color: '#905A01', fontSize: '18px', margin: 0 }}>
                    -$3.25
                  </p>
                </div>
              </div>
              
              {/* Bank Deposit Transaction */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#1A3F22', fontSize: '20px' }}>
                        account_balance_wallet
                      </span>
                    </div>
                    <div style={{ marginLeft: '16px' }}>
                      <p style={{ fontWeight: '500', color: '#1A3F22', margin: 0 }}>
                        Bank Deposit
                      </p>
                      <p style={{ fontSize: '14px', color: '#58761B', margin: 0 }}>
                        Yesterday, 10:30
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: '500', color: '#1A3F22', fontSize: '18px', margin: 0 }}>
                    +$200.00
                  </p>
                </div>
              </div>
              
              {/* Amazon Transaction */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        alt="Amazon Logo" 
                        style={{ height: '20px', width: '20px' }}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvRO6wSon4f-WXoH9UQFxX79RYYTnKgdPe4-SqOARXH_vFUjaFPGRoWMVhAWnPc5IHVAd9inB0oH7rVx5-hJSDjw7WvehLWqcp-OKC8_yPl6BsAk97AycYOrDMbjhpfnrBqKky6o8T89CsyagTKsifOUwZfwooEdszao12qAuBSMe-CJc6s91mmfP8a10z8qJY5g9mVLyVe8BPnOks5_fwR7lp0Nqp7D5YxJxLXp3qLnIbzH3_1FgTktD2EMnbuGUl_HK3ohiIzcbz" 
                      />
                    </div>
                    <div style={{ marginLeft: '16px' }}>
                      <p style={{ fontWeight: '500', color: '#1A3F22', margin: 0 }}>
                        Amazon.com
                      </p>
                      <p style={{ fontSize: '14px', color: '#58761B', margin: 0 }}>
                        Oct 28, 09:12
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: '500', color: '#905A01', fontSize: '18px', margin: 0 }}>
                    -$49.99
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;