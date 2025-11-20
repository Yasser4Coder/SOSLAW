import api from "./api";

const dashboardService = {
  // Get dashboard statistics
  getDashboardStatistics: async () => {
    const response = await api.get("/api/v1/dashboard/statistics");
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`/api/v1/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  // Get chart data
  getChartData: async (days = 30) => {
    const response = await api.get(`/api/v1/dashboard/chart?days=${days}`);
    return response.data;
  },
};

export default dashboardService;

