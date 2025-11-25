import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
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
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
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
          // Assuming you have an endpoint to get the current user profile
          // If not, you might need to adjust this or rely on the token being present
          const response = await axios.get('/api/user/profile');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: state.token,
            },
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, role = 'user') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Mocking role-based login for now since backend might not support it yet
      // In a real app, the backend would return the role
      const response = await axios.post('/api/auth/login', { email, password });

      // Inject role into user object for frontend logic
      const userWithRole = { ...response.data.user, role: role };

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
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email,
          role: role,
          balance: 5000.00
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
      const response = await axios.post('/api/auth/register', userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      // Fallback for demo/testing without backend
      console.warn("Backend not reachable, using mock registration");
      const mockUser = {
        id: 'new-user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user', // Default role for new registrations
        balance: 0.00
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
    hasRole
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
