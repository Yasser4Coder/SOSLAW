import { useState, useEffect, useCallback, useRef } from "react";
import paymentService from "../services/paymentService";

const usePayments = (params = {}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const isFetchingRef = useRef(false);

  const fetchPayments = useCallback(
    async (newParams = {}) => {
      // Prevent multiple simultaneous calls
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        // Check if user is authenticated before making API call
        const token = document.cookie.includes("jwt=");
        if (!token) {
          setPayments([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
          setLoading(false);
          return;
        }

        const response = await paymentService.getUserPayments({
          ...params,
          ...newParams,
        });

        if (response && response.success) {
          setPayments(response.data.payments || []);
          setPagination({
            page: response.data.page || 1,
            limit: response.data.limit || 10,
            total: response.data.total || 0,
            totalPages: response.data.totalPages || 0,
          });
        } else {
          // Set fallback data if response is not successful
          setPayments([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to fetch payments");
        // Set fallback data
        setPayments([]);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [] // Remove params dependency to prevent infinite loop
  );

  const fetchPaymentById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getPaymentById(id);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError(err.message || "Failed to fetch payment details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.createPayment(data);
      if (response.success) {
        // Refresh payments list
        await fetchPayments();
        return response.data;
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      setError(err.message || "Failed to create payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.updatePaymentStatus(id, status);
      if (response.success) {
        // Refresh payments list
        await fetchPayments();
        return response.data;
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError(err.message || "Failed to update payment status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    pagination,
    refetch: fetchPayments,
    fetchById: fetchPaymentById,
    createPayment,
    updatePaymentStatus,
  };
};

export default usePayments;
