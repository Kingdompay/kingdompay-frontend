import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const SendMoney = () => {
  const navigate = useNavigate();
  console.log('SendMoney component loaded!');
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    message: '',
    paymentMethod: 'wallet'
  });
  const [step, setStep] = useState(1); // 1: Recipient, 2: Amount, 3: Review

  const recentContacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      phone: '+1 (555) 456-7890',
      avatar: 'ED'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSend = () => {
    console.log('Money sent:', formData);
    navigate('/home');
  };

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
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
            Send Money
          </h1>
          <div style={{ width: '40px' }}></div>
        </header>

        {/* Progress Steps */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepNumber ? '#6f9c16' : '#e5e7eb',
                  color: step >= stepNumber ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: step > stepNumber ? '#6f9c16' : '#e5e7eb',
                    margin: '0 8px'
                  }}></div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: step >= 1 ? '#6f9c16' : '#9ca3af' }}>Recipient</span>
            <span style={{ fontSize: '12px', color: step >= 2 ? '#6f9c16' : '#9ca3af' }}>Amount</span>
            <span style={{ fontSize: '12px', color: step >= 3 ? '#6f9c16' : '#9ca3af' }}>Review</span>
          </div>
        </div>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          {/* Step 1: Recipient */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Who do you want to send money to?
              </h2>
              
              {/* Search Input */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="Enter phone number, email, or name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6f9c16'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Recent Contacts */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: '0 0 12px 0' }}>
                  Recent Contacts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        setFormData({ ...formData, recipient: contact.name });
                        setStep(2);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#6f9c16',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginRight: '12px'
                        }}>
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                            {contact.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            {contact.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Amount */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                How much do you want to send?
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
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setFormData({ ...formData, amount: formatted });
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
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: '0 0 12px 0' }}>
                  Quick Amounts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[10, 25, 50, 100, 200, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setFormData({ ...formData, amount: `$${amount}.00` })}
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
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A3F22',
                  marginBottom: '8px'
                }}>
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add a note..."
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
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Review your payment
              </h2>
              
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>To</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22' }}>{formData.recipient}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6f9c16' }}>{formData.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Fee</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22' }}>Free</span>
                </div>
                {formData.message && (
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Message</span>
                    <p style={{ fontSize: '14px', color: '#1A3F22', margin: '4px 0 0 0' }}>{formData.message}</p>
                  </div>
                )}
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
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!formData.recipient || (step === 2 && !formData.amount)}
              style={{
                width: '100%',
                backgroundColor: (!formData.recipient || (step === 2 && !formData.amount)) ? '#d1d5db' : '#6f9c16',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!formData.recipient || (step === 2 && !formData.amount)) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSend}
              style={{
                width: '100%',
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
              Send Money
            </button>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default SendMoney;
