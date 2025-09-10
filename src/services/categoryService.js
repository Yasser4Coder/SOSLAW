import api from "./api";
import axios from "axios";

class CategoryService {
  // Get all categories (admin)
  async getAllCategories(options = {}) {
    const params = new URLSearchParams();

    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);
    if (options.status) params.append("status", options.status);
    if (options.language) params.append("language", options.language);
    if (options.search) params.append("search", options.search);

    const response = await api.get(`/api/v1/categories?${params.toString()}`);
    return response.data;
  }

  // Get public categories (frontend)
  async getPublicCategories(options = {}) {
    const params = new URLSearchParams();
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "https://api-v1.soslawdz.com";

    if (options.limit) params.append("limit", options.limit);
    if (options.language) params.append("language", options.language);

    const response = await axios.get(
      `${API_BASE_URL}/public/categories?${params.toString()}`
    );
    return response.data;
  }

  // Get category by ID
  async getCategoryById(id, language = "ar") {
    const response = await api.get(
      `/api/v1/categories/${id}?language=${language}`
    );
    return response.data;
  }

  // Get category by ID with all languages (for editing)
  async getCategoryByIdAllLanguages(id) {
    const response = await api.get(`/api/v1/categories/${id}/all-languages`);
    return response.data;
  }

  // Get category by slug
  async getCategoryBySlug(slug, language = "ar") {
    const API_BASE_URL =
      import.meta.env?.VITE_API_URL || "https://api-v1.soslawdz.com";
    const response = await axios.get(
      `${API_BASE_URL}/public/categories/slug/${slug}?language=${language}`
    );
    return response.data;
  }

  // Create category
  async createCategory(categoryData) {
    const response = await api.post("/api/v1/categories", categoryData);
    return response.data;
  }

  // Update category
  async updateCategory(id, categoryData) {
    const response = await api.put(`/api/v1/categories/${id}`, categoryData);
    return response.data;
  }

  // Delete category
  async deleteCategory(id) {
    const response = await api.delete(`/api/v1/categories/${id}`);
    return response.data;
  }

  // Toggle category status
  async toggleCategoryStatus(id) {
    const response = await api.patch(`/api/v1/categories/${id}/status`);
    return response.data;
  }

  // Update category order
  async updateCategoryOrder(id, order) {
    const response = await api.patch(`/api/v1/categories/${id}/order`, {
      order,
    });
    return response.data;
  }

  // Get category statistics
  async getCategoryStats() {
    const response = await api.get("/api/v1/categories/stats");
    return response.data;
  }

  // Search categories
  async searchCategories(searchTerm, options = {}) {
    const params = new URLSearchParams();
    params.append("q", searchTerm);

    if (options.language) params.append("language", options.language);
    if (options.status) params.append("status", options.status);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);

    const response = await api.get(
      `/api/v1/categories/search?${params.toString()}`
    );
    return response.data;
  }

  // Check slug availability
  async checkSlugAvailability(slug, excludeId = null) {
    const params = new URLSearchParams();
    params.append("slug", slug);
    if (excludeId) params.append("excludeId", excludeId);

    const response = await api.get(
      `/api/v1/categories/check-slug?${params.toString()}`
    );
    return response.data;
  }
}

export default new CategoryService();
