import React from 'react';
import { getErrorType } from '../utils/errorHandler';

const ErrorMessage = ({ message, onRetry, showRetry = true, type, error }) => {
  // Determine error type from error object if provided
  const errorType = type || (error ? getErrorType(error) : 'unknown');
  
  const getIcon = () => {
    switch (errorType) {
      case 'network':
        return 'wifi_off';
      case 'auth':
        return 'lock';
      case 'validation':
        return 'error_outline';
      case 'server':
        return 'dns';
      default:
        return 'error';
    }
  };
  
  const getColor = () => {
    switch (errorType) {
      case 'network':
        return { bg: '#fef3c7', icon: '#f59e0b' };
      case 'auth':
        return { bg: '#fee2e2', icon: '#ef4444' };
      case 'validation':
        return { bg: '#fef2f2', icon: '#ef4444' };
      case 'server':
        return { bg: '#fee2e2', icon: '#dc2626' };
      default:
        return { bg: '#fef2f2', icon: '#ef4444' };
    }
  };
  
  const colors = getColor();
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
        backgroundColor: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
      }}>
        <span className="material-symbols-outlined" style={{ color: colors.icon, fontSize: '24px' }}>
          {getIcon()}
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
