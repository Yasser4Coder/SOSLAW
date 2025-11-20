import api from "./api.js";

// Simple test function to check if API is working
export const testGetAllServiceRequests = async (params = {}) => {
  try {
    console.log("🔍 Testing getAllServiceRequests...", params);
    const response = await api.get("/api/v1/service-requests", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status,
      }
    });
    console.log("✅ Response received:", response);
    console.log("✅ Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in testGetAllServiceRequests:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};

export default testGetAllServiceRequests;
