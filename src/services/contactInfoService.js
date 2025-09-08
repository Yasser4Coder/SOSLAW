import api from "./api";

const contactInfoService = {
  // Get all contact information (public)
  async getAllContactInfo() {
    try {
      const response = await api.get("/api/v1/contact-info");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact info:", error);
      throw error;
    }
  },

  // Get contact info by type (public)
  async getContactInfoByType(type) {
    try {
      const response = await api.get(`/api/v1/contact-info/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact info by type ${type}:`, error);
      throw error;
    }
  },

  // Get all contact information for admin (with inactive items)
  async getAllContactInfoAdmin() {
    try {
      const response = await api.get("/api/v1/contact-info/admin");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin contact info:", error);
      throw error;
    }
  },

  // Get contact info by ID (admin)
  async getContactInfoById(id) {
    try {
      const response = await api.get(`/api/v1/contact-info/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact info by ID ${id}:`, error);
      throw error;
    }
  },

  // Create new contact info (admin)
  async createContactInfo(contactInfoData) {
    try {
      const response = await api.post(
        "/api/v1/contact-info/admin",
        contactInfoData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contact info:", error);
      throw error;
    }
  },

  // Update contact info (admin)
  async updateContactInfo(id, updateData) {
    try {
      const response = await api.put(
        `/api/v1/contact-info/admin/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating contact info ${id}:`, error);
      throw error;
    }
  },

  // Update contact info by key (admin)
  async updateContactInfoByKey(type, keyName, updateData) {
    try {
      const response = await api.put(
        `/api/v1/contact-info/admin/type/${type}/key/${keyName}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating contact info ${type}/${keyName}:`, error);
      throw error;
    }
  },

  // Bulk update contact info (admin)
  async bulkUpdateContactInfo(updates) {
    try {
      const response = await api.put("/api/v1/contact-info/admin/bulk-update", {
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk updating contact info:", error);
      throw error;
    }
  },

  // Delete contact info (admin)
  async deleteContactInfo(id) {
    try {
      const response = await api.delete(`/api/v1/contact-info/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact info ${id}:`, error);
      throw error;
    }
  },

  // Toggle contact info status (admin)
  async toggleContactInfoStatus(id) {
    try {
      const response = await api.patch(
        `/api/v1/contact-info/admin/${id}/toggle-status`
      );
      return response.data;
    } catch (error) {
      console.error(`Error toggling contact info status ${id}:`, error);
      throw error;
    }
  },

  // Helper function to get formatted contact info for frontend
  async getFormattedContactInfo() {
    try {
      const response = await contactInfoService.getAllContactInfo();
      return response.data;
    } catch (error) {
      console.error("Error getting formatted contact info:", error);
      // Return default fallback data
      return {
        phones: [
          { key: "main_phone", value: "+ 383 (21) 23 43984", order: 1 },
          { key: "contact_phone", value: "+213 555 123 456", order: 2 },
        ],
        emails: [
          { key: "main_email", value: "Sos.law.35@gmail.com", order: 1 },
          { key: "contact_email", value: "info@soslaw.com", order: 2 },
        ],
        addresses: [
          { key: "main_address", value: "الجزائر العاصمة، الجزائر", order: 1 },
        ],
        hours: [
          {
            key: "main_hours",
            value: "السبت - الخميس 8:30ص - 6:00م",
            order: 1,
          },
        ],
        socialMedia: {
          facebook: "https://www.facebook.com/soslaw",
          linkedin: "https://www.linkedin.com/company/soslaw",
          instagram: "https://www.instagram.com/soslaw",
          twitter: "https://www.twitter.com/soslaw",
          youtube: "https://www.youtube.com/soslaw",
        },
      };
    }
  },
};

export default contactInfoService;
