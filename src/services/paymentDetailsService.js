import api from "./api";

const paymentDetailsService = {
  // Get payment details by payment ID
  async getPaymentDetailsByPaymentId(paymentId) {
    try {
      const response = await api.get(
        `/api/v1/payment-details/payment/${paymentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  },

  // Get payment details by service request ID
  async getPaymentDetailsByServiceRequestId(serviceRequestId) {
    try {
      const response = await api.get(
        `/api/v1/payment-details/service-request/${serviceRequestId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching payment details by service request:",
        error
      );
      throw error;
    }
  },

  // Get payment details by reference ID (more secure)
  async getPaymentDetailsByReferenceId(referenceId) {
    try {
      const response = await api.get(
        `/api/v1/payment-details/reference/${referenceId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching payment details by reference ID:",
        error
      );
      throw error;
    }
  },
};

export default paymentDetailsService;
