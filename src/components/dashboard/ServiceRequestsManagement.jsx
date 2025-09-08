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
} from "react-icons/fi";
import serviceRequestService from "../../services/serviceRequestService";
import serviceService from "../../services/serviceService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const ServiceRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
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

  // Fetch service requests with React Query - only filter by status, not search
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery({
    queryKey: ["service-requests", selectedFilter],
    queryFn: async () => {
      try {
        const result = await serviceRequestService.getAllServiceRequests({
          status: selectedFilter === "all" ? undefined : selectedFilter,
          page: currentPage,
          limit: itemsPerPage,
        });
        console.log("Service requests API response:", result);
        return result;
      } catch (error) {
        console.error("Service requests API error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch services for reference
  const { data: servicesData, error: servicesError } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const result = await serviceService.getAllServices({
          status: "active",
        });
        console.log("Services API response:", result);
        return result;
      } catch (error) {
        console.error("Services API error:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract requests from API response
  const allRequests = requestsData?.data?.requests || [];
  const totalRequests = requestsData?.data?.total || 0;

  // Filter requests based on search term (client-side filtering)
  const requests = React.useMemo(() => {
    if (!searchTerm.trim()) return allRequests;

    const searchLower = searchTerm.toLowerCase().trim();

    return allRequests.filter((request) => {
      return (
        (request.clientName &&
          request.clientName.toLowerCase().includes(searchLower)) ||
        (request.clientEmail &&
          request.clientEmail.toLowerCase().includes(searchLower)) ||
        (request.clientPhone &&
          request.clientPhone.toLowerCase().includes(searchLower)) ||
        (request.serviceDescription &&
          request.serviceDescription.toLowerCase().includes(searchLower)) ||
        (request.additionalRequirements &&
          request.additionalRequirements.toLowerCase().includes(searchLower)) ||
        (request.clientAddress &&
          request.clientAddress.toLowerCase().includes(searchLower))
      );
    });
  }, [allRequests, searchTerm]);

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
        const config = statusConfig[value] || statusConfig.pending;
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
      key: "createdAt",
      label: "تاريخ الطلب",
      sortable: true,
      render: (value) => {
        if (!value) return "غير محدد";
        try {
          return new Date(value).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "short",
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
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleView(request)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="عرض التفاصيل"
          >
            <FiEye className="w-4 h-4" />
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
    onSuccess: () => {
      queryClient.invalidateQueries(["service-requests"]);
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      console.error("Error updating request status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => serviceRequestService.deleteServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["service-requests"]);
      setShowDeleteModal(false);
      setSelectedRequest(null);
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error) => {
      console.error("Error deleting request:", error);
      toast.error("حدث خطأ أثناء حذف الطلب");
    },
  });

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
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

  const getStatusStats = () => {
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter((r) => r.status === "pending").length,
      approved: allRequests.filter((r) => r.status === "approved").length,
      rejected: allRequests.filter((r) => r.status === "rejected").length,
      in_progress: allRequests.filter((r) => r.status === "in_progress").length,
      completed: allRequests.filter((r) => r.status === "completed").length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (isLoadingRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (requestsError) {
    console.error("Service requests error details:", requestsError);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="البحث في طلبات الخدمات... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
              title="البحث في طلبات الخدمات - استخدم Ctrl+F للوصول السريع"
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
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border">
        <DataTable
          data={requests}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={requests.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          searchTerm={searchTerm}
          isLoading={isLoadingRequests}
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
                                ).toLocaleDateString("ar-SA");
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
                        {selectedRequest.status === "approved" && "مقبول"}
                        {selectedRequest.status === "rejected" && "مرفوض"}
                        {selectedRequest.status === "in_progress" &&
                          "قيد التنفيذ"}
                        {selectedRequest.status === "completed" && "مكتمل"}
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
                            return new Date(
                              selectedRequest.createdAt
                            ).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
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
                            return new Date(
                              selectedRequest.updatedAt
                            ).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
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
    </div>
  );
};

export default ServiceRequestsManagement;
