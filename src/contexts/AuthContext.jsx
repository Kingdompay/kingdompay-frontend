import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api, { 
  getCurrentUser, 
  getWalletBalance, 
  getWalletTransactions,
  getNotifications,
  logout as apiLogout,
  uploadKYCDocument,
  getKYCStatus,
  getCommunities 
} from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  wallet: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  transactions: [],
  notifications: [],
  kycStatus: null, // KYC verification status
  kycDocuments: [], // User's KYC documents
  communities: [], // User's communities
  // Legacy state for backward compatibility
  groups: [],
  withdrawalRequests: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false, 
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        token: null,
        loading: false,
      };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications] 
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    
    case 'UPDATE_BALANCE':
      return {
        ...state,
        wallet: state.wallet ? { ...state.wallet, balance: action.payload } : { balance: action.payload },
        // Also update user.balance for backward compatibility
        user: state.user ? { ...state.user, balance: action.payload } : state.user,
      };
    
    // Legacy actions for backward compatibility
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };
    
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload.id ? action.payload : g),
      };
    
    case 'SET_WITHDRAWAL_REQUESTS':
      return { ...state, withdrawalRequests: action.payload };

    case 'SET_KYC_STATUS':
      return { ...state, kycStatus: action.payload };

    case 'SET_KYC_DOCUMENTS':
      return { ...state, kycDocuments: action.payload };

    case 'SET_COMMUNITIES':
      return { ...state, communities: action.payload };

    case 'ADD_COMMUNITY':
      return { ...state, communities: [...state.communities, action.payload] };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      
        const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
        return;
      }

      // Check if it's an old mock token
      if (token.startsWith('mock-')) {
        console.warn('Found legacy mock token, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
        return;
      }

      try {
        // Set token in api headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch current user
        const userData = await getCurrentUser();
        
        // Fetch wallet data
        let walletResponse = null;
        let walletData = null;
        try {
          walletResponse = await getWalletBalance();
          // API returns { success, wallet: {...} }
          walletData = walletResponse?.wallet || walletResponse || null;
        } catch (e) {
          console.warn('Failed to fetch wallet:', e);
        }

        // Fetch transactions
        let transactionsData = [];
        try {
          const txResponse = await getWalletTransactions(20, 0);
          transactionsData = txResponse.transactions || [];
        } catch (e) {
          console.warn('Failed to fetch transactions:', e);
        }

        // Fetch notifications
        let notificationsData = [];
        try {
          const notifResponse = await getNotifications(20, 0);
          notificationsData = notifResponse.notifications || [];
        } catch (e) {
          console.warn('Failed to fetch notifications:', e);
        }

        // Fetch KYC status
        let kycData = null;
        try {
          kycData = await getKYCStatus();
        } catch (e) {
          console.warn('Failed to fetch KYC status:', e);
        }

        // Fetch communities
        let communitiesData = [];
        try {
          const commResponse = await getCommunities();
          communitiesData = commResponse.communities || [];
        } catch (e) {
          console.warn('Failed to fetch communities:', e);
        }

        // Merge wallet balance and KYC status into user for backward compatibility
        const userWithBalance = {
          ...userData.user || userData,
          balance: walletData?.balance || 0,
          wallet_number: walletData?.wallet_number || walletData?.display_number,
          kyc_status: userData.user?.kyc_status || userData.kyc_status || kycData?.verification?.status || 'pending',
          kyc_tier: userData.user?.kyc_tier || userData.kyc_tier || kycData?.verification?.tier || 'tier_0',
          verificationStatus: userData.user?.kyc_status || userData.kyc_status || kycData?.verification?.status || 'pending', // Keep for backward compatibility
          kycTier: userData.user?.kyc_tier || userData.kyc_tier || kycData?.verification?.tier || 'tier_0', // Keep for backward compatibility
          documents: kycData?.documents?.reduce((acc, doc) => {
            acc[doc.document_type] = doc.status;
            return acc;
          }, {}) || {},
        };

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: userWithBalance,
            token,
          },
        });

        dispatch({ type: 'SET_WALLET', payload: walletData });
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsData });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsData });
        dispatch({ type: 'SET_KYC_STATUS', payload: kycData?.verification || null });
        dispatch({ type: 'SET_KYC_DOCUMENTS', payload: kycData?.documents || [] });
        dispatch({ type: 'SET_COMMUNITIES', payload: communitiesData });

      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
      }
    };

    initializeAuth();
  }, []);

  // Login with token (called after OTP verification)
  const loginWithToken = useCallback(async (token, userData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch wallet data
      let walletResponse = null;
      let walletData = null;
      try {
        walletResponse = await getWalletBalance();
        walletData = walletResponse?.wallet || walletResponse || null;
      } catch (e) {
        console.warn('Failed to fetch wallet:', e);
      }

      // Fetch transactions
      let transactionsData = [];
      try {
        const txResponse = await getWalletTransactions(20, 0);
        transactionsData = txResponse.transactions || [];
      } catch (e) {
        console.warn('Failed to fetch transactions:', e);
      }

      // Merge wallet balance into user
      const userWithBalance = {
        ...userData,
        balance: walletData?.balance || 0,
        wallet_number: walletData?.wallet_number || walletData?.display_number,
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(userWithBalance));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: userWithBalance,
          token,
        },
      });

      dispatch({ type: 'SET_WALLET', payload: walletData });
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsData });

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn('Logout API call failed:', e);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Refresh wallet balance
  const refreshWallet = useCallback(async () => {
    try {
      const walletResponse = await getWalletBalance();
      const walletData = walletResponse?.wallet || walletResponse || null;
      dispatch({ type: 'SET_WALLET', payload: walletData });
      dispatch({ type: 'UPDATE_BALANCE', payload: walletData?.balance || 0 });
      return walletData;
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
      return null;
    }
  }, []);

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    try {
      const response = await getWalletTransactions(50, 0);
      const transactions = response.transactions || [];
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      return transactions;
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
      return [];
    }
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    try {
      const response = await getNotifications(50, 0);
      const notifications = response.notifications || [];
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      return notifications;
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
      return [];
    }
  }, []);

  // Refresh KYC status
  const refreshKYCStatus = useCallback(async () => {
    try {
      const kycData = await getKYCStatus();
      dispatch({ type: 'SET_KYC_STATUS', payload: kycData?.verification || null });
      dispatch({ type: 'SET_KYC_DOCUMENTS', payload: kycData?.documents || [] });
      
      // Update user's verification status
      if (state.user) {
        const updatedUser = {
          ...state.user,
          kyc_status: state.user.kyc_status || kycData?.verification?.status || 'pending',
          kyc_tier: state.user.kyc_tier || kycData?.verification?.tier || 'tier_0',
          verificationStatus: state.user.kyc_status || kycData?.verification?.status || 'pending', // Keep for backward compatibility
          kycTier: state.user.kyc_tier || kycData?.verification?.tier || 'tier_0', // Keep for backward compatibility
          documents: kycData?.documents?.reduce((acc, doc) => {
            acc[doc.document_type] = doc.status;
            return acc;
          }, {}) || {},
        };
        dispatch({ type: 'SET_USER', payload: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return kycData;
    } catch (error) {
      console.error('Failed to refresh KYC status:', error);
      return null;
    }
  }, [state.user]);

  // Refresh communities
  const refreshCommunities = useCallback(async () => {
    try {
      const response = await getCommunities();
      const communities = response.communities || [];
      dispatch({ type: 'SET_COMMUNITIES', payload: communities });
      return communities;
    } catch (error) {
      console.error('Failed to refresh communities:', error);
      return [];
    }
  }, []);

  // Update balance (for optimistic updates)
  const updateBalance = useCallback((newBalance) => {
    dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
  }, []);

  // Add transaction (for optimistic updates)
  const addTransaction = useCallback((transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      created_at: new Date().toISOString(),
      ...notification,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, []);

  // Legacy functions for backward compatibility
  const updateProfile = useCallback((profileData) => {
    if (!state.user) return { success: false, error: 'No user logged in' };

    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });

    return { success: true };
  }, [state.user]);

  const updateProfilePicture = useCallback((base64Image) => {
    if (!state.user) return { success: false, error: 'No user logged in' };

    const updatedUser = { ...state.user, profilePicture: base64Image };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });

    return { success: true };
  }, [state.user]);

  const hasRole = useCallback((role) => {
    return state.user?.role === role;
  }, [state.user]);

  // Community/Group functions (legacy compatibility)
  const createGroup = useCallback((group) => {
    const newGroup = {
      ...group,
      id: Date.now(),
      ownerId: group.ownerId || state.user?.phone_number || state.user?.email,
    };
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
  }, [state.user]);

  const updateGroup = useCallback((group) => {
    dispatch({ type: 'UPDATE_GROUP', payload: group });
  }, []);

  // Savings functions (legacy compatibility)
  const updateSavingsBalance = useCallback((newBalance) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, savingsBalance: newBalance };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, [state.user]);

  const addSavingsGoal = useCallback((goal) => {
    if (!state.user) return;
    const goals = state.user.savingsGoals || [];
    const updatedUser = { ...state.user, savingsGoals: [...goals, goal] };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, [state.user]);

  const updateSavingsGoal = useCallback((goal) => {
    if (!state.user) return;
    const goals = state.user.savingsGoals || [];
    const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
    const updatedUser = { ...state.user, savingsGoals: updatedGoals };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, [state.user]);

  // Upload KYC document
  const uploadDocument = useCallback(async (file, docType) => {
    console.log('uploadDocument called with:', { file: file?.name, docType });
    
    if (!state.user) {
      console.error('No user logged in');
      return { success: false, error: 'Not logged in' };
    }

    try {
      // Upload to backend
      console.log('Calling uploadKYCDocument API...');
      const response = await uploadKYCDocument(file, docType);
      console.log('API response:', response);
      
      // Backend returns document data directly on success, or { error: '...' } on failure
      if (response && !response.error) {
        // Update local user state with document status
        const currentDocs = state.user.documents || {};
        const updatedDocs = { ...currentDocs, [docType]: 'pending' };
        
        const updatedUser = {
          ...state.user,
          documents: updatedDocs,
          verificationStatus: 'pending',
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        
        console.log('Upload successful, document ID:', response.id);
        return { success: true, document: response };
      } else {
        console.error('Upload failed:', response?.error);
        return { success: false, error: response?.error || response?.message || 'Upload failed' };
      }
    } catch (error) {
      console.error('Document upload exception:', error);
      console.error('Error response data:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Upload failed';
      return { success: false, error: errorMsg };
    }
  }, [state.user]);

  // Update user verification status
  const updateUserStatus = useCallback((email, status) => {
    if (!state.user) return;
    
    if (state.user.email === email) {
      const updatedUser = {
        ...state.user,
        verificationStatus: status,
        limits: status === 'verified' 
          ? { daily: 5000, monthly: 25000 } 
          : { daily: 500, monthly: 2000 }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  }, [state.user]);

  // Context value
  const value = {
    // State
    user: state.user,
    wallet: state.wallet,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    transactions: state.transactions,
    notifications: state.notifications,
    kycStatus: state.kycStatus,
    kycDocuments: state.kycDocuments,
    communities: state.communities,
    groups: state.groups,
    withdrawalRequests: state.withdrawalRequests,
    
    // Auth functions
    loginWithToken,
    logout,
    
    // Data refresh functions
    refreshWallet,
    refreshTransactions,
    refreshNotifications,
    refreshKYCStatus,
    refreshCommunities,
    
    // Update functions
        updateBalance,
        addTransaction,
        addNotification,
        markAsRead,
        markAllAsRead,
    
    // Profile functions
    updateProfile,
    updateProfilePicture,
    hasRole,
    
    // KYC/Verification functions
    uploadDocument,
    updateUserStatus,
    
    // Legacy compatibility
    createGroup,
    updateGroup,
    updateSavingsBalance,
    addSavingsGoal,
    updateSavingsGoal,
    
    // Computed values for backward compatibility
    allUsers: [],
    verifications: [],
    apps: [],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Helper function to check if user is verified
  const isVerified = () => {
    const { user, kycStatus } = context;
    // Primary check: user.kyc_status from backend
    if (user?.kyc_status === 'approved') return true;
    // Fallback: kycStatus from context
    if (kycStatus?.status === 'approved') return true;
    // Legacy fallback
    if (user?.verificationStatus === 'approved') return true;
    // Admins are always verified
    if (user?.role?.toUpperCase() === 'ADMIN') return true;
    return false;
  };
  
  // Helper function to get verification status
  const getVerificationStatus = () => {
    const { user, kycStatus } = context;
    return user?.kyc_status || kycStatus?.status || user?.verificationStatus || 'none';
  };
  
  return {
    ...context,
    isVerified: isVerified(),
    getVerificationStatus
  };
};
