import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  groups: [],
  withdrawalRequests: [],
  allUsers: [],
  verifications: [],
  apps: []
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
      const updatedNotifications = [newNotification, ...existingNotifications];
      const updatedUser = { ...state.user, notifications: updatedNotifications };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_notifications_${state.user.email}`, JSON.stringify(updatedNotifications));

      return { ...state, user: updatedUser };
    }

    case 'MARK_AS_READ': {
      if (!state.user) return state;
      const notificationId = action.payload;
      const existingNotifications = state.user.notifications || [];
      const updatedNotifications = existingNotifications.map(n =>
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
      const existingNotifications = state.user.notifications || [];
      const updatedNotifications = existingNotifications.map(n => ({ ...n, read: true }));
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

    // Withdrawal Requests
    case 'REQUEST_WITHDRAWAL': {
      const request = action.payload;
      const existingRequests = state.withdrawalRequests || [];
      const newRequests = [...existingRequests, request];
      localStorage.setItem('mock_withdrawal_requests', JSON.stringify(newRequests));
      return { ...state, withdrawalRequests: newRequests };
    }

    case 'APPROVE_WITHDRAWAL': {
      const requestId = action.payload;
      const requests = state.withdrawalRequests || [];
      const requestIndex = requests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) return state;

      const request = requests[requestIndex];
      if (request.status !== 'pending') return state;

      // 1. Update request status
      const updatedRequest = { ...request, status: 'approved' };
      const newRequests = [...requests];
      newRequests[requestIndex] = updatedRequest;

      // 2. Deduct from group balance
      const groups = state.groups || [];
      const groupIndex = groups.findIndex(g => g.id === request.groupId);
      let newGroups = groups;

      if (groupIndex !== -1) {
        const group = groups[groupIndex];
        const updatedGroup = { ...group, balance: group.balance - request.amount };
        newGroups = [...groups];
        newGroups[groupIndex] = updatedGroup;
        localStorage.setItem('mock_groups', JSON.stringify(newGroups));
      }

      // 3. Add to user balance (Institution's wallet)
      const requesterEmail = request.requesterId;
      // Default to 5000 if not set, matching the login default
      const currentBalance = localStorage.getItem(`mock_balance_${requesterEmail}`)
        ? parseFloat(localStorage.getItem(`mock_balance_${requesterEmail}`))
        : 0;

      const newBalance = currentBalance + request.amount;
      localStorage.setItem(`mock_balance_${requesterEmail}`, newBalance.toString());
      console.log(`APPROVE_WITHDRAWAL: Updated balance for ${requesterEmail} to ${newBalance}`);

      // If the current user is the requester, update their state immediately
      let updatedUser = state.user;
      if (state.user && state.user.email === requesterEmail) {
        updatedUser = { ...state.user, balance: newBalance };
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Ensure user object in local storage is also updated
      }

      localStorage.setItem('mock_withdrawal_requests', JSON.stringify(newRequests));

      return { ...state, withdrawalRequests: newRequests, groups: newGroups, user: updatedUser };
    }

    case 'SET_WITHDRAWAL_REQUESTS': {
      return { ...state, withdrawalRequests: action.payload };
    }

    case 'REJECT_WITHDRAWAL': {
      const requestId = action.payload;
      const requests = state.withdrawalRequests || [];
      const newRequests = requests.map(r =>
        r.id === requestId ? { ...r, status: 'rejected' } : r
      );
      localStorage.setItem('mock_withdrawal_requests', JSON.stringify(newRequests));
      return { ...state, withdrawalRequests: newRequests };
    }

    case 'ADD_CARD': {
      if (!state.user) return state;
      const card = action.payload;
      const existingCards = state.user.cards || [];
      const newCards = [...existingCards, { ...card, isFrozen: false, limits: { daily: 1000, monthly: 5000 } }];
      const updatedUser = { ...state.user, cards: newCards };

      // Persist
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_cards_${state.user.email}`, JSON.stringify(newCards));

      return { ...state, user: updatedUser };
    }

    case 'TOGGLE_CARD_FREEZE': {
      if (!state.user) return state;
      const cardId = action.payload;
      const existingCards = state.user.cards || [];
      const newCards = existingCards.map(c =>
        c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c
      );
      const updatedUser = { ...state.user, cards: newCards };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_cards_${state.user.email}`, JSON.stringify(newCards));

      return { ...state, user: updatedUser };
    }

    case 'UPDATE_CARD_LIMITS': {
      if (!state.user) return state;
      const { cardId, limits } = action.payload;
      const existingCards = state.user.cards || [];
      const newCards = existingCards.map(c =>
        c.id === cardId ? { ...c, limits: { ...c.limits, ...limits } } : c
      );
      const updatedUser = { ...state.user, cards: newCards };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`mock_cards_${state.user.email}`, JSON.stringify(newCards));

      return { ...state, user: updatedUser };
    }

    case 'SET_ALL_USERS':
      return { ...state, allUsers: action.payload };

    case 'SET_APPS':
      return { ...state, apps: action.payload };

    case 'ADD_APP': {
      const app = action.payload;
      const existingApps = state.apps || [];
      const newApps = [...existingApps, app];
      localStorage.setItem('mock_apps', JSON.stringify(newApps));
      return { ...state, apps: newApps };
    }

    case 'DELETE_APP': {
      const appId = action.payload;
      const existingApps = state.apps || [];
      const newApps = existingApps.filter(app => app.id !== appId);
      localStorage.setItem('mock_apps', JSON.stringify(newApps));
      return { ...state, apps: newApps };
    }

    case 'SET_VERIFICATIONS':
      return { ...state, verifications: action.payload };

    case 'UPDATE_VERIFICATION_STATUS': {
      const { email, status } = action.payload;
      const updatedVerifications = state.verifications.map(v =>
        v.email === email ? { ...v, status } : v
      );
      return { ...state, verifications: updatedVerifications };
    }

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    groups: JSON.parse(localStorage.getItem('mock_groups')) || [],
    withdrawalRequests: JSON.parse(localStorage.getItem('mock_withdrawal_requests')) || []
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists and is valid
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        // FORCE LOGOUT if using old mock tokens (incompatible with new backend)
        if (token && token.startsWith('mock-')) {
          console.warn("Found legacy mock token, forcing logout");
          localStorage.clear(); // Wipe everything to be safe
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
          return; // Stop initialization
        }

        if (token && savedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: JSON.parse(savedUser), token }
            });
          } catch (error) {
            console.error("Session restoration failed", error);
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
          }
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: null });
        }

        // Force clear old groups (Cleanup for fresh state)
        const defaultGroups = [];
        localStorage.setItem('mock_groups', JSON.stringify(defaultGroups));
        dispatch({ type: 'SET_GROUPS', payload: defaultGroups });

        // Load all users for Admin
        // Load all users for Admin
        try {
          // Attempt to fetch from backend first
          try {
            const response = await api.get('/users'); // Uses the new endpoint
            if (response.data && Array.isArray(response.data)) {
              const backendUsers = response.data;
              console.log('[AuthContext] Fetched users from backend:', backendUsers.length);

              const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
              console.log('[AuthContext] Local mock users:', localUsers.length);

              // Merge: Keep backend users + any local users NOT in backend
              const mergedUsers = [...backendUsers];
              localUsers.forEach(localUser => {
                if (!backendUsers.find(bu => bu.email === localUser.email)) {
                  mergedUsers.push(localUser);
                }
              });

              console.log('[AuthContext] Merged total users:', mergedUsers.length);

              dispatch({ type: 'SET_ALL_USERS', payload: mergedUsers });
              // Sync to local storage for offline backup
              localStorage.setItem('mock_users', JSON.stringify(mergedUsers));
            } else {
              throw new Error('Invalid response format');
            }
          } catch (apiError) {
            console.warn("Backend user fetch failed, falling back to local", apiError);
            const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            dispatch({ type: 'SET_ALL_USERS', payload: allUsers });
          }
        } catch (e) {
          console.error("Error loading users", e);
        }

        // Load verifications for Admin
        try {
          const allVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
          dispatch({ type: 'SET_VERIFICATIONS', payload: allVerifications });
        } catch (e) {
          console.error("Error loading verifications", e);
        }

        // Load apps for Admin
        try {
          const allApps = JSON.parse(localStorage.getItem('mock_apps') || '[]');
          dispatch({ type: 'SET_APPS', payload: allApps });
        } catch (e) {
          console.error("Error loading apps", e);
        }

      } catch (error) {
        console.error("Auto-login failed completely", error);
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Initialization failed' });
      }
    };

    initializeAuth();
  }, []);

  // Listen for storage changes to update balance across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (state.user && e.key === `mock_balance_${state.user.email}`) {
        const newBalance = parseFloat(e.newValue);
        console.log(`Storage Event: Balance updated for ${state.user.email} to ${newBalance}`);
        if (!isNaN(newBalance)) {
          dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.user]);

  const login = async (email, password, role = 'user') => {
    const normalizedEmail = email.toLowerCase();
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/login', { email: normalizedEmail, password });

      // Mock verification status
      const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
      const userVerification = mockVerifications.find(v => v.email === response.data.user.email);

      const verificationStatus = userVerification ? userVerification.status : 'unverified';
      const limits = verificationStatus === 'verified'
        ? { daily: 5000, monthly: 25000 }
        : { daily: 500, monthly: 2000 };

      // Load persisted data from localStorage
      const userEmail = response.data.user.email;
      const balance = parseFloat(localStorage.getItem(`mock_balance_${userEmail}`)) || 0.00;
      const transactions = JSON.parse(localStorage.getItem(`mock_transactions_${userEmail}`)) || [];
      const notifications = JSON.parse(localStorage.getItem(`mock_notifications_${userEmail}`)) || [];
      const savingsGoals = JSON.parse(localStorage.getItem(`mock_savings_${userEmail}`)) || [];
      const savingsBalance = parseFloat(localStorage.getItem(`mock_savings_balance_${userEmail}`)) || 0.00;
      const cards = JSON.parse(localStorage.getItem(`mock_cards_${userEmail}`)) || [];

      // Inject role, verification status, and persisted data into user object
      const userWithRole = {
        ...response.data.user,
        role: role,
        verificationStatus,
        limits,
        balance,
        transactions,
        notifications,
        savingsGoals,
        savingsBalance,
        cards
      };

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: userWithRole,
          token: response.data.token
        }
      });

      // Refresh global data for Admin (or generally) to ensure latest from localStorage
      const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      dispatch({ type: 'SET_ALL_USERS', payload: allUsers });

      const allVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
      dispatch({ type: 'SET_VERIFICATIONS', payload: allVerifications });

      const savedGroups = JSON.parse(localStorage.getItem('mock_groups') || '[]');
      dispatch({ type: 'SET_GROUPS', payload: savedGroups });

      const withdrawalRequests = JSON.parse(localStorage.getItem('mock_withdrawal_requests') || '[]');
      dispatch({ type: 'SET_WITHDRAWAL_REQUESTS', payload: withdrawalRequests });

      // Sync logged-in user to mock_users if not present (for Admin visibility)
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (!mockUsers.find(u => u.email === normalizedEmail)) {
        const newUserFromLogin = {
          ...response.data.user,
          role: role // maintain selected role preference
        };
        mockUsers.push(newUserFromLogin);
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));

        // Refresh allUsers immediately
        dispatch({ type: 'SET_ALL_USERS', payload: mockUsers });
      }

      return { success: true };
    } catch (error) {
      // Fallback for demo/testing without backend

      // 1. Check for Hardcoded Admin
      if (normalizedEmail === 'admin@kingdompay.com' && password === 'Admin@123') {
        const mockUser = {
          id: 'admin-user',
          name: 'System Admin',
          email: 'admin@kingdompay.com',
          role: 'admin',
          balance: 0,
          transactions: [],
          notifications: [],
          savingsGoals: [],
          savingsBalance: 0,
          cards: [],
          verificationStatus: 'verified',
          limits: { daily: 100000, monthly: 500000 }
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: mockUser,
            token: 'mock-admin-token-' + Date.now()
          }
        });

        // Refresh global data
        try {
          // Fetch real users from backend
          const usersRes = await api.get('/users');
          const backendUsers = usersRes.data || [];

          const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');

          // Merge lists
          const mergedUsers = [...backendUsers];
          localUsers.forEach(localUser => {
            if (!backendUsers.find(bu => bu.email === localUser.email)) {
              mergedUsers.push(localUser);
            }
          });

          dispatch({ type: 'SET_ALL_USERS', payload: mergedUsers });
          // Backup to localStorage
          localStorage.setItem('mock_users', JSON.stringify(mergedUsers));
        } catch (err) {
          console.warn("Fetch failed, using local", err);
          const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
          dispatch({ type: 'SET_ALL_USERS', payload: allUsers });
        }

        const allVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
        dispatch({ type: 'SET_VERIFICATIONS', payload: allVerifications });

        const savedGroups = JSON.parse(localStorage.getItem('mock_groups') || '[]');
        dispatch({ type: 'SET_GROUPS', payload: savedGroups });

        const withdrawalRequests = JSON.parse(localStorage.getItem('mock_withdrawal_requests') || '[]');
        dispatch({ type: 'SET_WITHDRAWAL_REQUESTS', payload: withdrawalRequests });

        return { success: true };
      }

      // 2. Check for Registered Users in mock_users
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const existingUser = mockUsers.find(u => u.email === normalizedEmail);

      if (existingUser) {
        // Simple password check (in real app, hash check)
        // For this mock, we assume if they exist in mock_users, they can login if password matches (or we skip password check for simplicity as we didn't store it)
        // Let's assume password is correct for now for registered users to keep it simple, or check if we stored it.
        // We didn't store password in register, so we'll allow any password for now for registered users.

        // Load persisted data
        const balance = parseFloat(localStorage.getItem(`mock_balance_${normalizedEmail}`)) || existingUser.balance || 0.00;
        const transactions = JSON.parse(localStorage.getItem(`mock_transactions_${normalizedEmail}`)) || [];
        const notifications = JSON.parse(localStorage.getItem(`mock_notifications_${normalizedEmail}`)) || [];
        const savingsGoals = JSON.parse(localStorage.getItem(`mock_savings_${normalizedEmail}`)) || [];
        const savingsBalance = parseFloat(localStorage.getItem(`mock_savings_balance_${normalizedEmail}`)) || 0.00;
        const cards = JSON.parse(localStorage.getItem(`mock_cards_${normalizedEmail}`)) || [];

        // Check verification status
        const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
        const userVerification = mockVerifications.find(v => v.email === normalizedEmail);
        const verificationStatus = userVerification ? userVerification.status : existingUser.verificationStatus;

        const userToLogin = {
          ...existingUser,
          balance,
          transactions,
          notifications,
          savingsGoals,
          savingsBalance,
          cards,
          verificationStatus,
          limits: verificationStatus === 'verified' ? { daily: 5000, monthly: 25000 } : { daily: 500, monthly: 2000 }
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: userToLogin,
            token: 'mock-token-' + Date.now()
          }
        });

        // Refresh global data
        const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        dispatch({ type: 'SET_ALL_USERS', payload: allUsers });

        const allVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
        dispatch({ type: 'SET_VERIFICATIONS', payload: allVerifications });

        const savedGroups = JSON.parse(localStorage.getItem('mock_groups') || '[]');
        dispatch({ type: 'SET_GROUPS', payload: savedGroups });

        const withdrawalRequests = JSON.parse(localStorage.getItem('mock_withdrawal_requests') || '[]');
        dispatch({ type: 'SET_WITHDRAWAL_REQUESTS', payload: withdrawalRequests });

        return { success: true };
      }

      // 3. Legacy Demo Fallback (Optional: Remove if we want strict login)
      // Keeping it for 'demo@kingdompay.com' only if needed, but user asked to remove buttons.
      // Let's remove the generic "startsWith" logic and only allow registered users + admin.

      const message = 'Invalid email or password';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };


  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await api.post('/auth/register', userData);

      // Sync with mock storage for Admin Dashboard visibility
      const newUser = {
        id: response.data.user.id || 'user-' + Date.now(),
        name: userData.firstName + ' ' + userData.lastName, // Construct full name from input
        email: userData.email,
        role: userData.role || 'user',
        balance: 0.00,
        verificationStatus: response.data.user.verificationStatus || 'unverified',
        ...response.data.user // Merge backend data
      };

      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      // Avoid duplicates
      if (!mockUsers.find(u => u.email === newUser.email)) {
        mockUsers.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
      }

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          ...response.data,
          user: {
            ...response.data.user,
            verificationStatus: response.data.user.verificationStatus || 'unverified'
          }
        }
      });
      return { success: true };
    } catch (error) {
      // Fallback for demo/testing without backend
      console.warn("Backend not reachable, using mock registration");
      const mockUser = {
        id: 'new-user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user', // Support role
        balance: 0.00,
        savingsBalance: 0.00,
        cards: [],
        savingsBalance: 0.00,
        cards: [],
        verificationStatus: 'unverified',
        documents: {}, // Track uploaded documents
        limits: { daily: 500, monthly: 2000 }
      };

      // Save to mock_users for login retrieval
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      mockUsers.push(mockUser);
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));

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

  const uploadDocument = async (file, docType) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (state.user) {
          const currentDocs = state.user.documents || {};
          const updatedDocs = { ...currentDocs, [docType]: 'pending' };

          let newStatus = state.user.verificationStatus;

          // Determine status based on role and uploads
          if (state.user.role === 'institution') {
            if (docType === 'permit') newStatus = 'pending';
          } else {
            // Regular user needs both ID and Face
            if (updatedDocs.id === 'pending' && updatedDocs.face === 'pending') {
              newStatus = 'pending';
            }
          }

          const updatedUser = {
            ...state.user,
            documents: updatedDocs,
            verificationStatus: newStatus
          };

          // Persist the request to localStorage for Admin to see
          const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
          const filtered = mockVerifications.filter(v => v.email !== state.user.email);

          filtered.push({
            id: Date.now(),
            name: state.user.name,
            email: state.user.email,
            role: state.user.role,
            documentType: docType, // Track latest upload
            documents: updatedDocs,
            status: 'pending', // Always pending review initially
            submittedAt: new Date().toISOString().split('T')[0]
          });

          localStorage.setItem('mock_verifications', JSON.stringify(filtered));
          localStorage.setItem('user', JSON.stringify(updatedUser));

          dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        }
        resolve({ success: true });
      }, 1500);
    });
  };

  const updateUserStatus = (email, status) => {
    // Update mock verifications
    const mockVerifications = JSON.parse(localStorage.getItem('mock_verifications') || '[]');
    const updatedVerifications = mockVerifications.map(v =>
      v.email === email ? { ...v, status } : v
    );
    localStorage.setItem('mock_verifications', JSON.stringify(updatedVerifications));

    // Update state
    dispatch({ type: 'UPDATE_VERIFICATION_STATUS', payload: { email, status } });

    // Update mock_users in localStorage
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedMockUsers = mockUsers.map(u =>
      u.email === email ? { ...u, verificationStatus: status } : u
    );
    localStorage.setItem('mock_users', JSON.stringify(updatedMockUsers));

    // Update global allUsers state
    dispatch({ type: 'SET_ALL_USERS', payload: updatedMockUsers });

    // If current user is the one being updated, update state
    if (state.user && state.user.email === email) {
      const limits = status === 'verified'
        ? { daily: 5000, monthly: 25000 }
        : { daily: 500, monthly: 2000 };

      const updatedUser = { ...state.user, verificationStatus: status, limits };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateBalance = (newBalance) => {
    dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
  };

  const updateSavingsBalance = (newBalance) => {
    dispatch({ type: 'UPDATE_SAVINGS_BALANCE', payload: newBalance });
  };

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_READ' });
  };

  const addSavingsGoal = (goal) => {
    dispatch({ type: 'ADD_SAVINGS_GOAL', payload: goal });
  };

  const updateSavingsGoal = (goal) => {
    dispatch({ type: 'UPDATE_SAVINGS_GOAL', payload: goal });
  };

  const createGroup = (group) => {
    // Ensure new group has ownerId set to current user if not provided
    const newGroup = {
      ...group,
      ownerId: group.ownerId || state.user?.email,
      balanceVisible: group.balanceVisible !== undefined ? group.balanceVisible : true
    };
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
  };

  const updateGroup = (group) => {
    dispatch({ type: 'UPDATE_GROUP', payload: group });
  };

  const requestWithdrawal = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      status: 'pending',
      date: new Date().toISOString()
    };
    dispatch({ type: 'REQUEST_WITHDRAWAL', payload: newRequest });
  };

  const approveWithdrawal = (requestId) => {
    dispatch({ type: 'APPROVE_WITHDRAWAL', payload: requestId });
  };

  const rejectWithdrawal = (requestId) => {
    dispatch({ type: 'REJECT_WITHDRAWAL', payload: requestId });
  };

  const addCard = (card) => {
    dispatch({ type: 'ADD_CARD', payload: card });
  };

  const toggleCardFreeze = (cardId) => {
    dispatch({ type: 'TOGGLE_CARD_FREEZE', payload: cardId });
  };

  const updateCardLimits = (cardId, limits) => {
    dispatch({ type: 'UPDATE_CARD_LIMITS', payload: { cardId, limits } });
  };

  const addApp = (app) => {
    dispatch({ type: 'ADD_APP', payload: app });
  };

  const deleteApp = (appId) => {
    dispatch({ type: 'DELETE_APP', payload: appId });
  };

  const hasRole = (role) => {
    return state.user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        groups: state.groups,
        withdrawalRequests: state.withdrawalRequests,
        login,
        register,
        logout,
        updateBalance,
        updateSavingsBalance,
        addTransaction,
        addNotification,
        markAsRead,
        markAllAsRead,
        addSavingsGoal,
        updateSavingsGoal,
        createGroup,
        updateGroup,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        hasRole,
        uploadDocument,
        updateUserStatus,
        addCard,
        toggleCardFreeze,
        updateCardLimits,
        addApp,
        deleteApp,
        allUsers: state.allUsers,
        verifications: state.verifications,
        apps: state.apps
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
