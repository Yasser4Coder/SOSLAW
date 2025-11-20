import api from "./api.js";

const serviceRequestService = {
  // Get user's service requests
  async getUserServiceRequests(params = {}) {
    try {
      const response = await api.get("/api/v1/service-requests/my-requests", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user service requests:", error);
      throw error;
    }
  },

  // Get service requests by consultant
  async getServiceRequestsByConsultant(consultantId, params = {}) {
    try {
      const response = await api.get(
        `/api/v1/service-requests/by-consultant/${consultantId}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching service requests by consultant:", error);
      throw error;
    }
  },

  // Get service request statistics
  async getServiceRequestStatistics(params = {}) {
    try {
      const response = await api.get("/api/v1/service-requests/statistics", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching service request statistics:", error);
      throw error;
    }
  },

  // Search service requests
  async searchServiceRequests(params = {}) {
    try {
      const response = await api.get("/api/v1/service-requests/search", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching service requests:", error);
      throw error;
    }
  },

  // Get specific service request details
  async getUserServiceRequestById(id) {
    try {
      const response = await api.get(
        `/api/v1/service-requests/my-requests/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching service request details:", error);
      throw error;
    }
  },

  // Create new service request
  async createServiceRequest(data) {
    try {
      const response = await api.post("/api/v1/service-requests", data);
      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
      throw error;
    }
  },

  // Get all service requests (for admin/consultant/support)
  async getAllServiceRequests(params = {}) {
    try {
      const response = await api.get("/api/v1/service-requests", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all service requests:", error);
      throw error;
    }
  },

  // Update service request status
  async updateServiceRequestStatus(id, status) {
    try {
      const response = await api.patch(
        `/api/v1/service-requests/${id}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating service request status:", error);
      throw error;
    }
  },

  // Delete service request
  async deleteServiceRequest(id) {
    try {
      const response = await api.delete(`/api/v1/service-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting service request:", error);
      throw error;
    }
  },

  // Assign consultant to service request
  async assignConsultant(id, consultantId) {
    try {
      const response = await api.patch(
        `/api/v1/service-requests/${id}/assign`,
        {
          consultantId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning consultant:", error);
      throw error;
    }
  },

  // Add reply to service request
  async addReply(id, replyData) {
    try {
      const response = await api.post(
        `/api/v1/service-requests/${id}/replies`,
        replyData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  },

  // Update payment information
  async updatePaymentInfo(id, paymentData) {
    try {
      const response = await api.patch(
        `/api/v1/service-requests/${id}/payment`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment info:", error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(id, statusData) {
    try {
      const response = await api.patch(
        `/api/v1/service-requests/${id}/payment-status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },
};

export default serviceRequestService;
