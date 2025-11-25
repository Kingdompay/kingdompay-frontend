import React from 'react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Users', value: '12,345', icon: 'group', color: 'bg-blue-100 text-blue-600' },
        { title: 'Pending Verifications', value: '23', icon: 'pending_actions', color: 'bg-orange-100 text-orange-600' },
        { title: 'Total Transactions', value: '$1.2M', icon: 'payments', color: 'bg-green-100 text-green-600' },
        { title: 'Active Groups', value: '142', icon: 'diversity_3', color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 m-0">Dashboard Overview</h2>
                <p className="text-gray-500 mt-1">Welcome back, Admin</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 m-0">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 m-0">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Verifications</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-500">person</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 m-0">User #{1000 + i}</p>
                                        <p className="text-xs text-gray-500 m-0">Submitted ID Document</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Server Uptime</span>
                            <span className="font-medium text-green-600">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Database Health</span>
                            <span className="font-medium text-green-600">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">API Latency</span>
                            <span className="font-medium text-gray-800">45ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
