import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        // Handle 401 Unauthorized globally (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Optional: Redirect to login or dispatch logout action
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
