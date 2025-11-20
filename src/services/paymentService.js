import api from "./api";

const paymentService = {
  // Get all payments (admin only)
  getAllPayments: async (params = {}) => {
    const response = await api.get("/api/v1/payments", { params });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/api/v1/payments/${id}`);
    return response.data;
  },

  // Get user's payments
  getUserPayments: async (params = {}) => {
    const response = await api.get("/api/v1/payments/my-payments", { params });
    return response.data;
  },

  // Update payment
  updatePayment: async (id, data) => {
    const response = await api.put(`/api/v1/payments/${id}`, data);
    return response.data;
  },

  // Delete payment
  deletePayment: async (id) => {
    const response = await api.delete(`/api/v1/payments/${id}`);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id, statusData) => {
    const response = await api.patch(`/api/v1/payments/${id}/status`, statusData);
    return response.data;
  },

  // Search payments
  searchPayments: async (query, params = {}) => {
    const response = await api.get(`/api/v1/payments/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get("/api/v1/payments/stats");
    return response.data;
  },
};

export default paymentService;
