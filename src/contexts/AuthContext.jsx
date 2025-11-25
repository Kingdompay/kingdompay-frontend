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
    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };

    // Granular updates to prevent race conditions
    case 'UPDATE_BALANCE': {
      if (!state.user) return state;
      const newBalance = action.payload;
      const updatedUser = { ...state.user, balance: newBalance };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_balance_${state.user.email}`, newBalance.toString());

      return { ...state, user: updatedUser };
    }

    case 'UPDATE_SAVINGS_BALANCE': {
      if (!state.user) return state;
      const newBalance = action.payload;
      const updatedUser = { ...state.user, savingsBalance: newBalance };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_savings_balance_${state.user.email}`, newBalance.toString());

      return { ...state, user: updatedUser };
    }

    case 'ADD_TRANSACTION': {
      if (!state.user) return state;
      const transaction = action.payload;
      const existingTransactions = state.user.transactions || [];
      const newTransactions = [transaction, ...existingTransactions];
      const updatedUser = { ...state.user, transactions: newTransactions };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_transactions_${state.user.email}`, JSON.stringify(newTransactions));

      return { ...state, user: updatedUser };
    }

    case 'ADD_NOTIFICATION': {
      if (!state.user) return state;
      const notification = action.payload;
      const existingNotifications = state.user.notifications || [];
      const newNotification = {
        id: Date.now(),
        read: false,
        time: new Date().toISOString(),
        ...notification
      };
      const newNotifications = [newNotification, ...existingNotifications];
      const updatedUser = { ...state.user, notifications: newNotifications };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_notifications_${state.user.email}`, JSON.stringify(newNotifications));

      return { ...state, user: updatedUser };
    }

    case 'MARK_AS_READ': {
      if (!state.user) return state;
      const notificationId = action.payload;
      const updatedNotifications = (state.user.notifications || []).map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      const updatedUser = { ...state.user, notifications: updatedNotifications };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_notifications_${state.user.email}`, JSON.stringify(updatedNotifications));

      return { ...state, user: updatedUser };
    }

    case 'MARK_ALL_READ': {
      if (!state.user) return state;
      const updatedNotifications = (state.user.notifications || []).map(n => ({ ...n, read: true }));
      const updatedUser = { ...state.user, notifications: updatedNotifications };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_notifications_${state.user.email}`, JSON.stringify(updatedNotifications));

      return { ...state, user: updatedUser };
    }

    // Savings Actions
    case 'ADD_SAVINGS_GOAL': {
      if (!state.user) return state;
      const goal = action.payload;
      const existingGoals = state.user.savingsGoals || [];
      const newGoals = [...existingGoals, goal];
      const updatedUser = { ...state.user, savingsGoals: newGoals };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_savings_${state.user.email}`, JSON.stringify(newGoals));

      return { ...state, user: updatedUser };
    }

    case 'UPDATE_SAVINGS_GOAL': {
      if (!state.user) return state;
      const updatedGoal = action.payload;
      const existingGoals = state.user.savingsGoals || [];
      const newGoals = existingGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
      const updatedUser = { ...state.user, savingsGoals: newGoals };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_savings_${state.user.email}`, JSON.stringify(newGoals));

      return { ...state, user: updatedUser };
    }

    // Community Actions (Global)
    case 'ADD_GROUP': {
      const group = action.payload;
      const existingGroups = state.groups || [];
      const newGroups = [...existingGroups, group];

      localStorage.setItem('mock_groups', JSON.stringify(newGroups));

      return { ...state, groups: newGroups };
    }

    case 'UPDATE_GROUP': {
      const updatedGroup = action.payload;
      const existingGroups = state.groups || [];
      const newGroups = existingGroups.map(g => g.id === updatedGroup.id ? updatedGroup : g);

      localStorage.setItem('mock_groups', JSON.stringify(newGroups));

      return { ...state, groups: newGroups };
    }

    case 'SET_GROUPS': {
      return { ...state, groups: action.payload };
    }

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    groups: JSON.parse(localStorage.getItem('mock_groups')) || []
  });

  useEffect(() => {
    // Check if token exists and is valid (optional: verify with backend)
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load groups if not loaded
    const savedGroups = JSON.parse(localStorage.getItem('mock_groups'));
    if (savedGroups && savedGroups.length > 0 && (!state.groups || state.groups.length === 0)) {
      dispatch({ type: 'SET_GROUPS', payload: savedGroups });
    } else if (!savedGroups) {
      // Initialize default groups if none exist
      const defaultGroups = [
        { id: 1, name: 'St. Mary\'s Church', type: 'church', balance: 15000, description: 'Church building fund', members: [] },
        { id: 2, name: 'Family Savings', type: 'family', balance: 5000, description: 'Joint family savings', members: [] },
        { id: 3, name: 'Teachers Sacco', type: 'sacco', balance: 50000, description: 'Teachers investment group', members: [] }
      ];
      localStorage.setItem('mock_groups', JSON.stringify(defaultGroups));
      dispatch({ type: 'SET_GROUPS', payload: defaultGroups });
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

      // Load persisted data from localStorage
      const userEmail = response.data.user.email;
      const balance = parseFloat(localStorage.getItem(`mock_balance_${userEmail}`)) || 5000.00;
      const transactions = JSON.parse(localStorage.getItem(`mock_transactions_${userEmail}`)) || [];
      const notifications = JSON.parse(localStorage.getItem(`mock_notifications_${userEmail}`)) || [];
      const savingsGoals = JSON.parse(localStorage.getItem(`mock_savings_${userEmail}`)) || [];
      const savingsBalance = parseFloat(localStorage.getItem(`mock_savings_balance_${userEmail}`)) || 0.00;

      // Inject role, verification status, and persisted data into user object
      const userWithRole = {
        ...response.data.user,
        role: role,
        verificationStatus,
        limits,
        balance,
        transactions,
        notifications,
        transactions,
        notifications,
        savingsGoals,
        savingsBalance
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

        // Load persisted data from localStorage
        const balance = parseFloat(localStorage.getItem(`mock_balance_${email}`)) || 5000.00;
        const transactions = JSON.parse(localStorage.getItem(`mock_transactions_${email}`)) || [];
        const notifications = JSON.parse(localStorage.getItem(`mock_notifications_${email}`)) || [];
        const savingsGoals = JSON.parse(localStorage.getItem(`mock_savings_${email}`)) || [];
        const savingsBalance = parseFloat(localStorage.getItem(`mock_savings_balance_${email}`)) || 0.00;

        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email,
          role: role,
          balance,
          transactions,
          notifications,
          transactions,
          notifications,
          savingsGoals,
          savingsBalance,
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
        role: 'user',
        balance: 0.00,
        savingsBalance: 0.00,
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
    if (!state.user) return;
    const updatedUser = { ...state.user, ...userData };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const updateBalance = (newBalance) => {
    console.log('AuthContext: updateBalance called with', newBalance);
    dispatch({ type: 'UPDATE_BALANCE', payload: Number(newBalance) });
  };

  const updateSavingsBalance = (newBalance) => {
    dispatch({ type: 'UPDATE_SAVINGS_BALANCE', payload: Number(newBalance) });
  };

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (notificationId) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_READ' });
  };

  // Savings Helpers
  const createSavingsGoal = (goal) => {
    dispatch({ type: 'ADD_SAVINGS_GOAL', payload: goal });
  };

  const updateSavingsGoal = (goal) => {
    dispatch({ type: 'UPDATE_SAVINGS_GOAL', payload: goal });
  };

  // Community Helpers
  const createGroup = (group) => {
    dispatch({ type: 'ADD_GROUP', payload: group });
  };

  const updateGroup = (group) => {
    dispatch({ type: 'UPDATE_GROUP', payload: group });
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
    updateUser,
    updateBalance,
    updateSavingsBalance,
    addTransaction,
    addNotification,
    markAsRead,
    markAllAsRead,
    createSavingsGoal,
    updateSavingsGoal,
    createGroup,
    updateGroup,
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
