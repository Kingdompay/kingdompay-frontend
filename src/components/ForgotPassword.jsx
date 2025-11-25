import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setMessage('Check your inbox for further instructions');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1A3F22] mb-2">Reset Password</h1>
                    <p className="text-gray-500">Enter your email to reset your password</p>
                </div>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold hover:bg-[#14301a] transition-colors disabled:opacity-50 mt-6 cursor-pointer border-none"
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <Link to="/login" className="text-[#1A3F22] font-bold hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
