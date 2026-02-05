import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Add idempotency key for mutations
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            config.headers['Idempotency-Key'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Enhanced error handling with better messages
        if (error.response) {
            const { status, data } = error.response;
            
            // Handle 401 Unauthorized globally
            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            
            // Enhance error object with user-friendly message
            error.userMessage = data?.message || getErrorMessage(status, data);
        } else if (error.request) {
            // Network error - no response received
            error.userMessage = 'Network error. Please check your internet connection and try again.';
        } else {
            // Request setup error
            error.userMessage = 'An unexpected error occurred. Please try again.';
        }
        
        return Promise.reject(error);
    }
);

/**
 * Get user-friendly error message based on status code
 */
function getErrorMessage(status, data) {
    const statusMessages = {
        400: data?.message || 'Invalid request. Please check your input and try again.',
        401: 'Your session has expired. Please log in again.',
        403: data?.message || 'You do not have permission to perform this action.',
        404: data?.message || 'The requested resource was not found.',
        409: data?.message || 'This action conflicts with the current state. Please refresh and try again.',
        422: data?.message || 'Validation error. Please check your input.',
        429: 'Too many requests. Please wait a moment and try again.',
        500: 'Server error. Please try again later or contact support.',
        502: 'Service temporarily unavailable. Please try again later.',
        503: 'Service temporarily unavailable. Please try again later.',
        504: 'Request timeout. Please try again.',
    };
    
    return statusMessages[status] || data?.message || 'An error occurred. Please try again.';
}

// ============================================
// AUTH API
// ============================================

/**
 * Request OTP for phone number
 * @param {string} phoneNumber - Phone number (+254... or 07...)
 */
export const requestOTP = async (phoneNumber) => {
    const response = await api.post('/auth/otp/request', { phone_number: phoneNumber });
    return response.data;
};

/**
 * Verify OTP and login/register
 * @param {string} phoneNumber - Phone number
 * @param {string} otpCode - 6-digit OTP code
 * @param {string} fullName - User's full name (for registration)
 * @param {string} email - User's email (for registration)
 * @param {string} password - User's password/PIN (for registration)
 */
export const verifyOTP = async (phoneNumber, otpCode, fullName = null, email = null, password = null) => {
    const payload = { phone_number: phoneNumber, otp_code: otpCode };
    if (fullName) {
        payload.full_name = fullName;
    }
    if (email) {
        payload.email = email;
    }
    if (password) {
        payload.password = password;
    }
    const response = await api.post('/auth/otp/verify', payload);
    return response.data;
};

/**
 * Login with email/phone and password
 */
export const passwordLogin = async (identifier, password) => {
    const response = await api.post('/auth/login/password', {
        identifier,
        password,
    });
    return response.data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

/**
 * Refresh JWT token
 */
export const refreshToken = async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

// ============================================
// WALLET API
// ============================================

/**
 * Get wallet balance
 */
export const getWalletBalance = async () => {
    const response = await api.get('/wallets/balance');
    return response.data;
};

/**
 * Get wallet transactions
 * @param {number} limit - Number of transactions to fetch
 * @param {number} offset - Offset for pagination
 */
export const getWalletTransactions = async (limit = 50, offset = 0) => {
    const response = await api.get('/wallets/transactions', { params: { limit, offset } });
    return response.data;
};

/**
 * Transfer funds to another user
 * @param {string} recipientPhone - Recipient's phone number
 * @param {number} amount - Amount to transfer
 * @param {string} description - Transfer description
 */
export const transferFunds = async (recipientPhone, amount, description = '') => {
    const response = await api.post('/wallets/transfer', {
        recipient_phone: recipientPhone,
        amount,
        description
    });
    return response.data;
};

/**
 * Deposit funds (for internal use)
 */
export const depositFunds = async (amount, source) => {
    const response = await api.post('/wallets/deposit', { amount, source });
    return response.data;
};

// ============================================
// M-PESA API
// ============================================

/**
 * Initiate M-Pesa STK Push for deposit
 * @param {string} phoneNumber - M-Pesa phone number
 * @param {number} amount - Amount to deposit
 */
export const initiateMpesaDeposit = async (phoneNumber, amount) => {
    const response = await api.post('/mpesa/pay', {
        phone_number: phoneNumber,
        amount,
        reference: 'Wallet Top-up'
    });
    return response.data;
};

/**
 * Initiate M-Pesa B2C withdrawal
 * @param {string} phoneNumber - M-Pesa phone number to receive funds
 * @param {number} amount - Amount to withdraw
 */
export const initiateMpesaWithdrawal = async (phoneNumber, amount) => {
    const response = await api.post('/mpesa/withdraw', {
        phone_number: phoneNumber,
        amount
    });
    return response.data;
};

/**
 * Check M-Pesa service status
 */
export const getMpesaStatus = async () => {
    const response = await api.get('/mpesa/status');
    return response.data;
};

// ============================================
// KYC API
// ============================================

/**
 * Get KYC status
 */
export const getKYCStatus = async () => {
    const response = await api.get('/kyc/status');
    return response.data;
};

/**
 * Initiate KYC verification
 */
export const initiateKYC = async () => {
    const response = await api.post('/kyc/initiate');
    return response.data;
};

/**
 * Upload KYC document
 * @param {File} file - Document file
 * @param {string} documentType - Type of document (national_id, passport, drivers_license, utility_bill, bank_statement, employment_letter)
 */
export const uploadKYCDocument = async (file, documentType) => {
    console.log('uploadKYCDocument called:', { fileName: file?.name, documentType });
    
    const formData = new FormData();
    formData.append('file', file);  // Backend expects 'file' not 'document'
    formData.append('document_type', documentType);
    
    console.log('Sending request to /kyc/documents');
    const response = await api.post('/kyc/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log('Response received:', response.status, response.data);
    return response.data;
};

/**
 * Get KYC document types
 */
export const getKYCDocumentTypes = async () => {
    const response = await api.get('/kyc/document-types');
    return response.data;
};

/**
 * Check transaction limits
 */
export const checkTransactionLimits = async (amount, transactionType) => {
    const response = await api.post('/kyc/limits/check', { amount, transaction_type: transactionType });
    return response.data;
};

// ============================================
// COMMUNITIES API
// ============================================

/**
 * Get all communities user belongs to
 */
export const getCommunities = async () => {
    const response = await api.get('/communities');
    return response.data;
};

/**
 * Create a new community
 */
export const createCommunity = async (communityData) => {
    const response = await api.post('/communities', communityData);
    return response.data;
};

/**
 * Get community details
 */
export const getCommunityDetails = async (communityId) => {
    const response = await api.get(`/communities/${communityId}`);
    return response.data;
};

/**
 * Join a community
 */
export const joinCommunity = async (inviteToken) => {
    const response = await api.post('/communities/join', { token: inviteToken });
    return response.data;
};

/**
 * Generate invite link
 */
export const generateInviteLink = async (communityId) => {
    const response = await api.post(`/communities/${communityId}/invite`);
    return response.data;
};

// ============================================
// CAMPAIGNS API
// ============================================

/**
 * Get community campaigns
 */
export const getCampaigns = async (communityId = null) => {
    const params = communityId ? { community_id: communityId } : {};
    const response = await api.get('/campaigns', { params });
    return response.data;
};

/**
 * Create a campaign
 */
export const createCampaign = async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
};

/**
 * Contribute to a campaign
 */
export const contributeToCampaign = async (campaignId, amount) => {
    const response = await api.post(`/campaigns/${campaignId}/contribute`, { amount });
    return response.data;
};

// ============================================
// NOTIFICATIONS API
// ============================================

/**
 * Get user notifications
 */
export const getNotifications = async (limit = 50, offset = 0) => {
    const response = await api.get('/notifications', { params: { limit, offset } });
    return response.data;
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
};

// ============================================
// 2FA API
// ============================================

/**
 * Get 2FA status
 */
export const get2FAStatus = async () => {
    const response = await api.get('/2fa/status');
    return response.data;
};

/**
 * Setup 2FA
 */
export const setup2FA = async () => {
    const response = await api.post('/2fa/setup');
    return response.data;
};

/**
 * Enable 2FA with verification code
 */
export const enable2FA = async (code) => {
    const response = await api.post('/2fa/enable', { code });
    return response.data;
};

/**
 * Disable 2FA
 */
export const disable2FA = async (code) => {
    const response = await api.post('/2fa/disable', { code });
    return response.data;
};

// ============================================
// CURRENCY API
// ============================================

/**
 * Get supported currencies
 */
export const getCurrencies = async () => {
    const response = await api.get('/currencies');
    return response.data;
};

/**
 * Get exchange rate
 */
export const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await api.get('/currencies/rate', { params: { from: fromCurrency, to: toCurrency } });
    return response.data;
};

/**
 * Convert amount
 */
export const convertAmount = async (amount, fromCurrency, toCurrency) => {
    const response = await api.post('/currencies/convert', { amount, from_currency: fromCurrency, to_currency: toCurrency });
    return response.data;
};

// ============================================
// FEES API
// ============================================

/**
 * Calculate transaction fees
 */
export const calculateFees = async (amount, transactionType) => {
    const response = await api.post('/fees/calculate', { amount, transaction_type: transactionType });
    return response.data;
};

// ============================================
// ADMIN API
// ============================================

/**
 * Get all users (admin only)
 */
export const getAdminUsers = async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

/**
 * Get user details (admin only)
 */
export const getAdminUserDetails = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

/**
 * Get user statistics (admin only)
 */
export const getAdminUserStats = async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
};

/**
 * Get pending KYC documents (admin only)
 */
export const getAdminPendingDocuments = async (showAll = false) => {
    const response = await api.get('/admin/kyc/pending-documents', { params: { all: showAll } });
    return response.data;
};

/**
 * Verify a KYC document (admin only)
 */
export const verifyKYCDocument = async (documentId, status, rejectionReason = null) => {
    const response = await api.post(`/admin/kyc/document/${documentId}/verify`, {
        status,
        rejection_reason: rejectionReason
    });
    return response.data;
};

/**
 * Get KYC stats (admin only)
 */
export const getAdminKYCStats = async () => {
    const response = await api.get('/admin/kyc/stats');
    return response.data;
};

// ============================================
// SCHEDULED PAYMENTS API
// ============================================

/**
 * Get scheduled payments
 */
export const getScheduledPayments = async () => {
    const response = await api.get('/scheduled-payments');
    return response.data;
};

/**
 * Create scheduled payment
 */
export const createScheduledPayment = async (paymentData) => {
    const response = await api.post('/scheduled-payments', paymentData);
    return response.data;
};

/**
 * Cancel scheduled payment
 */
export const cancelScheduledPayment = async (paymentId) => {
    const response = await api.delete(`/scheduled-payments/${paymentId}`);
    return response.data;
};

// ============================================
// SAVINGS GOALS API
// ============================================

/**
 * Get all savings goals
 */
export const getSavingsGoals = async () => {
    const response = await api.get('/savings/goals');
    return response.data;
};

/**
 * Create a savings goal
 */
export const createSavingsGoal = async (goalData) => {
    const response = await api.post('/savings/goals', {
        name: goalData.name,
        target_amount: goalData.targetAmount || goalData.target_amount,
        icon: goalData.icon || 'savings',
        deadline: goalData.deadline,
        currency: goalData.currency || 'KES'
    });
    return response.data;
};

/**
 * Get a specific savings goal
 */
export const getSavingsGoal = async (goalId) => {
    const response = await api.get(`/savings/goals/${goalId}`);
    return response.data;
};

/**
 * Update a savings goal
 */
export const updateSavingsGoal = async (goalId, goalData) => {
    const response = await api.put(`/savings/goals/${goalId}`, goalData);
    return response.data;
};

/**
 * Delete a savings goal
 */
export const deleteSavingsGoal = async (goalId) => {
    const response = await api.delete(`/savings/goals/${goalId}`);
    return response.data;
};

/**
 * Contribute to a savings goal
 */
export const contributeToGoal = async (goalId, amount) => {
    const response = await api.post(`/savings/goals/${goalId}/contribute`, { amount });
    return response.data;
};

/**
 * Withdraw from a savings goal
 */
export const withdrawFromGoal = async (goalId, amount) => {
    const response = await api.post(`/savings/goals/${goalId}/withdraw`, { amount });
    return response.data;
};

// ============================================
// MONEY REQUESTS API
// ============================================

/**
 * Get money requests
 */
export const getMoneyRequests = async (params = {}) => {
    const response = await api.get('/money-requests', { params });
    return response.data;
};

/**
 * Create a money request
 */
export const createMoneyRequest = async (requestData) => {
    const response = await api.post('/money-requests', {
        recipient_phone: requestData.recipientPhone || requestData.recipient_phone,
        amount: requestData.amount,
        message: requestData.message,
        category: requestData.category || 'general',
        due_date: requestData.dueDate || requestData.due_date,
        currency: requestData.currency || 'KES'
    });
    return response.data;
};

/**
 * Accept a money request
 */
export const acceptMoneyRequest = async (requestId) => {
    const response = await api.post(`/money-requests/${requestId}/accept`);
    return response.data;
};

/**
 * Reject a money request
 */
export const rejectMoneyRequest = async (requestId) => {
    const response = await api.post(`/money-requests/${requestId}/reject`);
    return response.data;
};

/**
 * Cancel a money request
 */
export const cancelMoneyRequest = async (requestId) => {
    const response = await api.post(`/money-requests/${requestId}/cancel`);
    return response.data;
};

// ============================================
// QR CODE API
// ============================================

/**
 * Generate wallet QR code for receiving payments
 */
export const generateWalletQR = async (amount = null, message = '') => {
    const params = {};
    if (amount) params.amount = amount;
    if (message) params.message = message;
    const response = await api.get('/wallets/qr-code', { params });
    return response.data;
};

/**
 * Get community members (for admin/owner view)
 */
export const getCommunityMembers = async (communityId) => {
    const response = await api.get(`/communities/${communityId}/members`);
    return response.data;
};

export default api;
