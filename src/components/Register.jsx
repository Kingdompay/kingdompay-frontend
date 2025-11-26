import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user' // Default role
    });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            const result = await register(formData);
            if (result.success) {
                navigate('/home');
            } else {
                setError(result.error || 'Failed to register');
            }
        } catch (err) {
            setError('Failed to create an account');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="KingdomPay Logo" className="h-28 w-auto object-contain max-w-xs" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1A3F22] mb-2">Create Account</h1>
                    <p className="text-gray-500">Join KingdomPay today</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${formData.role === 'user'
                                ? 'bg-white text-[#1A3F22] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Individual
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'institution' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${formData.role === 'institution'
                                ? 'bg-white text-[#1A3F22] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Institution
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.role === 'institution' ? 'Institution Name' : 'Full Name'}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none transition-all"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A3F22] text-white py-3 rounded-xl font-bold hover:bg-[#14301a] transition-colors disabled:opacity-50 mt-6 cursor-pointer border-none"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#1A3F22] font-bold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
