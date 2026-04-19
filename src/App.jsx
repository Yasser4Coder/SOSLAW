import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Consultants from "./pages/Consultants";
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
import Shop from "./pages/Shop";
import ShopProduct from "./pages/ShopProduct";
import ShopOrderResult from "./pages/ShopOrderResult";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import RequestService from "./pages/RequestService";
import ServiceRequests from "./pages/ServiceRequests";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import NationalConferenceRegistration from "./pages/NationalConferenceRegistration";
import TrainingCourse from "./pages/TrainingCourse";
import VoiceCourseRegistration from "./pages/VoiceCourseRegistration";
import EmpowerProgram from "./pages/EmpowerProgram";
import EmpowerProgramRegistration from "./pages/EmpowerProgramRegistration";
import HopeForum from "./pages/HopeForum";
import HopeForumRegistration from "./pages/HopeForumRegistration";
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
                    <Route path="/consultants" element={<Consultants />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/order/success" element={<ShopOrderResult />} />
                    <Route path="/shop/order/failure" element={<ShopOrderResult />} />
                    <Route path="/shop/:productId" element={<ShopProduct />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:courseId" element={<CourseDetail />} />
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

                    <Route path="/contact" element={<Contact />} />
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
                        
                          <ServicePage />
                        
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
                      element={<RequestService />}
                    />
                    <Route
                      path="/national-conference-registration"
                      element={<NationalConferenceRegistration />}
                    />
                    <Route path="/empower-program" element={<EmpowerProgram />} />
                    <Route path="/empower-program/register" element={<EmpowerProgramRegistration />} />
                    <Route path="/hope-forum" element={<HopeForum />} />
                    <Route path="/hope-forum/register" element={<HopeForumRegistration />} />
                    <Route path="/training-course" element={<TrainingCourse />} />
                    <Route path="/voice-course-registration" element={<VoiceCourseRegistration />} />
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
            {/* Payment result pages (redirect from Chargily) */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Routes>
          <Toaster />
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
