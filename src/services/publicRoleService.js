import axios from "axios";
import API_BASE_URL from "../config/api.js";

// Create axios instance for public endpoints
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Get public roles
export const getPublicRoles = async (params = {}) => {
  try {
    const response = await publicApi.get("/public/roles", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};

// Get role by slug
export const getRoleBySlug = async (slug, params = {}) => {
  try {
    const response = await publicApi.get(`/public/roles/${slug}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch role");
  }
};

// Get role stats
export const getPublicRoleStats = async (params = {}) => {
  try {
    const response = await publicApi.get("/public/roles/stats", { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch role stats"
    );
  }
};

// Get role categories
export const getPublicRoleCategories = async (params = {}) => {
  try {
    const response = await publicApi.get("/public/roles/categories", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch role categories"
    );
  }
};

const publicRoleService = {
  getPublicRoles,
  getRoleBySlug,
  getPublicRoleStats,
  getPublicRoleCategories,
};

export default publicRoleService;
