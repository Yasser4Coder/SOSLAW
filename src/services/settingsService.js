import api from "./api";

const settingsService = {
  /**
   * Get e-payment (Chargily) enabled state. Public endpoint.
   */
  getEpaymentEnabled: async () => {
    const response = await api.get("/api/v1/settings/epayment");
    return response.data?.data?.ePaymentEnabled ?? true;
  },

  /**
   * Update e-payment enabled. Admin only (backend enforces).
   */
  updateEpaymentEnabled: async (ePaymentEnabled) => {
    const response = await api.patch("/api/v1/settings/epayment", {
      ePaymentEnabled,
    });
    return response.data;
  },
};

export default settingsService;
