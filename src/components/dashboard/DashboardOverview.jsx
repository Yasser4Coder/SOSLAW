import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import ChartWidget from "./ChartWidget";
import {
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiTrendingUp,
  FiLoader,
  FiArrowLeft,
  FiDollarSign,
  FiBriefcase,
  FiMail,
} from "react-icons/fi";
import dashboardService from "../../services/dashboardService";
import { useAuth } from "../../contexts/useAuth";

const DashboardOverview = () => {
  const { user } = useAuth();
  const userName = user?.fullName || user?.firstName || "مدير";

  // Fetch dashboard statistics
  const {
    data: statisticsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["dashboardStatistics"],
    queryFn: dashboardService.getDashboardStatistics,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch recent activities
  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Extract data from API response
  const statsFromAPI = statisticsData?.data || {};
  const activitiesFromAPI = activitiesData?.data || [];

  // Map icons for activities
  const activitiesWithIcons = (activitiesFromAPI || []).map((activity) => ({
    ...activity,
    icon:
      activity.type === "user"
        ? FiUsers
        : activity.type === "consultation"
        ? FiFileText
        : activity.type === "contact"
        ? FiMessageSquare
        : activity.type === "join"
        ? FiTrendingUp
        : FiFileText,
  }));

  // Build statistics cards from real data
  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: statsFromAPI.totalUsers?.toLocaleString("en-US") || "0",
      change: statsFromAPI.usersChange || "+0%",
      changeType: statsFromAPI.usersChange?.startsWith("-") ? "negative" : "positive",
      icon: FiUsers,
      color: "blue",
    },
    {
      title: "الاستشارات القانونية",
      value: statsFromAPI.totalConsultations?.toLocaleString("en-US") || "0",
      change: statsFromAPI.consultationsChange || "+0%",
      changeType: statsFromAPI.consultationsChange?.startsWith("-") ? "negative" : "positive",
      icon: FiFileText,
      color: "green",
    },
    {
      title: "طلبات التواصل",
      value: statsFromAPI.totalContactRequests?.toLocaleString("en-US") || "0",
      change: statsFromAPI.contactRequestsChange || "+0%",
      changeType: statsFromAPI.contactRequestsChange?.startsWith("-") ? "negative" : "positive",
      icon: FiMessageSquare,
      color: "purple",
    },
    {
      title: "طلبات الانضمام",
      value: statsFromAPI.totalJoinApplications?.toLocaleString("en-US") || "0",
      change: statsFromAPI.joinApplicationsChange || "+0%",
      changeType: statsFromAPI.joinApplicationsChange?.startsWith("-") ? "negative" : "positive",
      icon: FiTrendingUp,
      color: "orange",
    },
  ];

  const hasError = statsError || activitiesError;
  const isLoading = isLoadingStats || isLoadingActivities;

  const handleRetry = () => {
    refetchStats();
    refetchActivities();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-right">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-6" />
            <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بك في لوحة تحكم SOSLAW</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
          <p className="text-red-600 font-medium mb-2">حدث خطأ أثناء تحميل لوحة التحكم</p>
          <p className="text-gray-500 text-sm mb-4">يرجى المحاولة مرة أخرى</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1a2a4a] transition-colors text-sm font-medium"
          >
            <FiArrowLeft className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Quick links for main sections
  const quickLinks = [
    { name: "المستخدمين", href: "/dashboard/users", icon: FiUsers },
    { name: "طلبات الخدمات", href: "/dashboard/service-requests", icon: FiFileText },
    { name: "طلبات التواصل", href: "/dashboard/contact", icon: FiMessageSquare },
    { name: "طلبات التوظيف", href: "/dashboard/applications", icon: FiMail },
    { name: "المدفوعات", href: "/dashboard/payments", icon: FiDollarSign },
    { name: "المستشارين", href: "/dashboard/consultants", icon: FiBriefcase },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-1">مرحباً {userName}، إليك ملخص النشاط الأخير</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">وصول سريع</h2>
          <p className="text-sm text-gray-500 mt-0.5">انتقل إلى الأقسام الرئيسية</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#09142b] hover:bg-[#f8f9fc] transition-all group"
                >
                  <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#09142b]/10 mb-2">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-[#09142b]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartWidget />
        </div>
        <div>
          <RecentActivity activities={activitiesWithIcons} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
