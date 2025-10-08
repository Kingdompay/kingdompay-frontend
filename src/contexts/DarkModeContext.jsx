import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then default to false
    const saved = localStorage.getItem('kingdompay-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Save to localStorage whenever dark mode changes
    localStorage.setItem('kingdompay-dark-mode', JSON.stringify(isDarkMode));
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Dark green theme colors
  const darkTheme = {
    primary: '#1A3F22',      // Dark green
    secondary: '#58761B',    // Medium green
    accent: '#D99201',       // Gold
    background: '#0D1B0F',   // Very dark green
    surface: '#1A2E1D',      // Dark surface
    surfaceVariant: '#243B28', // Slightly lighter surface
    text: '#E8F5E8',         // Light green text
    textSecondary: '#A8C4A8', // Muted green text
    border: '#2D4A32',       // Dark green border
    error: '#FF6B6B',
    warning: '#FFA726',
    success: '#4CAF50'
  };

  // Light theme colors (existing)
  const lightTheme = {
    primary: '#1A3F22',
    secondary: '#58761B',
    accent: '#D99201',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F9FAFB',
    text: '#1A3F22',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#DC2626',
    warning: '#D97706',
    success: '#059669'
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    toggleDarkMode,
    theme
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
