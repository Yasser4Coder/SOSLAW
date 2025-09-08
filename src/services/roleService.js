import api from "./api.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Protected routes (admin)
export const getAllRoles = (params = {}) => {
  return api.get("/api/v1/roles", { params });
};

export const getRoleById = (id, params = {}) => {
  return api.get(`/api/v1/roles/${id}`, { params });
};

export const getRoleByIdAllLanguages = (id) => {
  return api.get(`/api/v1/roles/${id}/all-languages`);
};

export const createRole = (data) => {
  return api.post("/api/v1/roles", data);
};

export const updateRole = (id, data) => {
  return api.put(`/api/v1/roles/${id}`, data);
};

export const deleteRole = (id) => {
  return api.delete(`/api/v1/roles/${id}`);
};

export const toggleRoleStatus = (id) => {
  return api.patch(`/api/v1/roles/${id}/status`);
};

export const updateRoleOrder = (id, order) => {
  return api.patch(`/api/v1/roles/${id}/order`, { order });
};

export const getRoleStats = () => {
  return api.get("/api/v1/roles/stats");
};

export const searchRoles = (searchTerm, params = {}) => {
  return api.get("/api/v1/roles/search", {
    params: {
      q: searchTerm,
      ...params,
    },
  });
};

export const checkSlugAvailability = (slug, excludeId = null) => {
  return api.get("/api/v1/roles/check-slug", {
    params: {
      slug,
      excludeId,
    },
  });
};

export const getRoleCategories = () => {
  return api.get("/api/v1/roles/categories");
};

// Public routes
export const getPublicRoles = (params = {}) => {
  return axios.get(`${API_BASE_URL}/public/roles`, { params });
};

export const getRoleBySlug = (slug, params = {}) => {
  return axios.get(`${API_BASE_URL}/public/roles/${slug}`, { params });
};

export const getPublicRoleStats = () => {
  return axios.get(`${API_BASE_URL}/public/roles/stats`);
};

export const getPublicRoleCategories = () => {
  return axios.get(`${API_BASE_URL}/public/roles/categories`);
};

const roleService = {
  // Protected routes
  getAllRoles,
  getRoleById,
  getRoleByIdAllLanguages,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  updateRoleOrder,
  getRoleStats,
  searchRoles,
  checkSlugAvailability,
  getRoleCategories,

  // Public routes
  getPublicRoles,
  getRoleBySlug,
  getPublicRoleStats,
  getPublicRoleCategories,
};

export default roleService;
