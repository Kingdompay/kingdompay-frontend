import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I add money to my wallet?",
      answer: "You can add money to your wallet by linking your bank account, using a debit/credit card, or visiting any of our partner locations. Go to the Home page and tap the 'Add' button to get started."
    },
    {
      id: 2,
      question: "How do I send money to friends?",
      answer: "To send money, go to the Home page and tap the 'Send' button. Enter the recipient's phone number or email, amount, and confirm the transaction. The money will be sent instantly."
    },
    {
      id: 3,
      question: "What are the transaction fees?",
      answer: "Most transactions are free. Small fees may apply for international transfers or expedited processing. Check the transaction details before confirming any payment."
    },
    {
      id: 4,
      question: "How do I set up savings goals?",
      answer: "Go to the Savings page and tap 'Add New Goal'. Set your target amount, choose an icon, and start saving. You can track your progress and make contributions anytime."
    },
    {
      id: 5,
      question: "Is my money safe?",
      answer: "Yes, your money is protected by bank-level security. We use encryption and fraud monitoring to keep your account safe. Your funds are also insured up to $250,000."
    }
  ];

  const contactMethods = [
    {
      icon: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat'
    },
    {
      icon: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      action: 'Send Email'
    },
    {
      icon: 'phone',
      title: 'Phone Support',
      description: 'Call us directly',
      action: 'Call Now'
    }
  ];

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
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
            Help & Support
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
          
          {/* Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              position: 'relative',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px solid #e5e7eb'
            }}>
              <input
                type="text"
                placeholder="Search help topics..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  outline: 'none'
                }}
              />
              <span 
                className="material-symbols-outlined" 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280', 
                  fontSize: '20px' 
                }}
              >
                search
              </span>
            </div>
          </div>

          {/* Quick Help */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Quick Help
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
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
                        {method.icon}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                        {method.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <button style={{
                    backgroundColor: '#6f9c16',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0, flex: 1 }}>
                      {faq.question}
                    </h3>
                    <span 
                      className="material-symbols-outlined" 
                      style={{ 
                        color: '#6b7280', 
                        fontSize: '20px',
                        transform: activeFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      expand_more
                    </span>
                  </button>
                  {activeFAQ === faq.id && (
                    <div style={{
                      padding: '0 20px 20px 20px',
                      borderTop: '1px solid #e5e7eb',
                      backgroundColor: 'white'
                    }}>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div style={{
            backgroundColor: '#fef2f2',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#dc2626', fontSize: '24px' }}>
                emergency
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', margin: '0 0 8px 0' }}>
              Emergency Support
            </h3>
            <p style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 16px 0' }}>
              If your account has been compromised or you need immediate assistance
            </p>
            <button style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Contact Emergency Support
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default HelpSupport;
