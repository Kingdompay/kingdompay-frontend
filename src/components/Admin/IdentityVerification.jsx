import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const IdentityVerification = () => {
    const { updateUserStatus, verifications } = useAuth();
    // const [verifications, setVerifications] = useState([]); // Removed local state

    // useEffect removed - fetching from AuthContext now
    // useEffect(() => { ... }, []);

    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleAction = (id, action) => {
        const item = verifications.find(v => v.id === id);
        if (!item) return;

        // Update global auth context - this will auto-update the list via Context
        if (action === 'approved') {
            updateUserStatus(item.email, 'verified');
        } else if (action === 'rejected') {
            updateUserStatus(item.email, 'rejected');
        }

        // Close modal if open
        setSelectedRequest(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
        }
    };

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Identity Verification</h2>
                    <p className="text-gray-500 dark:text-[#A8C4A8] mt-1">Review and approve user identification documents</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#E5EBE3] dark:bg-[#0D1B0F] border border-gray-200 dark:border-[#2D4A32] rounded-lg text-gray-600 dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#243B28] font-medium cursor-pointer transition-colors">Filter</button>
                    <button className="px-4 py-2 bg-[#1A3F22] text-white rounded-lg hover:bg-[#14301a] font-medium border-none cursor-pointer text-white">Export CSV</button>
                </div>
            </header>

            <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#1A2E1D] border-b border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">User</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Document</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Submitted</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8]">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-[#A8C4A8] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!verifications || verifications.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-[#A8C4A8]">
                                        No verification requests found.
                                    </td>
                                </tr>
                            ) : verifications.map((item) => {
                                if (!item) return null;
                                const initial = (item.name && typeof item.name === 'string') ? item.name.charAt(0) : 'U';
                                const displayName = item.name || 'Unknown User';
                                const displayEmail = item.email || 'No Email';
                                const displayStatus = item.status || 'pending';

                                return (
                                    <tr key={item.id} className="border-b border-gray-50 dark:border-[#2D4A32] hover:bg-gray-50/50 dark:hover:bg-[#243B28] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-[#243B28] rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-[#E8F5E8] transition-colors">
                                                    {initial}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">{displayName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">{displayEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-[#E8F5E8] capitalize">{item.documentType || 'ID Document'}</td>
                                        <td className="p-4 text-gray-500 dark:text-[#A8C4A8]">{item.submittedAt || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(displayStatus)} capitalize`}>
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {displayStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(item.id, 'approved')}
                                                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors border-none cursor-pointer"
                                                            title="Quick Approve"
                                                        >
                                                            <span className="material-symbols-outlined">check_circle</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(item.id, 'rejected')}
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-none cursor-pointer"
                                                            title="Quick Reject"
                                                        >
                                                            <span className="material-symbols-outlined">cancel</span>
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedRequest(item)}
                                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border-none cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-[#2D4A32] flex justify-between items-center transition-colors duration-300">
                    <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Showing {verifications?.length || 0} results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 dark:border-[#2D4A32] rounded-lg text-gray-500 dark:text-[#A8C4A8] bg-[#E5EBE3] dark:bg-[#0D1B0F] disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-[#2D4A32] rounded-lg text-gray-500 dark:text-[#A8C4A8] bg-[#E5EBE3] dark:bg-[#0D1B0F] disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
                    <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up transition-colors duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center transition-colors duration-300">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Verification Details</h3>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 dark:text-[#A8C4A8] hover:text-gray-600 dark:hover:text-[#E8F5E8] border-none bg-transparent cursor-pointer transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* User Info */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-[#A8C4A8] uppercase tracking-wider mb-3">User Information</h4>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-[#243B28] rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-[#E8F5E8] text-2xl transition-colors">
                                            {(selectedRequest.name && typeof selectedRequest.name === 'string') ? selectedRequest.name.charAt(0) : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-[#E8F5E8] text-lg m-0">{selectedRequest.name || 'Unknown User'}</p>
                                            <p className="text-gray-500 dark:text-[#A8C4A8] m-0">{selectedRequest.email}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#1A2E1D] p-4 rounded-xl space-y-2 transition-colors duration-300">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Role</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8] capitalize">{selectedRequest.role || 'User'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Joined</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8]">{selectedRequest.submittedAt || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-[#A8C4A8]">Status</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedRequest.status || 'pending')}`}>
                                                {(selectedRequest.status || 'pending').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-[#A8C4A8] uppercase tracking-wider mb-3">Submitted Document</h4>
                                    <div className="bg-gray-50 dark:bg-[#1A2E1D] p-4 rounded-xl border border-gray-200 dark:border-[#2D4A32] transition-colors duration-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8]">description</span>
                                            <span className="font-medium text-gray-900 dark:text-[#E8F5E8] capitalize">{selectedRequest.documentType || 'Document'}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Submitted on {selectedRequest.submittedAt || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview */}
                            <div className="flex flex-col h-full">
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-[#A8C4A8] uppercase tracking-wider mb-3">Document Preview</h4>
                                <div className="flex-grow bg-gray-100 dark:bg-[#1A2E1D] rounded-xl border-2 border-dashed border-gray-200 dark:border-[#2D4A32] flex items-center justify-center min-h-[300px] relative overflow-hidden group transition-colors duration-300">
                                    {/* Placeholder for actual image */}
                                    <div className="text-center p-6">
                                        <span className="material-symbols-outlined text-gray-400 dark:text-[#A8C4A8] text-6xl mb-2">image</span>
                                        <p className="text-gray-500 dark:text-[#A8C4A8] text-sm">Document Image Preview</p>
                                        <p className="text-xs text-gray-400 dark:text-[#6b7280] mt-1">(Mock Data - No actual file stored)</p>
                                    </div>

                                    {/* Simulating a real view */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white/90 dark:bg-[#0D1B0F]/90 text-gray-800 dark:text-[#E8F5E8] px-4 py-2 rounded-lg font-medium shadow-sm border-none cursor-pointer">
                                            Open Full Size
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {(selectedRequest.status || 'pending') === 'pending' && (
                            <div className="p-6 border-t border-gray-100 dark:border-[#2D4A32] bg-gray-50 dark:bg-[#1A2E1D] flex justify-end gap-3 transition-colors duration-300">
                                <button
                                    onClick={() => handleAction(selectedRequest.id, 'rejected')}
                                    className="px-6 py-2 bg-[#E5EBE3] dark:bg-[#0D1B0F] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium cursor-pointer transition-colors"
                                >
                                    Reject Application
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest.id, 'approved')}
                                    className="px-6 py-2 bg-[#1A3F22] text-white rounded-xl hover:bg-[#14301a] font-medium border-none cursor-pointer shadow-lg shadow-green-900/10 transition-colors"
                                >
                                    Approve Application
                                </button>
                            </div>
                        )}
                        {(selectedRequest.status || 'pending') !== 'pending' && (
                            <div className="p-6 border-t border-gray-100 dark:border-[#2D4A32] bg-gray-50 dark:bg-[#1A2E1D] flex justify-end transition-colors duration-300">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-6 py-2 bg-gray-200 dark:bg-[#243B28] text-gray-700 dark:text-[#E8F5E8] rounded-xl hover:bg-gray-300 dark:hover:bg-[#1A2E1D] font-medium border-none cursor-pointer transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdentityVerification;

