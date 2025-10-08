import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Cards = () => {
  const navigate = useNavigate();
  const [cards] = useState([
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1234',
      name: 'John Doe',
      expiry: '12/25',
      color: '#1A3F22',
      gradient: 'linear-gradient(135deg, #1A3F22, #58761B)'
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '**** **** **** 5678',
      name: 'John Doe',
      expiry: '08/26',
      color: '#D99201',
      gradient: 'linear-gradient(135deg, #D99201, #905A01)'
    }
  ]);

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
            Cards
          </h1>
          <button
            onClick={() => console.log('Add new card')}
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
              add
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
          
          {/* Add New Card Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => console.log('Add new card')}
              style={{
                width: '100%',
                backgroundColor: '#6f9c16',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7a12'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6f9c16'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                add
              </span>
              Add New Card
            </button>
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: card.gradient,
                  borderRadius: '16px',
                  padding: '20px',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {/* Card Type */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{card.type}</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      credit_card
                    </span>
                  </div>
                </div>

                {/* Card Number */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '2px' }}>
                    {card.number}
                  </span>
                </div>

                {/* Card Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '12px', margin: '0 0 4px 0', opacity: 0.8 }}>CARDHOLDER</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{card.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', margin: '0 0 4px 0', opacity: 0.8 }}>EXPIRES</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{card.expiry}</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  opacity: 0.5
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  opacity: 0.7
                }}></div>
              </div>
            ))}
          </div>

          {/* Card Management Options */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Freeze Card */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                    pause
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Freeze Card
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Temporarily disable your card
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
                Freeze
              </button>
            </div>

            {/* Card Limits */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                    account_balance
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Set Limits
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Manage spending limits
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
                Manage
              </button>
            </div>

            {/* Card History */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                    history
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A3F22', margin: 0 }}>
                    Transaction History
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    View card transactions
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
                View
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

export default Cards;
