import { useState, useEffect, useCallback } from "react";
import notificationService from "../services/notificationService";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCounts, setNotificationCounts] = useState({
    total: 0,
    serviceRequests: 0,
    payments: 0,
    contactRequests: 0,
    joinApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated before making API call
      const token = document.cookie.includes("jwt=");
      console.log("useNotifications: Token check result:", token);
      if (!token) {
        console.log("useNotifications: No token found, skipping API call");
        setNotifications([]);
        setNotificationCounts({ total: 0, serviceRequests: 0, payments: 0, contactRequests: 0, joinApplications: 0 });
        setLoading(false);
        return;
      }

      const response = await notificationService.getUserNotifications();
      if (response && response.success) {
        const allNotifications = [];

        // Map service requests
        if (response.data.recentServiceRequests) {
          const serviceRequestNotifications = response.data.recentServiceRequests.map(
            (req) => ({
              id: `sr-${req.id}`,
              type: "info",
              title: `طلب خدمة جديد #${req.id}`,
              message: `من ${req.clientName}: ${req.serviceDescription?.substring(0, 50) || "طلب خدمة"}...`,
              time: new Date(req.created_at || req.createdAt).toLocaleString(),
              read: false,
              link: `/dashboard/service-requests`,
            })
          );
          allNotifications.push(...serviceRequestNotifications);
        }

        // Map contact requests
        if (response.data.recentContactRequests) {
          const contactRequestNotifications = response.data.recentContactRequests.map(
            (req) => ({
              id: `cr-${req.id}`,
              type: "info",
              title: `طلب تواصل جديد #${req.id}`,
              message: `من ${req.name}: ${req.subject || "طلب تواصل"}`,
              time: new Date(req.created_at || req.createdAt).toLocaleString(),
              read: false,
              link: `/dashboard/contact`,
            })
          );
          allNotifications.push(...contactRequestNotifications);
        }

        // Map join applications
        if (response.data.recentJoinApplications) {
          const joinApplicationNotifications = response.data.recentJoinApplications.map(
            (app) => ({
              id: `ja-${app.id}`,
              type: "info",
              title: `طلب توظيف جديد #${app.id}`,
              message: `من ${app.fullName}`,
              time: new Date(app.createdAt).toLocaleString(),
              read: false,
              link: `/dashboard/applications`,
            })
          );
          allNotifications.push(...joinApplicationNotifications);
        }

        setNotifications(allNotifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
      // Set fallback data
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotificationCounts = useCallback(async () => {
    try {
      setError(null);

      // Check if user is authenticated before making API call
      const token = document.cookie.includes("jwt=");
      if (!token) {
        setNotificationCounts({ total: 0, serviceRequests: 0, payments: 0, contactRequests: 0, joinApplications: 0 });
        return;
      }

      const response = await notificationService.getNotificationCounts();
      if (response && response.success) {
        setNotificationCounts(response.data);
      } else {
        // Set fallback data if response is not successful
        setNotificationCounts({ total: 0, serviceRequests: 0, payments: 0, contactRequests: 0, joinApplications: 0 });
      }
    } catch (err) {
      console.error("Error fetching notification counts:", err);
      setError(err.message || "Failed to fetch notification counts");
      // Set fallback data
      setNotificationCounts({ total: 0, serviceRequests: 0, payments: 0, contactRequests: 0, joinApplications: 0 });
    }
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      setError(null);
      const response = await notificationService.markNotificationAsRead(
        notificationId
      );
      if (response && response.success) {
        // Refresh notifications
        await fetchNotifications();
        await fetchNotificationCounts();
        return response.data;
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError(err.message || "Failed to mark notification as read");
      throw err;
    }
  };

  const decreaseServiceRequestCount = () => {
    setNotificationCounts((prev) => ({
      ...prev,
      serviceRequests: Math.max(0, prev.serviceRequests - 1),
      total: Math.max(0, prev.total - 1),
    }));
  };

  useEffect(() => {
    fetchNotifications();
    fetchNotificationCounts();
  }, [fetchNotifications, fetchNotificationCounts]);

  return {
    notifications,
    notificationCounts,
    loading,
    error,
    refetch: fetchNotifications,
    refetchCounts: fetchNotificationCounts,
    markAsRead: markNotificationAsRead,
    decreaseServiceRequestCount,
  };
};

export default useNotifications;
