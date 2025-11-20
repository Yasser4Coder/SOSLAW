import React, { useState } from "react";
import { Link, useLocation, Routes, Route, Navigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiBriefcase,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiUser,
  FiTrendingUp,
  FiCalendar,
  FiMail,
  FiStar,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";
import { useFontLoader } from "../hooks/useFontLoader";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useAuth } from "../contexts/useAuth.js";
import BackToTop from "../components/BackToTop";

// Dashboard Pages
import DashboardOverview from "../components/dashboard/DashboardOverview";
import UsersManagement from "../components/dashboard/UsersManagement";
import JoinTeamRequests from "../components/dashboard/JoinTeamRequests";
import ContactRequests from "../components/dashboard/ContactRequests";
import LegalConsultations from "../components/dashboard/LegalConsultations";
import ConsultantsManagement from "../components/dashboard/ConsultantsManagement";
import TestimonialsManagement from "../components/dashboard/TestimonialsManagement";
import FAQManagement from "../components/dashboard/FAQManagement";
import CategoryManagement from "../components/dashboard/CategoryManagement";
import RoleManagement from "../components/dashboard/RoleManagement";
import JoinTeamApplicationsManagement from "../components/dashboard/JoinTeamApplicationsManagement";
import ServiceRequestsManagement from "../components/dashboard/ServiceRequestsManagement";
import PaymentsManagement from "../components/dashboard/PaymentsManagement";
import Settings from "../components/dashboard/Settings";
import NotificationDropdown from "../components/dashboard/NotificationDropdown";
import AllNotifications from "../components/dashboard/AllNotifications";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = true; // Dashboard is always RTL/Arabic
  const { logout, user } = useAuth();

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      logout();
    }
  };

  // Ensure font is loaded
  useFontLoader();

  // Scroll to top on route change
  useScrollToTop();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    // Check user role directly
    const userRole = user?.role;

    // Limited access for consultant and support roles
    if (userRole === "consultant" || userRole === "support") {
      return [
        {
          name: "طلبات الخدمات",
          href: "/dashboard/service-requests",
          icon: FiFileText,
          current: location.pathname === "/dashboard/service-requests",
        },
        {
          name: "طلبات التواصل",
          href: "/dashboard/contact",
          icon: FiMessageSquare,
          current: location.pathname === "/dashboard/contact",
        },
      ];
    }

    // Full access for admin
    return [
      {
        name: "نظرة عامة",
        href: "/dashboard",
        icon: FiHome,
        current: location.pathname === "/dashboard",
      },
      {
        name: "إدارة المستخدمين",
        href: "/dashboard/users",
        icon: FiUsers,
        current: location.pathname === "/dashboard/users",
      },
      {
        name: "إدارة المستشارين",
        href: "/dashboard/consultants",
        icon: FiUser,
        current: location.pathname === "/dashboard/consultants",
      },
      {
        name: "إدارة التوصيات",
        href: "/dashboard/testimonials",
        icon: FiStar,
        current: location.pathname === "/dashboard/testimonials",
      },
      {
        name: "إدارة الأسئلة الشائعة",
        href: "/dashboard/faq",
        icon: FiHelpCircle,
        current: location.pathname === "/dashboard/faq",
      },
      {
        name: "إدارة الفئات",
        href: "/dashboard/categories",
        icon: FiTag,
        current: location.pathname === "/dashboard/categories",
      },
      {
        name: "إدارة الوظائف",
        href: "/dashboard/roles",
        icon: FiBriefcase,
        current: location.pathname === "/dashboard/roles",
      },
      {
        name: "طلبات التوظيف",
        href: "/dashboard/applications",
        icon: FiMail,
        current: location.pathname === "/dashboard/applications",
      },
      {
        name: "طلبات الخدمات",
        href: "/dashboard/service-requests",
        icon: FiFileText,
        current: location.pathname === "/dashboard/service-requests",
      },
      {
        name: "طلبات التواصل",
        href: "/dashboard/contact",
        icon: FiMessageSquare,
        current: location.pathname === "/dashboard/contact",
      },
      {
        name: "المدفوعات",
        href: "/dashboard/payments",
        icon: FiDollarSign,
        current: location.pathname === "/dashboard/payments",
      },
      {
        name: "الإعدادات",
        href: "/dashboard/settings",
        icon: FiSettings,
        current: location.pathname === "/dashboard/settings",
      },
    ];
  };

  const navigation = getNavigationItems();

  return (
    <div
      className="min-h-screen bg-gray-50 font-arabic dashboard-layout"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Content */}
      <div className="flex flex-col dashboard-content h-screen">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200 relative z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={20} />
            </button>

            <div className="flex items-center justify-between w-full">
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Menu */}
              <div className="flex items-center space-x-reverse space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    user?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.firstName || "User"
                    )}+${encodeURIComponent(
                      user?.lastName || ""
                    )}&background=09142b&color=ffffff&size=128`
                  }
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.role === "admin"
                      ? "مدير النظام"
                      : user?.role === "consultant"
                      ? "مستشار"
                      : user?.role === "support"
                      ? "دعم فني"
                      : "مدير"}
                  </div>
                </div>
                {/* Top Navigation Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="تسجيل الخروج"
                >
                  <FiLogOut className="ml-2 h-4 w-4" />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            {/* Routes available to consultant and support users */}
            <Route
              path="/service-requests"
              element={<ServiceRequestsManagement />}
            />
            <Route path="/contact" element={<ContactRequests />} />

            {/* Admin-only routes */}
            {user?.role === "admin" && (
              <>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/join-team" element={<JoinTeamRequests />} />
                <Route path="/consultations" element={<LegalConsultations />} />
                <Route
                  path="/consultants"
                  element={<ConsultantsManagement />}
                />
                <Route
                  path="/testimonials"
                  element={<TestimonialsManagement />}
                />
                <Route path="/faq" element={<FAQManagement />} />
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/roles" element={<RoleManagement />} />
                <Route
                  path="/applications"
                  element={<JoinTeamApplicationsManagement />}
                />
                <Route path="/payments" element={<PaymentsManagement />} />
                <Route path="/notifications" element={<AllNotifications />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}

            {/* Default redirect for limited access users */}
            {(user?.role === "consultant" || user?.role === "support") && (
              <Route
                path="/"
                element={<Navigate to="/dashboard/service-requests" replace />}
              />
            )}
          </Routes>
        </main>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-[#09142b] h-screen dashboard-sidebar">
        <div className="flex items-center justify-between h-16 px-6 bg-[#1a2a4a]">
          <div className="flex items-center">
            <img src="/logo.svg" alt="SOSLAW" className="h-8 w-auto" />
            <span className="mr-3 text-white font-bold text-lg">Dashboard</span>
          </div>
        </div>

        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "bg-[#c8a45e] text-[#09142b]"
                      : "text-gray-300 hover:bg-[#1a2a4a] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`ml-3 h-5 w-5 ${
                      item.current ? "text-[#09142b]" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2a4a] hover:text-white rounded-md transition-colors"
          >
            <FiLogOut className="ml-3 h-5 w-5 text-gray-400" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#09142b] transform transition-transform duration-300 ease-in-out md:hidden dashboard-sidebar ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-[#1a2a4a]">
          <div className="flex items-center">
            <img src="/logo.svg" alt="SOSLAW" className="h-8 w-auto" />
            <span className="mr-3 text-white font-bold text-lg">Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "bg-[#c8a45e] text-[#09142b]"
                      : "text-gray-300 hover:bg-[#1a2a4a] hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`ml-3 h-5 w-5 ${
                      item.current ? "text-[#09142b]" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2a4a] hover:text-white rounded-md transition-colors"
          >
            <FiLogOut className="ml-3 h-5 w-5 text-gray-400" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default DashboardLayout;
