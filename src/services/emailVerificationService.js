import api from "./api";

class EmailVerificationService {
  // Send verification email
  async sendVerificationEmail(email) {
    const response = await api.post(
      "/api/v1/email-verification/send-verification",
      {
        email,
      }
    );
    return response.data;
  }

  // Verify email with token
  async verifyEmail(token) {
    const response = await api.get(
      `/api/v1/email-verification/verify/${token}`
    );
    return response.data;
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    const response = await api.post(
      "/api/v1/email-verification/resend-verification",
      {
        email,
      }
    );
    return response.data;
  }

  // Check verification status
  async checkVerificationStatus(email) {
    const response = await api.get(
      `/api/v1/email-verification/status/${email}`
    );
    return response.data;
  }
}

export default new EmailVerificationService();
