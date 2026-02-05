import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DarkModeProvider, useDarkMode } from "./contexts/DarkModeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifiedRoute from "./components/VerifiedRoute";
import AdminRoute from "./components/AdminRoute";

// Auth Components
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";
import ForgotPassword from "./components/ForgotPassword";

// Main Pages
import Home from "./components/Home";
import Profile from "./components/Profile";
import Savings from "./components/Savings";
import Community from "./components/Community";
import Payments from "./components/Payments";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";

// Profile Sub-pages
import EditProfile from "./components/EditProfile";
import Security from "./components/Security";
import Cards from "./components/Cards";
import Referrals from "./components/Referrals";
import PersonalDetails from "./components/PersonalDetails";
import LinkedAccounts from "./components/LinkedAccounts";
import LimitsPlans from "./components/LimitsPlans";
import ChangePin from "./components/ChangePin";
import TwoFactorAuth from "./components/TwoFactorAuth";
import Biometric from "./components/Biometric";
import HelpSupport from "./components/HelpSupport";
import ChatSupport from "./components/ChatSupport";
import FAQs from "./components/FAQs";
import VerificationUpload from "./components/VerificationUpload";

// Payment Sub-pages
import SendMoney from "./components/SendMoney";
import RequestMoney from "./components/RequestMoney";
import AddMoney from "./components/AddMoney";
import WithdrawMoney from "./components/WithdrawMoney";
import ScanQR from "./components/ScanQR";

// Community Sub-pages
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";
import CommunitySettings from "./components/CommunitySettings";

// Savings Sub-pages
import CreateGoal from "./components/CreateGoal";
import QuickSave from "./components/QuickSave";

// Admin Components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import IdentityVerification from "./components/Admin/IdentityVerification";
import Users from "./components/Admin/Users";
import AdminSettings from "./components/Admin/AdminSettings";
import WithdrawalRequests from "./components/Admin/WithdrawalRequests";

const AppContent = () => {
  // Dark mode class is handled in DarkModeContext

  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-bg">
      <div className="w-full h-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Welcome />
                </PageTransition>
              }
            />
            <Route
              path="/welcome"
              element={
                <PageTransition>
                  <Welcome />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />
            <Route
              path="/admin-login"
              element={
                <PageTransition>
                  <AdminLogin />
                </PageTransition>
              }
            />
            <Route
              path="/community-login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              }
            />

            {/* Protected User Routes */}
            {/* Home is restricted until verified as it shows wallet */}
            <Route
              path="/home"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <Home />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/savings"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <Savings />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/community"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <Community />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/payments"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <Payments />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/notifications"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </PageTransition>
              }
            />

            {/* Profile Sub-pages */}
            <Route
              path="/linked-accounts"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <LinkedAccounts />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/limits-plans"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <LimitsPlans />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/change-pin"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <ChangePin />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/two-factor-auth"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <TwoFactorAuth />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/biometric"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Biometric />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/help-support"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <HelpSupport />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/chat-support"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <ChatSupport />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/faqs"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <FAQs />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/security"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Security />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/cards"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <Cards />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/referrals"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Referrals />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/personal-details"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <PersonalDetails />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/verify-identity"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerificationUpload />
                  </ProtectedRoute>
                </PageTransition>
              }
            />

            {/* Payment Sub-pages */}
            <Route
              path="/send-money"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <SendMoney />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/request-money"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <RequestMoney />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/add-money"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <AddMoney />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/withdraw-money"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <WithdrawMoney />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/scan-qr"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <ScanQR />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />

            {/* Community Sub-pages */}
            <Route
              path="/create-group"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <CreateGroup />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/join-group"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <JoinGroup />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/community/:communityId/settings"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <CommunitySettings />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />

            {/* Savings Sub-pages */}
            <Route
              path="/create-goal"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <CreateGoal />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/quick-save"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <VerifiedRoute>
                      <QuickSave />
                    </VerifiedRoute>
                  </ProtectedRoute>
                </PageTransition>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="verification" element={<IdentityVerification />} />
              <Route path="withdrawals" element={<WithdrawalRequests />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DarkModeProvider>
          <CurrencyProvider>
            <Router>
              <AppContent />
            </Router>
          </CurrencyProvider>
        </DarkModeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
