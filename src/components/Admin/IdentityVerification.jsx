import React, { useState } from 'react';

const IdentityVerification = () => {
    const [verifications, setVerifications] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', documentType: 'Passport', status: 'pending', submittedAt: '2023-10-25' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', documentType: 'Driver License', status: 'pending', submittedAt: '2023-10-24' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', documentType: 'National ID', status: 'rejected', submittedAt: '2023-10-23' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', documentType: 'Passport', status: 'approved', submittedAt: '2023-10-22' },
    ]);

    const handleAction = (id, action) => {
        setVerifications(prev => prev.map(v =>
            v.id === id ? { ...v, status: action } : v
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-orange-100 text-orange-700';
        }
    };

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 m-0">Identity Verification</h2>
                    <p className="text-gray-500 mt-1">Review and approve user identification documents</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Filter</button>
                    <button className="px-4 py-2 bg-[#1A3F22] text-white rounded-lg hover:bg-[#14301a] font-medium">Export CSV</button>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Document</th>
                                <th className="p-4 font-semibold text-gray-600">Submitted</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifications.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 m-0">{item.name}</p>
                                                <p className="text-xs text-gray-500 m-0">{item.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">{item.documentType}</td>
                                    <td className="p-4 text-gray-500">{item.submittedAt}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} capitalize`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {item.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(item.id, 'approved')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border-none cursor-pointer"
                                                    title="Approve"
                                                >
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item.id, 'rejected')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none cursor-pointer"
                                                    title="Reject"
                                                >
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </button>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none cursor-pointer" title="View Document">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="text-gray-400 hover:text-gray-600 font-medium text-sm border-none bg-transparent cursor-pointer">View Details</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-500 m-0">Showing 1-4 of 4 results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-gray-500 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityVerification;
