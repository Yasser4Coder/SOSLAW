import api from "./api";

const consultantService = {
  // Get all consultants for assignment
  async getConsultantsForAssignment() {
    try {
      const response = await api.get("/api/v1/consultants/for-assignment");
      return response.data;
    } catch (error) {
      console.error("Error fetching consultants for assignment:", error);
      throw error;
    }
  },

  // Get consultants for public use (no authentication required)
  async getPublicConsultantsForAssignment() {
    try {
      const response = await api.get("/public/consultants/for-assignment");
      return response.data;
    } catch (error) {
      console.error("Error fetching public consultants for assignment:", error);
      throw error;
    }
  },

  // Get all consultants
  async getAllConsultants(params = {}) {
    try {
      const response = await api.get("/api/v1/consultants", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching consultants:", error);
      throw error;
    }
  },

  // Get consultant by ID
  async getConsultantById(id) {
    try {
      const response = await api.get(`/api/v1/consultants/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching consultant:", error);
      throw error;
    }
  },

  // Create consultant
  async createConsultant(data) {
    try {
      const response = await api.post("/api/v1/consultants", data);
      return response.data;
    } catch (error) {
      console.error("Error creating consultant:", error);
      throw error;
    }
  },

  // Update consultant
  async updateConsultant(id, data) {
    try {
      const response = await api.put(`/api/v1/consultants/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating consultant:", error);
      throw error;
    }
  },

  // Delete consultant
  async deleteConsultant(id) {
    try {
      const response = await api.delete(`/api/v1/consultants/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting consultant:", error);
      throw error;
    }
  },

  // Toggle consultant status
  async toggleConsultantStatus(id) {
    try {
      const response = await api.patch(`/api/v1/consultants/${id}/status`);
      return response.data;
    } catch (error) {
      console.error("Error toggling consultant status:", error);
      throw error;
    }
  },
};

export default consultantService;
