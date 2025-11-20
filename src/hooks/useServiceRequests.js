import { useState, useEffect, useCallback, useRef } from "react";
import serviceRequestService from "../services/serviceRequestService";

const useServiceRequests = (params = {}) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const isFetchingRef = useRef(false);

  const fetchServiceRequests = useCallback(
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
        console.log("useServiceRequests: Token check result:", token);
        if (!token) {
          console.log("useServiceRequests: No token found, skipping API call");
          setServiceRequests([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
          setLoading(false);
          return;
        }

        const response = await serviceRequestService.getUserServiceRequests({
          ...params,
          ...newParams,
        });

        if (response && response.success) {
          setServiceRequests(response.data.requests || []);
          setPagination({
            page: response.data.page || 1,
            limit: response.data.limit || 10,
            total: response.data.total || 0,
            totalPages: response.data.totalPages || 0,
          });
        } else {
          console.error(
            "Service requests API returned unsuccessful response:",
            response
          );
          setServiceRequests([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching service requests:", err);
        setError(err.message || "Failed to fetch service requests");
        // Set fallback data
        setServiceRequests([]);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [] // Remove params dependency to prevent infinite loop
  );

  const fetchServiceRequestById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceRequestService.getUserServiceRequestById(
        id
      );
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error("Error fetching service request details:", err);
      setError(err.message || "Failed to fetch service request details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  return {
    serviceRequests,
    loading,
    error,
    pagination,
    refetch: fetchServiceRequests,
    fetchById: fetchServiceRequestById,
  };
};

export default useServiceRequests;
