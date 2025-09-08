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
import JoinTeam from "./pages/JoinTeam";
import RoleDetails from "./pages/RoleDetails";
import Dashboard from "./pages/Dashboard";
import ServicePage from "./pages/ServicePage";
import Library from "./pages/Library";
import RequestService from "./pages/RequestService";
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
            {/* Dashboard route - Admin only */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
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
                      path="/join"
                      element={<Navigate to="/join-team" replace />}
                    />

                    {/* Protected routes - require authentication */}
                    <Route
                      path="/contact"
                      element={
                        <ProtectedRoute>
                          <Contact />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/join-team"
                      element={
                        <ProtectedRoute>
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
                        <ProtectedRoute>
                          <RequestService />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </MainLayout>
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
