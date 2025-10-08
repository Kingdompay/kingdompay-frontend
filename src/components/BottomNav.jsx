import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/community', icon: 'groups', label: 'Community' },
    { path: '/payments', icon: 'qr_code_scanner', label: 'Payments' },
    { path: '/savings', icon: 'savings', label: 'Savings' },
    { path: '/profile', icon: 'person', label: 'Profile' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '384px',
      margin: '0 auto',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 63, 34, 0.6)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -5px 30px -5px rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(217, 146, 1, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              style={{ 
                textAlign: 'center', 
                color: isActive(item.path) ? '#D99201' : 'rgba(255, 255, 255, 0.6)', 
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                {item.icon}
              </span>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '500' }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
