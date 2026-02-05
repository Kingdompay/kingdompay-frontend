/**
 * Error handling utilities for consistent error messages across the app
 */

/**
 * Extract user-friendly error message from error object
 * @param {Error} error - Error object from API or other sources
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  
  // If error has userMessage (from API interceptor)
  if (error.userMessage) {
    return error.userMessage;
  }
  
  // If error has response data
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // If error has message
  if (error.message) {
    // Filter out technical error messages
    if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again.';
    }
    return error.message;
  }
  
  // Default message
  return 'An error occurred. Please try again.';
};

/**
 * Get error type for styling/icon purposes
 * @param {Error} error - Error object
 * @returns {string} Error type: 'network' | 'validation' | 'server' | 'auth' | 'unknown'
 */
export const getErrorType = (error) => {
  if (!error) return 'unknown';
  
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return 'network';
  }
  
  if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) return 'auth';
    if (status >= 400 && status < 500) return 'validation';
    if (status >= 500) return 'server';
  }
  
  return 'unknown';
};

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} Whether the error is retryable
 */
export const isRetryable = (error) => {
  if (!error) return false;
  
  // Network errors are retryable
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return true;
  }
  
  // Server errors (5xx) are retryable
  if (error.response?.status >= 500) {
    return true;
  }
  
  // Timeout errors are retryable
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }
  
  return false;
};

/**
 * Log error for debugging (in development)
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` in ${context}` : ''}]:`, {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      stack: error?.stack,
    });
  }
};
