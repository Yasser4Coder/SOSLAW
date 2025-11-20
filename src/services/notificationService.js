import api from "./api";

const notificationService = {
  // Get user notifications
  async getUserNotifications() {
    try {
      const response = await api.get("/api/v1/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  },

  // Get notification counts only
  async getNotificationCounts() {
    try {
      const response = await api.get("/api/v1/notifications/counts");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification counts:", error);
      throw error;
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.patch(
        `/api/v1/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },
};

export default notificationService;
