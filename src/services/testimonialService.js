import api from "./api";
import axios from "axios";

class TestimonialService {
  // Get all testimonials (admin)
  async getAllTestimonials(options = {}) {
    const params = new URLSearchParams();

    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);
    if (options.status) params.append("status", options.status);
    if (options.language) params.append("language", options.language);
    if (options.rating) params.append("rating", options.rating);
    if (options.verified !== undefined)
      params.append("verified", options.verified);
    if (options.featured !== undefined)
      params.append("featured", options.featured);
    if (options.search) params.append("search", options.search);

    const response = await api.get(`/api/v1/testimonials?${params.toString()}`);
    return response.data;
  }

  // Get public testimonials (frontend)
  async getPublicTestimonials(options = {}) {
    const params = new URLSearchParams();
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "http://localhost:5000";

    if (options.limit) params.append("limit", options.limit);
    if (options.language) params.append("language", options.language);
    if (options.rating) params.append("rating", options.rating);
    if (options.featured !== undefined)
      params.append("featured", options.featured);

    const response = await axios.get(
      `${API_BASE_URL}/public/testimonials?${params.toString()}`
    );
    return response.data;
  }

  // Get testimonial by ID
  async getTestimonialById(id, language = "ar") {
    const response = await api.get(
      `/api/v1/testimonials/${id}?language=${language}`
    );
    return response.data;
  }

  // Get testimonial by ID with all languages (for editing)
  async getTestimonialByIdAllLanguages(id) {
    const response = await api.get(`/api/v1/testimonials/${id}/all-languages`);
    return response.data;
  }

  // Create testimonial
  async createTestimonial(testimonialData) {
    const response = await api.post("/api/v1/testimonials", testimonialData);
    return response.data;
  }

  // Update testimonial
  async updateTestimonial(id, testimonialData) {
    const response = await api.put(
      `/api/v1/testimonials/${id}`,
      testimonialData
    );
    return response.data;
  }

  // Delete testimonial
  async deleteTestimonial(id) {
    const response = await api.delete(`/api/v1/testimonials/${id}`);
    return response.data;
  }

  // Toggle testimonial status
  async toggleTestimonialStatus(id) {
    const response = await api.patch(`/api/v1/testimonials/${id}/status`);
    return response.data;
  }

  // Toggle testimonial verification
  async toggleTestimonialVerification(id) {
    const response = await api.patch(`/api/v1/testimonials/${id}/verification`);
    return response.data;
  }

  // Toggle testimonial featured status
  async toggleTestimonialFeatured(id) {
    const response = await api.patch(`/api/v1/testimonials/${id}/featured`);
    return response.data;
  }

  // Get testimonial statistics
  async getTestimonialStats() {
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "http://localhost:5000";
    const response = await axios.get(
      `${API_BASE_URL}/public/testimonials/stats`
    );
    return response.data;
  }

  // Search testimonials
  async searchTestimonials(searchTerm, options = {}) {
    const params = new URLSearchParams();
    params.append("q", searchTerm);

    if (options.language) params.append("language", options.language);
    if (options.status) params.append("status", options.status);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);

    const response = await api.get(
      `/api/v1/testimonials/search?${params.toString()}`
    );
    return response.data;
  }
}

export default new TestimonialService();
