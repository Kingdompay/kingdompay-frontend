import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Components
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

// Main Pages
import Home from './components/Home';
import Profile from './components/Profile';
import Savings from './components/Savings';
import Community from './components/Community';
import Payments from './components/Payments';
import Notifications from './components/Notifications';
import Settings from './components/Settings';

// Profile Sub-pages
import EditProfile from './components/EditProfile';
import Security from './components/Security';
import Cards from './components/Cards';
import Referrals from './components/Referrals';
import PersonalDetails from './components/PersonalDetails';
import LinkedAccounts from './components/LinkedAccounts';
import LimitsPlans from './components/LimitsPlans';
import ChangePin from './components/ChangePin';
import TwoFactorAuth from './components/TwoFactorAuth';
import Biometric from './components/Biometric';
import HelpSupport from './components/HelpSupport';
import ChatSupport from './components/ChatSupport';
import FAQs from './components/FAQs';

// Payment Sub-pages
import SendMoney from './components/SendMoney';
import RequestMoney from './components/RequestMoney';
import AddMoney from './components/AddMoney';
import ScanQR from './components/ScanQR';

// Community Sub-pages
import CreateGroup from './components/CreateGroup';
import JoinGroup from './components/JoinGroup';

// Savings Sub-pages
import CreateGoal from './components/CreateGoal';
import QuickSave from './components/QuickSave';

// Admin Components
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import IdentityVerification from './components/Admin/IdentityVerification';
import Users from './components/Admin/Users';
import AdminSettings from './components/Admin/AdminSettings';

// Test Page
import TestPage from './components/TestPage';

const AppContent = () => {
  const { theme } = useDarkMode();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg">
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected User Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Profile Sub-pages */}
          <Route path="/linked-accounts" element={<ProtectedRoute><LinkedAccounts /></ProtectedRoute>} />
          <Route path="/limits-plans" element={<ProtectedRoute><LimitsPlans /></ProtectedRoute>} />
          <Route path="/change-pin" element={<ProtectedRoute><ChangePin /></ProtectedRoute>} />
          <Route path="/two-factor-auth" element={<ProtectedRoute><TwoFactorAuth /></ProtectedRoute>} />
          <Route path="/biometric" element={<ProtectedRoute><Biometric /></ProtectedRoute>} />
          <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
          <Route path="/chat-support" element={<ProtectedRoute><ChatSupport /></ProtectedRoute>} />
          <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/personal-details" element={<ProtectedRoute><PersonalDetails /></ProtectedRoute>} />

          {/* Payment Sub-pages */}
          <Route path="/send-money" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/request-money" element={<ProtectedRoute><RequestMoney /></ProtectedRoute>} />
          <Route path="/add-money" element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
          <Route path="/scan-qr" element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />

          {/* Community Sub-pages */}
          <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
          <Route path="/join-group" element={<ProtectedRoute><JoinGroup /></ProtectedRoute>} />

          {/* Savings Sub-pages */}
          <Route path="/create-goal" element={<ProtectedRoute><CreateGoal /></ProtectedRoute>} />
          <Route path="/quick-save" element={<ProtectedRoute><QuickSave /></ProtectedRoute>} />

          {/* Test Page */}
          <Route path="/test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="verification" element={<IdentityVerification />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <AppContent />
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
