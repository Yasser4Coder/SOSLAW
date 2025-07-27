import React, { useState } from "react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
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
} from "react-icons/fi";
import { useFontLoader } from "../hooks/useFontLoader";

// Dashboard Pages
import DashboardOverview from "../components/dashboard/DashboardOverview";
import UsersManagement from "../components/dashboard/UsersManagement";
import JoinTeamRequests from "../components/dashboard/JoinTeamRequests";
import ContactRequests from "../components/dashboard/ContactRequests";
import LegalConsultations from "../components/dashboard/LegalConsultations";
import ConsultantsManagement from "../components/dashboard/ConsultantsManagement";
import FAQManagement from "../components/dashboard/FAQManagement";
import Settings from "../components/dashboard/Settings";
import NotificationDropdown from "../components/dashboard/NotificationDropdown";
import AllNotifications from "../components/dashboard/AllNotifications";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = true; // Dashboard is always RTL/Arabic

  // Ensure font is loaded
  useFontLoader();

  const navigation = [
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
      name: "طلبات الانضمام للفريق",
      href: "/dashboard/join-team",
      icon: FiBriefcase,
      current: location.pathname === "/dashboard/join-team",
    },
    {
      name: "طلبات التواصل",
      href: "/dashboard/contact",
      icon: FiMessageSquare,
      current: location.pathname === "/dashboard/contact",
    },
    {
      name: "الاستشارات القانونية",
      href: "/dashboard/consultations",
      icon: FiFileText,
      current: location.pathname === "/dashboard/consultations",
    },
    {
      name: "إدارة المستشارين",
      href: "/dashboard/consultants",
      icon: FiUser,
      current: location.pathname === "/dashboard/consultants",
    },
    {
      name: "إدارة الأسئلة الشائعة",
      href: "/dashboard/faq",
      icon: FiHelpCircle,
      current: location.pathname === "/dashboard/faq",
    },
    {
      name: "الإعدادات",
      href: "/dashboard/settings",
      icon: FiSettings,
      current: location.pathname === "/dashboard/settings",
    },
  ];

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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    مدير النظام
                  </div>
                  <div className="text-sm text-gray-500">مدير</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/join-team" element={<JoinTeamRequests />} />
            <Route path="/contact" element={<ContactRequests />} />
            <Route path="/consultations" element={<LegalConsultations />} />
            <Route path="/consultants" element={<ConsultantsManagement />} />
            <Route path="/faq" element={<FAQManagement />} />
            <Route path="/notifications" element={<AllNotifications />} />
            <Route path="/settings" element={<Settings />} />
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
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2a4a] hover:text-white rounded-md transition-colors">
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

        {/* Mobile Logout Button */}
        <div className="absolute bottom-0 w-full p-4">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2a4a] hover:text-white rounded-md transition-colors">
            <FiLogOut className="ml-3 h-5 w-5 text-gray-400" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
