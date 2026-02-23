import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiFileText,
  FiMapPin,
  FiDollarSign,
  FiEdit,
  FiMessageCircle,
} from "react-icons/fi";
import serviceRequestService from "../../services/serviceRequestService";
import serviceService from "../../services/serviceService";
import replyService from "../../services/replyService";
import consultantService from "../../services/consultantService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const ServiceRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedConsultantFilter, setSelectedConsultantFilter] =
    useState("all");
  const [isSearching, setIsSearching] = useState(false);

  // Professional debounced search with proper state management
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500); // Increased delay for better UX

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedConsultantFilter, debouncedSearchTerm]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const searchInputRef = useRef(null);

  const queryClient = useQueryClient();

  // Professional search handlers
  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleImmediateSearch = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Single endpoint: getAllServiceRequests with server-side search across all requests
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: [
      "service-requests",
      selectedFilter,
      selectedConsultantFilter,
      currentPage,
      itemsPerPage,
      debouncedSearchTerm.trim() || null,
    ],
    queryFn: async () => {
      const result = await serviceRequestService.getAllServiceRequests({
        page: currentPage,
        limit: itemsPerPage,
        status: selectedFilter === "all" ? undefined : selectedFilter,
        assignedTo:
          selectedConsultantFilter === "all"
            ? undefined
            : selectedConsultantFilter,
        ...(debouncedSearchTerm.trim()
          ? { search: debouncedSearchTerm.trim() }
          : {}),
      });
      return result;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !isSearching,
  });

  // Fetch services for reference
  const { data: servicesData, error: servicesError } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const result = await serviceService.getAllServices({
          status: "active",
        });
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch consultants for assignment
  const { data: consultantsData, error: consultantsError } = useQuery({
    queryKey: ["consultants-for-assignment"],
    queryFn: async () => {
      try {
        const result = await consultantService.getConsultantsForAssignment();
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch statistics (only when not searching, since search results show filtered stats)
  const { data: statisticsData } = useQuery({
    queryKey: ["service-request-statistics", selectedConsultantFilter],
    queryFn: async () => {
      try {
        const result = await serviceRequestService.getServiceRequestStatistics({
          assignedTo:
            selectedConsultantFilter === "all"
              ? undefined
              : selectedConsultantFilter,
        });
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !debouncedSearchTerm || debouncedSearchTerm.trim().length === 0, // Only fetch when not searching
  });

  // Extract requests from API response
  const allRequests = requestsData?.data?.requests || [];
  const totalRequests = requestsData?.data?.total || 0;

  // Extract consultants from API response
  const consultants = consultantsData?.data || [];

  // Extract statistics from API response
  const stats = statisticsData?.data || {
    total: 0,
    pending: 0,
    pending_payment: 0,
    approved: 0,
    rejected: 0,
    in_progress: 0,
    completed: 0,
  };

  // For now, use allRequests directly since search should be server-side
  // TODO: Implement server-side search for better pagination support
  const requests = allRequests;

  // Get service name by ID
  const getServiceName = (serviceId) => {
    const service = servicesData?.data?.services?.find(
      (s) => s.id === serviceId
    );
    return service ? service.titleAr : "غير محدد";
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "الرقم",
      sortable: true,
      render: (value) => `#${value}`,
    },
    {
      key: "clientName",
      label: "اسم العميل",
      sortable: true,
    },
    {
      key: "clientEmail",
      label: "البريد الإلكتروني",
      sortable: true,
    },
    {
      key: "clientPhone",
      label: "رقم الهاتف",
      sortable: true,
    },
    {
      key: "serviceId",
      label: "الخدمة",
      sortable: true,
      render: (value) => getServiceName(value),
    },
    {
      key: "urgency",
      label: "الأولوية",
      sortable: true,
      render: (value) => {
        const urgencyConfig = {
          urgent: { text: "عاجل", color: "text-red-600 bg-red-50" },
          high: { text: "عالية", color: "text-orange-600 bg-orange-50" },
          normal: { text: "عادية", color: "text-blue-600 bg-blue-50" },
          low: { text: "منخفضة", color: "text-green-600 bg-green-50" },
        };
        const config = urgencyConfig[value] || urgencyConfig.normal;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, request) => {
        const statusConfig = {
          pending: {
            text: "في الانتظار",
            icon: FiClock,
            color: "text-yellow-600 bg-yellow-50",
          },
          pending_payment: {
            text: "في انتظار الدفع",
            icon: FiDollarSign,
            color: "text-orange-600 bg-orange-50",
          },
          approved: {
            text: "مقبول",
            icon: FiCheckCircle,
            color: "text-green-600 bg-green-50",
          },
          rejected: {
            text: "مرفوض",
            icon: FiXCircle,
            color: "text-red-600 bg-red-50",
          },
          in_progress: {
            text: "قيد التنفيذ",
            icon: FiLoader,
            color: "text-blue-600 bg-blue-50",
          },
          completed: {
            text: "مكتمل",
            icon: FiCheck,
            color: "text-green-600 bg-green-50",
          },
        };
        // Use request.status if value is not available or incorrect
        const actualStatus = value || request.status;
        const config = statusConfig[actualStatus] || statusConfig.pending;
        const Icon = config.icon;

        return (
          <div className="flex items-center space-x-2 space-x-reverse">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
              <Icon className="ml-1 w-3 h-3" />
              {config.text}
            </span>
            <select
              value={value}
              onChange={(e) => handleStatusChange(request.id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="pending">في الانتظار</option>
              <option value="pending_payment">في انتظار الدفع</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "paymentRequired",
      label: "متطلبات الدفع",
      sortable: true,
      render: (value, request) => {
        if (!value) {
          return (
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-gray-500 text-sm">لا يتطلب دفع</span>
              <span className="text-xs text-gray-400">(يمكن إضافة)</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-green-600 font-medium">نعم</span>
            {request.paymentAmount && (
              <span className="text-sm text-gray-600">
                {request.paymentAmount.toLocaleString()}{" "}
                {request.paymentCurrency || "DA"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "assignedConsultant",
      label: "المستشار المكلف",
      sortable: true,
      render: (value, request) => {
        // Find consultant name from the consultants list
        const consultant = consultants.find((c) => c.id === request.assignedTo);
        return (
          consultant?.name ||
          request.assignedConsultant?.fullName ||
          "لم يتم التكليف"
        );
      },
    },
    {
      key: "paymentStatus",
      label: "حالة الدفع",
      sortable: true,
      render: (value, request) => {
        if (!request.paymentRequired) {
          return <span className="text-gray-500 text-sm">لا يتطلب دفع</span>;
        }

        const statusColors = {
          pending: "text-yellow-600 bg-yellow-50",
          processing: "text-blue-600 bg-blue-50",
          completed: "text-green-600 bg-green-50",
          failed: "text-red-600 bg-red-50",
          cancelled: "text-gray-600 bg-gray-50",
          refunded: "text-purple-600 bg-purple-50",
        };

        const statusText = {
          pending: "في الانتظار",
          processing: "قيد المعالجة",
          completed: "مكتمل",
          failed: "فشل",
          cancelled: "ملغي",
          refunded: "مسترد",
        };

        const colorClass = statusColors[value] || "text-gray-600 bg-gray-50";
        const text = statusText[value] || value;

        return (
          <div className="flex items-center space-x-2 space-x-reverse">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {text}
            </span>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "تاريخ الطلب",
      sortable: true,
      render: (value, request) => {
        const dateValue = value || request.created_at;
        if (!dateValue) return "غير محدد";
        try {
          return new Date(dateValue).toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
        } catch (error) {
          return "غير محدد";
        }
      },
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, request) => (
        <div className="flex items-center space-x-1 space-x-reverse">
          <button
            onClick={() => handleView(request)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="عرض التفاصيل"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(request)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="تعديل الطلب"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAssign(request)}
            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
            title="تكليف مستشار"
          >
            <FiUser className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleReply(request)}
            className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
            title="إضافة رد"
          >
            <FiMessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePayment(request)}
            className={`p-1 rounded ${
              request.paymentRequired
                ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={
              request.paymentRequired
                ? "تعديل معلومات الدفع"
                : "إضافة متطلبات الدفع"
            }
          >
            <FiDollarSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(request)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="حذف الطلب"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Status update mutation
  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, status }) =>
      serviceRequestService.updateServiceRequestStatus(id, status),
    onSuccess: async () => {
      // Invalidate all service-requests queries
      queryClient.invalidateQueries({
        queryKey: ["service-requests"],
        exact: false,
      });

      // Small delay to ensure backend has processed the update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Force immediate refetch
      await refetchRequests();

      // Trigger notification refresh for clients
      window.dispatchEvent(new CustomEvent('refreshNotifications'));

      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      console.error("Status update error:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => serviceRequestService.deleteServiceRequest(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["service-requests"],
        exact: false,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      await refetchRequests();
      setShowDeleteModal(false);
      setSelectedRequest(null);
      
      // Trigger notification refresh for clients
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء حذف الطلب");
    },
  });

  // Assign consultant mutation
  const assignMutation = useMutation({
    mutationFn: ({ id, consultantId }) =>
      serviceRequestService.assignConsultant(id, consultantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-requests"],
        exact: false,
      });
      setShowAssignModal(false);
      setSelectedRequest(null);
      setSelectedConsultant("");
      
      // Trigger notification refresh for clients
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      
      toast.success("تم تكليف المستشار بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تكليف المستشار");
    },
  });

  // Add reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ serviceRequestId, message, replyType = "admin" }) =>
      replyService.createReply({
        serviceRequestId,
        message,
        messageEn: message,
        messageFr: message,
        replyType,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["service-requests"],
        exact: false,
      });
      await refetchRequests();
      setShowReplyModal(false);
      setSelectedRequest(null);
      setReplyMessage("");
      
      // Trigger notification refresh for clients
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      
      toast.success("تم إضافة الرد بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إضافة الرد");
    },
  });

  // Update payment info mutation
  const paymentMutation = useMutation({
    mutationFn: ({ id, paymentData }) =>
      serviceRequestService.updatePaymentInfo(id, paymentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-requests"],
        exact: false,
      });
      setShowPaymentModal(false);
      setSelectedRequest(null);
      setEditFormData({});

      // Trigger notification refresh for clients
      window.dispatchEvent(new CustomEvent('refreshNotifications'));

      // Show different success messages based on action
      const wasPaymentRequired = selectedRequest?.paymentRequired;
      const isNowPaymentRequired = variables.paymentData.paymentRequired;

      if (!wasPaymentRequired && isNowPaymentRequired) {
        toast.success("تم إضافة متطلبات الدفع بنجاح");
      } else if (wasPaymentRequired && !isNowPaymentRequired) {
        toast.success("تم إلغاء متطلبات الدفع بنجاح");
      } else {
        toast.success("تم تحديث معلومات الدفع بنجاح");
      }
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تحديث معلومات الدفع");
    },
  });


  const handleView = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setEditFormData({
      serviceDescription: request.serviceDescription,
      urgency: request.urgency,
      preferredDate: request.preferredDate,
      additionalRequirements: request.additionalRequirements,
      notes: request.notes,
    });
    setShowEditModal(true);
  };

  const handleAssign = (request) => {
    setSelectedRequest(request);
    setSelectedConsultant(request.assignedConsultant?.id || "");
    setShowAssignModal(true);
  };

  const handleReply = (request) => {
    setSelectedRequest(request);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handlePayment = (request) => {
    setSelectedRequest(request);
    setEditFormData({
      paymentRequired: request.paymentRequired,
      paymentAmount: request.paymentAmount,
      paymentCurrency: request.paymentCurrency,
      paymentDueDate: request.paymentDueDate,
    });
    setShowPaymentModal(true);
  };

  const handleStatusChange = (requestId, newStatus) => {
    statusUpdateMutation.mutate({ id: requestId, status: newStatus });
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRequest) {
      deleteMutation.mutate(selectedRequest.id);
    }
  };

  if (isLoadingRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (requestsError) {
    // Check if it's an authentication error
    if (requestsError.response?.status === 401) {
      return (
        <div className="text-center py-8">
          <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600">مطلوب تسجيل الدخول</p>
          <p className="text-sm text-gray-500 mt-2">
            يجب تسجيل الدخول لعرض طلبات الخدمات
          </p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8">
        <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-sm text-gray-500 mt-2">
          {requestsError.message || "خطأ في الاتصال بالخادم"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إدارة طلبات الخدمات
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة جميع طلبات الخدمات من العملاء
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">في انتظار الدفع</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.pending_payment}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مقبول</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiLoader className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">قيد التنفيذ</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.in_progress}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مكتمل</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiXCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مرفوض</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Professional Search Input */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="البحث في اسم العميل، البريد، أو الهاتف... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => {
                handleSearchInputChange(e.target.value);
              }}
              onKeyDown={(e) => {
                // Handle Enter key for immediate search
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImmediateSearch();
                }
                // Handle Escape key to clear
                if (e.key === "Escape") {
                  handleSearchClear();
                }
              }}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg transition-all duration-200 ${
                isSearching
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
              autoComplete="off"
              spellCheck="false"
              title="البحث في طلبات الخدمات - استخدم Ctrl+F للوصول السريع، Enter للبحث الفوري"
            />
            {/* Search Status Indicator */}
            {isSearching && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiLoader className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            )}
            {/* Clear Button */}
            {searchTerm && !isSearching && (
              <button
                onClick={handleSearchClear}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                type="button"
                title="مسح البحث"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            {/* Search Results Indicator */}
            {debouncedSearchTerm && totalRequests > 0 && (
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                تم العثور على {totalRequests} نتيجة
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="pending_payment">في انتظار الدفع</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>

          {/* Consultant Filter */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedConsultantFilter}
              onChange={(e) => setSelectedConsultantFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع المستشارين</option>
              <option value="unassigned">غير مكلف</option>
              {consultants.map((consultant) => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <DataTable
          data={requests}
          columns={columns}
          searchTerm={searchTerm}
          pagination={{
            current: currentPage,
            limit: itemsPerPage,
            total: totalRequests,
            offset: (currentPage - 1) * itemsPerPage,
            onPageChange: (offset) =>
              setCurrentPage(Math.floor(offset / itemsPerPage) + 1),
            onItemsPerPageChange: setItemsPerPage,
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف طلب الخدمة للعميل "${selectedRequest?.clientName}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        confirmColor="red"
        isLoading={deleteMutation.isPending}
      />

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل طلب الخدمة
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="ml-2" />
                    معلومات العميل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.clientName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiMail className="ml-1 w-4 h-4" />
                        {selectedRequest.clientEmail}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهاتف
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiPhone className="ml-1 w-4 h-4" />
                        {selectedRequest.clientPhone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        العنوان
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiMapPin className="ml-1 w-4 h-4" />
                        {selectedRequest.clientAddress || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiFileText className="ml-2" />
                    معلومات الخدمة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الخدمة
                      </label>
                      <p className="text-gray-900">
                        {getServiceName(selectedRequest.serviceId)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الأولوية
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.urgency === "urgent" && "عاجل"}
                        {selectedRequest.urgency === "high" && "عالية"}
                        {selectedRequest.urgency === "normal" && "عادية"}
                        {selectedRequest.urgency === "low" && "منخفضة"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التاريخ المفضل
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiCalendar className="ml-1 w-4 h-4" />
                        {selectedRequest.preferredDate
                          ? (() => {
                              try {
                                return new Date(
                                  selectedRequest.preferredDate
                                ).toLocaleDateString("en-US");
                              } catch (error) {
                                return "غير محدد";
                              }
                            })()
                          : "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.status === "pending" && "في الانتظار"}
                        {selectedRequest.status === "pending_payment" &&
                          "في انتظار الدفع"}
                        {selectedRequest.status === "approved" && "مقبول"}
                        {selectedRequest.status === "rejected" && "مرفوض"}
                        {selectedRequest.status === "in_progress" &&
                          "قيد التنفيذ"}
                        {selectedRequest.status === "completed" && "مكتمل"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedRequest.paymentRequired && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiDollarSign className="ml-2" />
                      معلومات الدفع
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          المبلغ المطلوب
                        </label>
                        <p className="text-gray-900 font-semibold">
                          {selectedRequest.paymentAmount?.toLocaleString() ||
                            "غير محدد"}{" "}
                          {selectedRequest.paymentCurrency || "DA"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الاستحقاق
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.paymentDueDate
                            ? (() => {
                                try {
                                  return new Date(
                                    selectedRequest.paymentDueDate
                                  ).toLocaleDateString("en-US");
                                } catch (error) {
                                  return "غير محدد";
                                }
                              })()
                            : "غير محدد"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferred Consultant */}
                {/* Selected Plan - Only for legal-consultation */}
                {selectedRequest.selectedPlan && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      الباقة المختارة
                    </h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center ml-3">
                          <FiFileText className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-purple-900">
                            {selectedRequest.selectedPlan === 'free-special-needs' && 'باقة ذوي الاحتياجات الخاصة'}
                            {selectedRequest.selectedPlan === 'mini-15min' && 'باقة Mini (15 دقيقة)'}
                            {selectedRequest.selectedPlan === 'standard-30min' && 'باقة Standard (30 دقيقة)'}
                            {selectedRequest.selectedPlan === 'premium-45min' && 'باقة Premium (45 دقيقة)'}
                          </p>
                          <p className="text-sm text-purple-700">
                            {selectedRequest.selectedPlan === 'free-special-needs' && 'مجاناً - 30 دقيقة'}
                            {selectedRequest.selectedPlan === 'mini-15min' && '1000 دج - استشارة سريعة'}
                            {selectedRequest.selectedPlan === 'standard-30min' && '2000 دج - استشارة كاملة'}
                            {selectedRequest.selectedPlan === 'premium-45min' && '3000 دج - استشارة معمقة + ملاحظات مكتوبة'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.preferredConsultant && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="ml-2" />
                      المستشار الذي يريده العميل
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">
                            {selectedRequest.preferredConsultant.nameAr || selectedRequest.preferredConsultant.nameEn}
                          </p>
                          <p className="text-sm text-blue-700">
                            {selectedRequest.preferredConsultant.titleAr || selectedRequest.preferredConsultant.titleEn}
                          </p>
                          {selectedRequest.preferredConsultant.specializationAr && (
                            <p className="text-sm text-blue-700">
                              {selectedRequest.preferredConsultant.specializationAr}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Consultant Assignment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="ml-2" />
                    تكليف المستشار
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المستشار المكلف
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.assignedConsultant?.fullName ||
                          "لم يتم التكليف"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.assignedConsultant?.email ||
                          "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الخدمة المطلوبة
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedRequest.serviceDescription}
                    </p>
                  </div>
                </div>

                {/* Additional Requirements */}
                {selectedRequest.additionalRequirements && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      متطلبات إضافية
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.additionalRequirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Request Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiCalendar className="ml-2" />
                    تفاصيل الطلب
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الطلب
                      </label>
                      <p className="text-gray-900">
                        {(() => {
                          try {
                            const dateValue = selectedRequest.createdAt || selectedRequest.created_at;
                            return new Date(dateValue).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          } catch (error) {
                            return "غير محدد";
                          }
                        })()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        آخر تحديث
                      </label>
                      <p className="text-gray-900">
                        {(() => {
                          try {
                            const dateValue = selectedRequest.updatedAt || selectedRequest.updated_at;
                            return new Date(dateValue).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          } catch (error) {
                            return "غير محدد";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-8">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تعديل طلب الخدمة
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRequest(null);
                    setEditFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وصف الخدمة
                  </label>
                  <textarea
                    value={editFormData.serviceDescription || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        serviceDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الأولوية
                    </label>
                    <select
                      value={editFormData.urgency || "normal"}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          urgency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">منخفضة</option>
                      <option value="normal">عادية</option>
                      <option value="high">عالية</option>
                      <option value="urgent">عاجل</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التاريخ المفضل
                    </label>
                    <input
                      type="date"
                      value={editFormData.preferredDate || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          preferredDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    متطلبات إضافية
                  </label>
                  <textarea
                    value={editFormData.additionalRequirements || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        additionalRequirements: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظات
                  </label>
                  <textarea
                    value={editFormData.notes || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRequest(null);
                    setEditFormData({});
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    // Update request logic here
                    setShowEditModal(false);
                    setSelectedRequest(null);
                    setEditFormData({});
                    toast.success("تم تحديث الطلب بنجاح");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Consultant Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تكليف مستشار
                </h2>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedRequest(null);
                    setSelectedConsultant("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اختر المستشار
                  </label>
                  <select
                    value={selectedConsultant}
                    onChange={(e) => setSelectedConsultant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر مستشار</option>
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name} - {consultant.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedRequest(null);
                    setSelectedConsultant("");
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    if (selectedConsultant) {
                      assignMutation.mutate({
                        id: selectedRequest.id,
                        consultantId: selectedConsultant,
                      });
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={!selectedConsultant || assignMutation.isPending}
                >
                  {assignMutation.isPending
                    ? "جاري التكليف..."
                    : "تكليف المستشار"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">إضافة رد</h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedRequest(null);
                    setReplyMessage("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="اكتب ردك هنا..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedRequest(null);
                    setReplyMessage("");
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    if (replyMessage.trim()) {
                      replyMutation.mutate({
                        serviceRequestId: selectedRequest.id,
                        message: replyMessage,
                        replyType: "admin",
                      });
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  disabled={!replyMessage.trim() || replyMutation.isPending}
                >
                  {replyMutation.isPending ? "جاري الإرسال..." : "إرسال الرد"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedRequest.paymentRequired
                    ? "تعديل معلومات الدفع"
                    : "إضافة متطلبات الدفع"}
                </h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedRequest(null);
                    setEditFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="paymentRequired"
                    checked={editFormData.paymentRequired || false}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        paymentRequired: e.target.checked,
                      })
                    }
                    className="ml-2"
                  />
                  <label
                    htmlFor="paymentRequired"
                    className="text-sm font-medium text-gray-700"
                  >
                    {selectedRequest.paymentRequired
                      ? "يتطلب دفع (يمكن إلغاء هذا الخيار)"
                      : "يتطلب دفع (إضافة متطلبات الدفع)"}
                  </label>
                </div>

                {!selectedRequest.paymentRequired &&
                  !editFormData.paymentRequired && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        💡 هذا الطلب لا يتطلب دفع حالياً. يمكنك إضافة متطلبات
                        الدفع عن طريق تفعيل الخيار أعلاه.
                      </p>
                    </div>
                  )}

                {editFormData.paymentRequired && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المبلغ
                      </label>
                      <input
                        type="number"
                        value={editFormData.paymentAmount || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            paymentAmount: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          العملة
                        </label>
                        <select
                          value={editFormData.paymentCurrency || "DA"}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              paymentCurrency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DA">دينار جزائري</option>
                          <option value="USD">دولار أمريكي</option>
                          <option value="EUR">يورو</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الاستحقاق
                        </label>
                        <input
                          type="date"
                          value={editFormData.paymentDueDate || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              paymentDueDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedRequest(null);
                    setEditFormData({});
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    paymentMutation.mutate({
                      id: selectedRequest.id,
                      paymentData: editFormData,
                    });
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  disabled={paymentMutation.isPending}
                >
                  {paymentMutation.isPending
                    ? "جاري الحفظ..."
                    : selectedRequest.paymentRequired
                    ? "حفظ التغييرات"
                    : "إضافة متطلبات الدفع"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceRequestsManagement;
