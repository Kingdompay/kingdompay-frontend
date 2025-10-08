import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Page</h1>
      <p>This is a test page to verify routing is working.</p>
      <button 
        onClick={() => navigate('/home')}
        style={{
          backgroundColor: '#6f9c16',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default TestPage;
