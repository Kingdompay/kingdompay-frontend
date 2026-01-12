import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updateProfilePicture } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || ''
  });

  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfilePicture(base64String);
      setPreviewUrl(base64String);
      setUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Update profile data
    const result = updateProfile(formData);

    // Update profile picture if changed
    if (profilePicture && profilePicture !== user?.profilePicture) {
      updateProfilePicture(profilePicture);
    }

    if (result.success) {
      navigate('/profile');
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || '';
    const last = formData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 dark:bg-[#1A2E1D] border-none rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Edit Profile</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-2xl mx-auto animate-fade-in-up">

            {/* Profile Photo Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <img
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-[#58761B] object-cover shadow-lg"
                    src={previewUrl}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-[#58761B] bg-gradient-to-br from-[#1A3F22] to-[#58761B] flex items-center justify-center shadow-lg">
                    <span className="text-white text-4xl font-bold">{getInitials()}</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-4 bg-[#6f9c16] text-white border-none rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-[#5a8012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Form Fields */}
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-[#0A150C] border border-gray-200 dark:border-[#2D4A32] rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-gray-200 dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-[#E8F5E8] border-none rounded-xl px-6 py-3 font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-[#243B28] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#6f9c16] text-white border-none rounded-xl px-6 py-3 font-medium cursor-pointer hover:bg-[#5a8012] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default EditProfile;
