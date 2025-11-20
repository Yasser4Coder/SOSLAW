import api from "./api";

const passwordResetService = {
  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      const response = await api.post("/api/v1/password-reset/send-reset", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  },

  // Verify password reset token
  async verifyResetToken(token) {
    try {
      const response = await api.get(`/api/v1/password-reset/verify/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying reset token:", error);
      throw error;
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(`/api/v1/password-reset/reset/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  // Resend password reset email
  async resendPasswordResetEmail(email) {
    try {
      const response = await api.post("/api/v1/password-reset/resend", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error resending password reset email:", error);
      throw error;
    }
  },
};

export default passwordResetService;
