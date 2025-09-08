import api from "./api";

const serviceRequestService = {
  // Create new service request
  createServiceRequest: async (requestData) => {
    const response = await api.post("/api/v1/service-requests", requestData);
    return response.data;
  },

  // Get all service requests (for admin)
  getAllServiceRequests: async (params = {}) => {
    const response = await api.get("/api/v1/service-requests", { params });
    return response.data;
  },

  // Get service request by ID
  getServiceRequestById: async (id) => {
    const response = await api.get(`/api/v1/service-requests/${id}`);
    return response.data;
  },

  // Update service request
  updateServiceRequest: async (id, requestData) => {
    const response = await api.put(
      `/api/v1/service-requests/${id}`,
      requestData
    );
    return response.data;
  },

  // Delete service request
  deleteServiceRequest: async (id) => {
    const response = await api.delete(`/api/v1/service-requests/${id}`);
    return response.data;
  },

  // Get service request statistics
  getServiceRequestStats: async () => {
    const response = await api.get("/api/v1/service-requests/stats");
    return response.data;
  },

  // Update service request status
  updateServiceRequestStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/service-requests/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Get user's service requests
  getUserServiceRequests: async (params = {}) => {
    const response = await api.get("/api/v1/service-requests/my-requests", {
      params,
    });
    return response.data;
  },

  // Search service requests
  searchServiceRequests: async (query, params = {}) => {
    const response = await api.get("/api/v1/service-requests/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },
};

export default serviceRequestService;
