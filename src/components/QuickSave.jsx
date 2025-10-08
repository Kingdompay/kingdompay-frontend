import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const QuickSave = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [note, setNote] = useState('');

  const savingsGoals = [
    {
      id: 1,
      name: 'Emergency Fund',
      current: 2500,
      target: 10000,
      icon: 'emergency',
      color: '#dc2626'
    },
    {
      id: 2,
      name: 'Vacation Fund',
      current: 800,
      target: 3000,
      icon: 'flight',
      color: '#2563eb'
    },
    {
      id: 3,
      name: 'New Car',
      current: 5000,
      target: 25000,
      icon: 'directions_car',
      color: '#d97706'
    },
    {
      id: 4,
      name: 'Home Down Payment',
      current: 12000,
      target: 50000,
      icon: 'home',
      color: '#059669'
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleSave = () => {
    console.log('Quick save:', { amount, selectedGoal, note });
    navigate('/savings');
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
            onClick={() => navigate('/savings')}
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
            Quick Save
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
          
          {/* Amount Section */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              How much do you want to save?
            </h2>
            
            {/* Amount Input */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Amount</p>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const formatted = formatAmount(e.target.value);
                    setAmount(formatted);
                  }}
                  placeholder="$0.00"
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1A3F22',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: '0 0 12px 0' }}>
                Quick Amounts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(`$${quickAmount}.00`)}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1A3F22',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#6f9c16';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = '#6f9c16';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#1A3F22';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Goal Selection */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Choose a savings goal
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savingsGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  style={{
                    backgroundColor: selectedGoal === goal.id ? '#f0f9ff' : 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: selectedGoal === goal.id ? '2px solid #6f9c16' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${goal.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <span className="material-symbols-outlined" style={{ 
                        color: goal.color, 
                        fontSize: '20px' 
                      }}>
                        {goal.icon}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                        {goal.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        height: '6px',
                        backgroundColor: goal.color,
                        width: `${(goal.current / goal.target) * 100}%`,
                        transition: 'width 0.8s ease-in-out',
                        borderRadius: '3px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1A3F22',
              marginBottom: '8px'
            }}>
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this savings..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#f9fafb',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6f9c16'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Summary */}
          {amount && selectedGoal && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Save Summary
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Amount</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>{amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Goal</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22' }}>
                  {savingsGoals.find(g => g.id === selectedGoal)?.name}
                </span>
              </div>
            </div>
          )}
        </main>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <button
            onClick={handleSave}
            disabled={!amount || !selectedGoal}
            style={{
              width: '100%',
              backgroundColor: (!amount || !selectedGoal) ? '#d1d5db' : '#6f9c16',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (!amount || !selectedGoal) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            Save Money
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default QuickSave;
