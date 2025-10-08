import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const ChatSupport = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setIsTyping(true);
      
      // Simulate support response
      setTimeout(() => {
        const supportResponse = {
          id: messages.length + 2,
          text: 'Thank you for your message. Our support team will get back to you shortly.',
          sender: 'support',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, supportResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickReplies = [
    'Account balance issue',
    'Transaction not working',
    'Forgot password',
    'Card not working',
    'App crashing'
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
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1A3F22',
              margin: 0
            }}>
              Chat Support
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#6f9c16',
              margin: '2px 0 0 0'
            }}>
              Online
            </p>
          </div>
          <button
            onClick={() => console.log('More options')}
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
              more_vert
            </span>
          </button>
        </header>

        {/* Chat Messages */}
        <main style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px'
              }}
            >
              <div style={{
                maxWidth: '80%',
                backgroundColor: msg.sender === 'user' ? '#6f9c16' : '#f3f4f6',
                color: msg.sender === 'user' ? 'white' : '#1A3F22',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                <p style={{ margin: 0 }}>{msg.text}</p>
                <p style={{
                  fontSize: '11px',
                  opacity: 0.7,
                  margin: '4px 0 0 0'
                }}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Support is typing</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'typing 1.4s infinite ease-in-out'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'typing 1.4s infinite ease-in-out 0.2s'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'typing 1.4s infinite ease-in-out 0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Quick Replies */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
            Quick replies:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => setMessage(reply)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '12px',
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
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb'
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: message.trim() ? '#6f9c16' : '#d1d5db',
                border: 'none',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease'
              }}
            >
              <span className="material-symbols-outlined" style={{ 
                color: 'white', 
                fontSize: '20px' 
              }}>
                send
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
        
        {/* Typing Animation */}
        <style>
          {`
            @keyframes typing {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-10px); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ChatSupport;
