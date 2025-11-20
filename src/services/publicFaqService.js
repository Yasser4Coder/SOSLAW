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

export const publicFaqService = {
  // Get public FAQs (frontend)
  getPublicFAQs: async (params = {}) => {
    try {
      const response = await createPublicInstance().get("/public/faqs", {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  },

  // Get FAQ by ID (public endpoint)
  getFAQById: async (id, language = "ar") => {
    try {
      const response = await createPublicInstance().get(`/public/faqs/${id}`, {
        params: { language },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch FAQ");
    }
  },

  // Get FAQ categories (public endpoint)
  getFAQCategories: async () => {
    try {
      const response = await createPublicInstance().get(
        "/public/faqs/categories"
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch FAQ categories"
      );
    }
  },

  // Get FAQ statistics (public endpoint)
  getFAQStats: async () => {
    try {
      const response = await createPublicInstance().get("/public/faqs/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch FAQ statistics"
      );
    }
  },
};

export default publicFaqService;
