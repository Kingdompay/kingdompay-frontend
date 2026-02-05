import React, { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, getAdminUserDetails, getAdminUserStats } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAdminUsers({
                page: currentPage,
                per_page: 20,
                search: searchQuery,
                role: roleFilter
            });
            
            if (response.success) {
                setUsers(response.users || []);
                setTotalPages(response.pagination?.pages || 1);
                setTotalUsers(response.pagination?.total || 0);
            } else {
                setError(response.error || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, roleFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await getAdminUserStats();
            if (response.success) {
                setStats(response.stats);
            }
        } catch (err) {
            console.error('Error fetching user stats:', err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [fetchUsers, fetchStats]);

    const handleViewDetails = async (user) => {
        setSelectedUser(user);
        setLoadingDetails(true);
        try {
            const response = await getAdminUserDetails(user.id);
            if (response.success) {
                setUserDetails(response.user);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers();
    };

    const getKYCStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            case 'SUPPORT': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">User Management</h2>
                <p className="text-gray-500 dark:text-[#A8C4A8] mt-1">View and manage all registered users</p>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">group</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] m-0">{stats.total_users}</p>
                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Total Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400">verified_user</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] m-0">{stats.kyc_approved}</p>
                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">KYC Verified</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">pending</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] m-0">{stats.kyc_pending}</p>
                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Pending KYC</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">person_add</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] m-0">{stats.recent_registrations}</p>
                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">New (7 days)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-[#1A2E1D] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2D4A32] mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0D1B0F] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A3F22]"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0D1B0F] border border-gray-200 dark:border-[#2D4A32] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A3F22]"
                    >
                        <option value="">All Roles</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                        <option value="SUPPORT">Support</option>
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#1A3F22] text-white rounded-lg font-medium hover:bg-[#14301a] transition-colors border-none cursor-pointer"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white dark:bg-[#1A2E1D] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                        <p className="mt-4 text-gray-500 dark:text-[#A8C4A8]">Loading users...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#0D1B0F] border-b border-gray-100 dark:border-[#2D4A32]">
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">User</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Phone</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Role</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">KYC Status</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Balance</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Joined</th>
                                        <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-gray-50 dark:border-[#2D4A32] hover:bg-gray-50/50 dark:hover:bg-[#243B28]/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#1A3F22] to-[#58761B] rounded-full flex items-center justify-center font-bold text-white text-sm">
                                                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{user.full_name || 'No Name'}</p>
                                                            <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{user.email || 'No email'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-700 dark:text-[#E8F5E8] font-mono text-sm">
                                                    {user.phone_number || 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                        {user.role || 'USER'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKYCStatusColor(user.kyc_status)} capitalize`}>
                                                        {user.kyc_status === 'not_initiated' ? 'Not Started' : user.kyc_status || 'Unknown'}
                                                    </span>
                                                    {user.kyc_tier && (
                                                        <span className="ml-2 text-xs text-gray-500 dark:text-[#A8C4A8]">
                                                            ({user.kyc_tier})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-medium text-gray-900 dark:text-[#E8F5E8]">
                                                    KSh {(user.wallet_balance || 0).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-gray-500 dark:text-[#A8C4A8] text-sm">
                                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleViewDetails(user)}
                                                        className="text-[#1A3F22] dark:text-[#81C784] hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-medium text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="p-12 text-center">
                                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">person_off</span>
                                                <p className="text-gray-500 dark:text-[#A8C4A8]">No users found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 dark:border-[#2D4A32] flex items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-[#A8C4A8]">
                                    Showing {users.length} of {totalUsers} users
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-[#2D4A32] text-gray-600 dark:text-[#A8C4A8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors bg-transparent cursor-pointer"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-gray-600 dark:text-[#A8C4A8]">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-[#2D4A32] text-gray-600 dark:text-[#A8C4A8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors bg-transparent cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto"
                        onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-[#1A2E1D] rounded-2xl shadow-xl w-full max-w-3xl my-8"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">User Details</h3>
                                    <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Complete profile information</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-[#E8F5E8] border-none bg-transparent cursor-pointer"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {loadingDetails ? (
                                    <div className="text-center py-12">
                                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                                        <p className="mt-4 text-gray-500 dark:text-[#A8C4A8]">Loading user details...</p>
                                    </div>
                                ) : userDetails ? (
                                    <div className="space-y-6">
                                        {/* Profile Header */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#1A3F22] to-[#58761B] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                                {(userDetails.full_name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] m-0">{userDetails.full_name || 'No Name'}</h4>
                                                <p className="text-gray-500 dark:text-[#A8C4A8] m-0">{userDetails.phone_number}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userDetails.role)}`}>
                                                        {userDetails.role || 'USER'}
                                                    </span>
                                                    {userDetails.kyc && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKYCStatusColor(userDetails.kyc.status)} capitalize`}>
                                                            KYC: {userDetails.kyc.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Wallet Info */}
                                        {userDetails.wallet && (
                                            <div className="bg-gradient-to-br from-[#1A3F22] to-[#58761B] p-6 rounded-xl text-white">
                                                <p className="text-white/80 text-sm m-0">Wallet Balance</p>
                                                <p className="text-3xl font-bold m-0 mt-1">KSh {(userDetails.wallet.balance || 0).toLocaleString()}</p>
                                                <p className="text-white/60 text-xs m-0 mt-2 font-mono">{userDetails.wallet.wallet_number}</p>
                                            </div>
                                        )}

                                        {/* KYC Details */}
                                        {userDetails.kyc && (
                                            <div className="bg-gray-50 dark:bg-[#0D1B0F] p-4 rounded-xl">
                                                <h5 className="font-semibold text-gray-900 dark:text-[#E8F5E8] m-0 mb-4">KYC Information</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Status</p>
                                                        <p className="font-medium text-gray-900 dark:text-[#E8F5E8] capitalize m-0">{userDetails.kyc.status}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Tier</p>
                                                        <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{userDetails.kyc.tier}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Daily Limit</p>
                                                        <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">KSh {(userDetails.kyc.daily_limit || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Documents */}
                                        {userDetails.documents && userDetails.documents.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-900 dark:text-[#E8F5E8] m-0 mb-4">Uploaded Documents ({userDetails.documents.length})</h5>
                                                <div className="space-y-2">
                                                    {userDetails.documents.map(doc => (
                                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1B0F] rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span className="material-symbols-outlined text-gray-400">description</span>
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0 text-sm capitalize">{doc.document_type.replace('_', ' ')}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">
                                                                        Uploaded {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKYCStatusColor(doc.status)} capitalize`}>
                                                                {doc.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Communities */}
                                        {userDetails.communities && userDetails.communities.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-gray-900 dark:text-[#E8F5E8] m-0 mb-4">Community Memberships ({userDetails.communities.length})</h5>
                                                <div className="space-y-2">
                                                    {userDetails.communities.map((membership, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1B0F] rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span className="material-symbols-outlined text-gray-400">groups</span>
                                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0 text-sm">{membership.community_name}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-500 dark:text-[#A8C4A8] capitalize">{membership.role}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Account Info */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Account Created</p>
                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">
                                                    {userDetails.created_at ? new Date(userDetails.created_at).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Email</p>
                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{userDetails.email || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Phone Verified</p>
                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{userDetails.is_phone_verified ? 'Yes' : 'No'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Account Status</p>
                                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{userDetails.is_active ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-[#A8C4A8] text-center py-8">Failed to load user details</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
