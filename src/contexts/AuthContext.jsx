import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if token exists and is valid (optional: verify with backend)
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [state.token]);

  const login = async (email, password, role = 'user') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Mocking role-based login for now since backend might not support it yet
      // In a real app, the backend would return the role
      const response = await api.post('/auth/login', { email, password });

      // Check for persisted verification status in localStorage
      const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
      const userVerification = mockVerifications.find(v => v.email === response.data.user.email);

      const verificationStatus = userVerification ? userVerification.status : 'unverified';
      const limits = verificationStatus === 'verified'
        ? { daily: 5000, monthly: 25000 }
        : { daily: 500, monthly: 2000 };

      // Inject role and verification status into user object for frontend logic
      const userWithRole = {
        ...response.data.user,
        role: role,
        verificationStatus,
        limits
      };

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: userWithRole,
          token: response.data.token
        }
      });
      return { success: true };
    } catch (error) {
      // Fallback for demo/testing without backend
      if (email.startsWith('demo') || email.startsWith('admin') || email.startsWith('institution')) {
        // Check for persisted verification status in localStorage
        const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
        const userVerification = mockVerifications.find(v => v.email === email);

        let isVerified = email === 'demo@kingdompay.com';
        let status = isVerified ? 'verified' : 'unverified';

        if (userVerification) {
          status = userVerification.status;
        }

        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email,
          role: role,
          balance: 5000.00,
          verificationStatus: status,
          limits: status === 'verified' ? { daily: 5000, monthly: 25000 } : { daily: 500, monthly: 2000 }
        };
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: mockUser,
            token: 'mock-token-' + Date.now()
          }
        });
        return { success: true };
      }

      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await api.post('/auth/register', userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      // Fallback for demo/testing without backend
      console.warn("Backend not reachable, using mock registration");
      const mockUser = {
        id: 'new-user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        balance: 0.00,
        verificationStatus: 'unverified',
        limits: { daily: 500, monthly: 2000 }
      };

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: mockUser,
          token: 'mock-token-' + Date.now()
        }
      });
      return { success: true };
    }
  };

  const uploadDocument = async (file) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update local state to pending
        if (state.user) {
          const updatedUser = { ...state.user, verificationStatus: 'pending' };

          // Persist the request to localStorage for Admin to see
          const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');

          // Remove existing request for this user if any
          const filtered = mockVerifications.filter(v => v.email !== state.user.email);

          filtered.push({
            id: Date.now(),
            name: state.user.name,
            email: state.user.email,
            documentType: 'ID Card', // Mock type
            status: 'pending',
            submittedAt: new Date().toISOString().split('T')[0]
          });

          localStorage.setItem('mock_verifications', JSON.stringify(filtered));

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: updatedUser, token: state.token }
          });
        }
        resolve({ success: true });
      }, 1500);
    });
  };

  // Helper to update user status (for Admin demo)
  const updateUserStatus = (userId, status) => {
    // This is called by Admin. We need to update the localStorage so the user sees it next time.
    const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
    const updatedVerifications = mockVerifications.map(v =>
      v.id === userId ? { ...v, status } : v
    );
    localStorage.setItem('mock_verifications', JSON.stringify(updatedVerifications));

    // Also update current user if it happens to be the same (unlikely for Admin approving themselves, but good for safety)
    if (state.user && state.user.id === userId) {
      const limits = status === 'verified'
        ? { daily: 5000, monthly: 25000 }
        : { daily: 500, monthly: 2000 };

      const updatedUser = { ...state.user, verificationStatus: status, limits };
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: updatedUser, token: state.token }
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    // Implement if needed
  };

  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    uploadDocument,
    updateUserStatus
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
