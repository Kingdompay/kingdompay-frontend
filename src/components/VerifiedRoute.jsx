import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifiedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3F22] mx-auto"></div>
                    <p className="text-[#1A3F22] mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is not verified, redirect to verification page
    if (user && user.verificationStatus !== 'verified') {
        return <Navigate to="/verify-identity" replace />;
    }

    return children;
};

export default VerifiedRoute;
