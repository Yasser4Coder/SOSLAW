import api from "./api.js";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

// Public route for creating applications
export const createApplication = (formData) => {
  return axios.post(`${API_BASE_URL}/api/v1/join-team-applications`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Protected routes (admin)
export const getAllApplications = (params = {}) => {
  return api.get("/api/v1/join-team-applications", { params });
};

export const getApplicationById = (id) => {
  return api.get(`/api/v1/join-team-applications/${id}`);
};

export const updateApplication = (id, data) => {
  return api.put(`/api/v1/join-team-applications/${id}`, data);
};

export const deleteApplication = (id) => {
  return api.delete(`/api/v1/join-team-applications/${id}`);
};

export const updateApplicationStatus = (id, status, adminNotes = null) => {
  return api.patch(`/api/v1/join-team-applications/${id}/status`, {
    status,
    adminNotes,
  });
};

export const getApplicationStats = () => {
  return api.get("/api/v1/join-team-applications/stats");
};

export const searchApplications = (searchTerm, params = {}) => {
  return api.get("/api/v1/join-team-applications/search", {
    params: {
      q: searchTerm,
      ...params,
    },
  });
};

export const getApplicationsByRole = (roleId, params = {}) => {
  return api.get(`/api/v1/join-team-applications/role/${roleId}`, { params });
};

const joinTeamApplicationService = {
  // Public routes
  createApplication,

  // Protected routes
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  getApplicationStats,
  searchApplications,
  getApplicationsByRole,
};

export default joinTeamApplicationService;
