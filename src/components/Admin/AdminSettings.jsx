import React, { useState } from 'react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistrations: true,
        emailNotifications: true,
        systemName: 'KingdomPay',
        supportEmail: 'support@kingdompay.com'
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-fade-in-up max-w-4xl">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E8F5E8] m-0">System Settings</h2>
                <p className="text-gray-500 dark:text-[#A8C4A8] mt-1">Configure global application settings</p>
            </header>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] mb-4">General Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-1">System Name</label>
                            <input
                                type="text"
                                name="systemName"
                                value={settings.systemName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 dark:border-[#2D4A32] rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#E8F5E8] mb-1">Support Email</label>
                            <input
                                type="email"
                                name="supportEmail"
                                value={settings.supportEmail}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 dark:border-[#2D4A32] rounded-xl focus:ring-2 focus:ring-[#1A3F22] focus:border-transparent outline-none bg-white dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2D4A32] transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-[#E8F5E8] mb-4">System Controls</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-xl transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">Maintenance Mode</p>
                                <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Disable access for non-admin users</p>
                            </div>
                            <button
                                onClick={() => handleToggle('maintenanceMode')}
                                className={`w-12 h-6 rounded-full transition-colors relative border-none cursor-pointer ${settings.maintenanceMode ? 'bg-[#1A3F22]' : 'bg-gray-300 dark:bg-[#2D4A32]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-xl transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">Allow Registrations</p>
                                <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Enable new user sign-ups</p>
                            </div>
                            <button
                                onClick={() => handleToggle('allowRegistrations')}
                                className={`w-12 h-6 rounded-full transition-colors relative border-none cursor-pointer ${settings.allowRegistrations ? 'bg-[#1A3F22]' : 'bg-gray-300 dark:bg-[#2D4A32]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.allowRegistrations ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#243B28] rounded-xl transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-[#E8F5E8] m-0">Email Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">Send system alerts to admins</p>
                            </div>
                            <button
                                onClick={() => handleToggle('emailNotifications')}
                                className={`w-12 h-6 rounded-full transition-colors relative border-none cursor-pointer ${settings.emailNotifications ? 'bg-[#1A3F22]' : 'bg-gray-300 dark:bg-[#2D4A32]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.emailNotifications ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="px-6 py-3 bg-[#1A3F22] text-white rounded-xl font-bold hover:bg-[#14301a] transition-colors border-none cursor-pointer">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

