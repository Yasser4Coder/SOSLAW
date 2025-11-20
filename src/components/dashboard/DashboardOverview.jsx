import React from "react";
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
} from "react-icons/fi";
import dashboardService from "../../services/dashboardService";

const DashboardOverview = () => {
  // Fetch dashboard statistics
  const {
    data: statisticsData,
    isLoading: isLoadingStats,
    error: statsError,
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
  } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Extract data from API response
  const statsFromAPI = statisticsData?.data || {};
  const activitiesFromAPI = activitiesData?.data || [];

  // Map icons for activities
  const activitiesWithIcons = activitiesFromAPI.map(activity => ({
    ...activity,
    icon: activity.type === 'user' ? FiUsers :
          activity.type === 'consultation' ? FiFileText :
          activity.type === 'contact' ? FiMessageSquare :
          activity.type === 'join' ? FiTrendingUp : FiFileText
  }));

  // Build statistics cards from real data
  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: statsFromAPI.totalUsers?.toLocaleString('en-US') || "0",
      change: statsFromAPI.usersChange || "+0%",
      changeType: statsFromAPI.usersChange?.startsWith('-') ? "negative" : "positive",
      icon: FiUsers,
      color: "text-blue-600",
    },
    {
      title: "الاستشارات القانونية",
      value: statsFromAPI.totalConsultations?.toLocaleString('en-US') || "0",
      change: statsFromAPI.consultationsChange || "+0%",
      changeType: statsFromAPI.consultationsChange?.startsWith('-') ? "negative" : "positive",
      icon: FiFileText,
      color: "text-green-600",
    },
    {
      title: "طلبات التواصل",
      value: statsFromAPI.totalContactRequests?.toLocaleString('en-US') || "0",
      change: statsFromAPI.contactRequestsChange || "+0%",
      changeType: statsFromAPI.contactRequestsChange?.startsWith('-') ? "negative" : "positive",
      icon: FiMessageSquare,
      color: "text-purple-600",
    },
    {
      title: "طلبات الانضمام",
      value: statsFromAPI.totalJoinApplications?.toLocaleString('en-US') || "0",
      change: statsFromAPI.joinApplicationsChange || "+0%",
      changeType: statsFromAPI.joinApplicationsChange?.startsWith('-') ? "negative" : "positive",
      icon: FiTrendingUp,
      color: "text-orange-600",
    },
  ];

  // Show loading state
  if (isLoadingStats || isLoadingActivities) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // Show error state
  if (statsError || activitiesError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">حدث خطأ أثناء تحميل لوحة التحكم</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة تحكم SOSLAW</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Widget */}
        <div className="lg:col-span-2">
          <ChartWidget />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity activities={activitiesWithIcons} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
