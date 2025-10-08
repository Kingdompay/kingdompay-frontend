import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#1A3F22', message = 'Loading...' }) => {
  const sizeMap = {
    small: '16px',
    medium: '32px',
    large: '48px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '12px'
    }}>
      <div style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      {message && (
        <p style={{
          color: color,
          fontSize: '14px',
          fontWeight: '500',
          margin: 0,
          opacity: 0.8
        }}>
          {message}
        </p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
