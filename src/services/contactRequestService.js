import api from "./api";

const contactRequestService = {
  // Create a new contact request (public endpoint)
  createContactRequest: async (contactData) => {
    try {
      const response = await api.post("/api/v1/contact-requests", contactData);
      return response.data;
    } catch (error) {
      console.error("Error creating contact request:", error);
      throw error;
    }
  },

  // Get all contact requests (admin only)
  getAllContactRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await api.get(
        `/api/v1/contact-requests?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      throw error;
    }
  },

  // Get contact request by ID (admin only)
  getContactRequestById: async (id) => {
    try {
      const response = await api.get(`/api/v1/contact-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching contact request:", error);
      throw error;
    }
  },

  // Update contact request (admin only)
  updateContactRequest: async (id, updateData) => {
    try {
      const response = await api.put(
        `/api/v1/contact-requests/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating contact request:", error);
      throw error;
    }
  },

  // Update contact request status (admin only)
  updateContactRequestStatus: async (id, status) => {
    try {
      const response = await api.patch(
        `/api/v1/contact-requests/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating contact request status:", error);
      throw error;
    }
  },

  // Reply to contact request (admin only)
  replyToContactRequest: async (id, replyMessage) => {
    try {
      const response = await api.post(`/api/v1/contact-requests/${id}/reply`, {
        replyMessage,
      });
      return response.data;
    } catch (error) {
      console.error("Error replying to contact request:", error);
      throw error;
    }
  },

  // Delete contact request (admin only)
  deleteContactRequest: async (id) => {
    try {
      const response = await api.delete(`/api/v1/contact-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact request:", error);
      throw error;
    }
  },

  // Get contact request statistics (admin only)
  getContactRequestStats: async () => {
    try {
      const response = await api.get("/api/v1/contact-requests/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact request statistics:", error);
      throw error;
    }
  },
};

export default contactRequestService;
