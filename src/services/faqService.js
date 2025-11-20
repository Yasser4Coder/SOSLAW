import api from "./api";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

class FAQService {
  // Get all FAQs (admin)
  async getAllFAQs(options = {}) {
    const params = new URLSearchParams();

    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);
    if (options.status) params.append("status", options.status);
    if (options.language) params.append("language", options.language);
    if (options.category) params.append("category", options.category);
    if (options.featured !== undefined)
      params.append("featured", options.featured);
    if (options.search) params.append("search", options.search);

    const response = await api.get(`/api/v1/faqs?${params.toString()}`);
    return response.data;
  }

  // Get public FAQs (frontend)
  async getPublicFAQs(options = {}) {
    const params = new URLSearchParams();

    if (options.limit) params.append("limit", options.limit);
    if (options.language) params.append("language", options.language);
    if (options.category) params.append("category", options.category);
    if (options.featured !== undefined)
      params.append("featured", options.featured);

    const response = await axios.get(
      `${API_BASE_URL}/public/faqs?${params.toString()}`
    );
    return response.data;
  }

  // Get FAQ by ID
  async getFAQById(id, language = "ar") {
    const response = await api.get(`/api/v1/faqs/${id}?language=${language}`);
    return response.data;
  }

  // Get FAQ by ID with all languages (for editing)
  async getFAQByIdAllLanguages(id) {
    const response = await api.get(`/api/v1/faqs/${id}/all-languages`);
    return response.data;
  }

  // Create FAQ
  async createFAQ(faqData) {
    const response = await api.post("/api/v1/faqs", faqData);
    return response.data;
  }

  // Update FAQ
  async updateFAQ(id, faqData) {
    const response = await api.put(`/api/v1/faqs/${id}`, faqData);
    return response.data;
  }

  // Delete FAQ
  async deleteFAQ(id) {
    const response = await api.delete(`/api/v1/faqs/${id}`);
    return response.data;
  }

  // Toggle FAQ status
  async toggleFAQStatus(id) {
    const response = await api.patch(`/api/v1/faqs/${id}/status`);
    return response.data;
  }

  // Toggle FAQ featured status
  async toggleFAQFeatured(id) {
    const response = await api.patch(`/api/v1/faqs/${id}/featured`);
    return response.data;
  }

  // Update FAQ order
  async updateFAQOrder(id, order) {
    const response = await api.patch(`/api/v1/faqs/${id}/order`, { order });
    return response.data;
  }

  // Get FAQ statistics
  async getFAQStats() {
    const response = await axios.get(`${API_BASE_URL}/public/faqs/stats`);
    return response.data;
  }

  // Search FAQs
  async searchFAQs(searchTerm, options = {}) {
    const params = new URLSearchParams();
    params.append("q", searchTerm);

    if (options.language) params.append("language", options.language);
    if (options.status) params.append("status", options.status);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);

    const response = await api.get(`/api/v1/faqs/search?${params.toString()}`);
    return response.data;
  }

  // Get FAQ categories
  async getFAQCategories() {
    const response = await axios.get(`${API_BASE_URL}/public/faqs/categories`);
    return response.data;
  }
}

export default new FAQService();
