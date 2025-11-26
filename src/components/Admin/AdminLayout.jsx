import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'bg-[#1A3F22] text-white' : 'text-gray-600 hover:bg-gray-100';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100 flex justify-center items-center h-24">
                    <img src="/logo.png" alt="KingdomPay Logo" className="w-56 h-auto object-contain" />
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <Link to="/admin" className={`flex items-center p-3 rounded-xl transition-colors no-underline font-medium ${isActive('/admin')}`}>
                        <span className="material-symbols-outlined mr-3">dashboard</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/verification" className={`flex items-center p-3 rounded-xl transition-colors no-underline font-medium ${isActive('/admin/verification')}`}>
                        <span className="material-symbols-outlined mr-3">verified_user</span>
                        Verification
                    </Link>
                    <Link to="/admin/withdrawals" className={`flex items-center p-3 rounded-xl transition-colors no-underline font-medium ${isActive('/admin/withdrawals')}`}>
                        <span className="material-symbols-outlined mr-3">payments</span>
                        Withdrawals
                    </Link>
                    <Link to="/admin/users" className={`flex items-center p-3 rounded-xl transition-colors no-underline font-medium ${isActive('/admin/users')}`}>
                        <span className="material-symbols-outlined mr-3">group</span>
                        Users
                    </Link>
                    <Link to="/admin/settings" className={`flex items-center p-3 rounded-xl transition-colors no-underline font-medium ${isActive('/admin/settings')}`}>
                        <span className="material-symbols-outlined mr-3">settings</span>
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium border-none cursor-pointer bg-transparent">
                        <span className="material-symbols-outlined mr-3">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
