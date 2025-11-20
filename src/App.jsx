import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import JoinTeam from "./pages/JoinTeam";
import RoleDetails from "./pages/RoleDetails";
import Dashboard from "./pages/Dashboard";
import ServicePage from "./pages/ServicePage";
import Library from "./pages/Library";
import RequestService from "./pages/RequestService";
import ServiceRequests from "./pages/ServiceRequests";
import PaymentDetails from "./pages/PaymentDetails";
import NationalConferenceRegistration from "./pages/NationalConferenceRegistration";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <Routes>
            {/* Dashboard route - Admin, Consultant, Support */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "consultant", "support"]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Main layout routes */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPassword />}
                    />
                    <Route
                      path="/verify-email/:token"
                      element={<VerifyEmail />}
                    />
                    <Route
                      path="/join"
                      element={<Navigate to="/join-team" replace />}
                    />

                    {/* Protected routes - require authentication */}
                    <Route
                      path="/contact"
                      element={
                        <ProtectedRoute requireEmailVerification={true}>
                          <Contact />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/join-team"
                      element={
                        <ProtectedRoute requireEmailVerification={true}>
                          <JoinTeam />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/role/:roleId"
                      element={
                        <ProtectedRoute>
                          <RoleDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/services/:serviceId"
                      element={
                        <ProtectedRoute>
                          <ServicePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/library"
                      element={
                        <ProtectedRoute>
                          <Library />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/request-service/:serviceId?"
                      element={
                        <ProtectedRoute requireEmailVerification={true}>
                          <RequestService />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/national-conference-registration"
                      element={<NationalConferenceRegistration />}
                    />
                    <Route
                      path="/service-requests"
                      element={
                        <ProtectedRoute>
                          <ServiceRequests />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </MainLayout>
              }
            />

            {/* Standalone Payment Details Route - No Header/Footer */}
            <Route
              path="/payment-details/:requestId"
              element={
                <ProtectedRoute>
                  <PaymentDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
