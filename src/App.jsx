import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Savings from './components/Savings';
import Community from './components/Community';
import EditProfile from './components/EditProfile';
import Security from './components/Security';
import Cards from './components/Cards';
import Referrals from './components/Referrals';
import Settings from './components/Settings';
import HelpSupport from './components/HelpSupport';
import Payments from './components/Payments';
import Notifications from './components/Notifications';

import PersonalDetails from './components/PersonalDetails';
import LinkedAccounts from './components/LinkedAccounts';
import LimitsPlans from './components/LimitsPlans';
import ChangePin from './components/ChangePin';
import TwoFactorAuth from './components/TwoFactorAuth';
import Biometric from './components/Biometric';
import ChatSupport from './components/ChatSupport';
import FAQs from './components/FAQs';
import SendMoney from './components/SendMoney';
import RequestMoney from './components/RequestMoney';
import AddMoney from './components/AddMoney';
import TestPage from './components/TestPage';
import CreateGroup from './components/CreateGroup';
import JoinGroup from './components/JoinGroup';
import CreateGoal from './components/CreateGoal';
import QuickSave from './components/QuickSave';
import ScanQR from './components/ScanQR';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-primary-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-primary-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

// Inner App component
const AppContent = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/savings"
                element={
                  <ProtectedRoute>
                    <Savings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/security"
                element={
                  <ProtectedRoute>
                    <Security />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cards"
                element={
                  <ProtectedRoute>
                    <Cards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/referrals"
                element={
                  <ProtectedRoute>
                    <Referrals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help-support"
                element={
                  <ProtectedRoute>
                    <HelpSupport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/personal-details"
                element={
                  <ProtectedRoute>
                    <PersonalDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/linked-accounts"
                element={
                  <ProtectedRoute>
                    <LinkedAccounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/limits-plans"
                element={
                  <ProtectedRoute>
                    <LimitsPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-pin"
                element={
                  <ProtectedRoute>
                    <ChangePin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/2fa"
                element={
                  <ProtectedRoute>
                    <TwoFactorAuth />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/biometric"
                element={
                  <ProtectedRoute>
                    <Biometric />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat-support"
                element={
                  <ProtectedRoute>
                    <ChatSupport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faqs"
                element={
                  <ProtectedRoute>
                    <FAQs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/send-money"
                element={
                  <ProtectedRoute>
                    <SendMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request-money"
                element={
                  <ProtectedRoute>
                    <RequestMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-money"
                element={
                  <ProtectedRoute>
                    <AddMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-group"
                element={
                  <ProtectedRoute>
                    <CreateGroup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/join-group"
                element={
                  <ProtectedRoute>
                    <JoinGroup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-goal"
                element={
                  <ProtectedRoute>
                    <CreateGoal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quick-save"
                element={
                  <ProtectedRoute>
                    <QuickSave />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan-qr"
                element={
                  <ProtectedRoute>
                    <ScanQR />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
