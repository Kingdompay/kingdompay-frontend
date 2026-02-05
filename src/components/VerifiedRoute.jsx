import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifiedRoute = ({ children }) => {
    const { user, loading, kycStatus } = useAuth();

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

    // Admins are exempt from verification check
    if (user?.role?.toUpperCase() === 'ADMIN') {
        return children;
    }

    // Check if user's KYC is approved
    // First check the kycStatus from AuthContext (fetched from /kyc/status API)
    // Then fall back to the user's kyc_status field (set during login)
    const isVerified = kycStatus?.status === 'approved' || user?.kyc_status === 'approved';

    // If user is not verified, redirect to verification page
    if (user && !isVerified) {
        return <Navigate to="/verify-identity" replace />;
    }

    return children;
};

export default VerifiedRoute;
