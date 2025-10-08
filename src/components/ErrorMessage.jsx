import React from 'react';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '16px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#fef2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
      }}>
        <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '24px' }}>
          error
        </span>
      </div>
      
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1A3F22',
        margin: 0
      }}>
        Something went wrong
      </h3>
      
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
        maxWidth: '280px'
      }}>
        {message || 'We encountered an error while loading your data. Please try again.'}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#6f9c16',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a7a12';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6f9c16';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
