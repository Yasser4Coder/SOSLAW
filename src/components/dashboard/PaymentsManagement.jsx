import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiX,
  FiLoader,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiFileText,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import paymentService from "../../services/paymentService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    paymentStatus: "pending",
    paymentReference: "",
    transactionId: "",
  });
  const [openActionsId, setOpenActionsId] = useState(null);
  const searchInputRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500);
    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedMethodFilter, debouncedSearchTerm]);

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

  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: [
      "payments",
      selectedFilter,
      selectedMethodFilter,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () => {
      return paymentService.getAllPayments({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        paymentMethod: selectedMethodFilter === "all" ? undefined : selectedMethodFilter,
        page: currentPage,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !isSearching,
  });

  const { data: statsData } = useQuery({
    queryKey: ["paymentStats"],
    queryFn: paymentService.getPaymentStats,
    staleTime: 5 * 60 * 1000,
    enabled: !debouncedSearchTerm || debouncedSearchTerm.trim().length === 0,
  });

  const allPayments = paymentsData?.data?.payments || [];
  const totalPayments = paymentsData?.data?.total || 0;

  const payments = React.useMemo(() => {
    if (!debouncedSearchTerm.trim()) return allPayments;
    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return allPayments.filter((payment) => {
      return (
        (payment.paymentId && payment.paymentId.toLowerCase().includes(searchLower)) ||
        (payment.client?.fullName && payment.client.fullName.toLowerCase().includes(searchLower)) ||
        (payment.clientName && payment.clientName.toLowerCase().includes(searchLower)) ||
        (payment.clientEmail && payment.clientEmail.toLowerCase().includes(searchLower)) ||
        (payment.clientPhone && payment.clientPhone?.toString().toLowerCase().includes(searchLower)) ||
        (payment.paymentReference && payment.paymentReference.toLowerCase().includes(searchLower)) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower))
      );
    });
  }, [allPayments, debouncedSearchTerm]);

  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    refunded: 0,
    totalAmount: 0,
  };

  const getStatusBadgeColor = (status) => {
    const map = {
      pending: "text-amber-700 bg-amber-50 border-amber-200",
      processing: "text-blue-700 bg-blue-50 border-blue-200",
      completed: "text-green-700 bg-green-50 border-green-200",
      failed: "text-red-700 bg-red-50 border-red-200",
      cancelled: "text-slate-700 bg-slate-50 border-slate-200",
      refunded: "text-purple-700 bg-purple-50 border-purple-200",
    };
    return map[status] || "text-slate-700 bg-slate-50 border-slate-200";
  };

  const getStatusText = (status) => {
    const map = {
      pending: "في الانتظار",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      failed: "فشل",
      cancelled: "ملغي",
      refunded: "مسترد",
    };
    return map[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const map = {
      chargily: "Chargily Pay",
      ccp: "CCP",
      baridimob: "Baridimob",
      bank_transfer: "تحويل بنكي",
      cash: "نقدي",
    };
    return map[method] || method || "—";
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleImmediateSearch = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  const deleteMutation = useMutation({
    mutationFn: paymentService.deletePayment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["payments"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      setShowDeleteModal(false);
      setSelectedPayment(null);
      await new Promise((r) => setTimeout(r, 300));
      await refetchPayments();
      toast.success("تم حذف الدفع بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الدفع");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }) =>
      paymentService.updatePaymentStatus(id, {
        status: statusData.paymentStatus,
        paymentReference: statusData.paymentReference,
        transactionId: statusData.transactionId,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["payments"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      setShowStatusModal(false);
      setSelectedPayment(null);
      setStatusFormData({
        paymentStatus: "pending",
        paymentReference: "",
        transactionId: "",
      });
      await refetchPayments();
      toast.success("تم تحديث حالة الدفع بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة الدفع");
    },
  });

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleStatusChange = (payment) => {
    setSelectedPayment(payment);
    setStatusFormData({
      paymentStatus: payment.paymentStatus,
      paymentReference: payment.paymentReference || "",
      transactionId: payment.transactionId || "",
    });
    setShowStatusModal(true);
  };

  const handleDelete = (payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedPayment) deleteMutation.mutate(selectedPayment.id);
  };

  const handleStatusUpdate = () => {
    if (selectedPayment) {
      updateStatusMutation.mutate({
        id: selectedPayment.id,
        statusData: statusFormData,
      });
    }
  };

  const statusTabs = [
    { value: "all", label: "الكل", count: stats.total, icon: FiDollarSign },
    { value: "pending", label: "في الانتظار", count: stats.pending ?? 0, icon: FiClock },
    { value: "processing", label: "قيد المعالجة", count: stats.processing ?? 0, icon: FiLoader },
    { value: "completed", label: "مكتمل", count: stats.completed ?? 0, icon: FiCheckCircle },
    { value: "failed", label: "فشل", count: stats.failed ?? 0, icon: FiXCircle },
    { value: "cancelled", label: "ملغي", count: stats.cancelled ?? 0, icon: FiXCircle },
    { value: "refunded", label: "مسترد", count: stats.refunded ?? 0, icon: FiDollarSign },
  ];

  const renderClient = (payment) => (
    <div className="min-w-0">
      <div className="font-medium text-slate-800 truncate">
        {payment.client?.fullName ?? payment.clientName ?? "—"}
      </div>
      <div className="text-xs text-slate-500 truncate">{payment.clientEmail}</div>
      {payment.clientPhone && (
        <div className="text-xs text-slate-500 truncate">{payment.clientPhone}</div>
      )}
    </div>
  );

  const columns = [
    {
      key: "paymentId",
      label: "رقم الطلبية",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-[#09142b]">{value}</span>
      ),
    },
    {
      key: "clientName",
      label: "العميل",
      sortable: true,
      render: (_, payment) => renderClient(payment),
    },
    {
      key: "amount",
      label: "المبلغ",
      sortable: true,
      render: (value, payment) => (
        <span className="font-semibold text-slate-800">
          {parseFloat(value).toLocaleString("ar-DZ")} {payment.currency}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "طريقة الدفع",
      sortable: true,
      render: (value) => (
        <span className="text-slate-800">{getPaymentMethodText(value)}</span>
      ),
    },
    {
      key: "paymentStatus",
      label: "الحالة",
      sortable: true,
      headerClassName: "min-w-[10rem] w-[10rem]",
      cellClassName: "min-w-[10rem] w-[10rem]",
      render: (value) => {
        const status = value;
        const colorClass = getStatusBadgeColor(status);
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${colorClass}`}
          >
            {getStatusText(status)}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "تاريخ الإنشاء",
      sortable: true,
      render: (value) => {
        if (!value) return "غير محدد";
        try {
          return new Date(value).toLocaleDateString("ar-DZ", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
        } catch (e) {
          return "غير محدد";
        }
      },
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: (_, payment) => {
        const isOpen = openActionsId === payment.id;
        return (
          <div className="relative flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionsId(isOpen ? null : payment.id);
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
                    onClick={() => {
                      handleView(payment);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEye className="w-4 h-4" /> عرض
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(payment);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiCheckCircle className="w-4 h-4" /> تغيير الحالة
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleDelete(payment);
                      setOpenActionsId(null);
                    }}
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

  if (isLoadingPayments) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-11 w-28 bg-slate-100 rounded-xl" />
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

  if (paymentsError) {
    if (paymentsError.response?.status === 401) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#09142b] mb-1">مطلوب تسجيل الدخول</h3>
          <p className="text-slate-600 text-sm mb-6">يجب تسجيل الدخول لعرض المدفوعات</p>
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
      <div
        className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center"
        dir="rtl"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#09142b] mb-1">حدث خطأ أثناء تحميل البيانات</h3>
        <p className="text-slate-600 text-sm">
          {paymentsError.message || "خطأ في الاتصال بالخادم"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] tracking-tight">
            إدارة المدفوعات
          </h1>
          <p className="text-slate-600 mt-1">عرض وإدارة جميع المدفوعات</p>
        </div>
        {stats.totalAmount != null && stats.totalAmount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <FiDollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">
              إجمالي المبلغ: {parseFloat(stats.totalAmount).toLocaleString("ar-DZ")} دج
            </span>
          </div>
        )}
      </div>

      {/* Status tabs */}
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="بحث برقم الطلبية، الاسم، البريد، الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImmediateSearch();
              }
              if (e.key === "Escape") handleSearchClear();
            }}
            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border bg-white transition-colors placeholder:text-slate-400 ${
              isSearching
                ? "border-[#c8a45e] bg-amber-50/30"
                : "border-slate-200 focus:border-[#09142b] focus:ring-2 focus:ring-[#09142b]/10"
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
          {debouncedSearchTerm && payments.length > 0 && (
            <p className="absolute -bottom-5 right-0 text-xs text-slate-500">
              {payments.length} نتيجة
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMethodFilter}
            onChange={(e) => {
              setSelectedMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:border-[#09142b]"
          >
            <option value="all">جميع الطرق</option>
            <option value="chargily">Chargily Pay</option>
            <option value="ccp">CCP</option>
            <option value="baridimob">Baridimob</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="cash">نقدي</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:border-[#09142b]"
          >
            <option value={5}>5 لكل صفحة</option>
            <option value={10}>10 لكل صفحة</option>
            <option value={25}>25 لكل صفحة</option>
            <option value={50}>50 لكل صفحة</option>
          </select>
        </div>
      </div>

      {/* Table / Card container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FiDollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#09142b] mb-1">لا توجد مدفوعات</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {debouncedSearchTerm || selectedFilter !== "all" || selectedMethodFilter !== "all"
                ? "لا توجد نتائج تطابق البحث أو الفلاتر. جرّب تغيير المعايير."
                : "لم يتم تسجيل أي مدفوعات حتى الآن."}
            </p>
          </div>
        ) : (
          <>
            <div className="lg:hidden p-4 space-y-4">
              {payments.map((payment) => {
                const isOpen = openActionsId === payment.id;
                const statusClass = getStatusBadgeColor(payment.paymentStatus);
                return (
                  <div
                    key={payment.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="font-mono text-sm font-medium text-[#09142b]">
                        {payment.paymentId}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${statusClass}`}
                        >
                          {getStatusText(payment.paymentStatus)}
                        </span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionsId(isOpen ? null : payment.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                          >
                            <FiChevronDown className={`w-4 h-4 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenActionsId(null)}
                                aria-hidden="true"
                              />
                              <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleView(payment);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEye className="w-4 h-4" /> عرض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleStatusChange(payment);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiCheckCircle className="w-4 h-4" /> تغيير الحالة
                                </button>
                                <hr className="my-1 border-slate-100" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDelete(payment);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <FiTrash2 className="w-4 h-4" /> حذف
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-medium text-slate-800">
                        {payment.client?.fullName ?? payment.clientName ?? "—"}
                      </p>
                      <p className="text-slate-500 text-xs">{payment.clientEmail}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">المبلغ</span>
                      <span className="text-slate-800 font-semibold">
                        {parseFloat(payment.amount).toLocaleString("ar-DZ")} {payment.currency}
                      </span>
                      <span className="text-slate-500">طريقة الدفع</span>
                      <span className="text-slate-800">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </span>
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-slate-800">
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString("ar-DZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleView(payment)}
                      className="mt-3 w-full py-2 rounded-xl bg-[#09142b] text-white text-sm font-medium hover:bg-[#0b1a36] transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                );
              })}
              {totalPayments > itemsPerPage && !debouncedSearchTerm && (
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
                    {currentPage} / {Math.ceil(totalPayments / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(totalPayments / itemsPerPage)}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(totalPayments / itemsPerPage), p + 1)
                      )
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </div>

            <div className="hidden lg:block overflow-x-visible">
              <DataTable
                data={payments}
                columns={columns}
                searchTerm={searchTerm}
                noHorizontalScroll
                pagination={{
                  current: currentPage,
                  limit: itemsPerPage,
                  total: debouncedSearchTerm ? payments.length : totalPayments,
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPayment(null);
        }}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الدفع "${selectedPayment?.paymentId}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        confirmColor="red"
        isLoading={deleteMutation.isPending}
      />

      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">تفاصيل الدفع</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPayment(null);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiDollarSign className="ml-2" />
                    معلومات الدفع
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الطلبية</label>
                      <p className="text-gray-900 font-mono">{selectedPayment.paymentId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                      <p className="text-gray-900 font-bold">
                        {parseFloat(selectedPayment.amount).toLocaleString("ar-DZ")}{" "}
                        {selectedPayment.currency}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                      <p className="text-gray-900">
                        {getPaymentMethodText(selectedPayment.paymentMethod)}
                      </p>
                    </div>
                    {(selectedPayment.chargilyCheckoutId ||
                      selectedPayment.chargily_checkout_id) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          معرف Chargily
                        </label>
                        <p className="text-gray-900 font-mono text-sm break-all">
                          {selectedPayment.chargilyCheckoutId ||
                            selectedPayment.chargily_checkout_id}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                      <span
                        className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${getStatusBadgeColor(
                          selectedPayment.paymentStatus
                        )}`}
                      >
                        {getStatusText(selectedPayment.paymentStatus)}
                      </span>
                    </div>
                    {selectedPayment.paymentReference && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مرجع الدفع</label>
                        <p className="text-gray-900">{selectedPayment.paymentReference}</p>
                      </div>
                    )}
                    {selectedPayment.transactionId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم المعاملة</label>
                        <p className="text-gray-900">{selectedPayment.transactionId}</p>
                      </div>
                    )}
                    {selectedPayment.dueDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الاستحقاق</label>
                        <p className="text-gray-900">
                          {new Date(selectedPayment.dueDate).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>
                    )}
                    {selectedPayment.paidAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الدفع</label>
                        <p className="text-gray-900">
                          {new Date(selectedPayment.paidAt).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="ml-2" />
                    معلومات العميل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                      <p className="text-gray-900">
                        {selectedPayment.client?.fullName ??
                          selectedPayment.clientName ??
                          "—"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <p className="text-gray-900 flex items-center">
                        <FiMail className="ml-1 w-4 h-4" />
                        {selectedPayment.clientEmail}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                      <p className="text-gray-900 flex items-center">
                        <FiPhone className="ml-1 w-4 h-4" />
                        {selectedPayment.clientPhone ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPayment.serviceRequest && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      طلب الخدمة
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-sm text-slate-700">
                        #{selectedPayment.serviceRequest.id} -{" "}
                        {selectedPayment.serviceRequest.serviceDescription}
                      </p>
                    </div>
                  </div>
                )}

                {selectedPayment.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      ملاحظات
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedPayment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => handleStatusChange(selectedPayment)}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors flex items-center gap-2"
                >
                  <FiCheckCircle size={16} />
                  تغيير الحالة
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPayment(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">تغيير حالة الدفع</h2>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedPayment(null);
                    setStatusFormData({
                      paymentStatus: "pending",
                      paymentReference: "",
                      transactionId: "",
                    });
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الحالة</label>
                  <select
                    value={statusFormData.paymentStatus}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        paymentStatus: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="completed">مكتمل</option>
                    <option value="failed">فشل</option>
                    <option value="cancelled">ملغي</option>
                    <option value="refunded">مسترد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">مرجع الدفع (اختياري)</label>
                  <input
                    type="text"
                    value={statusFormData.paymentReference}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        paymentReference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                    placeholder="مرجع الدفع من الوصل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">رقم المعاملة (اختياري)</label>
                  <input
                    type="text"
                    value={statusFormData.transactionId}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                    placeholder="رقم المعاملة"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedPayment(null);
                    setStatusFormData({
                      paymentStatus: "pending",
                      paymentReference: "",
                      transactionId: "",
                    });
                  }}
                  className="px-4 py-2.5 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
