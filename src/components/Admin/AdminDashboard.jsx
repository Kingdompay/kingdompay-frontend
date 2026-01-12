import React from 'react';

import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
    const { withdrawalRequests, allUsers, verifications, groups } = useAuth();
    const pendingWithdrawalsCount = withdrawalRequests ? withdrawalRequests.filter(req => req.status === 'pending').length : 0;
    const pendingVerificationsCount = verifications ? verifications.filter(v => v.status === 'pending').length : 0;

    const stats = [
        { title: 'Total Users', value: allUsers?.length || 0, icon: 'group', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
        { title: 'Pending Verifications', value: pendingVerificationsCount, icon: 'pending_actions', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
        { title: 'Pending Withdrawals', value: pendingWithdrawalsCount.toString(), icon: 'payments', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
        { title: 'Active Groups', value: groups?.length || 0, icon: 'diversity_3', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    ];

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">Dashboard Overview</h2>
                <p className="text-gray-500 dark:text-[#A8C4A8] mt-1">Welcome back, Admin</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#E5EBE3] dark:bg-[#0D1B0F] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] flex items-center gap-4 transition-colors duration-300">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} transition-colors duration-300`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] mb-4">Recent Verifications</h3>
                    <div className="space-y-4">
                        {verifications?.slice(0, 5).map((v) => (
                            <div key={v.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-[#1A2E1D] rounded-full flex items-center justify-center transition-colors">
                                        <span className="material-symbols-outlined text-gray-500 dark:text-[#A8C4A8]">person</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-[#E8F5E8] m-0">{v.name || v.email}</p>
                                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Submitted {v.documentType}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${v.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    v.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {v.status}
                                </span>
                            </div>
                        ))}
                        {(!verifications || verifications.length === 0) && (
                            <p className="text-gray-500 dark:text-[#A8C4A8] text-center py-4">No recent verifications</p>
                        )}
                    </div>
                </div>

                <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-[#A8C4A8]">Server Uptime</span>
                            <span className="font-medium text-green-600 dark:text-green-400">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-[#A8C4A8]">Database Health</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-[#A8C4A8]">API Latency</span>
                            <span className="font-medium text-gray-800 dark:text-[#E8F5E8]">45ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

