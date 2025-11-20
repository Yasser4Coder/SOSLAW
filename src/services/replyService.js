import api from "./api";

const replyService = {
  // Create a new reply
  async createReply(data) {
    try {
      const response = await api.post("/api/v1/replies", data);
      return response.data;
    } catch (error) {
      console.error("Error creating reply:", error);
      throw error;
    }
  },

  // Get replies for a specific service request
  async getRepliesByServiceRequest(serviceRequestId) {
    try {
      const response = await api.get(
        `/api/v1/replies/service-request/${serviceRequestId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  },

  // Get all replies (for admin/consultant/support)
  async getAllReplies(params = {}) {
    try {
      const response = await api.get("/api/v1/replies", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  },

  // Update a reply
  async updateReply(id, data) {
    try {
      const response = await api.put(`/api/v1/replies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating reply:", error);
      throw error;
    }
  },

  // Delete a reply
  async deleteReply(id) {
    try {
      const response = await api.delete(`/api/v1/replies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  },
};

export default replyService;
