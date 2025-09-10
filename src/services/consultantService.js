import axios from "axios";

// Use environment variable or default to localhost
const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "https://api-v1.soslawdz.com/api/v1";

// Get auth token from cookies
const getAuthToken = () => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("jwt=")
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Create axios instance with auth header
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Create axios instance for multipart/form-data (file uploads)
const createMultipartInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const consultantService = {
  // Get all consultants
  getAllConsultants: async (params = {}) => {
    try {
      const response = await createAuthInstance().get("/consultants", {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultants"
      );
    }
  },

  // Get consultant by ID
  getConsultantById: async (id, language = "ar") => {
    try {
      const response = await createAuthInstance().get(`/consultants/${id}`, {
        params: { language },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultant"
      );
    }
  },

  // Get consultant by ID with all languages (for editing)
  getConsultantByIdAllLanguages: async (id) => {
    try {
      const response = await createAuthInstance().get(
        `/consultants/${id}/all-languages`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultant"
      );
    }
  },

  // Create new consultant
  createConsultant: async (consultantData, imageFile) => {
    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(consultantData).forEach((key) => {
        formData.append(key, consultantData[key]);
      });

      // Add image file
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await createMultipartInstance().post(
        "/consultants",
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create consultant"
      );
    }
  },

  // Update consultant
  updateConsultant: async (id, consultantData, imageFile) => {
    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(consultantData).forEach((key) => {
        formData.append(key, consultantData[key]);
      });

      // Add image file if provided
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await createMultipartInstance().put(
        `/consultants/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update consultant"
      );
    }
  },

  // Delete consultant
  deleteConsultant: async (id) => {
    try {
      const response = await createAuthInstance().delete(`/consultants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete consultant"
      );
    }
  },

  // Toggle consultant status
  toggleConsultantStatus: async (id) => {
    try {
      const response = await createAuthInstance().patch(
        `/consultants/${id}/status`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle consultant status"
      );
    }
  },

  // Get consultant statistics
  getConsultantStats: async () => {
    try {
      const response = await createAuthInstance().get("/consultants/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultant statistics"
      );
    }
  },

  // Search consultants
  searchConsultants: async (searchTerm, params = {}) => {
    try {
      const response = await createAuthInstance().get("/consultants/search", {
        params: { q: searchTerm, ...params },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search consultants"
      );
    }
  },
};

export default consultantService;
