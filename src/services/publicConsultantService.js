import axios from "axios";
import API_BASE_URL from "../config/api.js";

// Create axios instance for public requests (no auth required)
const createPublicInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const publicConsultantService = {
  // Get all active consultants (public endpoint)
  getAllConsultants: async (params = {}) => {
    try {
      const response = await createPublicInstance().get("/public/consultants", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("🔍 API error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultants"
      );
    }
  },

  // Get consultant by ID (public endpoint)
  getConsultantById: async (id, language = "ar") => {
    try {
      const response = await createPublicInstance().get(
        `/public/consultants/${id}`,
        {
          params: { language },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch consultant"
      );
    }
  },

  // Search consultants (public endpoint)
  searchConsultants: async (searchTerm, params = {}) => {
    try {
      const response = await createPublicInstance().get(
        "/public/consultants/search",
        {
          params: { q: searchTerm, ...params },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search consultants"
      );
    }
  },
};

export default publicConsultantService;
