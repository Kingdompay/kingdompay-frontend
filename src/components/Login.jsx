import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    const result = await login('demo@kingdompay.com', 'password123');
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const [ripples, setRipples] = useState([]);
  const [buttonStates, setButtonStates] = useState({});

  const createRippleEffect = (e, buttonId) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleButtonClick = (action) => {
    setButtonStates(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [action]: false }));
    }, 150);
  };

  return (
    <div style={{
      maxWidth: '384px',
      margin: '0 auto',
      backgroundColor: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Manrope, "Noto Sans", sans-serif'
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
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes inputFocus {
            from {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(111, 156, 22, 0.4);
            }
            to {
              transform: scale(1.02);
              box-shadow: 0 0 0 8px rgba(111, 156, 22, 0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-slide-in-down {
            animation: slideInDown 0.6s ease-out forwards;
          }
          .animate-input-focus {
            animation: inputFocus 0.3s ease-out forwards;
          }
        `}
      </style>
      <div>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '16px 16px 8px 16px',
          justifyContent: 'space-between'
        }}>
          <button style={{ color: '#151711', opacity: 0.8, transition: 'opacity 0.3s', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 style={{
            color: '#151711',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '1.25',
            letterSpacing: '-0.015em',
            flex: 1,
            textAlign: 'center',
            margin: 0
          }}>KingdomPay</h2>
          <div style={{ display: 'flex', width: '48px', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button style={{
              display: 'flex',
              maxWidth: '480px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '0px',
              height: '48px',
              backgroundColor: 'transparent',
              color: '#151711',
              gap: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: 'normal',
              letterSpacing: '0.015em',
              minWidth: 0,
              padding: 0,
              border: 'none'
            }}>
              <div style={{ color: '#151711' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        {/* Title */}
        <h3 style={{
          color: '#151711',
          letterSpacing: 'light',
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: '1.25',
          padding: '0 16px',
          textAlign: 'center',
          paddingBottom: '8px',
          paddingTop: '20px',
          margin: 0
        }}>Welcome back</h3>
        
        {/* Error Message */}
        {error && (
          <div style={{
            margin: '0 16px',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '12px'
          }}>
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            maxWidth: '480px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '16px',
            padding: '0 16px 12px 16px'
          }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              flex: 1
            }}>
              <input
                type="email"
                name="email"
                placeholder="Email or phone number"
                style={{
                  display: 'flex',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  resize: 'none',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  color: '#151711',
                  outline: 'none',
                  border: (focusedField === 'email' || validationErrors.email) ? '2px solid #6f9c16' : '2px solid transparent',
                  backgroundColor: (focusedField === 'email' || validationErrors.email) ? '#ffffff' : '#f3f4f0',
                  height: '56px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  lineHeight: 'normal',
                  transition: 'all 0.3s ease',
                  boxShadow: (focusedField === 'email' || validationErrors.email) ? '0 4px 12px rgba(111, 156, 22, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                required
                aria-invalid={validationErrors.email ? 'true' : 'false'}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
              {validationErrors.email && (
                <span
                  id="email-error"
                  style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    paddingLeft: '4px'
                  }}
                >
                  {validationErrors.email}
                </span>
              )}
            </label>
          </div>
          
          <div style={{
            display: 'flex',
            maxWidth: '480px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '16px',
            padding: '0 16px 12px 16px'
          }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              flex: 1
            }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                style={{
                  display: 'flex',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  resize: 'none',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  color: '#151711',
                  outline: 'none',
                  border: (focusedField === 'password' || validationErrors.password) ? '2px solid #6f9c16' : '2px solid transparent',
                  backgroundColor: (focusedField === 'password' || validationErrors.password) ? '#ffffff' : '#f3f4f0',
                  height: '56px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  lineHeight: 'normal',
                  transition: 'all 0.3s ease',
                  boxShadow: (focusedField === 'password' || validationErrors.password) ? '0 4px 12px rgba(111, 156, 22, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                required
                aria-invalid={validationErrors.password ? 'true' : 'false'}
                aria-describedby={validationErrors.password ? 'password-error' : undefined}
              />
              {validationErrors.password && (
                <span
                  id="password-error"
                  style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    paddingLeft: '4px'
                  }}
                >
                  {validationErrors.password}
                </span>
              )}
            </label>
          </div>
          
          <p style={{
            color: '#7b8764',
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: 'normal',
            paddingBottom: '12px',
            paddingTop: '4px',
            paddingLeft: '16px',
            paddingRight: '16px',
            textDecoration: 'underline',
            cursor: 'pointer',
            margin: 0
          }}>Forgot password?</p>
          
          <div style={{ display: 'flex', padding: '0 16px 12px 16px' }}>
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => createRippleEffect(e, 'login')}
              style={{
                display: 'flex',
                minWidth: '84px',
                maxWidth: '480px',
                cursor: loading ? 'not-allowed' : 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '0px',
                height: '48px',
                paddingLeft: '20px',
                paddingRight: '20px',
                flex: 1,
                backgroundColor: loading ? '#9ca3af' : '#6f9c16',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                transition: 'all 0.3s ease',
                border: 'none',
                opacity: loading ? 0.7 : 1,
                transform: buttonStates.login ? 'scale(0.95)' : 'scale(1)',
                boxShadow: '0 4px 12px rgba(111, 156, 22, 0.3)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#5a7a12';
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 6px 16px rgba(111, 156, 22, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#6f9c16';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(111, 156, 22, 0.3)';
                }
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {loading ? 'Logging in...' : 'Log in'}
              </span>
              {ripples.map(ripple => (
                <span
                  key={ripple.id}
                  style={{
                    position: 'absolute',
                    width: ripple.size,
                    height: ripple.size,
                    left: ripple.x,
                    top: ripple.y,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.6)',
                    transform: 'scale(0)',
                    animation: 'ripple 0.6s linear',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </button>
          </div>
        </form>
        
        {/* Social Login Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flex: 1,
            gap: '12px',
            maxWidth: '480px',
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: '0 16px 12px 16px'
          }}>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              style={{
                display: 'flex',
                minWidth: '84px',
                maxWidth: '480px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '0px',
                height: '40px',
                paddingLeft: '16px',
                paddingRight: '16px',
                backgroundColor: '#f3f4f0',
                color: '#151711',
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                width: '100%',
                border: 'none',
                opacity: loading ? 0.5 : 1
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Demo Login
              </span>
            </button>
            
            <button style={{
              display: 'flex',
              minWidth: '84px',
              maxWidth: '480px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '0px',
              height: '40px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: '#f3f4f0',
              color: '#151711',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: 'normal',
              letterSpacing: '0.015em',
              width: '100%',
              border: 'none',
              gap: '8px'
            }}>
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Continue with Google
              </span>
            </button>
            
            <button style={{
              display: 'flex',
              minWidth: '84px',
              maxWidth: '480px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '0px',
              height: '40px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: '#f3f4f0',
              color: '#151711',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: 'normal',
              letterSpacing: '0.015em',
              width: '100%',
              border: 'none',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Continue with Apple
              </span>
            </button>
            
            <button style={{
              display: 'flex',
              minWidth: '84px',
              maxWidth: '480px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '0px',
              height: '40px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: '#f3f4f0',
              color: '#151711',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: 'normal',
              letterSpacing: '0.015em',
              width: '100%',
              border: 'none',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Continue with Mobile Money
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div>
        <p style={{
          color: '#7b8764',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 'normal',
          paddingBottom: '12px',
          paddingTop: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          textAlign: 'center',
          textDecoration: 'underline',
          cursor: 'pointer',
          margin: 0
        }}>Don't have an account? Sign up</p>
        
        <p style={{
          color: '#7b8764',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 'normal',
          paddingBottom: '12px',
          paddingTop: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          textAlign: 'center',
          margin: 0
        }}>Version 1.2.3</p>
        
        <p style={{
          color: '#7b8764',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 'normal',
          paddingBottom: '12px',
          paddingTop: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          textAlign: 'center',
          margin: 0
        }}>Terms of Service | Privacy Policy</p>
        
        <p style={{
          color: '#7b8764',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 'normal',
          paddingBottom: '12px',
          paddingTop: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          textAlign: 'center',
          margin: 0
        }}>Your information is secure</p>
        
        <div style={{ height: '20px', backgroundColor: 'white' }}></div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Login;
