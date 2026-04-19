import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiX,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiTag,
  FiAlertCircle,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiGlobe,
  FiChevronDown,
} from "react-icons/fi";
import DataTable from "./DataTable";
import ConfirmationModal from "./ConfirmationModal";
import joinTeamApplicationService from "../../services/joinTeamApplicationService";
import toast from "react-hot-toast";

const JoinTeamApplicationsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    status: "pending",
    adminNotes: "",
  });
  const [openActionsId, setOpenActionsId] = useState(null);
  const searchInputRef = useRef(null);

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
    data: applicationsData,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["joinTeamApplications", selectedFilter, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return joinTeamApplicationService.getAllApplications({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !isSearching,
  });

  const { data: statsData } = useQuery({
    queryKey: ["joinTeamApplicationStats"],
    queryFn: joinTeamApplicationService.getApplicationStats,
    staleTime: 5 * 60 * 1000,
    enabled: !debouncedSearchTerm || debouncedSearchTerm.trim().length === 0,
  });

  const allApplications = applicationsData?.data?.data?.applications || [];
  const totalApplications = applicationsData?.data?.data?.total || 0;

  const applications = React.useMemo(() => {
    if (!debouncedSearchTerm.trim()) return allApplications;
    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return allApplications.filter((app) => {
      return (
        (app.fullName && app.fullName.toLowerCase().includes(searchLower)) ||
        (app.email && app.email.toLowerCase().includes(searchLower)) ||
        (app.phoneNumber && app.phoneNumber?.toString().toLowerCase().includes(searchLower)) ||
        (app.role?.titleAr && app.role.titleAr.toLowerCase().includes(searchLower)) ||
        (app.city && app.city.toLowerCase().includes(searchLower)) ||
        (app.country && app.country.toLowerCase().includes(searchLower))
      );
    });
  }, [allApplications, debouncedSearchTerm]);

  const statsRaw = statsData?.data?.data || {};
  const stats = {
    total: statsRaw.totalApplications ?? 0,
    pending: statsRaw.pendingApplications ?? 0,
    reviewed: statsRaw.reviewedApplications ?? 0,
    shortlisted: statsRaw.shortlistedApplications ?? 0,
    accepted: statsRaw.acceptedApplications ?? 0,
    rejected: statsRaw.rejectedApplications ?? 0,
  };

  const getStatusBadgeColor = (status) => {
    const map = {
      pending: "text-amber-700 bg-amber-50 border-amber-200",
      reviewed: "text-blue-700 bg-blue-50 border-blue-200",
      shortlisted: "text-purple-700 bg-purple-50 border-purple-200",
      rejected: "text-red-700 bg-red-50 border-red-200",
      accepted: "text-green-700 bg-green-50 border-green-200",
    };
    return map[status] || "text-slate-700 bg-slate-50 border-slate-200";
  };

  const getStatusText = (status) => {
    const map = {
      pending: "في الانتظار",
      reviewed: "تم المراجعة",
      shortlisted: "القائمة المختصرة",
      rejected: "مرفوض",
      accepted: "مقبول",
    };
    return map[status] || status;
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleImmediateSearch = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  const deleteApplicationMutation = useMutation({
    mutationFn: joinTeamApplicationService.deleteApplication,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplications"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplicationStats"] });
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
      await new Promise((r) => setTimeout(r, 300));
      await refetchApplications();
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الطلب");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }) =>
      joinTeamApplicationService.updateApplicationStatus(id, status, adminNotes),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplications"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["joinTeamApplicationStats"] });
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusFormData({ status: "pending", adminNotes: "" });
      await refetchApplications();
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث حالة الطلب");
    },
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (application) => {
    setSelectedApplication(application);
    setStatusFormData({
      status: application.status,
      adminNotes: application.adminNotes || "",
    });
    setShowStatusModal(true);
  };

  const handleDelete = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (applicationToDelete) {
      deleteApplicationMutation.mutate(applicationToDelete);
    }
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status: statusFormData.status,
      adminNotes: statusFormData.adminNotes,
    });
  };

  const statusTabs = [
    { value: "all", label: "الكل", count: stats.total, icon: FiList },
    { value: "pending", label: "في الانتظار", count: stats.pending, icon: FiLoader },
    { value: "reviewed", label: "تم المراجعة", count: stats.reviewed, icon: FiEye },
    { value: "shortlisted", label: "القائمة المختصرة", count: stats.shortlisted, icon: FiTag },
    { value: "accepted", label: "مقبول", count: stats.accepted, icon: FiCheckCircle },
    { value: "rejected", label: "مرفوض", count: stats.rejected, icon: FiXCircle },
  ];

  const renderApplicant = (application) => (
    <div className="min-w-0">
      <div className="font-medium text-slate-800 truncate">{application.fullName}</div>
      <div className="text-xs text-slate-500 truncate">{application.email}</div>
      {application.phoneNumber && (
        <div className="text-xs text-slate-500 truncate">{application.phoneNumber}</div>
      )}
    </div>
  );

  const columns = [
    {
      key: "applicant",
      label: "معلومات مقدم الطلب",
      sortable: true,
      render: (_, application) => renderApplicant(application),
    },
    {
      key: "role",
      label: "الدور المطلوب",
      sortable: true,
      render: (_, application) => (
        <div className="min-w-0">
          <div className="font-medium text-slate-800 truncate">
            {application.role?.titleAr || "غير محدد"}
          </div>
          {application.role?.slug && (
            <div className="text-xs text-slate-500 truncate">{application.role.slug}</div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "الموقع",
      sortable: true,
      render: (_, application) => (
        <span className="text-slate-700 text-sm">
          {application.city}, {application.country}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      headerClassName: "min-w-[10rem] w-[10rem]",
      cellClassName: "min-w-[10rem] w-[10rem]",
      render: (value, application) => {
        const status = application.status;
        const colorClass = getStatusBadgeColor(status);
        return (
          <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
            {getStatusText(status)}
          </span>
        );
      },
    },
    {
      key: "submittedAt",
      label: "تاريخ التقديم",
      sortable: true,
      render: (_, application) => {
        const date = application.createdAt || application.created_at;
        if (!date) return "غير محدد";
        try {
          return new Date(date).toLocaleDateString("ar-DZ", {
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
      render: (_, application) => {
        const isOpen = openActionsId === application.id;
        return (
          <div className="relative flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionsId(isOpen ? null : application.id);
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
                <div className="absolute left-0 top-full mt-1 z-20 min-w-[200px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                  <button
                    onClick={() => {
                      handleViewDetails(application);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEye className="w-4 h-4" /> عرض
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(application);
                      setOpenActionsId(null);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" /> تحديث الحالة
                  </button>
                  {application.cvUrl && (
                    <a
                      href={application.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => setOpenActionsId(null)}
                    >
                      <FiDownload className="w-4 h-4" /> تحميل السيرة الذاتية
                    </a>
                  )}
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleDelete(application.id);
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

  if (isLoadingApplications) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
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

  if (applicationsError) {
    if (applicationsError.response?.status === 401) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[320px] bg-white rounded-2xl border border-slate-200 p-8 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#09142b] mb-1">مطلوب تسجيل الدخول</h3>
          <p className="text-slate-600 text-sm mb-6">يجب تسجيل الدخول لعرض طلبات التوظيف</p>
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
          {applicationsError.message || "خطأ في الاتصال بالخادم"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] tracking-tight">
          إدارة طلبات الانضمام للفريق
        </h1>
        <p className="text-slate-600 mt-1">
          عرض وإدارة طلبات التوظيف والانضمام للفريق
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
            placeholder="بحث بالاسم، البريد، الهاتف، الدور، المدينة..."
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
          {debouncedSearchTerm && applications.length > 0 && (
            <p className="absolute -bottom-5 right-0 text-xs text-slate-500">
              {applications.length} نتيجة
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
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FiMail className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#09142b] mb-1">لا توجد طلبات توظيف</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {debouncedSearchTerm || selectedFilter !== "all"
                ? "لا توجد نتائج تطابق البحث أو الفلاتر. جرّب تغيير المعايير."
                : "لم يتم تقديم أي طلبات توظيف بعد. ستظهر هنا عندما يتم تقديم طلبات جديدة."}
            </p>
          </div>
        ) : (
          <>
            {/* Card list: mobile */}
            <div className="lg:hidden p-4 space-y-4">
              {applications.map((application) => {
                const isOpen = openActionsId === application.id;
                const statusClass = getStatusBadgeColor(application.status);
                return (
                  <div
                    key={application.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="font-medium text-slate-800">{application.fullName}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${statusClass}`}
                        >
                          {getStatusText(application.status)}
                        </span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionsId(isOpen ? null : application.id);
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
                              <div className="absolute left-0 top-full mt-1 z-20 min-w-[180px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleViewDetails(application);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEye className="w-4 h-4" /> عرض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateStatus(application);
                                    setOpenActionsId(null);
                                  }}
                                  className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FiEdit className="w-4 h-4" /> تحديث الحالة
                                </button>
                                {application.cvUrl && (
                                  <a
                                    href={application.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    onClick={() => setOpenActionsId(null)}
                                  >
                                    <FiDownload className="w-4 h-4" /> تحميل السيرة
                                  </a>
                                )}
                                <hr className="my-1 border-slate-100" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDelete(application.id);
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
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="text-xs text-slate-500">{application.email}</p>
                      <p className="font-medium text-slate-800">
                        {application.role?.titleAr || "—"}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">الموقع</span>
                      <span className="text-slate-800">
                        {application.city}, {application.country}
                      </span>
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-slate-800">
                        {application.createdAt || application.created_at
                          ? new Date(
                              application.createdAt || application.created_at
                            ).toLocaleDateString("ar-DZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewDetails(application)}
                      className="mt-3 w-full py-2 rounded-xl bg-[#09142b] text-white text-sm font-medium hover:bg-[#0b1a36] transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                );
              })}
              {totalApplications > itemsPerPage && !debouncedSearchTerm && (
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
                    {currentPage} / {Math.ceil(totalApplications / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(totalApplications / itemsPerPage)}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(totalApplications / itemsPerPage), p + 1)
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
                data={applications}
                columns={columns}
                searchTerm={searchTerm}
                noHorizontalScroll
                pagination={{
                  current: currentPage,
                  limit: itemsPerPage,
                  total: debouncedSearchTerm ? applications.length : totalApplications,
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

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={deleteApplicationMutation.isPending}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">تفاصيل طلب الانضمام</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">المعلومات الشخصية</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                      <p className="text-sm text-gray-900">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                      <p className="text-sm text-gray-900">{selectedApplication.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.dateOfBirth
                          ? new Date(selectedApplication.dateOfBirth).toLocaleDateString("ar-DZ")
                          : "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">معلومات العنوان</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">العنوان</label>
                      <p className="text-sm text-gray-900">{selectedApplication.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">المدينة</label>
                      <p className="text-sm text-gray-900">{selectedApplication.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">البلاد</label>
                      <p className="text-sm text-gray-900">{selectedApplication.country}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900">المعلومات المهنية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الدور المطلوب</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.role?.titleAr || "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الخبرة</label>
                      <p className="text-sm text-gray-900">{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">التعليم</label>
                      <p className="text-sm text-gray-900">{selectedApplication.education}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">المهارات</label>
                      <p className="text-sm text-gray-900">{selectedApplication.skills}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900">معلومات إضافية</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الدافع للانضمام</label>
                      <p className="text-sm text-gray-900">{selectedApplication.motivation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الراتب المتوقع</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.expectedSalary || "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">تاريخ التوفر</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.availability
                          ? new Date(selectedApplication.availability).toLocaleDateString("ar-DZ")
                          : "غير محدد"}
                      </p>
                    </div>
                    {selectedApplication.additionalInfo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">معلومات إضافية</label>
                        <p className="text-sm text-gray-900">{selectedApplication.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">الروابط</h4>
                <div className="flex flex-wrap gap-4">
                  {selectedApplication.linkedin && (
                    <a
                      href={selectedApplication.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#09142b] hover:text-[#c8a45e] text-sm font-medium flex items-center gap-2"
                    >
                      <FiMail className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {selectedApplication.website && (
                    <a
                      href={selectedApplication.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#09142b] hover:text-[#c8a45e] text-sm font-medium flex items-center gap-2"
                    >
                      <FiGlobe className="w-4 h-4" />
                      الموقع الشخصي
                    </a>
                  )}
                  <a
                    href={selectedApplication.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#09142b] hover:text-[#c8a45e] text-sm font-medium flex items-center gap-2"
                  >
                    <FiFileText className="w-4 h-4" />
                    تحميل السيرة الذاتية
                  </a>
                </div>
              </div>

              {selectedApplication.adminNotes && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">ملاحظات الإدارة</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-sm text-slate-700">{selectedApplication.adminNotes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => handleUpdateStatus(selectedApplication)}
                  className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors flex items-center gap-2"
                >
                  <FiEdit size={16} />
                  تحديث الحالة
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#09142b]">تحديث حالة الطلب</h2>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedApplication(null);
                    setStatusFormData({ status: "pending", adminNotes: "" });
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الحالة الجديدة</label>
                  <select
                    name="status"
                    value={statusFormData.status}
                    onChange={(e) =>
                      setStatusFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="reviewed">تم المراجعة</option>
                    <option value="shortlisted">القائمة المختصرة</option>
                    <option value="rejected">مرفوض</option>
                    <option value="accepted">مقبول</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات الإدارة</label>
                  <textarea
                    name="adminNotes"
                    value={statusFormData.adminNotes}
                    onChange={(e) =>
                      setStatusFormData((prev) => ({ ...prev, adminNotes: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#09142b]/20 focus:border-[#09142b] outline-none"
                    placeholder="أضف ملاحظات حول الطلب..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedApplication(null);
                      setStatusFormData({ status: "pending", adminNotes: "" });
                    }}
                    className="px-4 py-2.5 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={updateStatusMutation.isPending}
                    className="px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-medium hover:bg-[#0b1a36] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {updateStatusMutation.isPending ? (
                      <FiLoader className="animate-spin w-4 h-4" />
                    ) : null}
                    تحديث الحالة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinTeamApplicationsManagement;
