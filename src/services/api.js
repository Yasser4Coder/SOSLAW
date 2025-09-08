import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      Cookies.remove("jwt");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: (userData) => api.post("/api/v1/auth/register", userData),

  // Login user
  login: (credentials) => api.post("/api/v1/auth/login", credentials),

  // Logout user
  logout: () => api.post("/api/v1/auth/logout"),

  // Get current user profile
  getProfile: () => api.get("/api/v1/auth/profile"),

  // Change password
  changePassword: (passwordData) =>
    api.put("/api/v1/auth/change-password", passwordData),

  // Refresh token
  refreshToken: () => api.post("/api/v1/auth/refresh"),
};

// User API endpoints
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: (params) => api.get("/api/v1/users", { params }),

  // Get user by ID
  getUserById: (id) => api.get(`/api/v1/users/${id}`),

  // Create new user (admin only)
  createUser: (userData) => api.post("/api/v1/users", userData),

  // Update user
  updateUser: (id, userData) => api.put(`/api/v1/users/${id}`, userData),

  // Delete user
  deleteUser: (id) => api.delete(`/api/v1/users/${id}`),

  // Toggle user status (activate/deactivate)
  toggleUserStatus: (id) => api.patch(`/api/v1/users/${id}/activate`),

  // Get user statistics
  getUserStats: () => api.get("/api/v1/users/stats/overview"),
};

export default api;
