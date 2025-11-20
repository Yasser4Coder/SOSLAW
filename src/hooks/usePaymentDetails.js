import { useState, useEffect, useCallback } from "react";
import paymentDetailsService from "../services/paymentDetailsService";

const usePaymentDetails = (requestId, type = "serviceRequest") => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentDetails = useCallback(async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);

      let response;
      if (type === "payment") {
        response = await paymentDetailsService.getPaymentDetailsByPaymentId(
          requestId
        );
      } else if (type === "reference") {
        response = await paymentDetailsService.getPaymentDetailsByReferenceId(
          requestId
        );
      } else {
        response =
          await paymentDetailsService.getPaymentDetailsByServiceRequestId(
            requestId
          );
      }

      if (response && response.success) {
        setPaymentDetails(response.data);
      } else {
        // Set error if response is not successful
        setError(response?.message || "Failed to fetch payment details");
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError(err.message || "Failed to fetch payment details");
    } finally {
      setLoading(false);
    }
  }, [requestId, type]);

  useEffect(() => {
    fetchPaymentDetails();
  }, [fetchPaymentDetails]);

  return {
    paymentDetails,
    loading,
    error,
    refetch: fetchPaymentDetails,
  };
};

export default usePaymentDetails;
