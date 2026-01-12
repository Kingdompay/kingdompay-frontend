import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Users = () => {
    const { allUsers } = useAuth();

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 m-0">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage system users, view details and verify accounts</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Joined</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers && allUsers.length > 0 ? (
                                allUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 m-0">{user.name || 'User'}</p>
                                                    <p className="text-xs text-gray-500 m-0">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700 capitalize">{user.role || 'User'}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.verificationStatus || 'unverified')} capitalize`}>
                                                {user.verificationStatus || 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="text-[#1A3F22] hover:bg-green-50 px-3 py-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer font-medium text-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-24" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 m-0">Customer Details</h3>
                                <p className="text-sm text-gray-500 m-0">Full profile view</p>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-[#1A3F22] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {(selectedUser.name || selectedUser.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-900 m-0">{selectedUser.name || 'No Name'}</h4>
                                    <p className="text-gray-500 m-0 mb-2">{selectedUser.email}</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.verificationStatus || 'unverified')} capitalize`}>
                                        {selectedUser.verificationStatus || 'Unverified'}
                                    </span>
                                </div>
                            </div>

                            {/* Financials Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 m-0 mb-1">Wallet Balance</p>
                                    <p className="text-2xl font-bold text-gray-900 m-0">${(selectedUser.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 m-0 mb-1">Savings Balance</p>
                                    <p className="text-2xl font-bold text-[#1A3F22] m-0">${(selectedUser.savingsBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4">
                                <h5 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 m-0">Account Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 m-0">Role</p>
                                        <p className="font-medium text-gray-900 capitalize m-0">{selectedUser.role || 'User'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 m-0">Phone</p>
                                        <p className="font-medium text-gray-900 m-0">{selectedUser.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 m-0">Date Joined</p>
                                        <p className="font-medium text-gray-900 m-0">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 m-0">User ID</p>
                                        <p className="font-mono text-sm text-gray-600 bg-gray-50 p-1 rounded inline-block m-0">{selectedUser.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cards Section */}
                            <div>
                                <h5 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 m-0 mb-4">Cards</h5>
                                {!selectedUser.cards || selectedUser.cards.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">No cards issued.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedUser.cards.map(card => (
                                            <div key={card.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-gray-400">credit_card</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 m-0 text-sm">•••• {card.number?.slice(-4) || '0000'}</p>
                                                        <p className="text-xs text-gray-500 m-0 capitalize">{card.type || 'Virtual'} Card</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded ${card.isFrozen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {card.isFrozen ? 'Frozen' : 'Active'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
