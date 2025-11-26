import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

const WithdrawalRequests = () => {
    const { withdrawalRequests, approveWithdrawal, rejectWithdrawal } = useAuth();
    const { formatCurrency } = useCurrency();

    const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
    const historyRequests = withdrawalRequests.filter(req => req.status !== 'pending').reverse();

    return (
        <div className="animate-fade-in-up">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 m-0">Withdrawal Requests</h2>
                <p className="text-gray-500 mt-1">Manage institutional withdrawal requests</p>
            </header>

            <div className="space-y-8">
                {/* Pending Requests */}
                <section>
                    <h3 className="text-lg font-bold text-[#1A3F22] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">pending</span>
                        Pending Requests
                    </h3>

                    {pendingRequests.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <p className="text-gray-500">No pending requests.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map(request => (
                                <div key={request.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-[#1A3F22] text-lg m-0">{request.groupName}</h4>
                                        <p className="text-sm text-gray-500 m-0">Requested by: {request.requesterId}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(request.date).toLocaleString()}</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
                                        <div className="text-right md:text-left">
                                            <p className="text-xs text-gray-500 m-0">Amount</p>
                                            <p className="text-xl font-bold text-[#1A3F22] m-0">{formatCurrency(request.amount)}</p>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => rejectWithdrawal(request.id)}
                                                className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => approveWithdrawal(request.id)}
                                                className="flex-1 md:flex-none bg-[#1A3F22] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#14301a] transition-colors shadow-sm cursor-pointer"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Request History */}
                <section>
                    <h3 className="text-lg font-bold text-[#1A3F22] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-500">history</span>
                        Request History
                    </h3>

                    {historyRequests.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <p className="text-gray-500">No history available.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                        <tr>
                                            <th className="p-4 font-medium">Group</th>
                                            <th className="p-4 font-medium">Requester</th>
                                            <th className="p-4 font-medium">Amount</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {historyRequests.map(request => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-medium text-[#1A3F22]">{request.groupName}</td>
                                                <td className="p-4 text-gray-600">{request.requesterId}</td>
                                                <td className="p-4 font-bold text-[#1A3F22]">{formatCurrency(request.amount)}</td>
                                                <td className="p-4 text-gray-500">{new Date(request.date).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {request.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default WithdrawalRequests;
