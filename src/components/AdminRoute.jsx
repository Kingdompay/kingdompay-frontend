import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D1B0F]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D99201] mx-auto"></div>
                    <p className="text-[#D99201] mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    // Check if user is admin
    if (user?.role?.toUpperCase() !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D1B0F] p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-4xl">block</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">
                        You don't have permission to access the admin area. 
                        Please login with an administrator account.
                    </p>
                    <a 
                        href="/admin-login" 
                        className="inline-block px-6 py-3 bg-[#D99201] text-white rounded-xl font-semibold hover:bg-[#B07A01] transition-colors no-underline"
                    >
                        Admin Login
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
