import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiEye,
  FiMail,
  FiSearch,
  FiFilter,
  FiMessageSquare,
  FiTrash2,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiUser,
  FiCalendar,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";
import contactRequestService from "../../services/contactRequestService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const ContactRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
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

  // Fetch contact requests with React Query - only filter by status, not search
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery({
    queryKey: ["contact-requests", selectedFilter],
    queryFn: async () => {
      try {
        const result = await contactRequestService.getAllContactRequests({
          status: selectedFilter === "all" ? undefined : selectedFilter,
          page: currentPage,
          limit: itemsPerPage,
        });
        console.log("Contact requests API response:", result);
        return result;
      } catch (error) {
        console.error("Contact requests API error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract requests from API response
  const allRequests = requestsData?.data?.contactRequests || [];
  const totalRequests = requestsData?.data?.total || 0;

  // Filter requests based on search term (client-side filtering)
  const requests = React.useMemo(() => {
    if (!searchTerm.trim()) return allRequests;

    const searchLower = searchTerm.toLowerCase().trim();

    return allRequests.filter((request) => {
      return (
        (request.name && request.name.toLowerCase().includes(searchLower)) ||
        (request.email && request.email.toLowerCase().includes(searchLower)) ||
        (request.subject &&
          request.subject.toLowerCase().includes(searchLower)) ||
        (request.message &&
          request.message.toLowerCase().includes(searchLower)) ||
        (request.phone && request.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [allRequests, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "id",
      label: "الرقم",
      sortable: true,
      render: (value) => `#${value}`,
    },
    {
      key: "name",
      label: "الاسم",
      sortable: true,
    },
    {
      key: "email",
      label: "البريد الإلكتروني",
      sortable: true,
    },
    {
      key: "phone",
      label: "رقم الهاتف",
      sortable: true,
      render: (value) => value || "غير محدد",
    },
    {
      key: "subject",
      label: "الموضوع",
      sortable: true,
      render: (value) => value || "غير محدد",
    },
    {
      key: "priority",
      label: "الأولوية",
      sortable: true,
      render: (value) => {
        const priorityConfig = {
          urgent: { text: "عاجل", color: "text-red-600 bg-red-50" },
          high: { text: "عالية", color: "text-orange-600 bg-orange-50" },
          normal: { text: "عادية", color: "text-blue-600 bg-blue-50" },
          low: { text: "منخفضة", color: "text-green-600 bg-green-50" },
        };
        const config = priorityConfig[value] || priorityConfig.normal;
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
          new: {
            text: "جديد",
            icon: FiClock,
            color: "text-blue-600 bg-blue-50",
          },
          read: {
            text: "مقروء",
            icon: FiCheckCircle,
            color: "text-green-600 bg-green-50",
          },
          replied: {
            text: "تم الرد",
            icon: FiCheck,
            color: "text-green-600 bg-green-50",
          },
          closed: {
            text: "مغلق",
            icon: FiXCircle,
            color: "text-gray-600 bg-gray-50",
          },
        };
        const config = statusConfig[value] || statusConfig.new;
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
              <option value="new">جديد</option>
              <option value="read">مقروء</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلق</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "created_at",
      label: "تاريخ الإرسال",
      sortable: true,
      render: (value) => {
        if (!value) return "غير محدد";
        try {
          const date = new Date(value);
          const dayNames = [
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ];
          const dayName = dayNames[date.getDay()];
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${dayName} ${day}/${month}/${year}`;
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
          {request.status !== "replied" && (
            <button
              onClick={() => handleReply(request)}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
              title="رد"
            >
              <FiMessageSquare className="w-4 h-4" />
            </button>
          )}
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
      contactRequestService.updateContactRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["contact-requests"]);
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      console.error("Error updating request status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ id, replyMessage }) =>
      contactRequestService.replyToContactRequest(id, replyMessage),
    onSuccess: () => {
      queryClient.invalidateQueries(["contact-requests"]);
      setShowReplyModal(false);
      setReplyMessage("");
      setSelectedRequest(null);
      toast.success("تم إرسال الرد بنجاح");
    },
    onError: (error) => {
      console.error("Error sending reply:", error);
      toast.error("حدث خطأ أثناء إرسال الرد");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => contactRequestService.deleteContactRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["contact-requests"]);
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

  const handleReply = (request) => {
    setSelectedRequest(request);
    setShowReplyModal(true);
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

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("يرجى كتابة رسالة الرد");
      return;
    }

    if (selectedRequest) {
      replyMutation.mutate({
        id: selectedRequest.id,
        replyMessage: replyMessage.trim(),
      });
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: allRequests.length,
      new: allRequests.filter((r) => r.status === "new").length,
      read: allRequests.filter((r) => r.status === "read").length,
      replied: allRequests.filter((r) => r.status === "replied").length,
      closed: allRequests.filter((r) => r.status === "closed").length,
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
    console.error("Contact requests error details:", requestsError);
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
          <h1 className="text-2xl font-bold text-gray-900">طلبات التواصل</h1>
          <p className="text-gray-600 mt-1">إدارة رسائل التواصل من العملاء</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">جديد</p>
              <p className="text-xl font-bold text-gray-900">{stats.new}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مقروء</p>
              <p className="text-xl font-bold text-gray-900">{stats.read}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">تم الرد</p>
              <p className="text-xl font-bold text-gray-900">{stats.replied}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiXCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مغلق</p>
              <p className="text-xl font-bold text-gray-900">{stats.closed}</p>
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
              placeholder="البحث في طلبات التواصل... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
              title="البحث في طلبات التواصل - استخدم Ctrl+F للوصول السريع"
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
              <option value="new">جديد</option>
              <option value="read">مقروء</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلق</option>
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
        message={`هل أنت متأكد من حذف طلب التواصل من "${selectedRequest?.name}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        confirmColor="red"
        isLoading={deleteMutation.isPending}
      />

      {/* View Request Modal */}
      {showViewModal &&
        selectedRequest &&
        (console.log("Rendering modal with selectedRequest:", selectedRequest),
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل طلب التواصل
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
                        <p className="text-gray-900">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          البريد الإلكتروني
                        </label>
                        <p className="text-gray-900 flex items-center">
                          <FiMail className="ml-1 w-4 h-4" />
                          {selectedRequest.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رقم الهاتف
                        </label>
                        <p className="text-gray-900 flex items-center">
                          <FiPhone className="ml-1 w-4 h-4" />
                          {selectedRequest.phone || "غير محدد"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الأولوية
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.priority === "urgent" && "عاجل"}
                          {selectedRequest.priority === "high" && "عالية"}
                          {selectedRequest.priority === "normal" && "عادية"}
                          {selectedRequest.priority === "low" && "منخفضة"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="ml-2" />
                      محتوى الرسالة
                    </h3>
                    <div className="space-y-4">
                      {selectedRequest.subject && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الموضوع
                          </label>
                          <p className="text-gray-900 font-medium">
                            {selectedRequest.subject}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الرسالة
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {selectedRequest.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply Information */}
                  {selectedRequest.replyMessage && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiMessageSquare className="ml-2" />
                        الرد
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedRequest.replyMessage}
                        </p>
                      </div>
                      {selectedRequest.repliedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          تم الرد في:{" "}
                          {(() => {
                            try {
                              const date = new Date(selectedRequest.repliedAt);
                              const dayNames = [
                                "الأحد",
                                "الاثنين",
                                "الثلاثاء",
                                "الأربعاء",
                                "الخميس",
                                "الجمعة",
                                "السبت",
                              ];
                              const dayName = dayNames[date.getDay()];
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const year = date.getFullYear();
                              return `${dayName} ${day}/${month}/${year}`;
                            } catch (error) {
                              return "غير محدد";
                            }
                          })()}
                        </p>
                      )}
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
                          تاريخ الإرسال
                        </label>
                        <p className="text-gray-900">
                          {(() => {
                            try {
                              const date = new Date(selectedRequest.created_at);
                              const dayNames = [
                                "الأحد",
                                "الاثنين",
                                "الثلاثاء",
                                "الأربعاء",
                                "الخميس",
                                "الجمعة",
                                "السبت",
                              ];
                              const dayName = dayNames[date.getDay()];
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const year = date.getFullYear();
                              const hours = String(date.getHours()).padStart(
                                2,
                                "0"
                              );
                              const minutes = String(
                                date.getMinutes()
                              ).padStart(2, "0");
                              return `${dayName} ${day}/${month}/${year} ${hours}:${minutes}`;
                            } catch (error) {
                              return "غير محدد";
                            }
                          })()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحالة
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.status === "new" && "جديد"}
                          {selectedRequest.status === "read" && "مقروء"}
                          {selectedRequest.status === "replied" && "تم الرد"}
                          {selectedRequest.status === "closed" && "مغلق"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse mt-8">
                  {selectedRequest.status !== "replied" && (
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleReply(selectedRequest);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse"
                    >
                      <FiMessageSquare size={16} />
                      <span>رد</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  رد على الطلب
                </h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إلى: {selectedRequest.name} ({selectedRequest.email})
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسالة الرد
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب رسالة الرد هنا..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setSelectedRequest(null);
                      setReplyMessage("");
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={replyMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {replyMutation.isPending ? "جاري الإرسال..." : "إرسال الرد"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequests;
