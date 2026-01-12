import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@kingdompay.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    occupation: 'Software Engineer',
    income: '$75,000 - $100,000'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Personal details updated:', formData);
    navigate('/profile');
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
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Personal Details</h1>
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
          <div className="max-w-2xl mx-auto animate-fade-in-up space-y-8">

            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Address Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Information */}
            <section>
              <h2 className="text-lg font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Financial Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#A8C4A8] mb-2">Annual Income</label>
                  <select
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] focus:border-transparent transition-all text-gray-900 dark:text-[#E8F5E8]"
                  >
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                    <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                    <option value="$100,000 - $150,000">$100,000 - $150,000</option>
                    <option value="$150,000+">$150,000+</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                className="w-full bg-[#6f9c16] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default PersonalDetails;


