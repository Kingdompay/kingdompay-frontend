import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/community', icon: 'groups', label: 'Community' },
    { path: '/payments', icon: 'qr_code_scanner', label: 'Payments' },
    { path: '/savings', icon: 'savings', label: 'Savings' },
    { path: '/profile', icon: 'person', label: 'Profile' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto z-50">
      <div className="bg-white/80 dark:bg-[#1A2E1D]/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-5px_30px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_30px_-5px_rgba(0,0,0,0.3)] border-t border-gray-200 dark:border-[#2D4A32] pb-safe transaction-colors duration-300">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full decoration-transparent no-underline transition-colors duration-300 ${isActive(item.path)
                  ? 'text-[#D99201]'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
            >
              <span className={`material-symbols-outlined text-2xl mb-1 ${isActive(item.path) ? 'font-variation-fill' : ''
                }`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .font-variation-fill {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
    </div>
  );
};

export default BottomNav;
