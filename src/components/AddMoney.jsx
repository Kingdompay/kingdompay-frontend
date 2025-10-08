import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const AddMoney = () => {
  const navigate = useNavigate();
  console.log('AddMoney component loaded!');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'account_balance',
      description: 'Transfer from your bank account',
      fee: 'Free'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit_card',
      description: 'Add money using your card',
      fee: '2.9% fee'
    },
    {
      id: 'cash',
      name: 'Cash Deposit',
      icon: 'local_atm',
      description: 'Deposit cash at partner locations',
      fee: '$1.00 fee'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: 'currency_bitcoin',
      description: 'Convert crypto to wallet balance',
      fee: '1% fee'
    }
  ];

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleAddMoney = () => {
    console.log('Adding money:', { amount, paymentMethod });
    navigate('/home');
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
            Add Money
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
              How much do you want to add?
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
                {[25, 50, 100, 200, 500, 1000].map((quickAmount) => (
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

          {/* Payment Methods */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Choose Payment Method
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    backgroundColor: paymentMethod === method.id ? '#f0f9ff' : 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: paymentMethod === method.id ? '2px solid #6f9c16' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {paymentMethod === method.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '20px',
                      backgroundColor: '#6f9c16',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Selected
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: paymentMethod === method.id ? '#E9F0E1' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px'
                      }}>
                        <span className="material-symbols-outlined" style={{ 
                          color: paymentMethod === method.id ? '#58761B' : '#6b7280', 
                          fontSize: '24px' 
                        }}>
                          {method.icon}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                          {method.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: method.fee === 'Free' ? '#059669' : '#d97706'
                    }}>
                      {method.fee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {amount && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Transaction Summary
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Amount to Add</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f9c16' }}>{amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Payment Method</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22' }}>
                  {paymentMethods.find(m => m.id === paymentMethod)?.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Fee</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22' }}>
                  {paymentMethods.find(m => m.id === paymentMethod)?.fee}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22' }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A3F22' }}>
                    {amount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div style={{
            backgroundColor: '#fef3c7',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: '20px', marginRight: '8px' }}>
                security
              </span>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#d97706', margin: 0 }}>
                Secure Transaction
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0, lineHeight: '1.4' }}>
              All transactions are encrypted and protected by bank-level security. Your financial information is safe with us.
            </p>
          </div>
        </main>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <button
            onClick={handleAddMoney}
            disabled={!amount || !paymentMethod}
            style={{
              width: '100%',
              backgroundColor: (!amount || !paymentMethod) ? '#d1d5db' : '#6f9c16',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (!amount || !paymentMethod) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            Add Money
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default AddMoney;
