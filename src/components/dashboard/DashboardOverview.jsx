import React from "react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import ChartWidget from "./ChartWidget";
import {
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";

const DashboardOverview = () => {
  // Mock data for statistics
  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FiUsers,
      color: "text-blue-600",
    },
    {
      title: "الاستشارات القانونية",
      value: "567",
      change: "+8%",
      changeType: "positive",
      icon: FiFileText,
      color: "text-green-600",
    },
    {
      title: "طلبات التواصل",
      value: "89",
      change: "+15%",
      changeType: "positive",
      icon: FiMessageSquare,
      color: "text-purple-600",
    },
    {
      title: "طلبات الانضمام",
      value: "45",
      change: "+5%",
      changeType: "positive",
      icon: FiTrendingUp,
      color: "text-orange-600",
    },
  ];

  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: "user",
      message: "تم تسجيل مستخدم جديد",
      time: "منذ 5 دقائق",
      icon: FiUsers,
    },
    {
      id: 2,
      type: "consultation",
      message: "تم إرسال استشارة قانونية جديدة",
      time: "منذ 15 دقيقة",
      icon: FiFileText,
    },
    {
      id: 3,
      type: "contact",
      message: "تم استلام طلب تواصل جديد",
      time: "منذ 30 دقيقة",
      icon: FiMessageSquare,
    },
    {
      id: 4,
      type: "join",
      message: "تم تقديم طلب انضمام للفريق",
      time: "منذ ساعة",
      icon: FiTrendingUp,
    },
  ];

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
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
