import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiX,
  FiLoader,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiFileText,
  FiCalendar,
  FiMail,
  FiPhone,
  FiAlertCircle,
} from "react-icons/fi";
import paymentService from "../../services/paymentService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState("all");
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
  const searchInputRef = useRef(null);

  const queryClient = useQueryClient();

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedMethodFilter]);

  // Fetch payments
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    error: paymentsError,
  } = useQuery({
    queryKey: ["payments", selectedFilter, selectedMethodFilter, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return paymentService.getAllPayments({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        paymentMethod: selectedMethodFilter === "all" ? undefined : selectedMethodFilter,
        page: currentPage,
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch payment statistics
  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ["paymentStats"],
    queryFn: paymentService.getPaymentStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching payment stats:", error);
    },
  });

  // Delete payment mutation
  const deleteMutation = useMutation({
    mutationFn: paymentService.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      setShowDeleteModal(false);
      setSelectedPayment(null);
      toast.success("تم حذف الدفع بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الدفع");
    },
  });

  // Update payment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }) =>
      paymentService.updatePaymentStatus(id, {
        status: statusData.paymentStatus,
        paymentReference: statusData.paymentReference,
        transactionId: statusData.transactionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentStats"] });
      setShowStatusModal(false);
      setSelectedPayment(null);
      setStatusFormData({
        paymentStatus: "pending",
        paymentReference: "",
        transactionId: "",
      });
      toast.success("تم تحديث حالة الدفع بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة الدفع");
    },
  });

  // Extract payments from API response
  const allPayments = paymentsData?.data?.payments || [];
  const totalPayments = paymentsData?.data?.total || 0;

  // Filter payments based on search term (client-side filtering)
  const payments = React.useMemo(() => {
    if (!searchTerm.trim()) return allPayments;

    const searchLower = searchTerm.toLowerCase().trim();

    return allPayments.filter((payment) => {
      return (
        (payment.paymentId && payment.paymentId.toLowerCase().includes(searchLower)) ||
        (payment.clientName && payment.clientName.toLowerCase().includes(searchLower)) ||
        (payment.clientEmail && payment.clientEmail.toLowerCase().includes(searchLower)) ||
        (payment.clientPhone && payment.clientPhone.toLowerCase().includes(searchLower)) ||
        (payment.paymentReference && payment.paymentReference.toLowerCase().includes(searchLower)) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower))
      );
    });
  }, [allPayments, searchTerm]);

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "completed":
        return "مكتمل";
      case "failed":
        return "فشل";
      case "cancelled":
        return "ملغي";
      case "refunded":
        return "مسترد";
      default:
        return status;
    }
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "ccp":
        return "CCP";
      case "baridimob":
        return "Baridimob";
      case "bank_transfer":
        return "تحويل بنكي";
      case "cash":
        return "نقدي";
      default:
        return method;
    }
  };

  // Table columns
  const columns = [
    {
      key: "paymentId",
      label: "رقم الطلبية",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-blue-600">
          {value}
        </span>
      ),
    },
    {
      key: "clientName",
      label: "اسم العميل",
      sortable: true,
    },
    {
      key: "amount",
      label: "المبلغ",
      sortable: true,
      render: (value, payment) => (
        <span className="font-semibold text-gray-900">
          {parseFloat(value).toLocaleString()} {payment.currency}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "طريقة الدفع",
      sortable: true,
      render: (value) => getPaymentMethodText(value),
    },
    {
      key: "paymentStatus",
      label: "الحالة",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
            value
          )}`}
        >
          {getStatusText(value)}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "تاريخ الإنشاء",
      sortable: true,
      render: (value) => {
        if (!value) return "غير محدد";
        return new Date(value).toLocaleDateString("en-US");
      },
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, payment) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleView(payment)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="عرض التفاصيل"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStatusChange(payment)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="تغيير الحالة"
          >
            <FiCheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(payment)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
    if (selectedPayment) {
      deleteMutation.mutate(selectedPayment.id);
    }
  };

  const handleStatusUpdate = () => {
    if (selectedPayment) {
      updateStatusMutation.mutate({
        id: selectedPayment.id,
        statusData: statusFormData,
      });
    }
  };

  // Log stats for debugging
  console.log("Stats Data:", statsData);
  console.log("Stats Error:", statsError);
  console.log("Is Loading Stats:", isLoadingStats);

  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    totalAmount: 0,
  };

  if (isLoadingPayments && !paymentsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (paymentsError) {
    return (
      <div className="text-center py-8">
        <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
        <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-sm text-gray-500 mt-2">
          {paymentsError.message || "خطأ في الاتصال بالخادم"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدفوعات</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة جميع المدفوعات</p>
        </div>
        {!isLoadingStats && statsData && (
          <div className="mt-4 sm:mt-0">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FiCheckCircle className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">المدفوعات المكتملة</p>
                  <p className="text-2xl font-bold">{stats.completed || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            خطأ في تحميل الإحصائيات: {statsError.message}
          </p>
        </div>
      )}
      {!isLoadingStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">إجمالي المدفوعات</p>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">مكتمل</p>
                <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiXCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">فشل</p>
                <p className="text-xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm text-gray-600">إجمالي المبلغ</p>
                <p className="text-lg font-bold text-gray-900">
                  {parseFloat(stats.totalAmount || 0).toLocaleString()} دج
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="البحث في المدفوعات... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <FiX className="w-4 h-4" />
              </button>
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
              <option value="processing">قيد المعالجة</option>
              <option value="completed">مكتمل</option>
              <option value="failed">فشل</option>
              <option value="cancelled">ملغي</option>
              <option value="refunded">مسترد</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <FiCreditCard className="text-gray-400" />
            <select
              value={selectedMethodFilter}
              onChange={(e) => setSelectedMethodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الطرق</option>
              <option value="ccp">CCP</option>
              <option value="baridimob">Baridimob</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="cash">نقدي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <DataTable
          data={payments}
          columns={columns}
          pagination={{
            total: totalPayments,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            onPageChange: (offset) => {
              const newPage = Math.floor(offset / itemsPerPage) + 1;
              setCurrentPage(newPage);
            }
          }}
          searchTerm={searchTerm}
          isLoading={isLoadingPayments}
        />
      </div>

      {/* Delete Confirmation Modal */}
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

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل الدفع
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPayment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiDollarSign className="ml-2" />
                    معلومات الدفع
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الطلبية
                      </label>
                      <p className="text-gray-900 font-mono">{selectedPayment.paymentId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المبلغ
                      </label>
                      <p className="text-gray-900 font-bold">
                        {parseFloat(selectedPayment.amount).toLocaleString()} {selectedPayment.currency}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        طريقة الدفع
                      </label>
                      <p className="text-gray-900">{getPaymentMethodText(selectedPayment.paymentMethod)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة
                      </label>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          selectedPayment.paymentStatus
                        )}`}
                      >
                        {getStatusText(selectedPayment.paymentStatus)}
                      </span>
                    </div>
                    {selectedPayment.paymentReference && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          مرجع الدفع
                        </label>
                        <p className="text-gray-900">{selectedPayment.paymentReference}</p>
                      </div>
                    )}
                    {selectedPayment.transactionId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رقم المعاملة
                        </label>
                        <p className="text-gray-900">{selectedPayment.transactionId}</p>
                      </div>
                    )}
                    {selectedPayment.dueDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الاستحقاق
                        </label>
                        <p className="text-gray-900">
                          {new Date(selectedPayment.dueDate).toLocaleDateString("en-US")}
                        </p>
                      </div>
                    )}
                    {selectedPayment.paidAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الدفع
                        </label>
                        <p className="text-gray-900">
                          {new Date(selectedPayment.paidAt).toLocaleDateString("en-US")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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
                      <p className="text-gray-900">{selectedPayment.clientName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiMail className="ml-1 w-4 h-4" />
                        {selectedPayment.clientEmail}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهاتف
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <FiPhone className="ml-1 w-4 h-4" />
                        {selectedPayment.clientPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Request Info */}
                {selectedPayment.serviceRequest && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      طلب الخدمة
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        #{selectedPayment.serviceRequest.id} -{" "}
                        {selectedPayment.serviceRequest.serviceDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedPayment.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      ملاحظات
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedPayment.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-8">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تغيير حالة الدفع
                </h2>
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
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={statusFormData.paymentStatus}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        paymentStatus: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مرجع الدفع (اختياري)
                  </label>
                  <input
                    type="text"
                    value={statusFormData.paymentReference}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        paymentReference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مرجع الدفع من الوصل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم المعاملة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={statusFormData.transactionId}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رقم المعاملة"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-6">
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
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
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

