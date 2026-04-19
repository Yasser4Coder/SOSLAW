import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiX,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiCheck,
  FiLoader,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiChevronDown,
} from "react-icons/fi";
import contactRequestService from "../../services/contactRequestService";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const ContactRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
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
  }, [selectedFilter, debouncedSearchTerm]);

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
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: [
      "contact-requests",
      selectedFilter,
      currentPage,
      itemsPerPage,
      debouncedSearchTerm.trim() || null,
    ],
    queryFn: async () => {
      const result = await contactRequestService.getAllContactRequests({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        page: currentPage,
        limit: itemsPerPage,
        ...(debouncedSearchTerm.trim()
          ? { search: debouncedSearchTerm.trim() }
          : {}),
      });
      return result;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !isSearching,
  });

  const { data: statsData } = useQuery({
    queryKey: ["contact-request-stats"],
    queryFn: contactRequestService.getContactRequestStats,
    staleTime: 2 * 60 * 1000,
    enabled: !debouncedSearchTerm || debouncedSearchTerm.trim().length === 0,
  });

  const requests = requestsData?.data?.contactRequests || [];
  const totalRequests = requestsData?.data?.total || 0;
  const apiStats = statsData?.data || {};
  const stats = {
    total: apiStats.total ?? 0,
    new: apiStats.new ?? 0,
    read: apiStats.read ?? 0,
    replied: apiStats.replied ?? 0,
    closed: apiStats.closed ?? 0,
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleImmediateSearch = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, status }) =>
      contactRequestService.updateContactRequestStatus(id, status),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["contact-request-stats"] });
      await new Promise((r) => setTimeout(r, 300));
      await refetchRequests();
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, replyMessage }) =>
      contactRequestService.replyToContactRequest(id, replyMessage),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["contact-request-stats"] });
      setShowReplyModal(false);
      setReplyMessage("");
      setSelectedRequest(null);
      await refetchRequests();
      toast.success("تم إرسال الرد بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إرسال الرد");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => contactRequestService.deleteContactRequest(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["contact-request-stats"] });
      setShowDeleteModal(false);
      setSelectedRequest(null);
      await new Promise((r) => setTimeout(r, 300));
      await refetchRequests();
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: () => {
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
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRequest) deleteMutation.mutate(selectedRequest.id);
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

  const statusTabs = [
    { value: "all", label: "الكل", count: stats.total, icon: FiFileText },
    { value: "new", label: "جديد", count: stats.new, icon: FiClock },
    { value: "read", label: "مقروء", count: stats.read, icon: FiCheckCircle },
    { value: "replied", label: "تم الرد", count: stats.replied, icon: FiCheck },
    { value: "closed", label: "مغلق", count: stats.closed, icon: FiXCircle },
  ];

  const statusConfig = {
    new: { text: "جديد", color: "text-blue-700 bg-blue-50 border-blue-200" },
    read: { text: "مقروء", color: "text-green-700 bg-green-50 border-green-200" },
    replied: { text: "تم الرد", color: "text-green-700 bg-green-50 border-green-200" },
    closed: { text: "مغلق", color: "text-slate-700 bg-slate-50 border-slate-200" },
  };

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
      render: (value, request) => (
        <div className="min-w-0">
          <div className="font-medium text-slate-800 truncate">{value}</div>
          <div className="text-xs text-slate-500 truncate">{request.email}</div>
          {request.phone && (
            <div className="text-xs text-slate-500 truncate">{request.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: "subject",
      label: "الموضوع",
      sortable: true,
      render: (value) => value ? <span className="text-slate-800">{value}</span> : <span className="text-slate-500">—</span>,
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      headerClassName: "min-w-[10rem] w-[10rem]",
      cellClassName: "min-w-[10rem] w-[10rem]",
      render: (value, request) => {
        const actualStatus = value || request.status;
        const config = statusConfig[actualStatus] || statusConfig.new;
        return (
          <select
            value={actualStatus}
            onChange={(e) => handleStatusChange(request.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            title={config.text}
            className={`w-full min-w-0 text-xs font-medium rounded-lg border px-3 py-1.5 pe-8 cursor-pointer focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none ${config.color}`}
          >
            <option value="new">جديد</option>
            <option value="read">مقروء</option>
            <option value="replied">تم الرد</option>
            <option value="closed">مغلق</option>
          </select>
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
          return new Date(value).toLocaleDateString("ar-DZ", {
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
                    onClick={() => {
                      handleView(request);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEye className="w-4 h-4" /> عرض
                  </button>
                  <button
                    onClick={() => {
                      handleReply(request);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiMessageSquare className="w-4 h-4" /> رد
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleDelete(request);
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

  if (isLoadingRequests) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
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

  if (requestsError) {
    if (requestsError.response?.status === 401) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#09142b] mb-1">مطلوب تسجيل الدخول</h3>
          <p className="text-slate-600 text-sm mb-6">يجب تسجيل الدخول لعرض طلبات التواصل</p>
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
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#09142b] mb-1">حدث خطأ أثناء تحميل البيانات</h3>
        <p className="text-slate-600 text-sm">{requestsError.message || "خطأ في الاتصال بالخادم"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] tracking-tight">
          طلبات التواصل
        </h1>
        <p className="text-slate-600 mt-1">
          إدارة وعرض رسائل التواصل من العملاء
        </p>
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
            placeholder="بحث بالاسم، البريد أو الهاتف..."
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
          {debouncedSearchTerm && totalRequests > 0 && (
            <p className="absolute -bottom-5 right-0 text-xs text-slate-500">
              {totalRequests} نتيجة
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FiMessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#09142b] mb-1">لا توجد طلبات</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {debouncedSearchTerm || selectedFilter !== "all"
                ? "لا توجد نتائج تطابق البحث أو الفلاتر. جرّب تغيير المعايير."
                : "لم يتم إرسال أي طلبات تواصل حتى الآن."}
            </p>
          </div>
        ) : (
          <>
            {/* Card list: mobile */}
            <div className="lg:hidden p-4 space-y-4">
              {requests.map((request) => {
                const isOpen = openActionsId === request.id;
                const cardStatusClass =
                  statusConfig[request.status]?.color || statusConfig.new.color;
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
                          onChange={(e) =>
                            handleStatusChange(request.id, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-medium rounded-lg border px-3 py-1.5 pe-8 cursor-pointer focus:ring-2 focus:ring-[#09142b]/20 outline-none w-full min-w-[10rem] ${cardStatusClass}`}
                        >
                          <option value="new">جديد</option>
                          <option value="read">مقروء</option>
                          <option value="replied">تم الرد</option>
                          <option value="closed">مغلق</option>
                        </select>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionsId(isOpen ? null : request.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                          >
                            <FiChevronDown
                              className={`w-4 h-4 ${isOpen ? "rotate-180" : ""}`}
                            />
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
                                    handleView(request);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEye className="w-4 h-4" /> عرض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleReply(request);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiMessageSquare className="w-4 h-4" /> رد
                                </button>
                                <hr className="my-1 border-slate-100" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDelete(request);
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
                      <p className="font-medium text-slate-800">{request.name}</p>
                      <p className="text-slate-500 text-xs">{request.email}</p>
                      {request.phone && (
                        <p className="text-slate-500 text-xs">{request.phone}</p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">الموضوع</span>
                      <span className="text-slate-800">
                        {request.subject || "—"}
                      </span>
                      <span className="text-slate-500">الأولوية</span>
                      <span className="text-slate-800">
                        {request.priority === "urgent" && "عاجل"}
                        {request.priority === "high" && "عالية"}
                        {request.priority === "normal" && "عادية"}
                        {request.priority === "low" && "منخفضة"}
                        {!request.priority && "—"}
                      </span>
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-slate-800">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString(
                              "ar-DZ",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
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
              {totalRequests > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    السابق
                  </button>
                  <span className="text-sm text-slate-600">
                    {currentPage} /{" "}
                    {Math.ceil(totalRequests / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    disabled={
                      currentPage >= Math.ceil(totalRequests / itemsPerPage)
                    }
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(
                          Math.ceil(totalRequests / itemsPerPage),
                          p + 1
                        )
                      )
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </div>

            {/* Table: desktop */}
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
        message={`هل أنت متأكد من حذف طلب التواصل من "${selectedRequest?.name}"؟`}
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
                  تفاصيل طلب التواصل
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
                        {!selectedRequest.priority && "—"}
                      </p>
                    </div>
                  </div>
                </div>

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

                {selectedRequest.replyMessage && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiMessageSquare className="ml-2" />
                      الرد
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.replyMessage}
                      </p>
                    </div>
                    {selectedRequest.repliedAt && (
                      <p className="text-sm text-slate-500 mt-2">
                        تم الرد في:{" "}
                        {new Date(
                          selectedRequest.repliedAt
                        ).toLocaleDateString("ar-DZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                )}

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
                        {selectedRequest.created_at
                          ? new Date(
                              selectedRequest.created_at
                            ).toLocaleDateString("ar-DZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "غير محدد"}
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

              <div className="flex justify-end gap-3 mt-8">
                {selectedRequest.status !== "replied" && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleReply(selectedRequest);
                    }}
                    className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors flex items-center gap-2"
                  >
                    <FiMessageSquare size={16} />
                    رد
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRequest(null);
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

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">
                  رد على الطلب
                </h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedRequest(null);
                    setReplyMessage("");
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    إلى: {selectedRequest.name} ({selectedRequest.email})
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    رسالة الرد
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                    placeholder="اكتب رسالة الرد هنا..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedRequest(null);
                    setReplyMessage("");
                  }}
                  className="px-4 py-2.5 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || replyMutation.isPending}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors disabled:opacity-50"
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

export default ContactRequests;
