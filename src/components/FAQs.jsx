import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const FAQs = () => {
  const navigate = useNavigate();
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'account',
      name: 'Account',
      icon: 'person',
      color: '#6f9c16'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: 'payments',
      color: '#D99201'
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'security',
      color: '#dc2626'
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: 'build',
      color: '#7c3aed'
    }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create a KingdomPay account?',
      answer: 'To create a KingdomPay account, download our app from the App Store or Google Play, then tap "Sign Up" and follow the on-screen instructions. You\'ll need to provide your email, phone number, and create a secure password.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I verify my identity?',
      answer: 'To verify your identity, go to your profile settings and tap "Verify Identity". You\'ll need to provide a government-issued ID and take a selfie. The verification process typically takes 1-2 business days.'
    },
    {
      id: 3,
      category: 'payments',
      question: 'How do I send money to friends?',
      answer: 'To send money, tap the "Send" button on the home screen, enter the recipient\'s phone number or email, specify the amount, and confirm the transaction. The money will be sent instantly.'
    },
    {
      id: 4,
      category: 'payments',
      question: 'What are the transaction fees?',
      answer: 'Most transactions are free. Small fees may apply for international transfers or expedited processing. Check the transaction details before confirming any payment to see applicable fees.'
    },
    {
      id: 5,
      category: 'payments',
      question: 'How long do transfers take?',
      answer: 'Domestic transfers are typically instant. International transfers may take 1-3 business days depending on the destination country and payment method.'
    },
    {
      id: 6,
      category: 'security',
      question: 'Is my money safe?',
      answer: 'Yes, your money is protected by bank-level security. We use encryption and fraud monitoring to keep your account safe. Your funds are also insured up to $250,000.'
    },
    {
      id: 7,
      category: 'security',
      question: 'What should I do if I lose my phone?',
      answer: 'If you lose your phone, immediately contact our support team or log into your account from another device to freeze your account. You can also change your password and PIN to secure your account.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'Why can\'t I log into my account?',
      answer: 'If you can\'t log in, try resetting your password using the "Forgot Password" option. Make sure you\'re using the correct email address and that your internet connection is stable.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'The app is crashing. What should I do?',
      answer: 'Try closing and reopening the app. If the problem persists, restart your phone and update to the latest version of the KingdomPay app from the App Store or Google Play.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'How do I update my app?',
      answer: 'To update the app, go to the App Store (iOS) or Google Play Store (Android), search for "KingdomPay", and tap "Update" if an update is available.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  const getCategoryFAQs = (categoryId) => {
    return filteredFAQs.filter(faq => faq.category === categoryId);
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
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
              Frequently Asked Questions
            </h1>
            <div style={{ width: '40px' }}></div>
          </div>
          
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
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
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          
          {/* Categories */}
          {!searchTerm && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
                Browse by Category
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {faqCategories.map((category) => (
                  <div
                    key={category.id}
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
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)';
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
                      backgroundColor: `${category.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}>
                      <span className="material-symbols-outlined" style={{ 
                        color: category.color, 
                        fontSize: '24px' 
                      }}>
                        {category.icon}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                      {category.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 16px 0' }}>
              {searchTerm ? `Search Results (${filteredFAQs.length})` : 'All Questions'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
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
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#E9F0E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '24px' }}>
                      search_off
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                    No results found
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div style={{ marginTop: '32px' }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #bae6fd',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#E9F0E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '24px' }}>
                  help
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: '0 0 8px 0' }}>
                Still need help?
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                Can't find what you're looking for? Contact our support team.
              </p>
              <button 
                onClick={() => navigate('/chat-support')}
                style={{
                  backgroundColor: '#0369a1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default FAQs;
