import api from "./api";

const serviceService = {
  // Get all services
  getAllServices: async (params = {}) => {
    const response = await api.get("/api/v1/services", { params });
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await api.get(`/api/v1/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const response = await api.post("/api/v1/services", serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await api.put(`/api/v1/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`/api/v1/services/${id}`);
    return response.data;
  },

  // Search services
  searchServices: async (query, params = {}) => {
    const response = await api.get("/api/v1/services/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get service statistics
  getServiceStats: async () => {
    const response = await api.get("/api/v1/services/stats");
    return response.data;
  },

  // Toggle service status
  toggleServiceStatus: async (id) => {
    const response = await api.patch(`/api/v1/services/${id}/toggle-status`);
    return response.data;
  },

  // Toggle service featured status
  toggleServiceFeatured: async (id) => {
    const response = await api.patch(`/api/v1/services/${id}/toggle-featured`);
    return response.data;
  },

  // Get service by ID with all languages
  getServiceByIdAllLanguages: async (id) => {
    const response = await api.get(`/api/v1/services/${id}/all-languages`);
    return response.data;
  },
};

export default serviceService;
