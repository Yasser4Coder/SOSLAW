import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import { useFontLoader } from "../hooks/useFontLoader";

const Dashboard = () => {
  // Ensure font is loaded
  useFontLoader();
  return (
    <>
      <Helmet>
        <html lang="ar" dir="rtl" />
        <title>لوحة التحكم | SOSLAW</title>
        <meta
          name="description"
          content="لوحة تحكم SOSLAW لإدارة المستخدمين والطلبات والاستشارات القانونية"
        />
      </Helmet>

      <DashboardLayout />
    </>
  );
};

export default Dashboard;
