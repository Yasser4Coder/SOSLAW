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
  FiChevronDown,
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
  }, [selectedFilter, debouncedSearchTerm]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [replyMessage, setReplyMessage] = useState("");
  const [openActionsId, setOpenActionsId] = useState(null);
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
      currentPage,
      itemsPerPage,
      debouncedSearchTerm.trim() || null,
    ],
    queryFn: async () => {
      const result = await serviceRequestService.getAllServiceRequests({
        page: currentPage,
        limit: itemsPerPage,
        status: selectedFilter === "all" ? undefined : selectedFilter,
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
    queryKey: ["service-request-statistics"],
    queryFn: async () => {
      try {
        const result = await serviceRequestService.getServiceRequestStatistics({});
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

  // Compact client display (one column instead of three)
  const renderClient = (request) => (
    <div className="min-w-0">
      <div className="font-medium text-slate-800 truncate">{request.clientName}</div>
      <div className="text-xs text-slate-500 truncate">{request.clientEmail}</div>
      {request.clientPhone && (
        <div className="text-xs text-slate-500 truncate">{request.clientPhone}</div>
      )}
    </div>
  );

  // Table columns (slimmer: client merged into one column to avoid horizontal scroll)
  const columns = [
    {
      key: "id",
      label: "الرقم",
      sortable: true,
      render: (value) => `#${value}`,
    },
    {
      key: "clientName",
      label: "العميل",
      sortable: true,
      render: (_, request) => renderClient(request),
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
      headerClassName: "min-w-[11rem] w-[11rem]",
      cellClassName: "min-w-[11rem] w-[11rem]",
      render: (value, request) => {
        const statusConfig = {
          pending: { text: "في الانتظار", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
          pending_payment: { text: "في انتظار الدفع", color: "text-orange-700 bg-orange-50 border-orange-200" },
          approved: { text: "مقبول", color: "text-green-700 bg-green-50 border-green-200" },
          rejected: { text: "مرفوض", color: "text-red-700 bg-red-50 border-red-200" },
          in_progress: { text: "قيد التنفيذ", color: "text-blue-700 bg-blue-50 border-blue-200" },
          completed: { text: "مكتمل", color: "text-green-700 bg-green-50 border-green-200" },
        };
        const actualStatus = value || request.status;
        const config = statusConfig[actualStatus] || statusConfig.pending;

        return (
          <select
            value={actualStatus}
            onChange={(e) => handleStatusChange(request.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            title={config.text}
            className={`w-full min-w-0 text-xs font-medium rounded-lg border px-3 py-1.5 pe-8 cursor-pointer focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none ${config.color}`}
          >
            <option value="pending">في الانتظار</option>
            <option value="pending_payment">في انتظار الدفع</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
          </select>
        );
      },
    },
    // Spacer column (RTL: clear gap between الحالة and المستشار)
    {
      key: "_spacer1",
      label: "",
      sortable: false,
      headerClassName: "w-8 min-w-[2rem] bg-slate-50/80",
      cellClassName: "w-8 min-w-[2rem] bg-slate-50/80",
      render: () => null,
    },
    {
      key: "preferredConsultant",
      label: "المستشار الذي يريده العميل",
      sortable: true,
      headerClassName: "min-w-[180px] w-[180px]",
      cellClassName: "min-w-[180px] w-[180px]",
      render: (value, request) => {
        const pref = request.preferredConsultant;
        const name = pref?.nameAr || pref?.nameEn || pref?.fullName;
        if (!name && !request.preferredConsultantId) return <span className="text-slate-500">—</span>;
        if (name) return <span className="text-slate-800">{name}</span>;
        const consultant = consultants.find((c) => c.id === request.preferredConsultantId);
        return <span className="text-slate-800">{consultant?.name || "—"}</span>;
      },
    },
    {
      key: "paymentStatus",
      label: "الدفع",
      sortable: true,
      render: (value, request) => {
        if (!request.paymentRequired && !request.paymentAmount) {
          return <span className="text-slate-500">—</span>;
        }
        const amount = request.paymentAmount != null ? Number(request.paymentAmount) : 0;
        const currency = request.paymentCurrency || "د.ج";
        const amountStr = amount > 0 ? `${amount.toLocaleString("ar-DZ")} ${currency}` : "—";

        const statusColors = {
          pending: "text-amber-600 bg-amber-50",
          processing: "text-blue-600 bg-blue-50",
          completed: "text-green-600 bg-green-50",
          failed: "text-red-600 bg-red-50",
          cancelled: "text-slate-500 bg-slate-100",
          refunded: "text-purple-600 bg-purple-50",
        };
        const statusText = {
          pending: "في الانتظار",
          processing: "قيد المعالجة",
          completed: "مُدفوع",
          failed: "فشل",
          cancelled: "ملغي",
          refunded: "مسترد",
        };
        const payStatus = value || request.paymentStatus;
        const colorClass = statusColors[payStatus] || "text-slate-600 bg-slate-100";
        const text = statusText[payStatus] || payStatus || "—";

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-slate-800">{amountStr}</span>
            <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
              {text}
            </span>
          </div>
        );
      },
    },
    {
      key: "replies",
      label: "الردود",
      sortable: false,
      headerClassName: "min-w-[100px]",
      cellClassName: "min-w-[100px]",
      render: (_, request) => {
        const replies = request.replies || [];
        const count = replies.length;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${count > 0 ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
              <FiMessageCircle className="w-3.5 h-3.5" />
              {count > 0 ? `${count} ${count === 1 ? "رد" : "ردود"}` : "لا ردود"}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleView(request); }}
              className="text-xs text-[#09142b] font-medium hover:underline"
            >
              عرض
            </button>
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
      label: "",
      sortable: false,
      render: (_, request) => {
        const isOpen = openActionsId === request.id;
        return (
          <div className="relative flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionsId(isOpen ? null : request.id);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-[#09142b] hover:bg-slate-100 transition-colors"
              title="الإجراءات"
            >
              <FiChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenActionsId(null)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 top-full mt-1 z-20 min-w-[180px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                  <button
                    onClick={() => { handleView(request); setOpenActionsId(null); }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEye className="w-4 h-4" /> عرض
                  </button>
                  <button
                    onClick={() => { handleEdit(request); setOpenActionsId(null); }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" /> تعديل
                  </button>
                  <button
                    onClick={() => { handleReply(request); setOpenActionsId(null); }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiMessageCircle className="w-4 h-4" /> رد
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => { handleDelete(request); setOpenActionsId(null); }}
                    className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </>
            )}
          </div>
        );
      },
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

  const handleReply = (request) => {
    setSelectedRequest(request);
    setReplyMessage("");
    setShowReplyModal(true);
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
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="h-14 bg-white rounded-xl border border-slate-200" />
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-12 bg-slate-50 border-b border-slate-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (requestsError) {
    if (requestsError.response?.status === 401) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#09142b] mb-1">مطلوب تسجيل الدخول</h3>
          <p className="text-slate-600 text-sm mb-6">يجب تسجيل الدخول لعرض طلبات الخدمات</p>
          <a
            href="/auth"
            className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors"
          >
            تسجيل الدخول
          </a>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#09142b] mb-1">حدث خطأ أثناء تحميل البيانات</h3>
        <p className="text-slate-600 text-sm">{requestsError.message || "خطأ في الاتصال بالخادم"}</p>
      </div>
    );
  }

  const statusTabs = [
    { value: "all", label: "الكل", count: stats.total, icon: FiFileText },
    { value: "pending", label: "في الانتظار", count: stats.pending, icon: FiClock },
    { value: "pending_payment", label: "انتظار الدفع", count: stats.pending_payment, icon: FiDollarSign },
    { value: "approved", label: "مقبول", count: stats.approved, icon: FiCheckCircle },
    { value: "in_progress", label: "قيد التنفيذ", count: stats.in_progress, icon: FiLoader },
    { value: "completed", label: "مكتمل", count: stats.completed, icon: FiCheck },
    { value: "rejected", label: "مرفوض", count: stats.rejected, icon: FiXCircle },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] tracking-tight">
          طلبات الخدمات
        </h1>
        <p className="text-slate-600 mt-1">
          إدارة وعرض طلبات العملاء وتحديث حالتها
        </p>
      </div>

      {/* Status tabs – quick filters with counts */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const isActive = selectedFilter === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#09142b] text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`tabular-nums ${isActive ? "text-white/90" : "text-slate-400"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: search + filters + per page */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="بحث بالاسم، البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleImmediateSearch(); }
              if (e.key === "Escape") handleSearchClear();
            }}
            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border bg-white transition-colors placeholder:text-slate-400 ${
              isSearching ? "border-[#c8a45e] bg-amber-50/30" : "border-slate-200 focus:border-[#09142b] focus:ring-2 focus:ring-[#09142b]/10"
            }`}
            autoComplete="off"
          />
          {searchTerm && !isSearching && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          {debouncedSearchTerm && totalRequests > 0 && (
            <p className="absolute -bottom-5 right-0 text-xs text-slate-500">
              {totalRequests} نتيجة
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:border-[#09142b]"
          >
            <option value={5}>5 لكل صفحة</option>
            <option value={10}>10 لكل صفحة</option>
            <option value={25}>25 لكل صفحة</option>
            <option value={50}>50 لكل صفحة</option>
          </select>
        </div>
      </div>

      {/* Table / Card container – cards on small screens (no horizontal scroll), table on large */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FiFileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#09142b] mb-1">لا توجد طلبات</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {debouncedSearchTerm || selectedFilter !== "all"
                ? "لا توجد نتائج تطابق البحث أو الفلاتر. جرّب تغيير المعايير."
                : "لم يتم إرسال أي طلبات حتى الآن."}
            </p>
          </div>
        ) : (
          <>
            {/* Card list: visible on small/medium only – no horizontal scroll */}
            <div className="lg:hidden p-4 space-y-4">
              {requests.map((request) => {
                const cardStatusColors = {
                  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  pending_payment: "bg-orange-50 text-orange-700 border-orange-200",
                  approved: "bg-green-50 text-green-700 border-green-200",
                  rejected: "bg-red-50 text-red-700 border-red-200",
                  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
                  completed: "bg-green-50 text-green-700 border-green-200",
                };
                const cardStatusLabels = {
                  pending: "في الانتظار",
                  pending_payment: "في انتظار الدفع",
                  approved: "مقبول",
                  rejected: "مرفوض",
                  in_progress: "قيد التنفيذ",
                  completed: "مكتمل",
                };
                const pref = request.preferredConsultant;
                const prefName = pref?.nameAr || pref?.nameEn || consultants.find((c) => c.id === request.preferredConsultantId)?.name || "—";
                const payAmount = request.paymentAmount != null ? `${Number(request.paymentAmount).toLocaleString("ar-DZ")} ${request.paymentCurrency || "د.ج"}` : "—";
                const payStatusMap = { pending: "في الانتظار", processing: "قيد المعالجة", completed: "مُدفوع", failed: "فشل", cancelled: "ملغي", refunded: "مسترد" };
                const payStatus = payStatusMap[request.paymentStatus] || request.paymentStatus || "—";
                const isOpen = openActionsId === request.id;
                const cardStatusClass = cardStatusColors[request.status] || cardStatusColors.pending;
                return (
                  <div
                    key={request.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-slate-500 font-medium">#{request.id}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          title={cardStatusLabels[request.status] || ""}
                          className={`text-xs font-medium rounded-lg border px-3 py-1.5 pe-8 cursor-pointer focus:ring-2 focus:ring-[#09142b]/20 outline-none w-full min-w-[11rem] ${cardStatusClass}`}
                        >
                          <option value="pending">في الانتظار</option>
                          <option value="pending_payment">في انتظار الدفع</option>
                          <option value="approved">مقبول</option>
                          <option value="rejected">مرفوض</option>
                          <option value="in_progress">قيد التنفيذ</option>
                          <option value="completed">مكتمل</option>
                        </select>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setOpenActionsId(isOpen ? null : request.id); }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                          >
                            <FiChevronDown className={`w-4 h-4 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenActionsId(null)} aria-hidden="true" />
                              <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                                <button type="button" onClick={() => { handleView(request); setOpenActionsId(null); }} className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <FiEye className="w-4 h-4" /> عرض
                                </button>
                                <button type="button" onClick={() => { handleEdit(request); setOpenActionsId(null); }} className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <FiEdit className="w-4 h-4" /> تعديل
                                </button>
                                <button type="button" onClick={() => { handleReply(request); setOpenActionsId(null); }} className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <FiMessageCircle className="w-4 h-4" /> رد
                                </button>
                                <hr className="my-1 border-slate-100" />
                                <button type="button" onClick={() => { handleDelete(request); setOpenActionsId(null); }} className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                  <FiTrash2 className="w-4 h-4" /> حذف
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-medium text-slate-800">{request.clientName}</p>
                      <p className="text-slate-500 text-xs">{request.clientEmail}</p>
                      {request.clientPhone && <p className="text-slate-500 text-xs">{request.clientPhone}</p>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">الخدمة</span>
                      <span className="text-slate-800">{getServiceName(request.serviceId)}</span>
                      <span className="text-slate-500">المستشار المطلوب</span>
                      <span className="text-slate-800">{prefName}</span>
                      <span className="text-slate-500">الردود</span>
                      <span className="text-slate-800 flex items-center gap-1">
                        <FiMessageCircle className="w-3.5 h-3.5" />
                        {(request.replies?.length ?? 0) > 0 ? `${request.replies.length} ردود` : "لا ردود"}
                        <button type="button" onClick={() => handleView(request)} className="text-[#09142b] font-medium hover:underline">عرض</button>
                      </span>
                      <span className="text-slate-500">الدفع</span>
                      <span className="text-slate-800">{payAmount} {payStatus !== "—" && ` · ${payStatus}`}</span>
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-slate-800">
                        {request.createdAt || request.created_at
                          ? new Date(request.createdAt || request.created_at).toLocaleDateString("ar-DZ", { year: "numeric", month: "short", day: "numeric" })
                          : "—"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleView(request)}
                      className="mt-3 w-full py-2 rounded-xl bg-[#09142b] text-white text-sm font-medium hover:bg-[#0b1a36] transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                );
              })}
              {/* Simple pagination for card view */}
              {totalRequests > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    السابق
                  </button>
                  <span className="text-sm text-slate-600">
                    {currentPage} / {Math.ceil(totalRequests / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(totalRequests / itemsPerPage)}
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalRequests / itemsPerPage), p + 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </div>

            {/* Table: visible on large screens only */}
            <div className="hidden lg:block overflow-x-visible">
              <DataTable
                data={requests}
                columns={columns}
                searchTerm={searchTerm}
                noHorizontalScroll
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
          </>
        )}
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">
                  تفاصيل طلب الخدمة
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
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

                {/* الردود */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <FiMessageCircle className="ml-2" />
                      الردود
                      {(selectedRequest.replies?.length ?? 0) > 0 && (
                        <span className="mr-2 text-sm font-normal text-gray-500">
                          ({selectedRequest.replies.length})
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowViewModal(false);
                        setShowReplyModal(true);
                      }}
                      className="text-sm px-3 py-1.5 rounded-lg bg-[#09142b] text-white hover:bg-[#0b1a36] transition-colors"
                    >
                      إضافة رد
                    </button>
                  </h3>
                  {selectedRequest.replies && selectedRequest.replies.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedRequest.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {reply.user?.fullName ?? "—"}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              reply.replyType === "admin" ? "bg-amber-100 text-amber-800" :
                              reply.replyType === "consultant" ? "bg-blue-100 text-blue-800" :
                              "bg-slate-200 text-slate-700"
                            }`}>
                              {reply.replyType === "admin" ? "إدارة" : reply.replyType === "consultant" ? "مستشار" : "دعم"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {reply.created_at ? new Date(reply.created_at).toLocaleDateString("ar-DZ", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-2">لا توجد ردود بعد.</p>
                  )}
                </div>

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

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors"
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
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

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
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

    </div>
  );
};

export default ServiceRequestsManagement;
