import React, { useState } from 'react';

const Users = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joined: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Institution', status: 'Active', joined: '2023-02-20' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Suspended', joined: '2023-03-10' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Admin', status: 'Active', joined: '2023-01-05' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Suspended': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 m-0">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage system users and their roles</p>
                </div>
                <button className="px-4 py-2 bg-[#1A3F22] text-white rounded-lg hover:bg-[#14301a] font-medium border-none cursor-pointer flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Add User
                </button>
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
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 m-0">{user.name}</p>
                                                <p className="text-xs text-gray-500 m-0">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">{user.role}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{user.joined}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-[#1A3F22] transition-colors border-none bg-transparent cursor-pointer">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
