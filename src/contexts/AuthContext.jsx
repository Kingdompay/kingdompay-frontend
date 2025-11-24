import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock user data - always authenticated
const mockUser = {
  id: 'demo-user-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@kingdompay.com',
  phone: '+1 234 567 890',
  balance: 1234.56,
  savingsBalance: 16000.00,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/user/profile');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: state.token,
            },
          });
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    // Always succeed
    return { success: true };
  };

  const register = async () => {
    // Always succeed
    return { success: true };
  };

  const logout = () => {
    // No-op for demo
  };

  const updateUser = () => {
    // No-op for demo
  };

  const value = {
    user,
    token: 'demo-token',
    isAuthenticated,
    loading,
    error: null,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
